'use client';

import { AutoTranslateText, useSmartTranslation } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TestAutoTranslatePage() {
  const { currentLanguage, changeLanguage, languages } = useLanguage();
  const { translation: headerTitle } = useSmartTranslation('header.home', 'Home');
  const { translation: footerTagline } = useSmartTranslation('footer.tagline', 'Your smart delivery platform, powered by AI.');

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Seletor de idioma */}
        <Card>
          <CardHeader>
            <CardTitle>Teste de Tradução Automática</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
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
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">🎯 Traduções Manuais (já existem):</h3>
                <p><strong>Home:</strong> {headerTitle}</p>
                <p><strong>Tagline:</strong> {footerTagline}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">⚡ Tradução Automática (MyMemory API):</h3>
                <p>
                  <strong>Welcome:</strong>{' '}
                  <AutoTranslateText 
                    translationKey="test.welcome" 
                    fallback="Welcome to our platform"
                  />
                </p>
                <p>
                  <strong>Thank You:</strong>{' '}
                  <AutoTranslateText 
                    translationKey="test.thankYou" 
                    fallback="Thank you for using our service"
                  />
                </p>
                <p>
                  <strong>Get Started:</strong>{' '}
                  <AutoTranslateText 
                    translationKey="test.getStarted" 
                    fallback="Get started with your first order"
                  />
                </p>
                <p>
                  <strong>Customer Support:</strong>{' '}
                  <AutoTranslateText 
                    translationKey="test.customerSupport" 
                    fallback="24/7 Customer Support Available"
                  />
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">🌐 Textos do Sistema (devem traduzir automaticamente):</h3>
                <p>
                  <strong>Business Management:</strong>{' '}
                  <AutoTranslateText 
                    translationKey="header.businessManagement" 
                    fallback="Business Management"
                  />
                </p>
                <p>
                  <strong>Send Package:</strong>{' '}
                  <AutoTranslateText 
                    translationKey="header.sendPackage" 
                    fallback="Send Package"
                  />
                </p>
                <p>
                  <strong>About Us:</strong>{' '}
                  <AutoTranslateText 
                    translationKey="footer.aboutUs" 
                    fallback="About Us (Coming Soon)"
                  />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <AutoTranslateText 
                translationKey="brand.zipp" 
                fallback="ZIPP"
                as="h1"
                className="text-4xl font-bold"
              />
              <AutoTranslateText 
                translationKey="brand.tagline" 
                fallback="The Home of Deliveries"
                as="h2"
                className="text-xl text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
