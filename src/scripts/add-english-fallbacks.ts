// Script para adicionar traduções em inglês baseadas nas chaves
// Isso permite que o Google Translate funcione melhor

const englishFallbacks = {
  // Header
  'header.myAccount': 'My Account',
  'header.cart': 'Cart',
  'header.language': 'Language',
  'header.travelMode': 'Travel Mode',
  'header.notifications': 'Notifications',
  'header.home': 'Home',
  'header.restaurants': 'Restaurants',
  'header.marketplace': 'Marketplace',
  'header.sendPackage': 'Send Package',
  'header.zippSale': 'ZIPP Sale',
  'header.trendScanner': 'Trend Scanner',
  'header.favorites': 'Favorites',
  'header.partners': 'Partners',
  'header.couriers': 'Couriers',
  'header.businessManagement': 'Business Management',
  'header.superAdmin': 'Super Admin',
  'header.smartTools': 'Smart Tools',
  
  // Footer
  'footer.aboutUs': 'About Us (Coming Soon)',
  'footer.careers': 'Careers (Coming Soon)',
  'footer.blog': 'Blog (Coming Soon)',
  'footer.customerService': 'Customer Service',
  'footer.helpCenter': 'Help Center',
  'footer.termsOfService': 'Terms of Service',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.joinUs': 'Join Us',
  'footer.businessesSignUp': 'Businesses: Sign up for ZIPP',
  'footer.couriersJoin': 'Couriers: Join the Team',
  'footer.partnerProgram': 'Partner Program',
  'footer.contact': 'Contact',
  'footer.orderNow': 'Order Now',
  'footer.trackOrder': 'Track Order',
  'footer.allRightsReserved': '© 2025 ZIPP. All rights reserved.',
  'footer.tagline': 'Your smart delivery platform, powered by AI.',
  
  // Common
  'common.loading': 'Loading...',
  'common.error': 'Error',
  'common.success': 'Success',
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.add': 'Add',
  'common.remove': 'Remove',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.sort': 'Sort',
  'common.view': 'View',
  'common.close': 'Close',
  'common.open': 'Open',
  'common.next': 'Next',
  'common.previous': 'Previous',
  'common.continue': 'Continue',
  'common.back': 'Back',
  'common.finish': 'Finish',
  'common.submit': 'Submit',
  'common.confirm': 'Confirm',
  'common.yes': 'Yes',
  'common.no': 'No',
  
  // Pages
  'pages.favorites.title': 'My Favorites',
  'pages.favorites.description': 'Your favorite restaurants, stores and items will appear here for quick access.',
  'pages.favorites.comingSoon': 'This feature is in development and will be available soon!',
  'pages.favorites.discoverMore': 'Discover More Businesses',
  
  // Brands/Company
  'brand.zipp': 'ZIPP',
  'brand.tagline': 'The Home of Deliveries',
};

// Função para converter chave em texto legível
function keyToReadableText(key: string): string {
  return key
    .split('.')
    .pop() // Pega a última parte da chave
    ?.replace(/([A-Z])/g, ' $1') // Adiciona espaço antes de maiúsculas
    .replace(/^./, str => str.toUpperCase()) // Primeira letra maiúscula
    .trim() || key;
}

export { englishFallbacks, keyToReadableText };

