import { useState, useCallback, useEffect, useRef } from 'react';
import { VoiceLanguage } from './useVoiceLanguages';
import { useLocationTranslations } from './useLocationTranslations';

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  error: string | null;
}

export const useVoiceRecognition = (initialLang: string = 'en-US'): UseVoiceRecognitionReturn & {
  setLanguage: (lang: VoiceLanguage) => void;
  currentLang: VoiceLanguage;
} => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout>();
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [currentLang, setCurrentLang] = useState<VoiceLanguage>({ name: 'English', code: 'en-US' });
  const { findMatchingLocation } = useLocationTranslations(currentLang);

  // Check if browser supports speech recognition
  const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

  useEffect(() => {
    if (isSupported) {
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = currentLang.code;
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const spokenText = event.results[0][0].transcript;
        // Use the raw transcript directly for searching
        setTranscript(spokenText);
        stopListening();
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        // Clear any existing timeout
        if (errorTimeoutRef.current) {
          clearTimeout(errorTimeoutRef.current);
        }

        setError(event.error);
        stopListening();

        // Set new timeout to clear error after 3 seconds
        errorTimeoutRef.current = setTimeout(() => {
          setError(null);
        }, 3000);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
      // Clear any pending error timeout on cleanup
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (recognition) {
      // Clear any existing error timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      setError(null);
      setTranscript('');
      setIsListening(true);
      recognition.start();
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  const setLanguage = useCallback((lang: VoiceLanguage) => {
    setCurrentLang(lang);
    if (recognition) {
      recognition.lang = lang.code;
    }
  }, [recognition]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    error,
    setLanguage,
    currentLang
  };
};
