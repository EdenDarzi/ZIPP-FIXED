import { NextRequest, NextResponse } from 'next/server';

// Cache em memória para traduções
const translationCache = new Map<string, string>();

function mapLanguageCode(languageCode: string): string {
  const mapping: { [key: string]: string } = {
    'he': 'he', // Hebraico
    'en': 'en', // Inglês
    'ru': 'ru', // Russo
    'ar': 'ar', // Árabe
  };
  return mapping[languageCode] || languageCode;
}

// Função para traduzir usando MyMemory API (gratuita)
async function translateWithMyMemory(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const cacheKey = `${text}_${sourceLang}_${targetLang}`;
    
    // Verificar cache primeiro
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Mapear códigos de idioma
    const sourceCode = mapLanguageCode(sourceLang);
    const targetCode = mapLanguageCode(targetLang);

    // Se for o mesmo idioma, retornar o texto original
    if (sourceCode === targetCode) {
      return text;
    }

    // Chamar MyMemory API
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceCode}|${targetCode}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'ZIPP-Translation-Service',
      },
    });

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
      const translation = data.responseData.translatedText;
      
      // Salvar no cache
      translationCache.set(cacheKey, translation);
      
      return translation;
    } else {
      throw new Error('Tradução não encontrada na resposta da API');
    }
  } catch (error) {
    console.error('Erro na tradução MyMemory:', error);
    return text; // Retorna o texto original em caso de erro
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage = 'en' } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Texto e idioma de destino são obrigatórios' },
        { status: 400 }
      );
    }

    // Usar MyMemory API para tradução
    const translation = await translateWithMyMemory(text, sourceLanguage, targetLanguage);

    return NextResponse.json({
      translation,
      cached: translationCache.has(`${text}_${sourceLanguage}_${targetLanguage}`),
      sourceLanguage,
      targetLanguage,
      service: 'MyMemory API',
    });

  } catch (error) {
    console.error('Erro na API de tradução:', error);
    return NextResponse.json(
      { translation: text, cached: false, error: 'Erro na tradução, retornando texto original' },
      { status: 200 }
    );
  }
}
