import { useMemo } from 'react';
import { VoiceLanguage } from './useVoiceLanguages';
import { findBestMatch } from '../utils/stringUtils';

// Define medicine translations for each supported language
const medicineTranslations: Record<string, Record<string, string[]>> = {
  'en-US': {
    'Paracetamol': ['paracetamol', 'acetaminophen', 'panadol'],
    'Ibuprofen': ['ibuprofen', 'advil', 'brufen', 'motrin'],
    'Amoxicillin': ['amoxicillin', 'amoxil', 'antibiotic'],
    'Aspirin': ['aspirin', 'dispirin', 'pain killer'],
    'Cough Syrup': ['cough syrup', 'cough medicine', 'cough suppressant'],
  },
  'fr-FR': {
    'Paracetamol': ['paracétamol', 'acétaminophène', 'doliprane'],
    'Ibuprofen': ['ibuprofène', 'advil', 'anti-inflammatoire'],
    'Amoxicillin': ['amoxicilline', 'antibiotique'],
    'Aspirin': ['aspirine', 'anti-douleur'],
    'Cough Syrup': ['sirop pour la toux', 'sirop contre la toux', 'médicament pour la toux'],
  },
  'tw': {
    'Paracetamol': ['paracetamol', 'anigyeɛ aduro', 'atwe aduro'],
    'Ibuprofen': ['ibuprofen', 'hwee aduro'],
    'Amoxicillin': ['amoxicillin', 'antibiotiki'],
    'Aspirin': ['aspirin', 'atwe aduro'],
    'Cough Syrup': ['ɛwa aduro', 'ɛwa syrup', 'ɛwa medicine'],
  },
  'ak-GH': {
    'Paracetamol': ['paracetamol', 'anigyeɛ aduro', 'atwe aduro'],
    'Ibuprofen': ['ibuprofen', 'hwee aduro'],
    'Amoxicillin': ['amoxicillin', 'antibiotiki'],
    'Aspirin': ['aspirin', 'atwe aduro'],
    'Cough Syrup': ['ɛwa aduro', 'ɛwa syrup', 'ɛwa medicine'],
  },
  'gaa-GH': {
    'Paracetamol': ['paracetamol', 'hela tsofai', 'hela aduro'],
    'Ibuprofen': ['ibuprofen', 'hela tsofai'],
    'Amoxicillin': ['amoxicillin', 'antibiotiki'],
    'Aspirin': ['aspirin', 'hela tsofai'],
    'Cough Syrup': ['kɔhɔ aduro', 'kɔhɔ syrup', 'kɔhɔ tsofai'],
  },
  'ee-GH': {
    'Paracetamol': ['paracetamol', 'atike', 'veveatike'],
    'Ibuprofen': ['ibuprofen', 'veveatike'],
    'Amoxicillin': ['amoxicillin', 'antibiotiki'],
    'Aspirin': ['aspirin', 'veveatike'],
    'Cough Syrup': ['kpekpe atike', 'syrup', 'kpekpe medicine'],
  },
};

// Add other languages as fallbacks to English
const fallbackTranslations = {
  'es-ES': 'en-US',
  'de-DE': 'en-US',
  'zh-CN': 'en-US',
};

type MedicineMap = Record<string, string[]>;

export const useMedicineTranslations = (currentLang: VoiceLanguage) => {
  const currentTranslations = useMemo<MedicineMap>(() => {
    // Get the language code or its fallback
    const langCode = currentLang.code;
    const effectiveLangCode = 
      langCode in medicineTranslations ? langCode :
      langCode in fallbackTranslations ? fallbackTranslations[langCode as keyof typeof fallbackTranslations] :
      'en-US';

    return medicineTranslations[effectiveLangCode];
  }, [currentLang]);

  const findMatchingMedicines = (searchTerm: string): { medicine: string; score: number }[] => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const results: { medicine: string; score: number }[] = [];

    // Check each medicine and its translations
    for (const [medicine, terms] of Object.entries(currentTranslations)) {
      // Find best matching translation for this medicine
      const matches = findBestMatch(normalizedSearch, [...terms, medicine]);
      const bestMatch = matches[0];

      if (bestMatch.score > 0.3) { // Minimum similarity threshold
        results.push({
          medicine,
          score: bestMatch.score
        });
      }
    }

    // Sort by similarity score
    return results.sort((a, b) => b.score - a.score);
  };

  const findMatchingMedicine = (searchTerm: string): string | null => {
    const matches = findMatchingMedicines(searchTerm);
    return matches.length > 0 ? matches[0].medicine : null;
  };

  return {
    findMatchingMedicine,
    findMatchingMedicines,
  };
};
