// MyMemory API será usado nas API routes (server-side)
// No client-side, usaremos fetch para chamar nossa API

// Interface para o cache de traduções
interface TranslationCache {
  [key: string]: string;
}

class TranslationService {
  private cache: Map<string, string> = new Map();
  private isClientSide = typeof window !== 'undefined';

  constructor() {
    // No client-side, apenas gerenciamos cache
  }

  /**
   * Traduz um texto para o idioma especificado
   * No client-side, chama nossa API. No server-side, usa MyMemory API.
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
    const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
    
    // Verifica cache primeiro
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      if (this.isClientSide) {
        // Client-side: chama nossa API
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            targetLanguage,
            sourceLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error('Translation API failed');
        }

        const data = await response.json();
        const translation = data.translation || text;

        // Salva no cache
        this.cache.set(cacheKey, translation);
        return translation;
      } else {
        // Server-side: retorna texto original (será implementado nas API routes)
        return text;
      }
    } catch (error) {
      console.error('Erro na tradução:', error);
      return text;
    }
  }

  /**
   * Traduz múltiplos textos de uma vez (mais eficiente)
   */
  async translateBatch(texts: string[], targetLanguage: string, sourceLanguage = 'en'): Promise<string[]> {
    if (this.isClientSide) {
      // Client-side: chama API em lote
      try {
        const response = await fetch('/api/translate/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            texts,
            targetLanguage,
            sourceLanguage,
          }),
        });

        if (!response.ok) {
          throw new Error('Batch translation API failed');
        }

        const data = await response.json();
        const translations = data.translations || texts;

        // Salva no cache
        texts.forEach((text, index) => {
          const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;
          this.cache.set(cacheKey, translations[index]);
        });

        return translations;
      } catch (error) {
        console.error('Erro na tradução em lote:', error);
        return texts;
      }
    } else {
      // Server-side: implementar depois
      return texts;
    }
  }

  /**
   * Mapeia nossos códigos de idioma para os códigos padrão
   */
  private mapLanguageCode(languageCode: string): string {
    const mapping: { [key: string]: string } = {
      'he': 'he', // Hebraico
      'en': 'en', // Inglês
      'ru': 'ru', // Russo
      'ar': 'ar', // Árabe
    };
    return mapping[languageCode] || languageCode;
  }

  /**
   * Limpa o cache (útil para desenvolvimento)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Retorna estatísticas do cache
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()).slice(0, 10), // Primeiras 10 chaves
    };
  }

  /**
   * Verifica se o serviço está ativo
   */
  isActive(): boolean {
    // No client-side, sempre assumimos que pode estar ativo (depende da API)
    return true;
  }
}

// Singleton instance
export const translationService = new TranslationService();

// Função utilitária para uso direto
export async function translateText(text: string, targetLanguage: string, sourceLanguage = 'en'): Promise<string> {
  return translationService.translateText(text, targetLanguage, sourceLanguage);
}

export default translationService;
