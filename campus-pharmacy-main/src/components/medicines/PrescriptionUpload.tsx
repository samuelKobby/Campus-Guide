import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, X, FileText, Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { extractMedicinesFromPrescription, matchMedicinesWithDatabase } from '../../services/geminiService';

interface PrescriptionUploadProps {
  onMedicineDetected: (medicineName: string) => void;
  theme: string;
}

interface DetectedMedicine {
  name: string;
  confidence: number;
  available: boolean; // Whether medicine exists in our database
  inStock: boolean; // Whether it's available in any pharmacy
  dosage?: string;
  frequency?: string;
}

// Uses Vision OCR + rule-based parsing for prescription analysis
// Extracts medicine names, dosage, frequency, and other prescription details

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
  const [prescriptionInfo, setPrescriptionInfo] = useState<any>(null);
  const [apiConnectionTest, setApiConnectionTest] = useState<{tested: boolean; success: boolean; message: string}>({tested: false, success: false, message: ''});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  // Set status when modal opens
  const handleOpen = async () => {
    setIsOpen(true);

    setApiConnectionTest({
      tested: true,
      success: true,
      message: 'Vision OCR + rule-based parsing enabled'
    });
  };

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
    setPrescriptionInfo(null);
    
    try {
      // Step 1: Use Gemini API to analyze the prescription
      setProcessingProgress(20);
      console.log('Starting Gemini analysis...');
      const geminiResult = await extractMedicinesFromPrescription(imageData);
      
      console.log('Gemini Result:', geminiResult);
      
      setProcessingProgress(40);
      
      // Store extracted text and prescription info
      setExtractedText(geminiResult.rawText);
      setPrescriptionInfo(geminiResult.prescriptionInfo);
      
      if (!geminiResult.medicines || geminiResult.medicines.length === 0) {
        console.warn('No medicines detected by Gemini');
        setExtractedText(
          `No medicines detected in the prescription.\n\nExtracted text:\n${geminiResult.rawText || 'Unable to extract text from image'}\n\nTips:\n• Ensure the prescription is clearly visible\n• Make sure text is horizontal and readable\n• Try with a different image if this one is blurry`
        );
        setProcessingProgress(100);
        return;
      }
      
      console.log(`Found ${geminiResult.medicines.length} medicines`, geminiResult.medicines);
      
      // Step 2: Fetch all medicines from database to check availability
      setProcessingProgress(50);
      const { data: allMedicines, error } = await supabase
        .from('medicines')
        .select('name, available');
      
      if (error) throw error;
      
      console.log(`Database has ${allMedicines?.length || 0} medicines`);
      setProcessingProgress(70);
      
      // Step 3: Match detected medicines with database
      const medicinesToMatch = geminiResult.medicines.map(med => ({
        name: med.name,
        confidence: med.confidence,
        dosage: med.dosage,
        frequency: med.frequency,
      }));
      
      const matchedMedicines = matchMedicinesWithDatabase(
        medicinesToMatch,
        allMedicines || []
      );
      
      setProcessingProgress(85);
      
      // Step 4: Convert to DetectedMedicine format
      const detectedMeds: DetectedMedicine[] = matchedMedicines.map(med => ({
        name: med.name,
        confidence: med.confidence,
        available: med.available,
        inStock: med.inStock,
        dosage: med.dosage,
        frequency: med.frequency,
      }));
      
      // Sort by confidence
      detectedMeds.sort((a, b) => b.confidence - a.confidence);
      
      setProcessingProgress(95);
      setDetectedMedicines(detectedMeds);
      
      console.log('Final detected medicines:', detectedMeds);
      
      setProcessingProgress(100);
      
      // Set the first AVAILABLE medicine as the search term (skip unavailable ones)
      const firstAvailable = detectedMeds.find(med => med.available);
      if (firstAvailable) {
        console.log('Auto-searching for:', firstAvailable.name);
        onMedicineDetected(firstAvailable.name);
      } else {
        console.log('No available medicines found in database');
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process image';
      setExtractedText(`Error: ${errorMessage}`);
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
    setPrescriptionInfo(null);
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
        onClick={handleOpen}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium transition-all ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
        }`}
      >
        <Camera className="w-4 h-4" />
        <span className="hidden sm:inline">Upload Prescription</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
            onClick={handleClose}
            data-lenis-prevent="true"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden ${
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
              <div 
                className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0 overscroll-contain"
                data-lenis-prevent="true"
              >
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
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className={`font-medium ${
                                      medicine.available 
                                        ? theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                                        : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                    }`}>
                                      {medicine.name}
                                    </p>
                                    {medicine.dosage && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        theme === 'dark' 
                                          ? 'bg-blue-500/20 text-blue-300' 
                                          : 'bg-blue-100 text-blue-700'
                                      }`}>
                                        {medicine.dosage}
                                      </span>
                                    )}
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
                                    {medicine.frequency && ` • ${medicine.frequency}`}
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
                          extractedText.includes('Error:')
                            ? theme === 'dark'
                              ? 'bg-red-500/10 border border-red-500/20'
                              : 'bg-red-50 border border-red-200'
                            : theme === 'dark'
                              ? 'bg-orange-500/10 border border-orange-500/20'
                              : 'bg-orange-50 border border-orange-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            extractedText.includes('Error:') ? 'bg-red-500' : 'bg-orange-500'
                          }`}>
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              {extractedText.includes('Error:') ? 'Processing Error' : 'No Medicines Detected'}
                            </h3>
                            <p className={`text-sm mb-3 whitespace-pre-wrap ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {extractedText}
                            </p>
                            {extractedText && !extractedText.includes('Error:') && (
                              <details className="mt-3">
                                <summary className={`text-xs cursor-pointer ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                                  View full extracted text
                                </summary>
                                <pre className={`text-xs mt-2 p-3 rounded overflow-auto max-h-40 ${theme === 'dark' ? 'bg-white/5' : 'bg-white'}`}>
                                  {extractedText}
                                </pre>
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
