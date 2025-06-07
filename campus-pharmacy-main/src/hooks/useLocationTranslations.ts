import { useMemo } from 'react';
import { VoiceLanguage } from './useVoiceLanguages';
import { findBestMatch } from '../utils/stringUtils';

// Define location translations for each supported language
const locationTranslations: Record<string, Record<string, string[]>> = {
  'en-US': {
    'Legon Campus': ['legon campus', 'legon', 'main campus'],
    'Korle Bu Campus': ['korle bu campus', 'korle bu', 'medical campus'],
    'City Campus': ['city campus', 'accra campus', 'business school'],
  },
  'fr-FR': {
    'Legon Campus': ['campus de legon', 'legon', 'campus principal'],
    'Korle Bu Campus': ['campus de korle bu', 'korle bu', 'campus médical'],
    'City Campus': ['campus de la ville', 'campus d\'accra', 'école de commerce'],
  },
  'tw': {
    'Legon Campus': ['legon sukuu', 'legon', 'sukuu panin'],
    'Korle Bu Campus': ['korle bu sukuu', 'korle bu', 'ayarehwɛ sukuu'],
    'City Campus': ['kuropon sukuu', 'accra sukuu', 'dwetire sukuu'],
  },
  'ak-GH': {
    'Legon Campus': ['legon sukuu', 'legon', 'sukuu panin'],
    'Korle Bu Campus': ['korle bu sukuu', 'korle bu', 'ayaresabea sukuu'],
    'City Campus': ['kuropon sukuu', 'accra sukuu', 'sikasɛm sukuu'],
  },
  'gaa-GH': {
    'Legon Campus': ['legon skul', 'legon', 'skul agbo'],
    'Korle Bu Campus': ['korle bu skul', 'korle bu', 'hela skul'],
    'City Campus': ['man skul', 'accra skul', 'shika skul'],
  },
  'ee-GH': {
    'Legon Campus': ['legon suku', 'legon', 'suku gã'],
    'Korle Bu Campus': ['korle bu suku', 'korle bu', 'atikewɔƒe suku'],
    'City Campus': ['du suku', 'accra suku', 'ga suku'],
  },
};

// Add other languages as fallbacks to English
const fallbackTranslations = {
  'es-ES': 'en-US',
  'de-DE': 'en-US',
  'zh-CN': 'en-US',
};

type LocationMap = Record<string, string[]>;

export const useLocationTranslations = (currentLang: VoiceLanguage) => {
  const currentTranslations = useMemo<LocationMap>(() => {
    // Get the language code or its fallback
    const langCode = currentLang.code;
    const effectiveLangCode = 
      langCode in locationTranslations ? langCode :
      langCode in fallbackTranslations ? fallbackTranslations[langCode as keyof typeof fallbackTranslations] :
      'en-US';

    return locationTranslations[effectiveLangCode];
  }, [currentLang]);

  const findMatchingLocations = (searchTerm: string): { location: string; score: number }[] => {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    const results: { location: string; score: number }[] = [];

    // Check each location and its translations
    for (const [location, terms] of Object.entries(currentTranslations)) {
      // Find best matching translation for this location
      const matches = findBestMatch(normalizedSearch, [...terms, location]);
      const bestMatch = matches[0];

      if (bestMatch.score > 0.3) { // Minimum similarity threshold
        results.push({
          location,
          score: bestMatch.score
        });
      }
    }

    // Sort by similarity score
    return results.sort((a, b) => b.score - a.score);
  };

  const findMatchingLocation = (searchTerm: string): string | null => {
    const matches = findMatchingLocations(searchTerm);
    return matches.length > 0 ? matches[0].location : null;
  };

  return {
    findMatchingLocation,
    findMatchingLocations,
  };
};
