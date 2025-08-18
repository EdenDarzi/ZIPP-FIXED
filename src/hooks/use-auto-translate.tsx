'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';

/**
 * Hook que automaticamente traduz textos usando Google Translate quando não há tradução manual
 * Mantém compatibilidade com o hook original mas adiciona funcionalidade automática
 */
export function useAutoTranslate() {
  const { t, tAuto, currentLanguage } = useLanguage();
  const [autoTranslations, setAutoTranslations] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  // Função que tenta tradução manual primeiro, depois automática
  const tSmart = (key: string, defaultValue?: string): string => {
    // Primeiro tenta tradução manual (síncrona)
    const manualTranslation = t(key, undefined);
    
    // Se a tradução manual retornou o próprio key, significa que não foi encontrada
    if (manualTranslation !== key) {
      return manualTranslation;
    }

    // Verifica se já temos tradução automática em cache
    const cacheKey = `${key}_${currentLanguage}`;
    const cachedTranslation = autoTranslations.get(cacheKey);
    if (cachedTranslation) {
      return cachedTranslation;
    }

    // Se não tem cache, inicia tradução automática em background
    if (currentLanguage !== 'en') {
      translateInBackground(key, defaultValue);
    }

    // Por enquanto, retorna o defaultValue ou key
    return defaultValue || key;
  };

  // Função para traduzir em background
  const translateInBackground = async (key: string, defaultValue?: string) => {
    const cacheKey = `${key}_${currentLanguage}`;
    
    // Evita traduções duplicadas
    if (autoTranslations.has(cacheKey)) return;

    try {
      setIsLoading(true);
      const translation = await tAuto(key, defaultValue);
      
      setAutoTranslations(prev => new Map(prev).set(cacheKey, translation));
    } catch (error) {
      console.error(`Erro na tradução automática de ${key}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para traduzir múltiplas chaves de uma vez
  const translateBatch = async (keys: string[], defaultValues?: { [key: string]: string }) => {
    const promises = keys.map(key => 
      tAuto(key, defaultValues?.[key])
    );

    try {
      setIsLoading(true);
      const results = await Promise.all(promises);
      
      const newTranslations = new Map(autoTranslations);
      keys.forEach((key, index) => {
        const cacheKey = `${key}_${currentLanguage}`;
        newTranslations.set(cacheKey, results[index]);
      });
      
      setAutoTranslations(newTranslations);
      return results;
    } catch (error) {
      console.error('Erro na tradução em lote:', error);
      return keys.map(key => defaultValues?.[key] || key);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpa cache quando idioma muda
  useEffect(() => {
    setAutoTranslations(new Map());
  }, [currentLanguage]);

  return {
    t: tSmart,
    tAuto,
    translateBatch,
    isLoading,
    cacheSize: autoTranslations.size,
    clearCache: () => setAutoTranslations(new Map()),
  };
}

