import React, { useState, useRef } from 'react';
import { Upload, Camera, X, FileText, Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Tesseract from 'tesseract.js';
import { supabase } from '../../lib/supabase';

interface PrescriptionUploadProps {
  onMedicineDetected: (medicineName: string) => void;
  theme: string;
}

interface DetectedMedicine {
  name: string;
  confidence: number;
}

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
      // Step 1: Extract text using Tesseract OCR
      setProcessingProgress(10);
      const result = await Tesseract.recognize(
        imageData,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProcessingProgress(10 + Math.floor(m.progress * 40));
            }
          }
        }
      );
      
      const extractedText = result.data.text;
      setExtractedText(extractedText);
      setProcessingProgress(50);
      
      // Step 2: Fetch all medicines from database
      const { data: allMedicines, error } = await supabase
        .from('medicines')
        .select('name, description, category');
      
      if (error) throw error;
      setProcessingProgress(60);
      
      // Step 3: Parse extracted text to find medicine names
      const detectedMeds: DetectedMedicine[] = [];
      const textLower = extractedText.toLowerCase();
      const words = textLower.split(/\s+/);
      
      // Check each medicine name against the extracted text
      allMedicines?.forEach((medicine) => {
        const medicineName = medicine.name.toLowerCase();
        const medicineWords = medicineName.split(/\s+/);
        
        // Check for exact name match
        if (textLower.includes(medicineName)) {
          detectedMeds.push({
            name: medicine.name,
            confidence: 1.0
          });
        } 
        // Check for partial matches (medicine name contains multiple words)
        else if (medicineWords.length > 1) {
          const matchedWords = medicineWords.filter((word: string) => 
            words.some((w: string) => w.includes(word) || word.includes(w))
          );
          const confidence = matchedWords.length / medicineWords.length;
          
          if (confidence >= 0.6) {
            detectedMeds.push({
              name: medicine.name,
              confidence
            });
          }
        }
        // Check for single word matches with fuzzy matching
        else {
          const matched = words.some((word: string) => {
            // Check if the word is similar to medicine name (allowing for OCR errors)
            if (word === medicineName) return true;
            if (word.includes(medicineName) || medicineName.includes(word)) return true;
            
            // Levenshtein distance check for OCR errors (optional)
            return calculateSimilarity(word, medicineName) > 0.8;
          });
          
          if (matched) {
            detectedMeds.push({
              name: medicine.name,
              confidence: 0.8
            });
          }
        }
      });
      
      setProcessingProgress(90);
      
      // Step 4: Sort by confidence and remove duplicates
      const uniqueMeds = Array.from(
        new Map(detectedMeds.map(med => [med.name, med])).values()
      ).sort((a, b) => b.confidence - a.confidence);
      
      setDetectedMedicines(uniqueMeds);
      setProcessingProgress(100);
      
      // Set the first detected medicine as the search term
      if (uniqueMeds.length > 0) {
        onMedicineDetected(uniqueMeds[0].name);
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      setExtractedText('Error processing image. Please try again.');
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
                        Upload an image of your prescription to search for medicines
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
                              Click on a medicine to search for it
                            </p>
                          </div>
                        </div>
                        
                        {/* Medicine List */}
                        <div className="space-y-2">
                          {detectedMedicines.map((medicine, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                onMedicineDetected(medicine.name);
                                handleClose();
                              }}
                              className={`w-full text-left p-3 rounded-lg transition-all ${
                                theme === 'dark'
                                  ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                                  : 'bg-white hover:bg-gray-50 border border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className={`font-medium ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                                    {medicine.name}
                                  </p>
                                  <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                    Confidence: {Math.round(medicine.confidence * 100)}%
                                  </p>
                                </div>
                                <ChevronRight className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
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
