import { NextRequest, NextResponse } from 'next/server';

// Cache em memória para traduções em lote
const batchTranslationCache = new Map<string, string>();

function mapLanguageCode(languageCode: string): string {
  const mapping: { [key: string]: string } = {
    'he': 'he', // Hebraico
    'en': 'en', // Inglês
    'ru': 'ru', // Russo
    'ar': 'ar', // Árabe
  };
  return mapping[languageCode] || languageCode;
}

// Função para traduzir múltiplos textos usando MyMemory API
async function translateBatchWithMyMemory(texts: string[], sourceLang: string, targetLang: string): Promise<string[]> {
  const translations: string[] = [];
  
  for (const text of texts) {
    try {
      const cacheKey = `${text}_${sourceLang}_${targetLang}`;
      
      // Verificar cache primeiro
      if (batchTranslationCache.has(cacheKey)) {
        translations.push(batchTranslationCache.get(cacheKey)!);
        continue;
      }

      // Mapear códigos de idioma
      const sourceCode = mapLanguageCode(sourceLang);
      const targetCode = mapLanguageCode(targetLang);

      // Se for o mesmo idioma, usar texto original
      if (sourceCode === targetCode) {
        translations.push(text);
        continue;
      }

      // Chamar MyMemory API
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceCode}|${targetCode}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'ZIPP-Translation-Service',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
          const translation = data.responseData.translatedText;
          
          // Salvar no cache
          batchTranslationCache.set(cacheKey, translation);
          translations.push(translation);
        } else {
          translations.push(text); // Fallback para texto original
        }
      } else {
        translations.push(text); // Fallback para texto original
      }

      // Pequeno delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Erro na tradução individual:', error);
      translations.push(text); // Fallback para texto original
    }
  }
  
  return translations;
}

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLanguage, sourceLanguage = 'en' } = await request.json();

    if (!texts || !Array.isArray(texts) || !targetLanguage) {
      return NextResponse.json(
        { error: 'Array de textos e idioma de destino são obrigatórios' },
        { status: 400 }
      );
    }

    // Limite para evitar abuso
    if (texts.length > 50) {
      return NextResponse.json(
        { error: 'Máximo 50 textos por requisição para API gratuita' },
        { status: 400 }
      );
    }

    // Usar MyMemory API para tradução em lote
    const translations = await translateBatchWithMyMemory(texts, sourceLanguage, targetLanguage);

    return NextResponse.json({
      translations,
      cached: false,
      sourceLanguage,
      targetLanguage,
      count: translations.length,
      service: 'MyMemory API',
    });

  } catch (error) {
    console.error('Erro na API de tradução em lote:', error);
    return NextResponse.json({
      translations: texts, // Fallback para textos originais
      cached: false,
      error: 'Erro na tradução, retornando textos originais'
    });
  }
}
