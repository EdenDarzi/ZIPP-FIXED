'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';

interface AutoTranslateTextProps {
  translationKey: string;
  fallback?: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/**
 * Componente que automaticamente traduz texto usando Google Translate
 * quando não há tradução manual disponível
 */
export function AutoTranslateText({ 
  translationKey, 
  fallback, 
  className, 
  as: Component = 'span',
  children 
}: AutoTranslateTextProps) {
  const { t, tAuto, currentLanguage } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTranslation = async () => {
      // Primeiro tenta tradução manual
      const manualTranslation = t(translationKey, undefined);
      
      // Se encontrou tradução manual (diferente do key), usa ela
      if (manualTranslation !== translationKey) {
        setTranslatedText(manualTranslation);
        return;
      }

      // Se não tem tradução manual e não está em inglês, tenta Google Translate
      if (currentLanguage !== 'en') {
        setIsLoading(true);
        try {
          const autoTranslation = await tAuto(translationKey, fallback);
          setTranslatedText(autoTranslation);
        } catch (error) {
          console.error(`Erro na tradução de ${translationKey}:`, error);
          setTranslatedText(fallback || translationKey);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Em inglês, usa fallback ou key
        setTranslatedText(fallback || translationKey);
      }
    };

    loadTranslation();
  }, [translationKey, fallback, currentLanguage, t, tAuto]);

  // Enquanto carrega, mostra o fallback ou key
  const displayText = isLoading ? (fallback || translationKey) : translatedText;

  return (
    <Component className={className}>
      {displayText}
      {children}
    </Component>
  );
}

/**
 * Hook simplificado para usar em componentes
 */
export function useSmartTranslation(key: string, fallback?: string) {
  const { t, tAuto, currentLanguage } = useLanguage();
  const [translation, setTranslation] = useState<string>(fallback || key);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTranslation = async () => {
      // Primeiro tenta manual
      const manual = t(key, undefined);
      if (manual !== key) {
        setTranslation(manual);
        return;
      }

      // Se não tem manual e não é inglês, tenta automática
      if (currentLanguage !== 'en') {
        setIsLoading(true);
        try {
          const auto = await tAuto(key, fallback);
          setTranslation(auto);
        } catch (error) {
          setTranslation(fallback || key);
        } finally {
          setIsLoading(false);
        }
      } else {
        setTranslation(fallback || key);
      }
    };

    loadTranslation();
  }, [key, fallback, currentLanguage, t, tAuto]);

  return { translation, isLoading };
}

