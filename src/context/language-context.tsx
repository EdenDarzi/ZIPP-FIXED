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

// Translation keys and their values
// Translation keys and their values for each language
// Define translations by language sections to avoid duplicates
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
    
    // Additional Navigation
    'nav.sendPackage': 'שלח חבילה',
    'nav.zippSale': 'ZIPP Sale',
    'nav.trendScanner': 'סורק טרנדים',
    'nav.favorites': 'מועדפים',
    'nav.partners': 'שותפים',
    'nav.couriers': 'שליחים',
    'nav.businessManagement': 'ניהול עסק',
    'nav.superAdmin': 'סופר אדמין',
    
    // Travel Mode
    'travelModeDemo': 'מצב נסיעות (הדגמה)',
    'travelModeDesc': 'המלצות מותאמות למיקום ושירותים בינלאומיים יגיעו. (הדגמה של פונקציונליות זו).',
    
    // Notifications Page
    'notificationsTitle': 'התראות ועדכונים',
    'notificationSettings': 'הגדרות התראות (בקרוב)',
    'noNotifications': 'אין לך התראות חדשות כרגע.',
    'markAsRead': 'סמן כנקרא (דמו)',
    'notificationFooter': 'ניהול מלא של התראות, כולל התראות Push, יפותח בהמשך.',
    'orderDeliveredTitle': 'הזמנה #12345 נמסרה!',
    'orderDeliveredDesc': 'ההזמנה שלך מ\'פיצה פאלאס\' הגיעה. בתאבון!',
    'fiveMinutesAgo': 'לפני 5 דקות',
    'newDealTitle': 'מבצע חדש ב\'בורגר בוננזה\'',
    'newDealDesc': 'קבל 20% הנחה על כל ההמבורגרים היום.',
    'twoHoursAgo': 'לפני שעתיים',
    'courierOnWayTitle': 'השליח בדרך!',
    'courierOnWayDesc': 'יוסי בדרך אליך עם ההזמנה מ\'סלט סנסיישנס\'.',
    'yesterday': 'אתמול',
    
    // Spin Wheel
    'spinWheelTitle': 'מרגיש/ה בר מזל? 🍀 סובב את הגלגל – ותגלה מה מחכה לך היום!',
    'discount10': '10% הנחה',
    'discount10Desc': 'על ההזמנה הבאה שלך (מעל 50₪) מאותו עסק',
    'freeDessert': 'קינוח מתנה',
    'freeDessertDesc': 'ממסעדות משתתפות בהזמנה הבאה מאותו עסק',
    'freeDelivery': 'משלוח חינם',
    'freeDeliveryDesc': 'עד עלות של 15₪ להזמנה הבאה מאותו עסק',
    'tryAgain': 'לא נורא, נסה שוב בהזמנה הבאה מאותו עסק!',
    'dailySurprise': 'הפתעה יומית סודית!',
    'dailySurpriseDesc': 'קוד קופון יישלח אליך בקרוב!',
    'discount5': '5% הנחה',
    'discount5Desc': 'על ההזמנה הבאה שלך מאותו עסק',
    'dailyAttemptUsed': 'ניסיון יומי נוצל',
    'spinAgainIn': 'תוכל לסובב שוב בעוד',
    'someTime': 'זמן מה',
    'youWon': 'זכית ב:',
    'benefitAdded': 'ההטבה נוספה לחשבונך (הדגמה).',
    'spinning': 'מסתובב... בהצלחה!',
    'redeemBenefit': 'נצל את ההטבה (הדגמה)',
    'spinNow': 'סובב עכשיו',
    'spinLater': 'תוכל לסובב שוב מאוחר יותר',
    
    // Promotions Management
    'promotionsManagement': 'ניהול מבצעים וקופונים',
    'promotionsManagementDesc': 'צור, ערוך ועקוב אחר מבצעים, הנחות וקופונים עבור העסק שלך.',
    'createNewPromotion': 'צור מבצע חדש',
    'existingPromotions': 'מבצעים קיימים',
    'noActivePromotions': 'אין כרגע מבצעים פעילים או מתוכננים.',
    'clickCreatePromotion': 'לחץ על "צור מבצע חדש" כדי להתחיל.',
    'promotionName': 'שם המבצע',
    'weekendDiscount15': 'הנחת סופ"ש 15%',
    'wholeMenu': 'כל התפריט',
    'buy1Get1Pizza': 'קנה 1 קבל 1 על פיצות',
    'margheritaPizza': 'פיצה מרגריטה',
    'selectedPizzas': 'פיצות נבחרות',
    'freeShippingOver100': 'משלוח חינם מעל 100₪',
    'over100': 'מעל 100₪',
    'allOrders': 'כל ההזמנות',
    'createPromotionDesc': 'טופס ליצירת מבצע חדש (אחוז הנחה, קנה-קבל, קופון, וכו\') יופיע כאן.',
    'editPromotion': 'עריכת מבצע',
    'editPromotionDesc': 'טופס עריכת מבצע יופיע כאן.',
    'promotionDeleted': 'מבצע נמחק (הדגמה)',
    
    // Super Admin Layout
    'superAdminTitle': 'ZIPP - Super Admin',
    'mainDashboard': 'לוח בקרה ראשי',
    'customerView': 'תצוגת לקוח (דף הבית)',
    'businessManagementPortal': 'פורטל ניהול עסקים',
    'courierPortal': 'פורטל שליחים',
    'deliveryTariffManagement': 'ניהול תעריפי משלוחים',
    'userManagementGeneral': 'ניהול משתמשים (כללי)',
    'systemSettings': 'הגדרות מערכת',
    'accessManagement': 'ניהול גישה (IP, 2FA)',
    'subscriptionManagement': 'ניהול מנויים',
    'globalAnalytics': 'ניתוחים גלובליים',
    'systemLogs': 'יומני מערכת',
    'serviceStatus': 'סטטוס שירותים',
    
    // Additional common translations
    'subtotal': 'סה"כ ביניים',
    'free': 'חינם',
    'paymentMethod': 'אמצעי תשלום',
    'enterCouponCode': 'הזן קוד קופון או שובר',
    'activateCoupon': 'הפעל קופון',
    'activate': 'הפעל',
    'demoTryZipp10': 'הדגמה: נסה "ZIPP10".',
    'orderScheduledFor': 'ההזמנה שלך מתוכננת ל:',
    'willBeProcessedNearTime': 'היא תעובד לקראת מועד זה',
    'arenaDeliverySelected': 'בחרת בזירת המשלוחים! לאחר התשלום, נמצא עבורך את השליח הטוב ביותר.',
    'selfPickupFromBusiness': 'איסוף עצמי מהעסק! תקבל/י הודעה כשההזמנה מוכנה.',
    'curbsidePickup': 'איסוף עד לרכב! העסק יביא את ההזמנה לרכבך.',
    
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
    
    // Restaurant Cards
    'restaurant.reviews': 'ביקורות',
    'restaurant.minutes': 'דקות',
    'restaurant.hours': 'שעות',
    'restaurant.cuisine.american': 'אמריקאי',
    'restaurant.cuisine.italian': 'איטלקי',
    'restaurant.cuisine.flower': 'חנות פרחים',
    
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
    
    // Common
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
    
    // Travel Mode
    'travelModeDemo': 'Travel Mode (Demo)',
    'travelModeDesc': 'Location-based recommendations and international services coming soon. (Demo functionality).',
    
    // Notifications Page
    'notificationsTitle': 'Notifications & Updates',
    'notificationSettings': 'Notification Settings (Coming Soon)',
    'noNotifications': 'You have no new notifications at the moment.',
    'markAsRead': 'Mark as Read (Demo)',
    'notificationFooter': 'Full notification management, including Push notifications, will be developed later.',
    'orderDeliveredTitle': 'Order #12345 Delivered!',
    'orderDeliveredDesc': 'Your order from Pizza Palace has arrived. Enjoy!',
    'fiveMinutesAgo': '5 minutes ago',
    'newDealTitle': 'New Deal at Burger Bonanza',
    'newDealDesc': 'Get 20% off all burgers today.',
    'twoHoursAgo': '2 hours ago',
    'courierOnWayTitle': 'Courier on the way!',
    'courierOnWayDesc': 'Yossi is on the way with your order from Salad Sensations.',
    'yesterday': 'Yesterday',
    
    // Spin Wheel
    'spinWheelTitle': 'Feeling lucky? 🍀 Spin the wheel and discover what awaits you today!',
    'discount10': '10% Discount',
    'discount10Desc': 'On your next order (over 50₪) from the same business',
    'freeDessert': 'Free Dessert',
    'freeDessertDesc': 'From participating restaurants on your next order from the same business',
    'freeDelivery': 'Free Delivery',
    'freeDeliveryDesc': 'Up to 15₪ value for your next order from the same business',
    'tryAgain': 'Not to worry, try again on your next order from the same business!',
    'dailySurprise': 'Secret Daily Surprise!',
    'dailySurpriseDesc': 'Coupon code will be sent to you soon!',
    'discount5': '5% Discount',
    'discount5Desc': 'On your next order from the same business',
    'dailyAttemptUsed': 'Daily attempt used',
    'spinAgainIn': 'You can spin again in',
    'someTime': 'some time',
    'youWon': 'You won:',
    'benefitAdded': 'Benefit added to your account (demo).',
    'spinning': 'Spinning... Good luck!',
    'redeemBenefit': 'Redeem Benefit (Demo)',
    'spinNow': 'Spin Now',
    'spinLater': 'You can spin again later',
    
    // Promotions Management
    'promotionsManagement': 'Promotions & Coupons Management',
    'promotionsManagementDesc': 'Create, edit and track promotions, discounts and coupons for your business.',
    'createNewPromotion': 'Create New Promotion',
    'existingPromotions': 'Existing Promotions',
    'noActivePromotions': 'There are currently no active or scheduled promotions.',
    'clickCreatePromotion': 'Click "Create New Promotion" to get started.',
    'promotionName': 'Promotion Name',
    'weekendDiscount15': 'Weekend 15% Discount',
    'wholeMenu': 'Entire Menu',
    'buy1Get1Pizza': 'Buy 1 Get 1 on Pizzas',
    'margheritaPizza': 'Margherita Pizza',
    'selectedPizzas': 'Selected Pizzas',
    'freeShippingOver100': 'Free Shipping Over 100₪',
    'over100': 'Over 100₪',
    'allOrders': 'All Orders',
    'createPromotionDesc': 'Form for creating a new promotion (percentage discount, buy-get, coupon, etc.) will appear here.',
    'editPromotion': 'Edit Promotion',
    'editPromotionDesc': 'Promotion editing form will appear here.',
    'promotionDeleted': 'Promotion deleted (demo)',
    
    // Super Admin Layout
    'superAdminTitle': 'ZIPP - Super Admin',
    'mainDashboard': 'Main Dashboard',
    'customerView': 'Customer View (Homepage)',
    'businessManagementPortal': 'Business Management Portal',
    'courierPortal': 'Courier Portal',
    'deliveryTariffManagement': 'Delivery Tariff Management',
    'userManagementGeneral': 'User Management (General)',
    'systemSettings': 'System Settings',
    'accessManagement': 'Access Management (IP, 2FA)',
    'subscriptionManagement': 'Subscription Management',
    'globalAnalytics': 'Global Analytics',
    'systemLogs': 'System Logs',
    'serviceStatus': 'Service Status',
    
    // Additional common translations
    'subtotal': 'Subtotal',
    'free': 'Free',
    'paymentMethod': 'Payment Method',
    'enterCouponCode': 'Enter coupon or voucher code',
    'activateCoupon': 'Activate Coupon',
    'activate': 'Activate',
    'demoTryZipp10': 'Demo: Try "ZIPP10".',
    'orderScheduledFor': 'Your order is scheduled for:',
    'willBeProcessedNearTime': 'It will be processed near that time',
    'arenaDeliverySelected': 'You chose delivery arena! After payment, we\'ll find the best courier for you.',
    'selfPickupFromBusiness': 'Self pickup from business! You\'ll receive a notification when the order is ready.',
    'curbsidePickup': 'Curbside pickup! The business will bring the order to your car.',
    
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
    
    // Restaurant Cards
    'restaurant.reviews': 'ביקורות',
    'restaurant.minutes': 'דקות',
    'restaurant.hours': 'שעות',
    'restaurant.cuisine.american': 'אמריקאי',
    'restaurant.cuisine.italian': 'איטלקי',
    'restaurant.cuisine.flower': 'חנות פרחים',
    
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
    
    // Common
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
    
    // Travel Mode
    'travelModeDemo': 'Travel Mode (Demo)',
    'travelModeDesc': 'Location-based recommendations and international services coming soon. (Demo functionality).',
    
    // Notifications Page
    'notificationsTitle': 'Notifications & Updates',
    'notificationSettings': 'Notification Settings (Coming Soon)',
    'noNotifications': 'You have no new notifications at the moment.',
    'markAsRead': 'Mark as Read (Demo)',
    'notificationFooter': 'Full notification management, including Push notifications, will be developed later.',
    'orderDeliveredTitle': 'Order #12345 Delivered!',
    'orderDeliveredDesc': 'Your order from Pizza Palace has arrived. Enjoy!',
    'fiveMinutesAgo': '5 minutes ago',
    'newDealTitle': 'New Deal at Burger Bonanza',
    'newDealDesc': 'Get 20% off all burgers today.',
    'twoHoursAgo': '2 hours ago',
    'courierOnWayTitle': 'Courier on the way!',
    'courierOnWayDesc': 'Yossi is on the way with your order from Salad Sensations.',
    'yesterday': 'Yesterday',
    
    // Spin Wheel
    'spinWheelTitle': 'Feeling lucky? 🍀 Spin the wheel and discover what awaits you today!',
    'discount10': '10% Discount',
    'discount10Desc': 'On your next order (over 50₪) from the same business',
    'freeDessert': 'Free Dessert',
    'freeDessertDesc': 'From participating restaurants on your next order from the same business',
    'freeDelivery': 'Free Delivery',
    'freeDeliveryDesc': 'Up to 15₪ value for your next order from the same business',
    'tryAgain': 'Not to worry, try again on your next order from the same business!',
    'dailySurprise': 'Secret Daily Surprise!',
    'dailySurpriseDesc': 'Coupon code will be sent to you soon!',
    'discount5': '5% Discount',
    'discount5Desc': 'On your next order from the same business',
    'dailyAttemptUsed': 'Daily attempt used',
    'spinAgainIn': 'You can spin again in',
    'someTime': 'some time',
    'youWon': 'You won:',
    'benefitAdded': 'Benefit added to your account (demo).',
    'spinning': 'Spinning... Good luck!',
    'redeemBenefit': 'Redeem Benefit (Demo)',
    'spinNow': 'Spin Now',
    'spinLater': 'You can spin again later',
    
    // Promotions Management
    'promotionsManagement': 'Promotions & Coupons Management',
    'promotionsManagementDesc': 'Create, edit and track promotions, discounts and coupons for your business.',
    'createNewPromotion': 'Create New Promotion',
    'existingPromotions': 'Existing Promotions',
    'noActivePromotions': 'There are currently no active or scheduled promotions.',
    'clickCreatePromotion': 'Click "Create New Promotion" to get started.',
    'promotionName': 'Promotion Name',
    'weekendDiscount15': 'Weekend 15% Discount',
    'wholeMenu': 'Entire Menu',
    'buy1Get1Pizza': 'Buy 1 Get 1 on Pizzas',
    'margheritaPizza': 'Margherita Pizza',
    'selectedPizzas': 'Selected Pizzas',
    'freeShippingOver100': 'Free Shipping Over 100₪',
    'over100': 'Over 100₪',
    'allOrders': 'All Orders',
    'createPromotionDesc': 'Form for creating a new promotion (percentage discount, buy-get, coupon, etc.) will appear here.',
    'editPromotion': 'Edit Promotion',
    'editPromotionDesc': 'Promotion editing form will appear here.',
    'promotionDeleted': 'Promotion deleted (demo)',
    
    // Super Admin Layout
    'superAdminTitle': 'ZIPP - Super Admin',
    'mainDashboard': 'Main Dashboard',
    'customerView': 'Customer View (Homepage)',
    'businessManagementPortal': 'Business Management Portal',
    'courierPortal': 'Courier Portal',
    'deliveryTariffManagement': 'Delivery Tariff Management',
    'userManagementGeneral': 'User Management (General)',
    'systemSettings': 'System Settings',
    'accessManagement': 'Access Management (IP, 2FA)',
    'subscriptionManagement': 'Subscription Management',
    'globalAnalytics': 'Global Analytics',
    'systemLogs': 'System Logs',
    'serviceStatus': 'Service Status',
    
    // Additional common translations
    'subtotal': 'Subtotal',
    'free': 'Free',
    'paymentMethod': 'Payment Method',
    'enterCouponCode': 'Enter coupon or voucher code',
    'activateCoupon': 'Activate Coupon',
    'activate': 'Activate',
    'demoTryZipp10': 'Demo: Try "ZIPP10".',
    'orderScheduledFor': 'Your order is scheduled for:',
    'willBeProcessedNearTime': 'It will be processed near that time',
    'arenaDeliverySelected': 'You chose delivery arena! After payment, we\'ll find the best courier for you.',
    'selfPickupFromBusiness': 'Self pickup from business! You\'ll receive a notification when the order is ready.',
    'curbsidePickup': 'Curbside pickup! The business will bring the order to your car.',
    
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
    
    // Restaurant Cards
    'restaurant.reviews': 'ביקורות',
    'restaurant.minutes': 'דקות',
    'restaurant.hours': 'שעות',
    'restaurant.cuisine.american': 'אמריקאי',
    'restaurant.cuisine.italian': 'איטלקי',
    'restaurant.cuisine.flower': 'חנות פרחים',
    
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
  
  ru: {
    // Russian translations (avoiding duplicates)
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
    
    // Navigation
    'nav.home': 'Главная',
    'nav.restaurants': 'Рестораны',
    'nav.marketplace': 'Маркетплейс',
    'nav.courier': 'Курьер',
    'nav.admin': 'Админ',
    
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
    
    // Additional Navigation
    'nav.sendPackage': 'Отправить посылку',
    'nav.zippSale': 'Скидки ZIPP',
    'nav.trendScanner': 'Сканер трендов',
    'nav.favorites': 'Избранное',
    'nav.partners': 'Партнеры',
    'nav.couriers': 'Курьеры',
    'nav.businessManagement': 'Управление бизнесом',
    'nav.superAdmin': 'Супер админ',
    
    // Travel Mode
    'travelModeDemo': 'Режим путешествий (Демо)',
    'travelModeDesc': 'Рекомендации на основе местоположения и международные услуги скоро будут доступны. (Демо функциональность).',
    
    // Notifications Page
    'notificationsTitle': 'Уведомления и обновления',
    'notificationSettings': 'Настройки уведомлений (Скоро)',
    'noNotifications': 'У вас нет новых уведомлений в данный момент.',
    'markAsRead': 'Отметить как прочитанное (Демо)',
    'notificationFooter': 'Полное управление уведомлениями, включая Push-уведомления, будет разработано позже.',
    'orderDeliveredTitle': 'Заказ #12345 Доставлен!',
    'orderDeliveredDesc': 'Ваш заказ из Pizza Palace прибыл. Приятного аппетита!',
    'fiveMinutesAgo': '5 минут назад',
    'newDealTitle': 'Новая сделка в Burger Bonanza',
    'newDealDesc': 'Получите 20% скидку на все бургеры сегодня.',
    'twoHoursAgo': '2 часа назад',
    'courierOnWayTitle': 'Курьер в пути!',
    'courierOnWayDesc': 'Йосси в пути с вашим заказом из Salad Sensations.',
    'yesterday': 'Вчера',
    
    // Spin Wheel
    'spinWheelTitle': 'Чувствуете удачу? 🍀 Крутите колесо и узнайте, что ждет вас сегодня!',
    'discount10': 'Скидка 10%',
    'discount10Desc': 'На ваш следующий заказ (сумма свыше 50₪) от того же заведения',
    'freeDessert': 'Бесплатный десерт',
    'freeDessertDesc': 'От участвующих ресторанов при следующем заказе от того же заведения',
    'freeDelivery': 'Бесплатная доставка',
    'freeDeliveryDesc': 'До 15₪ стоимости для вашего следующего заказа от того же заведения',
    'tryAgain': 'Не переживайте, попробуйте снова при следующем заказе от того же заведения!',
    'dailySurprise': 'Секретный ежедневный сюрприз!',
    'dailySurpriseDesc': 'Код купона будет отправлен вам скоро!',
    'discount5': 'Скидка 5%',
    'discount5Desc': 'На ваш следующий заказ от того же заведения',
    'dailyAttemptUsed': 'Ежедневная попытка использована',
    'spinAgainIn': 'Вы сможете крутить снова через',
    'someTime': 'некоторое время',
    'youWon': 'Вы выиграли:',
    'benefitAdded': 'Польза добавлена на ваш счет (демо).',
    'spinning': 'Крутится... Удачи!',
    'redeemBenefit': 'Погасить выгоду (Демо)',
    'spinNow': 'Крутить сейчас',
    'spinLater': 'Вы сможете крутить снова позже',
    
    // Promotions Management
    'promotionsManagement': 'Управление акциями и купонами',
    'promotionsManagementDesc': 'Создавайте, редактируйте и отслеживайте акции, скидки и купоны для вашего бизнеса.',
    'createNewPromotion': 'Создать новую акцию',
    'existingPromotions': 'Существующие акции',
    'noActivePromotions': 'В настоящее время нет активных или запланированных акций.',
    'clickCreatePromotion': 'Нажмите "Создать новую акцию", чтобы начать.',
    'promotionName': 'Название акции',
    'weekendDiscount15': 'Скидка 15% на выходные',
    'wholeMenu': 'Все меню',
    'buy1Get1Pizza': 'Купи 1, получи 1 на пиццы',
    'margheritaPizza': 'Пицца Маргарита',
    'selectedPizzas': 'Выбранные пиццы',
    'freeShippingOver100': 'Бесплатная доставка при заказе от 100₪',
    'over100': 'Свыше 100₪',
    'allOrders': 'Все заказы',
    'createPromotionDesc': 'Форма для создания новой акции (процентная скидка, купи-получи, купон и т.д.) появится здесь.',
    'editPromotion': 'Редактировать акцию',
    'editPromotionDesc': 'Форма редактирования акции появится здесь.',
    'promotionDeleted': 'Акция удалена (демо)',
    
    // Super Admin Layout
    'superAdminTitle': 'ZIPP - Супер админ',
    'mainDashboard': 'Главная панель управления',
    'customerView': 'Вид клиента (Главная страница)',
    'businessManagementPortal': 'Портал управления бизнесом',
    'courierPortal': 'Портал курьеров',
    'deliveryTariffManagement': 'Управление тарифами доставки',
    'userManagementGeneral': 'Управление пользователями (Общее)',
    'systemSettings': 'Настройки системы',
    'accessManagement': 'Управление доступом (IP, 2FA)',
    'subscriptionManagement': 'Управление подписками',
    'globalAnalytics': 'Глобальная аналитика',
    'systemLogs': 'Журналы системы',
    'serviceStatus': 'Статус службы',
    
    // Additional common translations
    'subtotal': 'Промежуточный итог',
    'free': 'Бесплатно',
    'paymentMethod': 'Способ оплаты',
    'enterCouponCode': 'Введите код купона или ваучера',
    'activateCoupon': 'Активировать купон',
    'activate': 'Активировать',
    'demoTryZipp10': 'Демо: попробуйте "ZIPP10".',
    'orderScheduledFor': 'Ваш заказ запланирован на:',
    'willBeProcessedNearTime': 'Он будет обработан ближе к этому времени',
    'arenaDeliverySelected': 'Вы выбрали арену доставки! После оплаты мы найдем для вас лучшего курьера.',
    'selfPickupFromBusiness': 'Самовывоз из бизнеса! Вы получите уведомление, когда заказ будет готов.',
    'curbsidePickup': 'Самовывоз до машины! Бизнес принесет заказ к вашему автомобилю.',
    
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
    
    // Restaurant Cards
    'restaurant.reviews': 'ביקורות',
    'restaurant.minutes': 'דקות',
    'restaurant.hours': 'שעות',
    'restaurant.cuisine.american': 'אמריקאי',
    'restaurant.cuisine.italian': 'איטלקי',
    'restaurant.cuisine.flower': 'חנות פרחים',
    
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
  
  ar: {
    // Header
    'header.myAccount': 'حسابי',
    'header.cart': 'سلة التسوق',
    'header.language': 'اللغة',
    'header.travelMode': 'وضع السفر',
    'header.notifications': 'الإشعارات',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'تم بنجاح',
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
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.restaurants': 'المطاعم',
    'nav.marketplace': 'السوق',
    'nav.courier': 'التوصيل',
    'nav.admin': 'الإدارة',
    'nav.sendPackage': 'إرسال طرد',
    'nav.zippSale': 'تخفيضات ZIPP',
    'nav.trendScanner': 'كاشف الاتجاهات',
    'nav.favorites': 'المفضلة',
    'nav.partners': 'الشركاء',
    'nav.couriers': 'السائقون',
    'nav.businessManagement': 'إدارة الأعمال',
    'nav.superAdmin': 'المشرف العام',
    
    // Language switching
    'language.changed': 'تم تغيير اللغة بنجاح',
    'language.changeToEnglish': 'Change to English',
    'language.changeToHebrew': 'שנה לעברית',
    'language.changeToRussian': 'Изменить на русский',
    'language.changeToArabic': 'تغيير إلى العربية',
    
    // Restaurant
    'restaurant.orderNow': 'اطلب الآن',
    'restaurant.addToCart': 'أضف إلى السلة',
    'restaurant.viewMenu': 'عرض القائمة',
    'restaurant.rating': 'تقييم',
    'restaurant.delivery': 'توصيل',
    'restaurant.pickup': 'استلام',
    
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
    'payment.wallet': 'محفظة إلكترونية',
    'payment.cash': 'نقدا',
    'payment.successful': 'تمت عملية الدفع بنجاح',
    'payment.failed': 'فشلت عملية الدفع',
    
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
    'notification.courierAssigned': 'تم تعيين المُوزع',
    'notification.onTheWay': 'في الطريق',
    'notification.delivered': 'تم التوصيل بنجاح',
    
    // Navigation keys moved to Russian translations to avoid duplicates
    'nav.home': 'الرئيسية',
    'nav.restaurants': 'المطاعم',
    'nav.marketplace': 'السوق',
    'nav.courier': 'التوصيل',
    'nav.admin': 'الإدارة',
    
    // Travel Mode
    'travelModeDemo': 'وضع السفر (عرض)',
    'travelModeDesc': 'ستصل التوصيات المعتمדות על המיקום والخدمات الدولية. (عرض لهذه الوظيفة).',
    
    // Notifications Page
    'notificationsTitle': 'الإشعارات والتحديثات',
    'notificationSettings': 'إعدادات الإشعارات (قريباً)',
    'noNotifications': 'ليس لديك إشعارات جديدة في الوقت الحالي.',
    'markAsRead': 'وسم كمقروء (عرض)',
    'notificationFooter': 'سوف يتم تطوير الإدارة الكاملة للإشعارات، بما في ذلك إشعارات الدفع، لاحقاً.',
    'orderDeliveredTitle': 'الطلب #12345 تم توصيله!',
    'orderDeliveredDesc': 'وصل طلبك من \'Pizza Palace\'. بالعافية!',
    'fiveMinutesAgo': 'قبل 5 دقائق',
    'newDealTitle': 'صفقة جديدة في \'Burger Bonanza\'',
    'newDealDesc': 'احصل على خصم 20% على جميع البرجر اليوم.',
    'twoHoursAgo': 'قبل ساعتين',
    'courierOnWayTitle': 'الموزع في الطريق!',
    'courierOnWayDesc': 'يوسف في طريقه إليك مع الطلب من \'Salad Sensations\'.',
    'yesterday': 'أمس',
    
    // Spin Wheel
    'spinWheelTitle': 'هل تشعر أنك محظوظ؟ 🍀 قم بتدوير العجلة - واكتشف ماذا ينتظرك اليوم!',
    'discount10': 'خصم 10%',
    'discount10Desc': 'على طلبك التالي (أكثر من 50₪) من نفس المتجر',
    'freeDessert': 'حلوى مجانية',
    'freeDessertDesc': 'من مطاعم مشاركة في الطلب التالي من نفس المتجر',
    'freeDelivery': 'توصيل مجاني',
    'freeDeliveryDesc': 'حتى 15₪ للطلب التالي من نفس المتجر',
    'tryAgain': 'لا تقلق، حاول مرة أخرى في الطلب التالي من نفس المتجر!',
    'dailySurprise': 'مفاجأة يومية سرية!',
    'dailySurpriseDesc': 'سيتم إرسال رمز القسيمة إليك قريبًا!',
    'discount5': 'خصم 5%',
    'discount5Desc': 'على طلبك التالي من نفس المتجر',
    'dailyAttemptUsed': 'تم استخدام المحاولة اليومية',
    'spinAgainIn': 'يمكنك التدوير مرة أخرى في',
    'someTime': 'بعض الوقت',
    'youWon': 'لقد ربحت:',
    'benefitAdded': 'تمت إضافة الفائدة إلى حسابك (عرض).',
    'spinning': 'يتم التدوير... حظًا سعيدًا!',
    'redeemBenefit': 'استرداد الفائدة (عرض)',
    'spinNow': 'قم بالتدوير الآن',
    'spinLater': 'يمكنك التدوير مرة أخرى لاحقًا',
    
    // Promotions Management
    'promotionsManagement': 'إدارة العروض والقسائم',
    'promotionsManagementDesc': 'إنشاء، تعديل وتتبع العروض، الخصومات والقسائم لعملك.',
    'createNewPromotion': 'إنشاء عرض جديد',
    'existingPromotions': 'عروض موجودة',
    'noActivePromotions': 'لا توجد عروض نشطة أو مجدولة حاليًا.',
    'clickCreatePromotion': 'انقر على "إنشاء عرض جديد" للبدء.',
    'promotionName': 'اسم العرض',
    'weekendDiscount15': 'خصم 15% في عطلة نهاية الأسبوع',
    'wholeMenu': 'قائمة كاملة',
    'buy1Get1Pizza': 'اشترِ 1 واحصل على 1 مجانًا על البيتزا',
    'margheritaPizza': 'بيتزا مارغريتا',
    'selectedPizzas': 'بيتزا مختارة',
    'freeShippingOver100': 'شحن مجاني للطلبات فوق 100₪',
    'over100': 'أكثر من 100₪',
    'allOrders': 'جميع الطلبات',
    'createPromotionDesc': 'سيظهر هنا نموذج لإنشاء عرض جديد (نسبة الخصم، اشترِ-احصل، قسيمة، إلخ).',
    'editPromotion': 'تعديل العرض',
    'editPromotionDesc': 'سيظهر هنا نموذج لتعديل العرض.',
    'promotionDeleted': 'تم حذف العرض (عرض)',
    
    // Super Admin Layout
    'superAdminTitle': 'ZIPP - سوبر أدمن',
    'mainDashboard': 'لوحة التحكم الرئيسية',
    'customerView': 'عرض العميل (הصفحة الرئيسية)',
    'businessManagementPortal': 'بوابة إدارة الأعمال',
    'courierPortal': 'بوابة الموزعين',
    'deliveryTariffManagement': 'إدارة تعريفة التوصيل',
    'userManagementGeneral': 'إدارة المستخدمين (عامة)',
    'systemSettings': 'إعدادات النظام',
    'accessManagement': 'إدارة الوصول (IP، 2FA)',
    'subscriptionManagement': 'إدارة الاشتراكات',
    'globalAnalytics': 'تحليلات عالمية',
    'systemLogs': 'سجلات النظام',
    'serviceStatus': 'حالة الخدمة',
    
    // Additional common translations
    'subtotal': 'إجمالي فرعي',
    'free': 'مجاني',
    'paymentMethod': 'طريقة الدفع',
    'enterCouponCode': 'أدخل رمز القسيمة أو الشيك',
    'activateCoupon': 'تفعيل القسيمة',
    'activate': 'تفعيل',
    'demoTryZipp10': 'عرض: جرب "ZIPP10".',
    'orderScheduledFor': 'تم جدولة طلبك لـ:',
    'willBeProcessedNearTime': 'سيتم معالجته بالقرب من هذا الوقت',
    'arenaDeliverySelected': 'لقد اخترت توصيل الساحة! بعد الدفع، سنجد لك أفضل موزع.',
    'selfPickupFromBusiness': 'استلام ذاتي من العمل! ستتلقى إشعارًا عندما يكون الطلب جاهزًا.',
    'curbsidePickup': 'استلام حتى السيارة! سيقوم العمل بإحضار الطلب إلى سيارتك.',
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
// Language type is already exported at the top of the file
