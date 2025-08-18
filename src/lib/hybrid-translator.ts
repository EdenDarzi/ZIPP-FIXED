import { translationService } from './translation-service';

// Interface para traduções manuais
interface ManualTranslations {
  [language: string]: {
    [key: string]: string;
  };
}

// Cache persistente para traduções automáticas
interface AutoTranslationCache {
  [cacheKey: string]: {
    translation: string;
    timestamp: number;
  };
}

class HybridTranslator {
  private autoTranslationCache: Map<string, { translation: string; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms

  constructor() {
    this.loadCacheFromStorage();
  }

  /**
   * Função principal de tradução híbrida
   * Prioridade: Manual -> Cache -> Google Translate
   */
  async translate(
    key: string,
    targetLanguage: string,
    manualTranslations: ManualTranslations,
    fallbackText?: string
  ): Promise<string> {
    // 1. Tenta tradução manual primeiro
    const manualTranslation = manualTranslations[targetLanguage]?.[key];
    if (manualTranslation) {
      return manualTranslation;
    }

    // 2. Se não tem tradução manual, verifica cache de tradução automática
    const cacheKey = `${key}_${targetLanguage}`;
    const cached = this.autoTranslationCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.translation;
    }

    // 3. Se não tem cache válido, usa Google Translate
    const sourceText = this.getSourceText(key, manualTranslations, fallbackText);
    
    if (!sourceText || !translationService.isActive()) {
      return fallbackText || key; // Fallback final
    }

    try {
      const translation = await translationService.translateText(sourceText, targetLanguage, 'en');
      
      // Salva no cache
      this.autoTranslationCache.set(cacheKey, {
        translation,
        timestamp: Date.now(),
      });
      
      this.saveCacheToStorage();
      return translation;
    } catch (error) {
      console.error(`Erro na tradução automática para ${key}:`, error);
      return fallbackText || key;
    }
  }

  /**
   * Tradução em lote para melhor performance
   */
  async translateBatch(
    keys: string[],
    targetLanguage: string,
    manualTranslations: ManualTranslations,
    fallbackTexts?: { [key: string]: string }
  ): Promise<{ [key: string]: string }> {
    const results: { [key: string]: string } = {};
    const keysToTranslate: string[] = [];
    const textsToTranslate: string[] = [];

    // Separa o que precisa de tradução automática
    for (const key of keys) {
      const manualTranslation = manualTranslations[targetLanguage]?.[key];
      if (manualTranslation) {
        results[key] = manualTranslation;
        continue;
      }

      const cacheKey = `${key}_${targetLanguage}`;
      const cached = this.autoTranslationCache.get(cacheKey);
      
      if (cached && this.isCacheValid(cached.timestamp)) {
        results[key] = cached.translation;
        continue;
      }

      // Precisa traduzir
      const sourceText = this.getSourceText(key, manualTranslations, fallbackTexts?.[key]);
      if (sourceText) {
        keysToTranslate.push(key);
        textsToTranslate.push(sourceText);
      } else {
        results[key] = fallbackTexts?.[key] || key;
      }
    }

    // Traduz em lote se necessário
    if (keysToTranslate.length > 0 && translationService.isActive()) {
      try {
        const translations = await translationService.translateBatch(textsToTranslate, targetLanguage, 'en');
        
        keysToTranslate.forEach((key, index) => {
          const translation = translations[index];
          results[key] = translation;
          
          // Salva no cache
          const cacheKey = `${key}_${targetLanguage}`;
          this.autoTranslationCache.set(cacheKey, {
            translation,
            timestamp: Date.now(),
          });
        });
        
        this.saveCacheToStorage();
      } catch (error) {
        console.error('Erro na tradução em lote:', error);
        // Em caso de erro, usa fallbacks
        keysToTranslate.forEach(key => {
          results[key] = fallbackTexts?.[key] || key;
        });
      }
    }

    return results;
  }

  /**
   * Obtém o texto fonte para tradução (inglês como base)
   */
  private getSourceText(
    key: string,
    manualTranslations: ManualTranslations,
    fallbackText?: string
  ): string | null {
    // Tenta pegar o texto em inglês primeiro
    const englishText = manualTranslations['en']?.[key];
    if (englishText) return englishText;

    // Se não tem em inglês, usa o fallback
    if (fallbackText) return fallbackText;

    // Como último recurso, usa qualquer tradução manual disponível
    for (const lang of Object.keys(manualTranslations)) {
      const text = manualTranslations[lang]?.[key];
      if (text) return text;
    }

    return null;
  }

  /**
   * Verifica se o cache ainda é válido
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Carrega cache do localStorage (apenas no cliente)
   */
  private loadCacheFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('auto-translation-cache');
      if (stored) {
        const data: AutoTranslationCache = JSON.parse(stored);
        for (const [key, value] of Object.entries(data)) {
          if (this.isCacheValid(value.timestamp)) {
            this.autoTranslationCache.set(key, value);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar cache de tradução:', error);
    }
  }

  /**
   * Salva cache no localStorage (apenas no cliente)
   */
  private saveCacheToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data: AutoTranslationCache = {};
      for (const [key, value] of this.autoTranslationCache.entries()) {
        if (this.isCacheValid(value.timestamp)) {
          data[key] = value;
        }
      }
      localStorage.setItem('auto-translation-cache', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar cache de tradução:', error);
    }
  }

  /**
   * Limpa cache expirado
   */
  cleanExpiredCache(): void {
    const toDelete: string[] = [];
    
    for (const [key, value] of this.autoTranslationCache.entries()) {
      if (!this.isCacheValid(value.timestamp)) {
        toDelete.push(key);
      }
    }
    
    toDelete.forEach(key => this.autoTranslationCache.delete(key));
    this.saveCacheToStorage();
  }

  /**
   * Estatísticas do sistema híbrido
   */
  getStats(): {
    cacheSize: number;
    googleTranslateActive: boolean;
    cacheHitRate?: number;
  } {
    return {
      cacheSize: this.autoTranslationCache.size,
      googleTranslateActive: translationService.isActive(),
    };
  }

  /**
   * Força a limpeza de todo o cache
   */
  clearAllCache(): void {
    this.autoTranslationCache.clear();
    translationService.clearCache();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auto-translation-cache');
    }
  }
}

// Singleton instance
export const hybridTranslator = new HybridTranslator();

export default hybridTranslator;

