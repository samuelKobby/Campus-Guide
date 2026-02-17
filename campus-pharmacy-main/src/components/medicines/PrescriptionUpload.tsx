import React, { useState, useRef } from 'react';
import { Upload, Camera, X, FileText, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrescriptionUploadProps {
  onMedicineDetected: (medicineName: string) => void;
  theme: string;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ 
  onMedicineDetected, 
  theme 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedText, setDetectedText] = useState<string>('');
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
    
    try {
      // Simulate OCR processing (in production, you'd use Tesseract.js or a cloud OCR API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock detected medicines - In production, use actual OCR
      const mockDetectedMedicines = [
        'Paracetamol',
        'Ibuprofen',
        'Amoxicillin',
        'Cetirizine'
      ];
      
      const detected = mockDetectedMedicines[Math.floor(Math.random() * mockDetectedMedicines.length)];
      setDetectedText(detected);
      onMedicineDetected(detected);
      
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setDetectedText('');
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
                      <div className={`rounded-xl p-6 text-center ${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <Loader2 className="w-12 h-12 mx-auto mb-4 text-purple-500 animate-spin" />
                        <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          Processing prescription...
                        </p>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Extracting medicine names
                        </p>
                      </div>
                    )}

                    {/* Results */}
                    {!isProcessing && detectedText && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-6 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20'
                            : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                              Medicine Detected
                            </h3>
                            <p className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                              {detectedText}
                            </p>
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                              Search results have been updated below
                            </p>
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
