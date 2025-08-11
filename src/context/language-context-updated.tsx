'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Supported languages
export type Language = 'he' | 'en' | 'ru' | 'ar';

// Language information
interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

const LANGUAGES: Record<Language, LanguageInfo> = {
  he: {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    direction: 'rtl',
    flag: '🇮🇱'
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇺🇸'
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    flag: '🇷🇺'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦'
  }
};

interface LanguageContextType {
  currentLanguage: Language;
  languages: Record<Language, LanguageInfo>;
  changeLanguage: (language: Language) => void;
  t: (key: string, defaultValue?: string | Record<string, string | number>) => string;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation keys and their values for each language
const translations: Record<Language, Record<string, string>> = {
  he: {
    // Header
    'header.myAccount': 'החשבון שלי',
    'header.cart': 'עגלת קניות',
    'header.language': 'שפה',
    'header.travelMode': 'מצב נסיעות',
    'header.notifications': 'התראות',
    
    // Common - Basic Actions
    'common.loading': 'טוען...',
    'common.error': 'שגיאה',
    'common.success': 'הצלחה',
    'common.save': 'שמור',
    'common.cancel': 'ביטול',
    'common.continue': 'המשך',
    'common.back': 'חזור',
    'common.edit': 'ערוך',
    'common.delete': 'מחק',
    'common.add': 'הוסף',
    'common.search': 'חיפוש',
    'common.filter': 'סינון',
    'common.sort': 'מיון',
    'common.close': 'סגור',
    'common.open': 'פתח',
    'common.yes': 'כן',
    'common.no': 'לא',
    'common.activate': 'הפעל',
    
    // Navigation
    'nav.home': 'בית',
    'nav.restaurants': 'מסעדות',
    'nav.marketplace': 'שוק',
    'nav.courier': 'שליח',
    'nav.admin': 'ניהול',
    'nav.sendPackage': 'שלח חבילה',
    'nav.zippSale': 'ZIPP Sale',
    'nav.trendScanner': 'סורק טרנדים',
    'nav.favorites': 'מועדפים',
    'nav.partners': 'שותפים',
    'nav.couriers': 'שליחים',
    'nav.businessManagement': 'ניהול עסק',
    'nav.superAdmin': 'סופר אדמין',
    
    // Language switching
    'language.changed': 'השפה שונתה בהצלחה',
    'language.changeToEnglish': 'Change to English',
    'language.changeToHebrew': 'שנה לעברית',
    'language.changeToRussian': 'Изменить на русский',
    'language.changeToArabic': 'تغيير إلى العربية',
    
    // Restaurant
    'restaurant.orderNow': 'הזמן עכשיו',
    'restaurant.addToCart': 'הוסף לעגלה',
    'restaurant.viewMenu': 'צפה בתפריט',
    'restaurant.rating': 'דירוג',
    'restaurant.delivery': 'משלוח',
    'restaurant.pickup': 'איסוף עצמי',
    'restaurant.reviews': 'ביקורות',
    'restaurant.minutes': 'דקות',
    'restaurant.hours': 'שעות',
    'restaurant.cuisine.american': 'אמריקאי',
    'restaurant.cuisine.italian': 'איטלקי',
    'restaurant.cuisine.flower': 'חנות פרחים',
    
    // Orders
    'order.status': 'סטטוס הזמנה',
    'order.tracking': 'מעקב הזמנה',
    'order.history': 'היסטוריית הזמנות',
    'order.total': 'סכום כולל',
    'order.items': 'פריטים',
    'order.deliveryTime': 'זמן משלוח',
    
    // Payment
    'payment.method': 'אמצעי תשלום',
    'payment.card': 'כרטיס אשראי',
    'payment.wallet': 'ארנק דיגיטלי',
    'payment.cash': 'מזומן',
    'payment.successful': 'התשלום עבר בהצלחה',
    'payment.failed': 'התשלום נכשל',
    
    // Wallet
    'wallet.balance': 'יתרה',
    'wallet.addFunds': 'הוסף כסף',
    'wallet.transactions': 'עסקאות',
    'wallet.history': 'היסטוריה',
    
    // Profile
    'profile.personalInfo': 'פרטים אישיים',
    'profile.addresses': 'כתובות',
    'profile.paymentMethods': 'אמצעי תשלום',
    'profile.preferences': 'העדפות',
    'profile.logout': 'התנתק',
    
    // Notifications
    'notification.orderConfirmed': 'הזמנה אושרה',
    'notification.courierAssigned': 'שליח שובץ',
    'notification.onTheWay': 'בדרך אליך',
    'notification.delivered': 'נמסר בהצלחה',
    
    // Travel Mode
    'travelModeDemo': 'מצב נסיעות (הדגמה)',
    'travelModeDesc': 'המלצות מותאמות למיקום ושירותים בינלאומיים יגיעו. (הדגמה של פונקציונליות זו).',
    
    // Homepage
    'welcome.title': 'ברוכים הבאים ל-ZIPP',
    'welcome.subtitle': 'הפתרון האחד שלכם למשלוח מהיר ואמין מהעסקים המקומיים האהובים עליכם, עם טוויסט חכם וקהילתי!',
    'business.all': 'לכל העסקים',
    'business.quickSignup': 'הרשמה מהירה',
    'ai.chef.title': '🔮 השף הקולינרי החכם שלך ממליץ...',
    'ai.chef.suggestion': 'היום יום ראשון! להתחיל את השבוע עם בראנץ\' מפנק? אולי ביצים בנדיקט מ\'קפה גרג\'?',
    'ai.more': 'קבל המלצות AI נוספות ←',
    'couriers.active': 'שליחים פעילים באזורך כעת!',
    'couriers.count': 'כעת יש כ-{{count}} שליחים זמינים!',
    'p2p.title': 'צריך לשלוח חפץ או מסמך?',
    'p2p.description': 'שירות משלוחי P2P לשליחת חפצים, מסמכים, או אפילו לבקש מהשליח לרכוש עבורך משהו קטן.',
    'p2p.start': 'התחל משלוח P2P',
    'radar.title': 'Food Radar & Live Trends',
    'radar.subtitle': 'גלה מה חם סביבך בזמן אמת!',
    'partners.program': 'תוכנית שותפים',
    'partners.description': 'הרווח כסף והטבות על המלצות.',
    'deals.title': 'שיתופי פעולה ודילים חמים',
    'deals.description': 'מבצעים בלעדיים בשיתוף עם מותגים מובילים, בהשראת הטרנדים החמים ביותר!',
    'deals.example': 'בלעדי ל-ZIPP! קבלו 20% הנחה על כל קולקציית הקינוחים החדשה של \'Sweet Dreams Bakery\' בהשראת טרנד ה\'קרופי\' שזוהה ב-TrendScanner!',
    'deals.more': 'גלה שיתופי פעולה נוספים',
    'wheel.title': '🎡 גלגל ההפתעות של ZIPP!',
    'wheel.description': 'מרגיש בר מזל? סובב את הגלגל וזכה בהנחות, קינוחים, משלוחים חינם ועוד הפתעות!',
    'wheel.spin': 'סובב את הגלגל היומי',
    'recommendations.title': '🎯 במיוחד בשבילך: ממצאים שאסור לפספס!',
    'new.title': '✨ חדש חם מהתנור: גלה מה נפתח לידך!',
    
    // Business Types
    'business.type.restaurant': 'מסעדה',
    'business.type.flower': 'חנות פרחים',
    'business.type.cafe': 'בית קפה',
    
    // Tags
    'tag.recommended': 'מומלץ',
    'tag.hot': 'חם עכשיו',
    'tag.new': 'חדש',
    'tag.choice': 'בחירת ZIPP',
    'tag.tooltip': '{{tag}} - מאפיין מיוחד של העסק',
    'tag.popular': 'פופולרי',
    'tag.fastDelivery': 'משלוח מהיר',
    'tag.deliveryArena': 'זירת משלוחים',
    'tag.choice.tooltip': 'מומלץ במיוחד על ידי צוות ZIPP!'
  },
  
  en: {
    // Header
    'header.myAccount': 'My Account',
    'header.cart': 'Shopping Cart',
    'header.language': 'Language',
    'header.travelMode': 'Travel Mode',
    'header.notifications': 'Notifications',
    
    // Common - Basic Actions
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.activate': 'Activate',
    
    // Navigation
    'nav.home': 'Home',
    'nav.restaurants': 'Restaurants',
    'nav.marketplace': 'Marketplace',
    'nav.courier': 'Courier',
    'nav.admin': 'Admin',
    'nav.sendPackage': 'Send Package',
    'nav.zippSale': 'ZIPP Sale',
    'nav.trendScanner': 'Trend Scanner',
    'nav.favorites': 'Favorites',
    'nav.partners': 'Partners',
    'nav.couriers': 'Couriers',
    'nav.businessManagement': 'Business Management',
    'nav.superAdmin': 'Super Admin',
    
    // Language switching
    'language.changed': 'Language changed successfully',
    'language.changeToEnglish': 'Change to English',
    'language.changeToHebrew': 'שנה לעברית',
    'language.changeToRussian': 'Изменить на русский',
    'language.changeToArabic': 'تغيير إلى العربية',
    
    // Restaurant
    'restaurant.orderNow': 'Order Now',
    'restaurant.addToCart': 'Add to Cart',
    'restaurant.viewMenu': 'View Menu',
    'restaurant.rating': 'Rating',
    'restaurant.delivery': 'Delivery',
    'restaurant.pickup': 'Pickup',
    'restaurant.reviews': 'Reviews',
    'restaurant.minutes': 'minutes',
    'restaurant.hours': 'hours',
    'restaurant.cuisine.american': 'American',
    'restaurant.cuisine.italian': 'Italian',
    'restaurant.cuisine.flower': 'Flower Shop',
    
    // Orders
    'order.status': 'Order Status',
    'order.tracking': 'Order Tracking',
    'order.history': 'Order History',
    'order.total': 'Total',
    'order.items': 'Items',
    'order.deliveryTime': 'Delivery Time',
    
    // Payment
    'payment.method': 'Payment Method',
    'payment.card': 'Credit Card',
    'payment.wallet': 'Digital Wallet',
    'payment.cash': 'Cash',
    'payment.successful': 'Payment successful',
    'payment.failed': 'Payment failed',
    
    // Wallet
    'wallet.balance': 'Balance',
    'wallet.addFunds': 'Add Funds',
    'wallet.transactions': 'Transactions',
    'wallet.history': 'History',
    
    // Profile
    'profile.personalInfo': 'Personal Information',
    'profile.addresses': 'Addresses',
    'profile.paymentMethods': 'Payment Methods',
    'profile.preferences': 'Preferences',
    'profile.logout': 'Logout',
    
    // Notifications
    'notification.orderConfirmed': 'Order confirmed',
    'notification.courierAssigned': 'Courier assigned',
    'notification.onTheWay': 'On the way',
    'notification.delivered': 'Delivered successfully',
    
    // Travel Mode
    'travelModeDemo': 'Travel Mode (Demo)',
    'travelModeDesc': 'Location-based recommendations and international services coming soon. (Demo functionality).',
    
    // Homepage
    'welcome.title': 'Welcome to ZIPP',
    'welcome.subtitle': 'Your one-stop solution for fast and reliable delivery from your favorite local businesses, with a smart and community twist!',
    'business.all': 'All Businesses',
    'business.quickSignup': 'Quick Signup',
    'ai.chef.title': '🔮 Your Smart Culinary Chef Recommends...',
    'ai.chef.suggestion': 'Today is Sunday! Start the week with a pampering brunch? Maybe eggs benedict from \'Cafe Greg\'?',
    'ai.more': 'Get More AI Recommendations →',
    'couriers.active': 'Active couriers in your area now!',
    'couriers.count': 'There are about {{count}} couriers available now!',
    'p2p.title': 'Need to send an item or document?',
    'p2p.description': 'P2P delivery service for sending items, documents, or even asking the courier to purchase something small for you.',
    'p2p.start': 'Start P2P Delivery',
    'radar.title': 'Food Radar & Live Trends',
    'radar.subtitle': 'Discover what\'s hot around you in real time!',
    'partners.program': 'Partners Program',
    'partners.description': 'Earn money and benefits from referrals.',
    'deals.title': 'Hot Collaborations & Deals',
    'deals.description': 'Exclusive deals in collaboration with leading brands, inspired by the hottest trends!',
    'deals.example': 'Exclusive to ZIPP! Get 20% off the entire new dessert collection from \'Sweet Dreams Bakery\' inspired by the \'Croffle\' trend identified by TrendScanner!',
    'deals.more': 'Discover More Collaborations',
    'wheel.title': '🎡 ZIPP\'s Surprise Wheel!',
    'wheel.description': 'Feeling lucky? Spin the wheel and win discounts, desserts, free deliveries and more surprises!',
    'wheel.spin': 'Spin the Daily Wheel',
    'recommendations.title': '🎯 Especially for You: Finds You Can\'t Miss!',
    'new.title': '✨ Hot from the Oven: Discover What\'s New Near You!',
    
    // Business Types
    'business.type.restaurant': 'Restaurant',
    'business.type.flower': 'Flower Shop',
    'business.type.cafe': 'Cafe',
    
    // Tags
    'tag.recommended': 'Recommended',
    'tag.hot': 'Hot Now',
    'tag.new': 'New',
    'tag.choice': 'ZIPP Choice',
    'tag.tooltip': '{{tag}} - Special business feature',
    'tag.popular': 'Popular',
    'tag.fastDelivery': 'Fast Delivery',
    'tag.deliveryArena': 'Delivery Arena',
    'tag.choice.tooltip': 'Specially recommended by ZIPP team!'
  },
  
  ru: {
    // Header
    'header.myAccount': 'Мой аккаунт',
    'header.cart': 'Корзина',
    'header.language': 'Язык',
    'header.travelMode': 'Режим путешествий',
    'header.notifications': 'Уведомления',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.continue': 'Продолжить',
    'common.back': 'Назад',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.add': 'Добавить',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.sort': 'Сортировка',
    'common.close': 'Закрыть',
    'common.open': 'Открыть',
    'common.yes': 'Да',
    'common.no': 'Нет',
    'common.activate': 'Активировать',
    
    // Navigation
    'nav.home': 'Главная',
    'nav.restaurants': 'Рестораны',
    'nav.marketplace': 'Маркетплейс',
    'nav.courier': 'Курьер',
    'nav.admin': 'Админ',
    'nav.sendPackage': 'Отправить посылку',
    'nav.zippSale': 'Скидки ZIPP',
    'nav.trendScanner': 'Сканер трендов',
    'nav.favorites': 'Избранное',
    'nav.partners': 'Партнеры',
    'nav.couriers': 'Курьеры',
    'nav.businessManagement': 'Управление бизнесом',
    'nav.superAdmin': 'Супер админ',
    
    // Language switching
    'language.changed': 'Язык успешно изменен',
    'language.changeToEnglish': 'Change to English',
    'language.changeToHebrew': 'שנה לעברית',
    'language.changeToRussian': 'Изменить на русский',
    'language.changeToArabic': 'تغيير إلى العربية',
    
    // Restaurant
    'restaurant.orderNow': 'Заказать сейчас',
    'restaurant.addToCart': 'В корзину',
    'restaurant.viewMenu': 'Посмотреть меню',
    'restaurant.rating': 'Рейтинг',
    'restaurant.delivery': 'Доставка',
    'restaurant.pickup': 'Самовывоз',
    'restaurant.reviews': 'Отзывы',
    'restaurant.minutes': 'минут',
    'restaurant.hours': 'часов',
    'restaurant.cuisine.american': 'Американская',
    'restaurant.cuisine.italian': 'Итальянская',
    'restaurant.cuisine.flower': 'Цветочный магазин',
    
    // Orders
    'order.status': 'Статус заказа',
    'order.tracking': 'Отслеживание заказа',
    'order.history': 'История заказов',
    'order.total': 'Итого',
    'order.items': 'Товары',
    'order.deliveryTime': 'Время доставки',
    
    // Payment
    'payment.method': 'Способ оплаты',
    'payment.card': 'Кредитная карта',
    'payment.wallet': 'Электронный кошелек',
    'payment.cash': 'Наличные',
    'payment.successful': 'Оплата прошла успешно',
    'payment.failed': 'Оплата не удалась',
    
    // Wallet
    'wallet.balance': 'Баланс',
    'wallet.addFunds': 'Пополнить',
    'wallet.transactions': 'Транзакции',
    'wallet.history': 'История',
    
    // Profile
    'profile.personalInfo': 'Личная информация',
    'profile.addresses': 'Адреса',
    'profile.paymentMethods': 'Способы оплаты',
    'profile.preferences': 'Предпочтения',
    'profile.logout': 'Выйти',
    
    // Notifications
    'notification.orderConfirmed': 'Заказ подтвержден',
    'notification.courierAssigned': 'Курьер назначен',
    'notification.onTheWay': 'В пути',
    'notification.delivered': 'Доставлено успешно',
    
    // Travel Mode
    'travelModeDemo': 'Режим путешествий (Демо)',
    'travelModeDesc': 'Рекомендации на основе местоположения и международные услуги скоро будут доступны. (Демо функциональность).',
    
    // Homepage
    'welcome.title': 'Добро пожаловать в ZIPP',
    'welcome.subtitle': 'Ваше универсальное решение для быстрой и надежной доставки от любимых местных заведений с умным и общественным подходом!',
    'business.all': 'Все заведения',
    'business.quickSignup': 'Быстрая регистрация',
    'ai.chef.title': '🔮 Ваш умный кулинарный шеф рекомендует...',
    'ai.chef.suggestion': 'Сегодня воскресенье! Начать неделю с роскошного бранча? Может быть, яйца бенедикт из \'Кафе Грег\'?',
    'ai.more': 'Получить больше ИИ рекомендаций →',
    'couriers.active': 'Активные курьеры в вашем районе сейчас!',
    'couriers.count': 'Сейчас доступно около {{count}} курьеров!',
    'p2p.title': 'Нужно отправить предмет или документ?',
    'p2p.description': 'Служба доставки P2P для отправки предметов, документов или даже просьбы к курьеру купить что-то маленькое для вас.',
    'p2p.start': 'Начать P2P доставку',
    'radar.title': 'Пищевой радар и живые тренды',
    'radar.subtitle': 'Узнайте, что популярно вокруг вас в режиме реального времени!',
    'partners.program': 'Партнерская программа',
    'partners.description': 'Зарабатывайте деньги и льготы на рекомендациях.',
    'deals.title': 'Горячие сотрудничества и предложения',
    'deals.description': 'Эксклюзивные предложения в сотрудничестве с ведущими брендами, вдохновленные самыми горячими трендами!',
    'deals.example': 'Эксклюзивно для ZIPP! Получите скидку 20% на всю новую коллекцию десертов от \'Sweet Dreams Bakery\', вдохновленную трендом \'Кроффл\', выявленным TrendScanner!',
    'deals.more': 'Узнать больше сотрудничеств',
    'wheel.title': '🎡 Колесо сюрпризов ZIPP!',
    'wheel.description': 'Чувствуете удачу? Крутите колесо и выигрывайте скидки, десерты, бесплатную доставку и другие сюрпризы!',
    'wheel.spin': 'Крутить ежедневное колесо',
    'recommendations.title': '🎯 Специально для вас: находки, которые нельзя пропустить!',
    'new.title': '✨ Горячее из печи: откройте для себя новое рядом с вами!',
    
    // Business Types
    'business.type.restaurant': 'Ресторан',
    'business.type.flower': 'Цветочный магазин',
    'business.type.cafe': 'Кафе',
    
    // Tags
    'tag.recommended': 'Рекомендуется',
    'tag.hot': 'Горячее сейчас',
    'tag.new': 'Новое',
    'tag.choice': 'Выбор ZIPP',
    'tag.tooltip': '{{tag}} - особенность заведения',
    'tag.popular': 'Популярное',
    'tag.fastDelivery': 'Быстрая доставка',
    'tag.deliveryArena': 'Арена доставки',
    'tag.choice.tooltip': 'Особенно рекомендуется командой ZIPP!'
  },
  
  ar: {
    // Header
    'header.myAccount': 'حسابي',
    'header.cart': 'عربة التسوق',
    'header.language': 'اللغة',
    'header.travelMode': 'وضع السفر',
    'header.notifications': 'الإشعارات',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.continue': 'متابعة',
    'common.back': 'رجوع',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.close': 'إغلاق',
    'common.open': 'فتح',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.activate': 'تفعيل',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.restaurants': 'المطاعم',
    'nav.marketplace': 'السوق',
    'nav.courier': 'موزع',
    'nav.admin': 'إدارة',
    'nav.sendPackage': 'إرسال طرد',
    'nav.zippSale': 'تخفيضات ZIPP',
    'nav.trendScanner': 'ماسح الاتجاهات',
    'nav.favorites': 'المفضلة',
    'nav.partners': 'الشركاء',
    'nav.couriers': 'الموزعون',
    'nav.businessManagement': 'إدارة الأعمال',
    'nav.superAdmin': 'المدير العام',
    
    // Language switching
    'language.changed': 'تم تغيير اللغة بنجاح',
    'language.changeToEnglish': 'Change to English',
    'language.changeToHebrew': 'שנה לעברית',
    'language.changeToRussian': 'Изменить на русский',
    'language.changeToArabic': 'تغيير إلى العربية',
    
    // Restaurant
    'restaurant.orderNow': 'اطلب الآن',
    'restaurant.addToCart': 'أضف للعربة',
    'restaurant.viewMenu': 'عرض القائمة',
    'restaurant.rating': 'التقييم',
    'restaurant.delivery': 'التوصيل',
    'restaurant.pickup': 'الاستلام',
    'restaurant.reviews': 'المراجعات',
    'restaurant.minutes': 'دقائق',
    'restaurant.hours': 'ساعات',
    'restaurant.cuisine.american': 'أمريكي',
    'restaurant.cuisine.italian': 'إيطالي',
    'restaurant.cuisine.flower': 'محل الزهور',
    
    // Orders
    'order.status': 'حالة الطلب',
    'order.tracking': 'تتبع الطلب',
    'order.history': 'تاريخ الطلبات',
    'order.total': 'الإجمالي',
    'order.items': 'العناصر',
    'order.deliveryTime': 'وقت التوصيل',
    
    // Payment
    'payment.method': 'طريقة الدفع',
    'payment.card': 'بطاقة ائتمان',
    'payment.wallet': 'محفظة رقمية',
    'payment.cash': 'نقدي',
    'payment.successful': 'تم الدفع بنجاح',
    'payment.failed': 'فشل الدفع',
    
    // Wallet
    'wallet.balance': 'الرصيد',
    'wallet.addFunds': 'إضافة أموال',
    'wallet.transactions': 'المعاملات',
    'wallet.history': 'التاريخ',
    
    // Profile
    'profile.personalInfo': 'المعلومات الشخصية',
    'profile.addresses': 'العناوين',
    'profile.paymentMethods': 'طرق الدفع',
    'profile.preferences': 'التفضيلات',
    'profile.logout': 'تسجيل خروج',
    
    // Notifications
    'notification.orderConfirmed': 'تم تأكيد الطلب',
    'notification.courierAssigned': 'تم تعيين موزع',
    'notification.onTheWay': 'في الطريق',
    'notification.delivered': 'تم التسليم بنجاح',
    
    // Travel Mode
    'travelModeDemo': 'وضع السفر (تجريبي)',
    'travelModeDesc': 'التوصيات المبنية على الموقع والخدمات الدولية قادمة قريباً. (وظيفة تجريبية).',
    
    // Homepage
    'welcome.title': 'مرحباً بك في ZIPP',
    'welcome.subtitle': 'حلك الشامل للتوصيل السريع والموثوق من الأعمال المحلية المفضلة لديك، مع لمسة ذكية ومجتمعية!',
    'business.all': 'جميع الأعمال',
    'business.quickSignup': 'تسجيل سريع',
    'ai.chef.title': '🔮 الشيف الذكي يوصي...',
    'ai.chef.suggestion': 'اليوم يوم الأحد! ابدأ الأسبوع بفطور متأخر مدلل؟ ربما بيض بنديكت من \'كافيه جريج\'؟',
    'ai.more': 'احصل على المزيد من توصيات الذكاء الاصطناعي ←',
    'couriers.active': 'الموزعون النشطون في منطقتك الآن!',
    'couriers.count': 'يتوفر حوالي {{count}} موزع الآن!',
    'p2p.title': 'تحتاج لإرسال عنصر أو وثيقة؟',
    'p2p.description': 'خدمة توصيل P2P لإرسال العناصر والوثائق، أو حتى طلب من الموزع شراء شيء صغير لك.',
    'p2p.start': 'ابدأ توصيل P2P',
    'radar.title': 'رادار الطعام والاتجاهات المباشرة',
    'radar.subtitle': 'اكتشف ما هو رائج حولك في الوقت الفعلي!',
    'partners.program': 'برنامج الشركاء',
    'partners.description': 'اكسب المال والمزايا من الإحالات.',
    'deals.title': 'تعاونات وصفقات ساخنة',
    'deals.description': 'صفقات حصرية بالتعاون مع العلامات التجارية الرائدة، مستوحاة من أحدث الاتجاهات!',
    'deals.example': 'حصرياً لـ ZIPP! احصل على خصم 20% على مجموعة الحلويات الجديدة من \'Sweet Dreams Bakery\' المستوحاة من اتجاه \'كروفل\' المكتشف بواسطة TrendScanner!',
    'deals.more': 'اكتشف المزيد من التعاونات',
    'wheel.title': '🎡 عجلة مفاجآت ZIPP!',
    'wheel.description': 'تشعر بالحظ؟ أدر العجلة واربح خصومات وحلويات وتوصيل مجاني والمزيد من المفاجآت!',
    'wheel.spin': 'أدر العجلة اليومية',
    'recommendations.title': '🎯 خصيصاً لك: اكتشافات لا يجب تفويتها!',
    'new.title': '✨ ساخن من الفرن: اكتشف الجديد بالقرب منك!',
    
    // Business Types
    'business.type.restaurant': 'مطعم',
    'business.type.flower': 'محل زهور',
    'business.type.cafe': 'مقهى',
    
    // Tags
    'tag.recommended': 'موصى به',
    'tag.hot': 'ساخن الآن',
    'tag.new': 'جديد',
    'tag.choice': 'اختيار ZIPP',
    'tag.tooltip': '{{tag}} - ميزة خاصة للعمل',
    'tag.popular': 'شائع',
    'tag.fastDelivery': 'توصيل سريع',
    'tag.deliveryArena': 'ساحة التوصيل',
    'tag.choice.tooltip': 'موصى به خصيصاً من فريق ZIPP!'
  }
};

// Language Provider Component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('he');
  const [isLoading, setIsLoading] = useState(true);

  // Load saved language from localStorage on mount
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = localStorage.getItem('zipp-language') as Language;
        if (savedLanguage && Object.keys(LANGUAGES).includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Update document direction, language and save to localStorage when language changes
  useEffect(() => {
    const languageInfo = LANGUAGES[currentLanguage];
    const direction = languageInfo.direction;
    const html = document.documentElement;
    
    // Update HTML attributes
    html.setAttribute('dir', direction);
    html.setAttribute('lang', currentLanguage);
    html.setAttribute('data-language', currentLanguage);
    html.setAttribute('data-native-name', languageInfo.nativeName);
    
    // Update direction class for RTL/LTR styling
    html.classList.remove('rtl', 'ltr');
    html.classList.add(direction);
    document.body.classList.remove('rtl', 'ltr');
    document.body.classList.add(direction);
    
    // Save to localStorage
    localStorage.setItem('zipp-language', currentLanguage);
    
    // Force re-render of all components that depend on direction
    window.dispatchEvent(new Event('languagechange'));
  }, [currentLanguage]);

  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  // Translation function with parameter interpolation, fallback and RTL/LTR handling
  const t = (key: string, defaultValue?: string | Record<string, string | number>): string => {
    // First try to get translation from our translations object
    let translation = translations[currentLanguage]?.[key];
    
    // If no translation found and defaultValue is a string, use it as fallback
    if (!translation && typeof defaultValue === 'string') {
      return defaultValue;
    }
    
    // If no translation and no string defaultValue, use the key as fallback
    if (!translation) {
      translation = key;
    }
    
    // Handle parameter interpolation when defaultValue is an object
    if (defaultValue && typeof defaultValue === 'object') {
      Object.entries(defaultValue).forEach(([paramKey, paramValue]) => {
        const value = String(paramValue);
        // Handle RTL/LTR embedding for parameters
        const direction = LANGUAGES[currentLanguage].direction;
        const oppositeDir = direction === 'rtl' ? 'ltr' : 'rtl';
        
        // If parameter seems to be in opposite direction (e.g. English in RTL text)
        if (/^[A-Za-z]/.test(value)) {
          translation = translation.replace(
            `{{${paramKey}}}`,
            `<span dir="${oppositeDir}">${value}</span>`
          );
        } else {
          translation = translation.replace(`{{${paramKey}}}`, value);
        }
      });
    }
    
    return translation;
  };

  const direction = LANGUAGES[currentLanguage].direction;
  const isRTL = direction === 'rtl';

  const value: LanguageContextType = {
    currentLanguage,
    languages: LANGUAGES,
    changeLanguage,
    t,
    direction,
    isRTL,
    isLoading
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LANGUAGES };
