// Universal trilingual speech synthesis utility for Venture Mind
import { Language } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

const LANG_CODE_MAP: Record<Language, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  zh: 'zh-CN',
};

export const isSpeechSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

export const stopSpeech = (): void => {
  if (isSpeechSupported()) {
    try {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    } catch {
      // Ignore audio synthesis cancel errors
    }
  }
};

export const speakText = (
  text: string,
  lang: Language = 'en',
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: unknown) => void
): boolean => {
  if (!isSpeechSupported() || !text.trim()) {
    return false;
  }

  try {
    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CODE_MAP[lang] || 'en-US';
    utterance.rate = 0.95; // Slightly measured executive cadence
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const targetPrefix = utterance.lang.slice(0, 2);
    const matchedVoice = voices.find(v => v.lang.startsWith(targetPrefix));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      currentUtterance = null;
      onError?.(e);
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    onError?.(error);
    return false;
  }
};
