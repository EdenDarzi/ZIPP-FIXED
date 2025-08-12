'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useEnhancedLanguage, useBatchTranslation } from '@/context/enhanced-language-context';
import { Languages, Zap, Database, Globe, RefreshCw } from 'lucide-react';

export default function TranslationDemo() {
  const { 
    currentLanguage, 
    changeLanguage, 
    languages, 
    tSync, 
    translationStats,
    clearTranslationCache 
  } = useEnhancedLanguage();
  
  const { translateBatch } = useBatchTranslation();
  const [customText, setCustomText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [batchResults, setBatchResults] = useState<{ [key: string]: string }>({});

  // Teste de tradução customizada
  const handleCustomTranslation = async () => {
    if (!customText.trim()) return;
    
    setIsTranslating(true);
    try {
      // Como não temos uma chave específica, usamos o próprio texto
      const result = await translateBatch([customText], { [customText]: customText });
      setTranslatedText(result[customText] || customText);
    } catch (error) {
      console.error('Erro na tradução:', error);
      setTranslatedText('Erro na tradução');
    } finally {
      setIsTranslating(false);
    }
  };

  // Teste de tradução em lote
  const handleBatchTranslation = async () => {
    const testKeys = [
      'profile.title',
      'profile.description', 
      'profile.fullName',
      'profile.email',
      'profile.phone'
    ];
    
    setIsTranslating(true);
    try {
      const results = await translateBatch(testKeys);
      setBatchResults(results);
    } catch (error) {
      console.error('Erro na tradução em lote:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Sistema de Tradução Híbrida
          </CardTitle>
          <CardDescription>
            Demonstração do sistema que usa traduções manuais + Google Translate API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Seletor de idioma */}
          <div className="space-y-2">
            <Label>Idioma Atual</Label>
            <div className="flex gap-2">
              {Object.values(languages).map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLanguage === lang.code ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => changeLanguage(lang.code)}
                >
                  {lang.flag} {lang.nativeName}
                </Button>
              ))}
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Cache</p>
                    <p className="text-2xl font-bold">{translationStats.cacheSize}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Google Translate</p>
                    <Badge variant={translationStats.googleTranslateActive ? 'default' : 'secondary'}>
                      {translationStats.googleTranslateActive ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium">Modo</p>
                    <p className="text-sm">Híbrido</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Teste de traduções existentes */}
          <div className="space-y-2">
            <Label>Traduções Manuais (Instantâneas)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><strong>Título:</strong> {tSync('profile.title', 'My Personal Profile')}</div>
              <div><strong>Descrição:</strong> {tSync('profile.description', 'Update your details')}</div>
              <div><strong>Nome:</strong> {tSync('profile.fullName', 'Full Name')}</div>
              <div><strong>Email:</strong> {tSync('profile.email', 'Email Address')}</div>
            </div>
          </div>

          {/* Teste de tradução customizada */}
          <div className="space-y-2">
            <Label>Teste de Tradução Automática</Label>
            <div className="flex gap-2">
              <Input
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Digite um texto para traduzir..."
                className="flex-1"
              />
              <Button 
                onClick={handleCustomTranslation}
                disabled={isTranslating || !customText.trim()}
              >
                {isTranslating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Traduzir'}
              </Button>
            </div>
            {translatedText && (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm"><strong>Resultado:</strong> {translatedText}</p>
              </div>
            )}
          </div>

          {/* Teste de tradução em lote */}
          <div className="space-y-2">
            <Label>Tradução em Lote</Label>
            <Button 
              onClick={handleBatchTranslation}
              disabled={isTranslating}
              className="w-full"
            >
              {isTranslating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Traduzir Chaves do Perfil em Lote
            </Button>
            {Object.keys(batchResults).length > 0 && (
              <div className="p-3 bg-muted rounded-md space-y-1">
                {Object.entries(batchResults).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <strong>{key}:</strong> {value}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearTranslationCache}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar Cache
            </Button>
          </div>

          {/* Aviso sobre API Key */}
          {!translationStats.googleTranslateActive && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Google Translate API não está ativa.</strong><br />
                Para habilitar traduções automáticas, configure a variável de ambiente <code>GOOGLE_TRANSLATE_API_KEY</code>.
                O sistema continuará funcionando apenas com traduções manuais.
              </p>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}

