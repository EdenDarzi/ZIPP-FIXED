/**
 * Script para automaticamente identificar páginas que precisam de tradução automática
 * e listar textos hardcoded que devem ser convertidos para AutoTranslateText
 */

// Lista de páginas que precisam ser verificadas
const PAGES_TO_CHECK = [
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx', 
  'src/app/support/page.tsx',
  'src/app/notifications/page.tsx',
  'src/app/affiliate/page.tsx',
  'src/app/vip/page.tsx',
  'src/app/send-package/page.tsx',
  'src/app/livepick-sale/page.tsx',
  'src/app/restaurants/page.tsx',
  'src/app/nutritional-advisor/page.tsx',
  'src/app/visual-search/page.tsx',
  'src/app/cart/page.tsx',
  'src/app/checkout/page.tsx',
];

// Padrões de texto hardcoded que devem ser convertidos
const HARDCODED_PATTERNS = [
  // Textos em hebraico
  /[\u0590-\u05FF]+/g,
  // Textos em árabe  
  /[\u0600-\u06FF]+/g,
  // Textos em russo
  /[\u0400-\u04FF]+/g,
  // Strings longas em inglês (provavelmente hardcoded)
  /"[A-Za-z\s]{20,}"/g,
];

// Função para analisar uma página
export function analyzePage(filePath: string, content: string) {
  const issues: Array<{
    line: number;
    text: string;
    suggestion: string;
  }> = [];

  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    HARDCODED_PATTERNS.forEach(pattern => {
      const matches = line.match(pattern);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            line: index + 1,
            text: match,
            suggestion: `Replace with <AutoTranslateText translationKey="..." fallback="${match}" />`
          });
        });
      }
    });
  });

  return {
    filePath,
    hasIssues: issues.length > 0,
    issues,
    needsImports: !content.includes('AutoTranslateText'),
    needsLanguageHook: !content.includes('useLanguage'),
  };
}

// Função para gerar código de correção automática
export function generateAutoFix(text: string, translationKey: string) {
  const cleanText = text.replace(/['"]/g, '');
  return `<AutoTranslateText 
    translationKey="${translationKey}" 
    fallback="${cleanText}"
  />`;
}

// Mapeamento de textos comuns para chaves de tradução
export const COMMON_TRANSLATIONS = {
  // Hebraico -> Inglês
  'מדיניות פרטיות': 'privacy.title',
  'תנאי השימוש': 'terms.title', 
  'מרכז התמיכה': 'support.title',
  'התראות': 'notifications.title',
  'שותפים': 'affiliate.title',
  'חברי VIP': 'vip.title',
  'שלח חבילה': 'sendPackage.title',
  'מסעדות': 'restaurants.title',
  'יועץ תזונה': 'nutritionalAdvisor.title',
  'חיפוש חזותי': 'visualSearch.title',
  'עגלת קניות': 'cart.title',
  'תשלום': 'checkout.title',
  
  // Textos em inglês comuns
  'Privacy Policy': 'privacy.title',
  'Terms of Service': 'terms.title',
  'Support Center': 'support.title',
  'Notifications': 'notifications.title',
  'Affiliate Program': 'affiliate.title',
  'VIP Members': 'vip.title',
  'Send Package': 'sendPackage.title',
  'Restaurants': 'restaurants.title',
  'Nutritional Advisor': 'nutritionalAdvisor.title',
  'Visual Search': 'visualSearch.title',
  'Shopping Cart': 'cart.title',
  'Checkout': 'checkout.title',
};

console.log('Auto-translate pages script loaded. Use analyzePage() to check files.');

