'use client';

import TranslationDemo from '@/components/translation/translation-demo';
import { EnhancedLanguageProvider } from '@/context/enhanced-language-context';

export default function TranslationDemoPage() {
  return (
    <EnhancedLanguageProvider>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Sistema de Tradução Híbrida</h1>
            <p className="text-muted-foreground">
              Demonstração do sistema que combina traduções manuais com Google Translate API
            </p>
          </div>
          <TranslationDemo />
        </div>
      </div>
    </EnhancedLanguageProvider>
  );
}

