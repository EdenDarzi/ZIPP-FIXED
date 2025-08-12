'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { hybridTranslator } from '@/lib/hybrid-translator';

// Supported languages
export type Language = 'he' | 'en' | 'ru' | 'ar';

// Language information
interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

const LANGUAGES: Record<Language, LanguageInfo> = {
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: 'rtl',
    flag: '🇮🇱'
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    flag: '🇷🇺'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  }
};

interface EnhancedLanguageContextType {
  currentLanguage: Language;
  languages: Record<Language, LanguageInfo>;
  changeLanguage: (language: Language) => void;
  t: (key: string, defaultValue?: string) => Promise<string>;
  tSync: (key: string, defaultValue?: string) => string;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  isLoading: boolean;
  translationStats: {
    cacheSize: number;
    googleTranslateActive: boolean;
  };
  clearTranslationCache: () => void;
}

const EnhancedLanguageContext = createContext<EnhancedLanguageContextType | undefined>(undefined);

export function useEnhancedLanguage() {
  const context = useContext(EnhancedLanguageContext);
  if (context === undefined) {
    throw new Error('useEnhancedLanguage must be used within an EnhancedLanguageProvider');
  }
  return context;
}

// Importar traduções manuais existentes do arquivo original
// Nota: Por agora, vamos definir aqui. Em produção, extrair para arquivo separado.
const translations: Record<Language, Record<string, string>> = {
  he: {
    'profile.title': 'הפרופיל האישי שלי',
    'profile.description': 'עדכן את הפרטים האישיים והעדפותיך.',
    'profile.fullName': 'שם מלא',
    'profile.email': 'כתובת אימייל',
    'profile.phone': 'מספר טלפון',
  },
  en: {
    'profile.title': 'My Personal Profile',
    'profile.description': 'Update your personal details and preferences.',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email Address',
    'profile.phone': 'Phone Number',
  },
  ru: {
    'profile.title': 'Мой личный профиль',
    'profile.description': 'Обновите свои личные данные и настройки.',
    'profile.fullName': 'Полное имя',
    'profile.email': 'Адрес электронной почты',
    'profile.phone': 'Номер телефона',
  },
  ar: {
    'profile.title': 'ملفي الشخصي',
    'profile.description': 'قم بتحديث تفاصيلك الشخصية وتفضيلاتك.',
    'profile.fullName': 'الاسم الكامل',
    'profile.email': 'عنوان البريد الإلكتروني',
    'profile.phone': 'رقم الهاتف',
  },
};

interface Props {
  children: React.ReactNode;
  defaultLanguage?: Language;
}

export function EnhancedLanguageProvider({ children, defaultLanguage = 'he' }: Props) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());

  // Carregar idioma salvo
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selected-language') as Language;
      if (savedLanguage && LANGUAGES[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
      }
    }
  }, []);

  // Salvar idioma quando mudar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected-language', currentLanguage);
    }
  }, [currentLanguage]);

  const changeLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
  }, []);

  // Função de tradução assíncrona (usa Google Translate se necessário)
  const t = useCallback(async (key: string, defaultValue?: string): Promise<string> => {
    const cacheKey = `${key}_${currentLanguage}`;
    
    // Verifica cache local primeiro
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    try {
      setIsLoading(true);
      
      const translation = await hybridTranslator.translate(
        key,
        currentLanguage,
        translations,
        defaultValue
      );

      // Atualiza cache local
      setTranslationCache(prev => new Map(prev).set(cacheKey, translation));
      
      return translation;
    } catch (error) {
      console.error(`Erro na tradução para ${key}:`, error);
      return defaultValue || key;
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, translationCache]);

  // Função de tradução síncrona (apenas traduções manuais)
  const tSync = useCallback((key: string, defaultValue?: string): string => {
    const manualTranslation = translations[currentLanguage]?.[key];
    if (manualTranslation) {
      return manualTranslation;
    }
    return defaultValue || key;
  }, [currentLanguage]);

  // Estatísticas do sistema de tradução
  const translationStats = {
    cacheSize: translationCache.size,
    googleTranslateActive: hybridTranslator.getStats().googleTranslateActive,
  };

  // Limpar cache
  const clearTranslationCache = useCallback(() => {
    setTranslationCache(new Map());
    hybridTranslator.clearAllCache();
  }, []);

  const value: EnhancedLanguageContextType = {
    currentLanguage,
    languages: LANGUAGES,
    changeLanguage,
    t,
    tSync,
    direction: LANGUAGES[currentLanguage].direction,
    isRTL: LANGUAGES[currentLanguage].direction === 'rtl',
    isLoading,
    translationStats,
    clearTranslationCache,
  };

  return (
    <EnhancedLanguageContext.Provider value={value}>
      {children}
    </EnhancedLanguageContext.Provider>
  );
}

// Hook para tradução em lote (útil para componentes com muitas strings)
export function useBatchTranslation() {
  const { currentLanguage } = useEnhancedLanguage();

  const translateBatch = useCallback(async (
    keys: string[],
    fallbacks?: { [key: string]: string }
  ): Promise<{ [key: string]: string }> => {
    return hybridTranslator.translateBatch(
      keys,
      currentLanguage,
      translations,
      fallbacks
    );
  }, [currentLanguage]);

  return { translateBatch };
}

// Hook para tradução com suspense (React 18+)
export function useTranslationSuspense(key: string, defaultValue?: string) {
  const { currentLanguage } = useEnhancedLanguage();
  const [translation, setTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const loadTranslation = async () => {
      try {
        const result = await hybridTranslator.translate(
          key,
          currentLanguage,
          translations,
          defaultValue
        );
        
        if (!isCancelled) {
          setTranslation(result);
          setIsLoading(false);
        }
      } catch (error) {
        if (!isCancelled) {
          setTranslation(defaultValue || key);
          setIsLoading(false);
        }
      }
    };

    loadTranslation();

    return () => {
      isCancelled = true;
    };
  }, [key, currentLanguage, defaultValue]);

  if (isLoading) {
    throw new Promise(resolve => {
      const checkLoading = () => {
        if (!isLoading) {
          resolve(translation);
        } else {
          setTimeout(checkLoading, 10);
        }
      };
      checkLoading();
    });
  }

  return translation || defaultValue || key;
}

export default EnhancedLanguageProvider;
