import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Currency, UserProgress, Term } from '../types';
import { termsData } from '../data/termsData';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';

export type NavTab = 
  | 'dashboard'
  | 'learn'
  | 'psychology'
  | 'mindfulness'
  | 'games'
  | 'simulators'
  | 'negotiation'
  | 'termsheet'
  | 'exam'
  | 'profile';

export type SimulatorType = 
  | 'captable' 
  | 'safe' 
  | 'waterfall' 
  | 'ai_investor' 
  | 'termsheet' 
  | 'fundraising';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedSimulator: SimulatorType;
  setSelectedSimulator: (sim: SimulatorType) => void;
  selectedTermId: string | null;
  setSelectedTermId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isOpeningPortalOpen: boolean;
  setIsOpeningPortalOpen: (open: boolean) => void;
  isCardStackModalOpen: boolean;
  setIsCardStackModalOpen: (open: boolean) => void;
  
  // Audio
  isAudioMuted: boolean;
  toggleAudioMute: () => void;
  isSpeaking: boolean;
  speak: (text: string, customLang?: Language) => void;
  stopVoice: () => void;
  
  // Progress & Mastery
  progress: UserProgress;
  toggleSaveTerm: (termId: string) => void;
  markLessonComplete: (termId: string) => void;
  recordGameScore: (gameId: string, score: number) => void;
  recordQuizScore: (quizKey: string, score: number, total: number) => void;
  recordMindfulnessSession: (minutes: number) => void;
  resetProgress: () => void;
  
  // Formatting utilities
  formatMoney: (amount: number) => string;
  formatNumber: (val: number, decimals?: number) => string;
}

const DEFAULT_PROGRESS: UserProgress = {
  ventureIQ: 126,
  level: 4,
  levelName: {
    en: 'Venture Architect',
    fr: 'Architecte Capital-Risque',
    zh: '风投架构师',
  },
  currentXP: 3850,
  targetXP: 5000,
  streakDays: 7,
  completedLessons: ['term_001', 'term_002', 'term_014', 'term_015', 'term_041', 'term_047', 'term_067'],
  savedTermIds: ['term_014', 'term_047', 'term_061', 'term_095'],
  gameScores: {
    game_01: 95,
    game_02: 88,
    game_04: 92,
  },
  quizScores: {
    funding_seed: { score: 5, total: 5, date: '2026-10-15' },
    captable_dilution: { score: 4, total: 5, date: '2026-10-16' },
  },
  radarCompetencies: {
    knowledge: 86,
    finance: 82,
    capTable: 79,
    psychology: 91,
    negotiation: 84,
    speed: 78,
    risk: 88,
    decisionQuality: 85,
  },
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vm_language') as Language;
    return saved && ['en', 'fr', 'zh'].includes(saved) ? saved : 'en';
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('vm_currency') as Currency;
    return saved && ['USD', 'EUR'].includes(saved) ? saved : 'USD';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('vm_dark_mode');
    return saved !== null ? saved === 'true' : false;
  });

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [selectedSimulator, setSelectedSimulator] = useState<SimulatorType>('captable');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isOpeningPortalOpen, setIsOpeningPortalOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('venture_mind_opening_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.alwaysShowOnLaunch === false) {
          return false;
        }
      }
    } catch {
      // default to true
    }
    return true;
  });
  const [isCardStackModalOpen, setIsCardStackModalOpen] = useState(false);

  // Audio state
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // User progress
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem('vm_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem('vm_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('vm_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('vm_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem('vm_progress', JSON.stringify(progress));
    } catch {
      // Ignore quota errors
    }
  }, [progress]);

  // Keyboard shortcut listener for Command/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    stopSpeech();
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleAudioMute = () => {
    setIsAudioMuted((prev) => {
      if (!prev) {
        stopSpeech();
        setIsSpeaking(false);
      }
      return !prev;
    });
  };

  const speak = (text: string, customLang?: Language) => {
    if (isAudioMuted || !isSpeechSupported()) return;
    const targetLang = customLang || language;
    setIsSpeaking(true);
    speakText(
      text,
      targetLang,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const stopVoice = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const toggleSaveTerm = (termId: string) => {
    setProgress((prev) => {
      const exists = prev.savedTermIds.includes(termId);
      const updated = exists
        ? prev.savedTermIds.filter((id) => id !== termId)
        : [...prev.savedTermIds, termId];
      return { ...prev, savedTermIds: updated };
    });
  };

  const markLessonComplete = (termId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(termId)) return prev;
      const newCompleted = [...prev.completedLessons, termId];
      const newXP = prev.currentXP + 75;
      const newIQ = Math.min(180, prev.ventureIQ + 1);
      return {
        ...prev,
        completedLessons: newCompleted,
        currentXP: newXP,
        ventureIQ: newIQ,
      };
    });
  };

  const recordGameScore = (gameId: string, score: number) => {
    setProgress((prev) => {
      const prevBest = prev.gameScores[gameId] || 0;
      const isNewBest = score > prevBest;
      const xpGained = isNewBest ? (score - prevBest) * 2 + 50 : 25;
      return {
        ...prev,
        currentXP: prev.currentXP + xpGained,
        ventureIQ: Math.min(180, prev.ventureIQ + (isNewBest ? 1 : 0)),
        gameScores: {
          ...prev.gameScores,
          [gameId]: Math.max(prevBest, score),
        },
      };
    });
  };

  const recordQuizScore = (quizKey: string, score: number, total: number) => {
    setProgress((prev) => {
      const xpEarned = Math.round((score / total) * 100);
      return {
        ...prev,
        currentXP: prev.currentXP + xpEarned,
        quizScores: {
          ...prev.quizScores,
          [quizKey]: {
            score,
            total,
            date: new Date().toISOString().split('T')[0],
          },
        },
      };
    });
  };

  const recordMindfulnessSession = (minutes: number) => {
    setProgress((prev) => {
      const addedXP = Math.round(minutes * 50);
      const newVentureIQ = Math.min(180, prev.ventureIQ + Math.round(minutes * 0.5));
      const newPsychology = Math.min(99, (prev.radarCompetencies?.psychology || 85) + 1);
      const newDecisionQuality = Math.min(99, (prev.radarCompetencies?.decisionQuality || 80) + 1);

      return {
        ...prev,
        currentXP: prev.currentXP + addedXP,
        ventureIQ: newVentureIQ,
        radarCompetencies: {
          ...prev.radarCompetencies,
          psychology: newPsychology,
          decisionQuality: newDecisionQuality,
        },
      };
    });
  };

  const resetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
  };

  const formatMoney = (amount: number): string => {
    const symbol = currency === 'EUR' ? '€' : '$';
    if (Math.abs(amount) >= 1_000_000) {
      const val = amount / 1_000_000;
      return `${symbol}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      const val = amount / 1_000;
      return `${symbol}${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}k`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  const formatNumber = (val: number, decimals: number = 2): string => {
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        darkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab,
        selectedSimulator,
        setSelectedSimulator,
        selectedTermId,
        setSelectedTermId,
        searchQuery,
        setSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isOpeningPortalOpen,
        setIsOpeningPortalOpen,
        isCardStackModalOpen,
        setIsCardStackModalOpen,
        isAudioMuted,
        toggleAudioMute,
        isSpeaking,
        speak,
        stopVoice,
        progress,
        toggleSaveTerm,
        markLessonComplete,
        recordGameScore,
        recordQuizScore,
        recordMindfulnessSession,
        resetProgress,
        formatMoney,
        formatNumber,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
