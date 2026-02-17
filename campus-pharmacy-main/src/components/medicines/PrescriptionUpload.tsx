import React, { useState, useRef } from 'react';
import { Upload, Camera, X, FileText, Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface PrescriptionUploadProps {
  onMedicineDetected: (medicineName: string) => void;
  theme: string;
}

interface DetectedMedicine {
  name: string;
  confidence: number;
  available: boolean; // Whether medicine exists in our database
  inStock: boolean; // Whether it's available in any pharmacy
}

// OCR.space API configuration (free tier - much faster than Tesseract.js)
// For production, consider upgrading to Google Cloud Vision API for even better accuracy and speed
// Google Vision API setup:
// 1. Enable Google Cloud Vision API in Google Cloud Console
// 2. Create API key or service account
// 3. Replace OCR.space call with Vision API call
// 4. Use Supabase Edge Function to securely handle API key
const OCR_API_KEY = 'K87899142388957'; // Free API key (max 25,000 requests/month)
const OCR_API_URL = 'https://api.ocr.space/parse/image';

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ 
  onMedicineDetected, 
  theme 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedMedicines, setDetectedMedicines] = useState<DetectedMedicine[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        processImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setDetectedMedicines([]);
    setExtractedText('');
    
    try {
      // Step 1: Perform OCR using OCR.space API (much faster than Tesseract.js)
      setProcessingProgress(10);
      
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      // Prepare form data for OCR.space API
      const formData = new FormData();
      formData.append('base64Image', imageData);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('detectOrientation', 'true');
      formData.append('scale', 'true');
      formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy
      
      setProcessingProgress(20);
      
      // Call OCR.space API
      const ocrResponse = await fetch(OCR_API_URL, {
        method: 'POST',
        headers: {
          'apikey': OCR_API_KEY
        },
        body: formData
      });
      
      const ocrResult = await ocrResponse.json();
      setProcessingProgress(50);
      
      if (ocrResult.IsErroredOnProcessing) {
        throw new Error(ocrResult.ErrorMessage?.[0] || 'OCR processing failed');
      }
      
      // Extract text from OCR result
      const extractedText = ocrResult.ParsedResults?.[0]?.ParsedText || '';
      setExtractedText(extractedText);
      setProcessingProgress(60);
      
      if (!extractedText) {
        setProcessingProgress(100);
        return;
      }
      
      // Step 2: Extract potential medicine names from the OCR text
      // Look for medicine-like patterns: capitalized words, medical terms, etc.
      const lines = extractedText.split('\n').filter((line: string) => line.trim());
      const potentialMedicines: string[] = [];
      
      lines.forEach((line: string) => {
        const words = line.trim().split(/\s+/);
        
        // Look for capitalized words or words that look like medicine names
        // Common patterns: starts with capital, contains "mg", "ml", ends with common suffixes
        words.forEach((word: string) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '');
          
          // Filter criteria for potential medicine names:
          // - At least 4 characters
          // - Starts with capital or contains medical terms
          // - Not common words
          if (cleanWord.length >= 4 && 
              (/^[A-Z]/.test(cleanWord) || 
               /mg|ml|tab|cap|syr|susp/i.test(word) ||
               /cillin|mycin|azole|prazole|olol|pine|ine|ide|one$/i.test(cleanWord))) {
            
            // Remove dosage info and clean up
            const medicineName = cleanWord
              .replace(/\d+mg/gi, '')
              .replace(/\d+ml/gi, '')
              .replace(/tab|caps?|syr|susp/gi, '')
              .trim();
            
            if (medicineName.length >= 4 && 
                !potentialMedicines.includes(medicineName) &&
                !/^(the|and|for|take|daily|times|day|night|morning|evening|after|before|with|without)$/i.test(medicineName)) {
              potentialMedicines.push(medicineName);
            }
          }
        });
      });
      
      setProcessingProgress(70);
      
      // Step 3: Fetch all medicines from database to check availability
      const { data: allMedicines, error } = await supabase
        .from('medicines')
        .select('name, available');
      
      if (error) throw error;
      setProcessingProgress(80);
      
      // Step 4: Match detected medicines with database
      const detectedMeds: DetectedMedicine[] = [];
      
      potentialMedicines.forEach((detectedName) => {
        const detectedLower = detectedName.toLowerCase();
        
        // Try to find exact or partial match in database
        let bestMatch: any = null;
        let bestConfidence = 0;
        
        allMedicines?.forEach((medicine) => {
          const medicineName = medicine.name.toLowerCase();
          
          // Exact match
          if (medicineName === detectedLower) {
            bestMatch = medicine;
            bestConfidence = 1.0;
          }
          // Partial match
          else if (medicineName.includes(detectedLower) || detectedLower.includes(medicineName)) {
            const similarity = calculateSimilarity(detectedLower, medicineName);
            if (similarity > bestConfidence) {
              bestMatch = medicine;
              bestConfidence = similarity;
            }
          }
        });
        
        // Add to detected medicines list
        if (bestMatch && bestConfidence >= 0.7) {
          // Medicine found in database
          detectedMeds.push({
            name: bestMatch.name, // Use actual database name
            confidence: bestConfidence,
            available: true,
            inStock: bestMatch.available
          });
        } else {
          // Medicine detected but not in database
          detectedMeds.push({
            name: detectedName, // Use detected name from prescription
            confidence: bestConfidence > 0 ? bestConfidence : 0.5,
            available: false,
            inStock: false
          });
        }
      });
      
      setProcessingProgress(90);
      
      // Step 4: Sort by confidence and remove duplicates
      const uniqueMeds = Array.from(
        new Map(detectedMeds.map(med => [med.name, med])).values()
      ).sort((a, b) => b.confidence - a.confidence);
      
      setDetectedMedicines(uniqueMeds);
      setProcessingProgress(100);
      
      // Set the first AVAILABLE medicine as the search term (skip out of stock ones)
      const firstAvailable = uniqueMeds.find(med => med.available);
      if (firstAvailable) {
        onMedicineDetected(firstAvailable.name);
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      setExtractedText('Error processing image. Please try again with a clearer image.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to calculate string similarity (Levenshtein distance based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  const getEditDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  const handleClear = () => {
    setSelectedImage(null);
    setDetectedMedicines([]);
    setExtractedText('');
    setProcessingProgress(0);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleClear();
    setIsOpen(false);
  };

  return (
    <>
      {/* Upload Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        <Camera className="w-5 h-5" />
        <span className="hidden sm:inline">Upload Prescription</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
                theme === 'dark' ? 'bg-[#151030]' : 'bg-white'
              }`}
            >
              {/* Header */}
              <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Upload Prescription
                      </h2>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Fast AI-powered scanning to instantly detect medicines
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className={`p-2 rounded-2xl transition-colors ${
                      theme === 'dark'
                        ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {!selectedImage ? (
                  <>
                    {/* Upload Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                        theme === 'dark'
                          ? 'border-white/20 hover:border-purple-500 hover:bg-purple-500/5'
                          : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Upload className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                      <p className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Click to upload or drag and drop
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>

                    {/* Instructions */}
                    <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Tips for best results:
                      </h3>
                      <ul className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        <li>• Make sure the prescription is clearly visible</li>
                        <li>• Ensure good lighting and focus</li>
                        <li>• Avoid shadows and glare</li>
                        <li>• Text should be horizontal and readable</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Preview */}
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Prescription preview"
                        className="w-full rounded-xl max-h-96 object-contain"
                      />
                      {!isProcessing && (
                        <button
                          onClick={handleClear}
                          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Processing State */}
                    {isProcessing && (
                      <div className={`rounded-xl p-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
                        <p className={`font-medium text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Processing prescription...
                        </p>
                        <p className={`text-sm mt-1 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Scanning image for medicine names
                        </p>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className={`w-full h-2 rounded-full overflow-hidden ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'}`}>
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                              style={{ width: `${processingProgress}%` }}
                            />
                          </div>
                          <p className={`text-xs mt-2 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {processingProgress}% Complete
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Results */}
                    {!isProcessing && detectedMedicines.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-6 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'
                            : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {detectedMedicines.length} Medicine{detectedMedicines.length > 1 ? 's' : ''} Detected
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              {detectedMedicines.filter(m => m.available).length} available • {detectedMedicines.filter(m => !m.available).length} not in stock
                            </p>
                          </div>
                        </div>
                        
                        {/* Medicine List */}
                        <div className="space-y-2">
                          {detectedMedicines.map((medicine, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                if (medicine.available) {
                                  onMedicineDetected(medicine.name);
                                  handleClose();
                                }
                              }}
                              disabled={!medicine.available}
                              className={`w-full text-left p-3 rounded-lg transition-all ${
                                medicine.available
                                  ? theme === 'dark'
                                    ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                                    : 'bg-white hover:bg-gray-50 border border-gray-200'
                                  : theme === 'dark'
                                    ? 'bg-red-500/10 border border-red-500/20 opacity-75'
                                    : 'bg-red-50 border border-red-200 opacity-75'
                              } ${medicine.available ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className={`font-medium ${
                                      medicine.available 
                                        ? theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                                        : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                    }`}>
                                      {medicine.name}
                                    </p>
                                    {!medicine.available && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        theme === 'dark' 
                                          ? 'bg-red-500/20 text-red-300' 
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        Out of Stock
                                      </span>
                                    )}
                                    {medicine.available && !medicine.inStock && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        theme === 'dark' 
                                          ? 'bg-orange-500/20 text-orange-300' 
                                          : 'bg-orange-100 text-orange-700'
                                      }`}>
                                        Limited Stock
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Confidence: {Math.round(medicine.confidence * 100)}%
                                    {medicine.available && ' • Click to view details'}
                                  </p>
                                </div>
                                {medicine.available && (
                                  <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    {/* No Medicines Detected */}
                    {!isProcessing && selectedImage && detectedMedicines.length === 0 && extractedText && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-6 ${
                          theme === 'dark'
                            ? 'bg-orange-500/10 border border-orange-500/20'
                            : 'bg-orange-50 border border-orange-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-orange-500">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              No Medicines Detected
                            </h3>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              We couldn't find any medicine names in the image. Please ensure the prescription is clear and readable.
                            </p>
                            {extractedText && (
                              <details className="mt-3">
                                <summary className={`text-xs cursor-pointer ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                  View extracted text
                                </summary>
                                <p className={`text-xs mt-2 p-2 rounded ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                  {extractedText.substring(0, 200)}{extractedText.length > 200 ? '...' : ''}
                                </p>
                              </details>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              {selectedImage && !isProcessing && (
                <div className={`p-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={handleClear}
                      className={`px-4 py-2 rounded-2xl font-medium transition-colors ${
                        theme === 'dark'
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      Upload Another
                    </button>
                    <button
                      onClick={handleClose}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-medium transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
