export interface VoiceLanguage {
  name: string;
  code: string;
  fallback?: string;
}

export const voiceLanguages: VoiceLanguage[] = [
  { name: 'English', code: 'en-US' },
  { name: 'French', code: 'fr-FR' },
  { name: 'Spanish', code: 'es-ES' },
  { name: 'German', code: 'de-DE' },
  { name: 'Chinese', code: 'zh-CN' },
  { name: 'Twi', code: 'tw' },
  { name: 'Akan', code: 'ak-GH' },
  { name: 'Ga', code: 'gaa-GH', fallback: 'ak-GH' },
  { name: 'Ewe', code: 'ee-GH', fallback: 'ak-GH' }
];

export const useVoiceLanguages = () => {
  const getEffectiveLanguageCode = (lang: VoiceLanguage): string => {
    // If the browser doesn't support the language and there's a fallback, use it
    try {
      const testSpeech = new SpeechSynthesisUtterance();
      testSpeech.lang = lang.code;
      return lang.code;
    } catch {
      return lang.fallback || lang.code;
    }
  };

  return {
    languages: voiceLanguages,
    getEffectiveLanguageCode
  };
};
