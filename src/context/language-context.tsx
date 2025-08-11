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
    'restaurant.cuisine.healthy': 'בריא',
    
    // Restaurant Names
    'restaurant.name.pizzaPalace': 'פיצה פאלאס',
    'restaurant.name.burgerBonanza': 'בורגר בוננזה', 
    'restaurant.name.pastaPerfection': 'פסטה פרפקשן',
    'restaurant.name.saladSensations': 'סלט סנסיישנס',
    'restaurant.name.seasonalFlowers': 'פרחי העונה',
    
    // Restaurant Descriptions
    'restaurant.desc.pizzaPalace': 'פיצות איטלקיות אותנטיות שנאפות לשלמות עם המרכיבים הטריים ביותר.',
    'restaurant.desc.burgerBonanza': 'ההמבורגרים הטובים בעיר, צלויים בדיוק כמו שצריך. טעמו את ההבדל!',
    'restaurant.desc.pastaPerfection': 'מנות פסטה טעימות שנעשו באהבה ומתכונים מסורתיים.',
    'restaurant.desc.saladSensations': 'סלטים טריים ובריאים לארוחה טעימה וללא רגשות אשם.',
    'restaurant.desc.seasonalFlowers': 'זרים טריים וסידורי פרחים מרהיבים לכל אירוע.',
    
    // Restaurants Page
    'restaurants.title': 'גלה מסעדות ועסקים',
    'restaurants.subtitle': 'מצא מגוון רחב של מטבחים ושירותים ומצא את הארוחה או השירות הבא האהוב עליך.',
    'restaurants.search.placeholder': 'חפש מסעדות, עסקים או מטבחים...',
    'restaurants.search.ariaLabel': 'חיפוש מסעדות, עסקים או מטבחים',
    'restaurants.zippSale.active': '🔥 מבצעי ZIPP Sale פעילים כעת!',
    'restaurants.zippSale.description': 'שקיות הפתעה מסוף היום במחירים מיוחדים! מהרו לפני שייגמר.',
    'restaurants.zippSale.from': 'מאת:',
    'restaurants.zippSale.addToCart': 'הוסף לעגלה',
    'restaurants.zippSale.viewAll': 'הצג את כל מבצעי ZIPP Sale...',
    'restaurants.filters.cuisine': 'סוג מטבח/עסק',
    'restaurants.filters.rating': 'דירוג מינימלי',
    'restaurants.filters.distance': 'מרחק',
    'restaurants.filters.all': 'הכל',
    'restaurants.filters.allTypes': 'כל הסוגים',
    'restaurants.filters.allRatings': 'כל דירוג',
    'restaurants.filters.allDistances': 'כל מרחק (בקרוב)',
    'restaurants.filters.stars45': '4.5+ כוכבים',
    'restaurants.filters.stars4': '4.0+ כוכבים',
    'restaurants.filters.stars35': '3.5+ כוכבים',
    'restaurants.filters.distance1km': '< 1 ק"מ (בקרוב)',
    'restaurants.filters.distance3km': '< 3 ק"מ (בקרוב)',
    'restaurants.filters.distance5km': '< 5 ק"מ (בקרוב)',
    'restaurants.filters.more': 'עוד פילטרים',
    'restaurants.filters.moreToast.title': 'פילטרים נוספים בקרוב!',
    'restaurants.filters.moreToast.description': 'אפשרויות סינון מתקדמות יתווספו בעדכון עתידי.',
    'restaurants.noResults.title': 'לא נמצאו מסעדות או עסקים התואמים לחיפוש או לפילטרים שלך.',
    'restaurants.noResults.suggestion': 'נסה לשנות את מונחי החיפוש או הפילטרים.',
    
    // Marketplace Page
    'marketplace.title': 'SwiftServe יד 2 - לוח קהילתי',
    'marketplace.subtitle': 'קנה ומכור פריטי יד שנייה בתוך קהילת SwiftServe. מצא מציאות או פנה מקום בבית!',
    'marketplace.publishNew': 'פרסם מוצר חדש',
    'marketplace.filtersTitle': 'סינון וחיפוש מודעות',
    'marketplace.search.label': 'חיפוש חופשי',
    'marketplace.search.placeholder': 'חפש לפי כותרת, תיאור, מיקום...',
    'marketplace.category.label': 'קטגוריה',
    'marketplace.category.all': 'כל הקטגוריות',
    'marketplace.sort.label': 'מיין לפי',
    'marketplace.sort.placeholder': 'מיון...',
    'marketplace.sort.newest': 'החדש ביותר',
    'marketplace.sort.priceAsc': 'מחיר: מהנמוך לגבוה',
    'marketplace.sort.priceDesc': 'מחיר: מהגבוה לנמוך',
    'marketplace.moreFilters': 'עוד פילטרים',
    'marketplace.moreFilters.toast.title': 'פילטרים נוספים',
    'marketplace.moreFilters.toast.description': 'אפשרויות סינון מתקדמות כגון טווח מחירים, דירוג מוכר ועוד יתווספו. (הדגמה)',
    'marketplace.noResults.title': 'לא נמצאו מוצרים התואמים לחיפוש שלך.',
    'marketplace.noResults.suggestion': 'נסה לשנות את מונחי החיפוש או הפילטרים.',
    'marketplace.loadMore': 'טען עוד',
    'marketplace.loadMore.toast': 'טעינת מוצרים נוספים (הדגמה).',
    
    // Send Package Page
    'sendPackage.title': 'שלח חבילה / בצע שליחות',
    'sendPackage.subtitle': 'שלח כל דבר, לכל מקום. מלא את הפרטים ונמצא לך שליח.',
    'sendPackage.deliveryDetails': 'פרטי המשלוח',
    'sendPackage.pickupAddress': 'כתובת איסוף מלאה',
    'sendPackage.pickupAddress.placeholder': 'רחוב, מספר בית, עיר',
    'sendPackage.destinationAddress': 'כתובת יעד מלאה',
    'sendPackage.destinationAddress.placeholder': 'רחוב, מספר בית, עיר',
    'sendPackage.packageDescription': 'תיאור החבילה/שליחות',
    'sendPackage.packageDescription.placeholder': 'לדוגמה: מפתחות, מסמכים, איסוף חולצה מחנות ABC',
    'sendPackage.contactDetails': 'פרטי יצירת קשר (אופציונלי)',
    'sendPackage.pickupContact': 'איש קשר באיסוף',
    'sendPackage.pickupContactName.placeholder': 'שם',
    'sendPackage.pickupContactPhone': 'טלפון באיסוף',
    'sendPackage.pickupContactPhone.placeholder': 'מספר טלפון',
    'sendPackage.destinationContact': 'איש קשר ביעד',
    'sendPackage.destinationContactName.placeholder': 'שם',
    'sendPackage.destinationContactPhone': 'טלפון ביעד',
    'sendPackage.destinationContactPhone.placeholder': 'מספר טלפון',
    'sendPackage.purchaseRequired': 'השליח צריך לרכוש עבורי פריטים?',
    'sendPackage.purchaseDetails': 'פרטי רכישה',
    'sendPackage.shoppingList': 'רשימת קניות (פריט אחד בכל שורה)',
    'sendPackage.shoppingList.placeholder': 'לדוגמה: לחם אחיד, חלב 3%, 6 ביצים L',
    'sendPackage.estimatedBudget': 'תקציב משוער לרכישה (₪)',
    'sendPackage.estimatedBudget.placeholder': 'לדוגמה: 50',
    'sendPackage.specialInstructions': 'הוראות מיוחדות לשליח (אופציונלי)',
    'sendPackage.specialInstructions.placeholder': 'לדוגמה: נא להתקשר לפני ההגעה, להשאיר אצל השומר',
    'sendPackage.submit': 'בקש משלוח',
    'sendPackage.processing': 'מעבד בקשה...',
    'sendPackage.success': 'הבקשה נשלחה בהצלחה!',
    'sendPackage.validationError': 'שגיאת אימות',
    'sendPackage.submitError': 'שגיאה בשליחת הבקשה',
    'sendPackage.submitError.description': 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
    'sendPackage.validation.pickupAddress': 'כתובת איסוף חייבת להכיל לפחות 5 תווים.',
    'sendPackage.validation.destinationAddress': 'כתובת יעד חייבת להכיל לפחות 5 תווים.',
    'sendPackage.validation.packageDescription': 'תיאור החבילה חייב להכיל לפחות 3 תווים.',
    'sendPackage.validation.budget': 'תקציב חייב להיות מספר',
    'sendPackage.validation.budgetPositive': 'תקציב חייב להיות חיובי',
    'sendPackage.validation.purchaseRequired': 'אם נדרשת רכישה, יש למלא רשימת קניות ותקציב משוער.',
    
    // Smart Tools Menu
    'smartTools.title': 'פיצ\'רים מבוססי AI ועוד',
    'smartTools.aiRecommendations': 'המלצות AI',
    'smartTools.nutritionalAdvisor': 'יועץ תזונה',
    'smartTools.foodRadar': 'רדאר אוכל וטרנדים',
    'smartTools.surpriseWheel': 'גלגל ההפתעות',
    'smartTools.travelMode': 'מצב נסיעות',
    
    // Spin Wheel Page
    'spinWheel.title': 'גלגל המזל',
    'spinWheel.subtitle': 'סובב את הגלגל וגלה איזה פרס מחכה לך!',
    'spinWheel.prizes.discount10': '10% הנחה',
    'spinWheel.prizes.discount10Desc': 'על ההזמנה הבאה שלך (מעל 50₪) מאותו עסק',
    'spinWheel.prizes.freeDessert': 'קינוח מתנה',
    'spinWheel.prizes.freeDessertDesc': 'ממסעדות משתתפות בהזמנה הבאה מאותו עסק',
    'spinWheel.prizes.freeDelivery': 'משלוח חינם',
    'spinWheel.prizes.freeDeliveryDesc': 'עד עלות של 15₪ להזמנה הבאה מאותו עסק',
    'spinWheel.prizes.tryAgain': 'נסה שוב',
    'spinWheel.prizes.dailySurprise': 'הפתעה יומית',
    'spinWheel.prizes.dailySurpriseDesc': 'קוד קופון יישלח אליך בקרוב!',
    'spinWheel.prizes.discount5': '5% הנחה',
    'spinWheel.prizes.discount5Desc': 'על ההזמנה הבאה שלך מאותו עסק',
    'spinWheel.spinning': 'מסתובב... בהצלחה!',
    'spinWheel.spinNow': 'סובב עכשיו',
    'spinWheel.spinLater': 'תוכל לסובב שוב מאוחר יותר',
    'spinWheel.comeBackLater': 'חזור מאוחר יותר',
    'spinWheel.dailyAttemptUsed': 'ניסיון יומי נוצל',
    'spinWheel.spinAgainIn': 'תוכל לסובב שוב בעוד {time}.',
    'spinWheel.youWon': '🎉 זכית ב: {prize}! 🎉',
    'spinWheel.benefitAdded': 'ההטבה נוספה לחשבונך (הדגמה).',
    'spinWheel.redeemBenefit': 'נצל את ההטבה (הדגמה)',
    'spinWheel.benefitRedeemed': 'הטבה מומשה (הדגמה)',
    'spinWheel.benefitRedeemedDesc': 'ההטבה "{benefit}" הופעלה עבורך. תראה אותה בעגלה/בתשלום בהזמנה הבאה מאותו עסק.',
    'spinWheel.share': 'שיתוף',
    'spinWheel.shareDesc': 'שתף עם חבר ותקבל ניסיון נוסף לסובב את הגלגל! (הדגמה של פונקציונליות זו).',
    'spinWheel.oneSpinPerDay': 'אפשר סיבוב אחד ביום. נסה שוב בעוד',
    'spinWheel.canSpinSoon': 'תוכל לסובב שוב בקרוב!',
    'spinWheel.shareForExtra': 'שתף עם חבר לניסיון נוסף',
    'spinWheel.rules': 'אפשר סיבוב אחד ביום – כל פרס אמיתי',
    'spinWheel.terms': 'תקנון הגלגל והמבצעים',
    'spinWheel.goodLuck': 'בהצלחה!',
    'spinWheel.disclaimer': 'האפליקציה מדגימה את הקונספט של גלגל המזל. משחק מלא עם אנימציות מתקדמות, סאונד, ניהול פרסים אמיתי בצד השרת ומגבלות שימוש מתקדמות יפותח בהמשך.',
    'spinWheel.spins': 'סיבובים',
    'spinWheel.muteSound': 'השתק קול',
    'spinWheel.enableSound': 'הפעל קול',
    'spinWheel.pointer': 'מחט',
    'spinWheel.totalSpins': 'סה"כ סיבובים',
    'spinWheel.lastResult': 'תוצאה אחרונה',
    
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
    'ai.chef.title': 'השף הדיגיטלי שלך',
    'ai.chef.subtitle': 'המלצות אישיות מבוססות AI',
    'ai.chef.suggestion': 'היום יום ראשון! מה דעתך להתחיל את השבוע עם בראנץ\' מפנק? ביצים בנדיקט מ"קפה גרג" נשמע מושלם!',
    'ai.more': 'עוד המלצות חכמות',
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
    // LivePick Sale (ZIPP Sale)
    'livepick.title': 'ZIPP Sale – שקיות הפתעה חמות מסוף היום!',
    'livepick.subtitle': 'תפסו דילים מדהימים על מוצרים איכותיים מעסקים, שווקים ודוכנים – בהנחה בסוף היום. פחות בזבוז, יותר חיסכון!',
    'livepick.back': 'חזרה לעסקים',
    'livepick.closed': 'מבצעי ZIPP Sale סגורים כעת.',
    'livepick.activeHours': 'המבצע פעיל בין השעות {start}:00 - {end}:00. בדקו עסקים אחרים או חזרו מאוחר יותר!',
    'livepick.soldout': 'אוי! נראה שכל שקיות ההפתעה להיום נחטפו.',
    'livepick.checkLater': 'בדקו שוב מאוחר יותר או חפשו בעסקים אחרים!',
    'livepick.badge': 'ZIPP Sale',
    'livepick.by': 'מאת',
    'livepick.original': 'במקור',
    'livepick.left': 'נותרו',
    'livepick.addToCart': 'הוסף שקית הפתעה לעגלה',
    'livepick.added': 'שקית הפתעה נוספה לעגלה!',
    'livepick.added.desc': 'שקית "{name}" מ-{restaurant} נוספה.',
    'livepick.bag': 'שקית הפתעה',
    'livepick.category': 'ZIPP Sale',
    'livepick.disclaimer': 'כל שקית מגיעה עם תגית "הפתעה טעימה במחיר של פחות מקפה". התכולה משתנה! (הדגמה)',
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
    'tag.choice.tooltip': 'מומלץ במיוחד על ידי צוות ZIPP!',
    
    // Additional translations
    'theme.dark': 'מצב כהה',
    'theme.light': 'מצב בהיר',
    'site.title': 'ZIPP',
    'site.tagline': 'הבית של המשלוחים',
    'tools.smart': 'כלים חכמים',
    'search.placeholder': 'מה בא לכם? חפשו \'פיצה חריפה\', \'זר ורדים\' או \'קפה קר\'',
    'search.tooltip': 'נסה לחפש מנה, סוג מטבח, שם עסק, או אפילו טרנד!',
    'zipp.sale.banner': '🔥 מבצעי ZIPP Sale לוהטים!',
    'zipp.sale.description': 'שקיות הפתעה מסוף היום בהנחות ענק! מהרו לפני שייגמר.',
    'ai.loading': 'ה-AI שלנו רוקח משהו מיוחד בשבילך...',
    'couriers.checking': 'בודק זמינות...',
    'partnerships.title': 'שיתופי פעולה ודילים חמים',
    'partnerships.description': 'מבצעים בלעדיים בשיתוף עם מותגים מובילים, בהשראת הטרנדים החמים ביותר!',
    'partnerships.example': 'בלעדי ל-ZIPP! קבלו 20% הנחה על כל קולקציית הקינוחים החדשה של \'Sweet Dreams Bakery\' בהשראת טרנד ה\'קרופי\' שזוהה ב-TrendScanner!',
    'partnerships.more': 'גלה שיתופי פעולה נוספים',
    'sections.recommended': '🎯 במיוחד בשבילך: ממצאים שאסור לפספס!',
    'sections.new': '✨ חדש חם מהתנור: גלה מה נפתח לידך!',
    'sections.favorites': 'הזמן שוב מועדפים בקליק',
    'sections.allBusinesses': 'גלה את כל העסקים',
    'show.all': 'הצג את כל העסקים והחנויות',
    'features.variety': 'מבחר רחב',
    'features.variety.desc': 'גלו מגוון רחב של מוצרים ושירותים ממספר רב של עסקים מקומיים.',
    'features.easy': 'הזמנה קלה',
    'features.easy.desc': 'תהליך הזמנה חלק ואינטואיטיבי מעיון ועד תשלום.',
    'features.smart': 'הצעות חכמות',
    'features.smart.desc': 'קבלו הצעות אישיות לפריטים ועסקים המופעלות על ידי מנוע ה-AI שלנו.',
    'hero.subtitle': 'מהיר, טרי, במשלוח.',
    'hero.description': 'חוו את זירת השליחים החכמה של ZIPP.',
    'footer.about': 'אודותינו (בקרוב)',
    'footer.careers': 'קריירה (בקרוב)',
    'footer.blog': 'בלוג (בקרוב)',
    'footer.support': 'שירות לקוחות',
    'footer.help': 'מרכז התמיכה',
    'footer.terms': 'תנאי שימוש',
    'footer.privacy': 'מדיניות פרטיות',
    'footer.joinUs': 'הצטרפו אלינו',
    'footer.business': 'עסקים: הירשמו ל-ZIPP',
    'footer.couriers': 'שליחים: הצטרפו לצוות',
    'footer.partners': 'תוכנית שותפים',
    'footer.contact': 'יצירת קשר',
    'footer.orderNow': 'הזמן עכשיו',
    'footer.trackOrder': 'עקוב אחר הזמנה',
    'footer.copyright': '© 2025 ZIPP. כל הזכויות שמורות.',
    'footer.tagline': 'פלטפורמת המשלוחים החכמה שלך, מבוססת AI.'
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
    'restaurant.cuisine.healthy': 'Healthy',
    
    // Restaurant Names
    'restaurant.name.pizzaPalace': 'Pizza Palace',
    'restaurant.name.burgerBonanza': 'Burger Bonanza', 
    'restaurant.name.pastaPerfection': 'Pasta Perfection',
    'restaurant.name.saladSensations': 'Salad Sensations',
    'restaurant.name.seasonalFlowers': 'Seasonal Flowers',
    
    // Restaurant Descriptions
    'restaurant.desc.pizzaPalace': 'Authentic Italian pizzas baked to perfection with the freshest ingredients.',
    'restaurant.desc.burgerBonanza': 'The best burgers in town, grilled just right. Taste the difference!',
    'restaurant.desc.pastaPerfection': 'Delicious pasta dishes made with love and traditional recipes.',
    'restaurant.desc.saladSensations': 'Fresh and healthy salads for a tasty meal without guilt.',
    'restaurant.desc.seasonalFlowers': 'Fresh bouquets and stunning flower arrangements for every occasion.',
    
    // Restaurants Page
    'restaurants.title': 'Discover Restaurants & Businesses',
    'restaurants.subtitle': 'Find a wide variety of cuisines and services and discover your next favorite meal or service.',
    'restaurants.search.placeholder': 'Search restaurants, businesses or cuisines...',
    'restaurants.search.ariaLabel': 'Search restaurants, businesses or cuisines',
    'restaurants.zippSale.active': '🔥 ZIPP Sale Deals Active Now!',
    'restaurants.zippSale.description': 'End-of-day surprise bags at special prices! Hurry before they\'re gone.',
    'restaurants.zippSale.from': 'From:',
    'restaurants.zippSale.addToCart': 'Add to Cart',
    'restaurants.zippSale.viewAll': 'View All ZIPP Sale Deals...',
    'restaurants.filters.cuisine': 'Cuisine/Business Type',
    'restaurants.filters.rating': 'Minimum Rating',
    'restaurants.filters.distance': 'Distance',
    'restaurants.filters.all': 'All',
    'restaurants.filters.allTypes': 'All Types',
    'restaurants.filters.allRatings': 'All Ratings',
    'restaurants.filters.allDistances': 'All Distances (Coming Soon)',
    'restaurants.filters.stars45': '4.5+ Stars',
    'restaurants.filters.stars4': '4.0+ Stars',
    'restaurants.filters.stars35': '3.5+ Stars',
    'restaurants.filters.distance1km': '< 1 km (Coming Soon)',
    'restaurants.filters.distance3km': '< 3 km (Coming Soon)',
    'restaurants.filters.distance5km': '< 5 km (Coming Soon)',
    'restaurants.filters.more': 'More Filters',
    'restaurants.filters.moreToast.title': 'More Filters Coming Soon!',
    'restaurants.filters.moreToast.description': 'Advanced filtering options will be added in a future update.',
    'restaurants.noResults.title': 'No restaurants or businesses found matching your search or filters.',
    'restaurants.noResults.suggestion': 'Try changing your search terms or filters.',
    
    // Marketplace Page
    'marketplace.title': 'SwiftServe Second-Hand - Community Board',
    'marketplace.subtitle': 'Buy and sell second-hand items within the SwiftServe community. Find bargains or make space at home!',
    'marketplace.publishNew': 'Publish New Product',
    'marketplace.filtersTitle': 'Filter and Search Listings',
    'marketplace.search.label': 'Free Search',
    'marketplace.search.placeholder': 'Search by title, description, location...',
    'marketplace.category.label': 'Category',
    'marketplace.category.all': 'All Categories',
    'marketplace.sort.label': 'Sort By',
    'marketplace.sort.placeholder': 'Sort...',
    'marketplace.sort.newest': 'Newest',
    'marketplace.sort.priceAsc': 'Price: Low to High',
    'marketplace.sort.priceDesc': 'Price: High to Low',
    'marketplace.moreFilters': 'More Filters',
    'marketplace.moreFilters.toast.title': 'More Filters',
    'marketplace.moreFilters.toast.description': 'Advanced filtering options such as price range, seller rating and more will be added. (Demo)',
    'marketplace.noResults.title': 'No products found matching your search.',
    'marketplace.noResults.suggestion': 'Try changing your search terms or filters.',
    'marketplace.loadMore': 'Load More',
    'marketplace.loadMore.toast': 'Loading more products (Demo).',
    
    // Send Package Page
    'sendPackage.title': 'Send Package / Run Errands',
    'sendPackage.subtitle': 'Send anything, anywhere. Fill in the details and we\'ll find you a courier.',
    'sendPackage.deliveryDetails': 'Delivery Details',
    'sendPackage.pickupAddress': 'Full Pickup Address',
    'sendPackage.pickupAddress.placeholder': 'Street, house number, city',
    'sendPackage.destinationAddress': 'Full Destination Address',
    'sendPackage.destinationAddress.placeholder': 'Street, house number, city',
    'sendPackage.packageDescription': 'Package/Errand Description',
    'sendPackage.packageDescription.placeholder': 'E.g.: keys, documents, pick up shirt from ABC store',
    'sendPackage.contactDetails': 'Contact Details (Optional)',
    'sendPackage.pickupContact': 'Pickup Contact',
    'sendPackage.pickupContactName.placeholder': 'Name',
    'sendPackage.pickupContactPhone': 'Pickup Phone',
    'sendPackage.pickupContactPhone.placeholder': 'Phone number',
    'sendPackage.destinationContact': 'Destination Contact',
    'sendPackage.destinationContactName.placeholder': 'Name',
    'sendPackage.destinationContactPhone': 'Destination Phone',
    'sendPackage.destinationContactPhone.placeholder': 'Phone number',
    'sendPackage.purchaseRequired': 'Does the courier need to purchase items for me?',
    'sendPackage.purchaseDetails': 'Purchase Details',
    'sendPackage.shoppingList': 'Shopping List (one item per line)',
    'sendPackage.shoppingList.placeholder': 'E.g.: bread, 3% milk, 6 eggs L',
    'sendPackage.estimatedBudget': 'Estimated Purchase Budget ($)',
    'sendPackage.estimatedBudget.placeholder': 'E.g.: 50',
    'sendPackage.specialInstructions': 'Special Instructions for Courier (Optional)',
    'sendPackage.specialInstructions.placeholder': 'E.g.: please call before arriving, leave with security guard',
    'sendPackage.submit': 'Request Delivery',
    'sendPackage.processing': 'Processing request...',
    'sendPackage.success': 'Request sent successfully!',
    'sendPackage.validationError': 'Validation Error',
    'sendPackage.submitError': 'Error sending request',
    'sendPackage.submitError.description': 'An error occurred. Please try again later.',
    'sendPackage.validation.pickupAddress': 'Pickup address must contain at least 5 characters.',
    'sendPackage.validation.destinationAddress': 'Destination address must contain at least 5 characters.',
    'sendPackage.validation.packageDescription': 'Package description must contain at least 3 characters.',
    'sendPackage.validation.budget': 'Budget must be a number',
    'sendPackage.validation.budgetPositive': 'Budget must be positive',
    'sendPackage.validation.purchaseRequired': 'If purchase is required, please fill in shopping list and estimated budget.',
    
    // Smart Tools Menu
    'smartTools.title': 'AI-powered Features & More',
    'smartTools.aiRecommendations': 'AI Recommendations',
    'smartTools.nutritionalAdvisor': 'Nutritional Advisor',
    'smartTools.foodRadar': 'Food Radar & Trends',
    'smartTools.surpriseWheel': 'Surprise Wheel',
    'smartTools.travelMode': 'Travel Mode',
    
    // Spin Wheel Page
    'spinWheel.title': 'Wheel of Fortune',
    'spinWheel.subtitle': 'Spin the wheel and discover what prize awaits you!',
    'spinWheel.prizes.discount10': '10% Discount',
    'spinWheel.prizes.discount10Desc': 'On your next order (over $50) from the same business',
    'spinWheel.prizes.freeDessert': 'Free Dessert',
    'spinWheel.prizes.freeDessertDesc': 'From participating restaurants on your next order from the same business',
    'spinWheel.prizes.freeDelivery': 'Free Delivery',
    'spinWheel.prizes.freeDeliveryDesc': 'Up to $15 cost for your next order from the same business',
    'spinWheel.prizes.tryAgain': 'Try Again',
    'spinWheel.prizes.dailySurprise': 'Daily Surprise',
    'spinWheel.prizes.dailySurpriseDesc': 'Coupon code will be sent to you soon!',
    'spinWheel.prizes.discount5': '5% Discount',
    'spinWheel.prizes.discount5Desc': 'On your next order from the same business',
    'spinWheel.spinning': 'Spinning... Good luck!',
    'spinWheel.spinNow': 'Spin Now',
    'spinWheel.spinLater': 'You can spin again later',
    'spinWheel.comeBackLater': 'Come Back Later',
    'spinWheel.dailyAttemptUsed': 'Daily Attempt Used',
    'spinWheel.spinAgainIn': 'You can spin again in {time}.',
    'spinWheel.youWon': '🎉 You Won: {prize}! 🎉',
    'spinWheel.benefitAdded': 'The benefit has been added to your account (Demo).',
    'spinWheel.redeemBenefit': 'Redeem Benefit (Demo)',
    'spinWheel.benefitRedeemed': 'Benefit Redeemed (Demo)',
    'spinWheel.benefitRedeemedDesc': 'The benefit "{benefit}" has been activated for you. You\'ll see it in your cart/payment on your next order from the same business.',
    'spinWheel.share': 'Share',
    'spinWheel.shareDesc': 'Share with a friend and get an extra spin attempt! (Demo of this functionality).',
    'spinWheel.oneSpinPerDay': 'One spin per day allowed. Try again in',
    'spinWheel.canSpinSoon': 'You can spin again soon!',
    'spinWheel.shareForExtra': 'Share with a friend for extra attempt',
    'spinWheel.rules': 'One spin per day allowed – every prize is real',
    'spinWheel.terms': 'Wheel Rules & Promotions',
    'spinWheel.goodLuck': 'Good luck!',
    'spinWheel.disclaimer': 'The app demonstrates the concept of a luck wheel. A full game with advanced animations, sound, real server-side prize management, and advanced usage limitations will be developed later.',
    'spinWheel.spins': 'Spins',
    'spinWheel.muteSound': 'Mute Sound',
    'spinWheel.enableSound': 'Enable Sound',
    'spinWheel.pointer': 'Pointer',
    'spinWheel.totalSpins': 'Total Spins',
    'spinWheel.lastResult': 'Last Result',
    
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
    'ai.chef.title': 'Your AI Chef',
    'ai.chef.subtitle': 'Personalized recommendations powered by AI',
    'ai.chef.suggestion': 'Perfect Sunday vibes! How about starting your week with a luxurious brunch? Eggs Benedict from "Cafe Greg" sounds absolutely divine!',
    'ai.more': 'Discover More',
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
    'tag.choice.tooltip': 'Specially recommended by ZIPP team!',
    
    // Additional translations
    'theme.dark': 'Dark',
    'theme.light': 'Light',
    'site.title': 'ZIPP',
    'site.tagline': 'The Home of Deliveries',
    'tools.smart': 'Smart Tools',
    'search.placeholder': 'What are you craving? Search for \'spicy pizza\', \'flower bouquet\' or \'cold coffee\'',
    'search.tooltip': 'Try searching for a dish, cuisine type, business name, or even a trend!',
    'zipp.sale.banner': '🔥 Hot ZIPP Sale Deals!',
    'zipp.sale.description': 'End-of-day surprise bags at huge discounts! Hurry before they\'re gone.',
    'ai.loading': 'Our AI is brewing something special for you...',
    'couriers.checking': 'Checking availability...',
    'partnerships.title': 'Hot Collaborations & Deals',
    'partnerships.description': 'Exclusive deals in collaboration with leading brands, inspired by the hottest trends!',
    'partnerships.example': 'Exclusive to ZIPP! Get 20% off the entire new dessert collection from \'Sweet Dreams Bakery\' inspired by the \'Croffle\' trend identified by TrendScanner!',
    'partnerships.more': 'Discover More Collaborations',
    'wheel.title': '🎡 ZIPP\'s Surprise Wheel!',
    'wheel.description': 'Feeling lucky? Spin the wheel and win discounts, desserts, free deliveries and more surprises!',
    'wheel.spin': 'Spin Today\'s Wheel',
    // LivePick Sale (ZIPP Sale)
    'livepick.title': 'ZIPP Sale – Hot End‑of‑Day Surprise Bags!',
    'livepick.subtitle': 'Grab amazing deals on quality items from shops, markets and vendors at end‑of‑day discounts. Less waste, more savings!',
    'livepick.back': 'Back to Businesses',
    'livepick.closed': 'ZIPP Sale is currently closed.',
    'livepick.activeHours': 'Active between {start}:00 - {end}:00. Check other businesses or come back later!',
    'livepick.soldout': 'Oops! Looks like today\'s surprise bags are gone.',
    'livepick.checkLater': 'Please check again later or explore other businesses!',
    'livepick.badge': 'ZIPP Sale',
    'livepick.by': 'By',
    'livepick.original': 'Original',
    'livepick.left': 'Left',
    'livepick.addToCart': 'Add Surprise Bag to Cart',
    'livepick.added': 'Surprise bag added to cart!',
    'livepick.added.desc': 'Bag "{name}" from {restaurant} added.',
    'livepick.bag': 'Surprise Bag',
    'livepick.category': 'ZIPP Sale',
    'livepick.disclaimer': 'Each bag comes with the tag "A tasty surprise for less than a coffee". Contents vary! (Demo)',
    'sections.recommended': '🎯 Especially for You: Finds You Can\'t Miss!',
    'sections.new': '✨ Hot from the Oven: Discover What\'s New Near You!',
    'sections.favorites': 'Reorder Favorites with One Click',
    'sections.allBusinesses': 'Discover All Businesses',
    'show.all': 'Show All Businesses and Stores',
    'features.variety': 'Wide Selection',
    'features.variety.desc': 'Discover a wide variety of products and services from numerous local businesses.',
    'features.easy': 'Easy Ordering',
    'features.easy.desc': 'Smooth and intuitive ordering process from browsing to payment.',
    'features.smart': 'Smart Suggestions',
    'features.smart.desc': 'Get personalized suggestions for items and businesses powered by our AI engine.',
    'hero.subtitle': 'Fast, Fresh, Delivered.',
    'hero.description': 'Experience ZIPP\'s smart courier arena.',
    'footer.about': 'About Us (Coming Soon)',
    'footer.careers': 'Careers (Coming Soon)',
    'footer.blog': 'Blog (Coming Soon)',
    'footer.support': 'Customer Service',
    'footer.help': 'Help Center',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.joinUs': 'Join Us',
    'footer.business': 'Businesses: Sign up for ZIPP',
    'footer.couriers': 'Couriers: Join the Team',
    'footer.partners': 'Partner Program',
    'footer.contact': 'Contact',
    'footer.orderNow': 'Order Now',
    'footer.trackOrder': 'Track Order',
    'footer.copyright': '© 2025 ZIPP. All rights reserved.',
    'footer.tagline': 'Your smart delivery platform, powered by AI.'
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
    'restaurant.cuisine.healthy': 'Здоровая еда',
    
    // Restaurant Names
    'restaurant.name.pizzaPalace': 'Пицца Палас',
    'restaurant.name.burgerBonanza': 'Бургер Бонанза', 
    'restaurant.name.pastaPerfection': 'Паста Перфекшн',
    'restaurant.name.saladSensations': 'Салат Сенсейшнс',
    'restaurant.name.seasonalFlowers': 'Сезонные Цветы',
    
    // Restaurant Descriptions
    'restaurant.desc.pizzaPalace': 'Аутентичная итальянская пицца, запеченная до совершенства с самыми свежими ингредиентами.',
    'restaurant.desc.burgerBonanza': 'Лучшие бургеры в городе, приготовленные как надо. Почувствуйте разницу!',
    'restaurant.desc.pastaPerfection': 'Вкусные блюда из пасты, приготовленные с любовью и по традиционным рецептам.',
    'restaurant.desc.saladSensations': 'Свежие и здоровые салаты для вкусной еды без чувства вины.',
    'restaurant.desc.seasonalFlowers': 'Свежие букеты и потрясающие цветочные композиции для любого случая.',
    
    // Restaurants Page
    'restaurants.title': 'Откройте рестораны и бизнес',
    'restaurants.subtitle': 'Найдите широкий выбор кухонь и услуг и откройте для себя свое следующее любимое блюдо или услугу.',
    'restaurants.search.placeholder': 'Поиск ресторанов, бизнеса или кухонь...',
    'restaurants.search.ariaLabel': 'Поиск ресторанов, бизнеса или кухонь',
    'restaurants.zippSale.active': '🔥 Акции ZIPP Sale активны сейчас!',
    'restaurants.zippSale.description': 'Пакеты-сюрпризы конца дня по специальным ценам! Спешите, пока не закончились.',
    'restaurants.zippSale.from': 'От:',
    'restaurants.zippSale.addToCart': 'Добавить в корзину',
    'restaurants.zippSale.viewAll': 'Посмотреть все акции ZIPP Sale...',
    'restaurants.filters.cuisine': 'Тип кухни/бизнеса',
    'restaurants.filters.rating': 'Минимальный рейтинг',
    'restaurants.filters.distance': 'Расстояние',
    'restaurants.filters.all': 'Все',
    'restaurants.filters.allTypes': 'Все типы',
    'restaurants.filters.allRatings': 'Все рейтинги',
    'restaurants.filters.allDistances': 'Все расстояния (скоро)',
    'restaurants.filters.stars45': '4.5+ звезд',
    'restaurants.filters.stars4': '4.0+ звезд',
    'restaurants.filters.stars35': '3.5+ звезд',
    'restaurants.filters.distance1km': '< 1 км (скоро)',
    'restaurants.filters.distance3km': '< 3 км (скоро)',
    'restaurants.filters.distance5km': '< 5 км (скоро)',
    'restaurants.filters.more': 'Больше фильтров',
    'restaurants.filters.moreToast.title': 'Больше фильтров скоро!',
    'restaurants.filters.moreToast.description': 'Расширенные параметры фильтрации будут добавлены в будущем обновлении.',
    'restaurants.noResults.title': 'Рестораны или предприятия, соответствующие вашему поиску или фильтрам, не найдены.',
    'restaurants.noResults.suggestion': 'Попробуйте изменить поисковые запросы или фильтры.',
    
    // Marketplace Page
    'marketplace.title': 'SwiftServe Б/У - Доска объявлений',
    'marketplace.subtitle': 'Покупайте и продавайте подержанные товары в сообществе SwiftServe. Найдите выгодные предложения или освободите место дома!',
    'marketplace.publishNew': 'Опубликовать новый товар',
    'marketplace.filtersTitle': 'Фильтрация и поиск объявлений',
    'marketplace.search.label': 'Свободный поиск',
    'marketplace.search.placeholder': 'Поиск по названию, описанию, местоположению...',
    'marketplace.category.label': 'Категория',
    'marketplace.category.all': 'Все категории',
    'marketplace.sort.label': 'Сортировать по',
    'marketplace.sort.placeholder': 'Сортировка...',
    'marketplace.sort.newest': 'Новые',
    'marketplace.sort.priceAsc': 'Цена: от низкой к высокой',
    'marketplace.sort.priceDesc': 'Цена: от высокой к низкой',
    'marketplace.moreFilters': 'Больше фильтров',
    'marketplace.moreFilters.toast.title': 'Больше фильтров',
    'marketplace.moreFilters.toast.description': 'Расширенные параметры фильтрации, такие как ценовой диапазон, рейтинг продавца и другие, будут добавлены. (Демо)',
    'marketplace.noResults.title': 'Товары, соответствующие вашему поиску, не найдены.',
    'marketplace.noResults.suggestion': 'Попробуйте изменить поисковые запросы или фильтры.',
    'marketplace.loadMore': 'Загрузить еще',
    'marketplace.loadMore.toast': 'Загрузка дополнительных товаров (Демо).',
    
    // Send Package Page
    'sendPackage.title': 'Отправить посылку / Выполнить поручения',
    'sendPackage.subtitle': 'Отправьте что угодно, куда угодно. Заполните детали, и мы найдем вам курьера.',
    'sendPackage.deliveryDetails': 'Детали доставки',
    'sendPackage.pickupAddress': 'Полный адрес получения',
    'sendPackage.pickupAddress.placeholder': 'Улица, номер дома, город',
    'sendPackage.destinationAddress': 'Полный адрес назначения',
    'sendPackage.destinationAddress.placeholder': 'Улица, номер дома, город',
    'sendPackage.packageDescription': 'Описание посылки/поручения',
    'sendPackage.packageDescription.placeholder': 'Например: ключи, документы, забрать рубашку из магазина ABC',
    'sendPackage.contactDetails': 'Контактные данные (необязательно)',
    'sendPackage.pickupContact': 'Контакт для получения',
    'sendPackage.pickupContactName.placeholder': 'Имя',
    'sendPackage.pickupContactPhone': 'Телефон для получения',
    'sendPackage.pickupContactPhone.placeholder': 'Номер телефона',
    'sendPackage.destinationContact': 'Контакт назначения',
    'sendPackage.destinationContactName.placeholder': 'Имя',
    'sendPackage.destinationContactPhone': 'Телефон назначения',
    'sendPackage.destinationContactPhone.placeholder': 'Номер телефона',
    'sendPackage.purchaseRequired': 'Нужно ли курьеру покупать товары для меня?',
    'sendPackage.purchaseDetails': 'Детали покупки',
    'sendPackage.shoppingList': 'Список покупок (один товар на строку)',
    'sendPackage.shoppingList.placeholder': 'Например: хлеб, молоко 3%, 6 яиц L',
    'sendPackage.estimatedBudget': 'Предполагаемый бюджет на покупки (₽)',
    'sendPackage.estimatedBudget.placeholder': 'Например: 50',
    'sendPackage.specialInstructions': 'Особые инструкции для курьера (необязательно)',
    'sendPackage.specialInstructions.placeholder': 'Например: пожалуйста, позвоните перед прибытием, оставьте у охранника',
    'sendPackage.submit': 'Запросить доставку',
    'sendPackage.processing': 'Обработка запроса...',
    'sendPackage.success': 'Запрос отправлен успешно!',
    'sendPackage.validationError': 'Ошибка валидации',
    'sendPackage.submitError': 'Ошибка отправки запроса',
    'sendPackage.submitError.description': 'Произошла ошибка. Пожалуйста, попробуйте еще раз позже.',
    'sendPackage.validation.pickupAddress': 'Адрес получения должен содержать не менее 5 символов.',
    'sendPackage.validation.destinationAddress': 'Адрес назначения должен содержать не менее 5 символов.',
    'sendPackage.validation.packageDescription': 'Описание посылки должно содержать не менее 3 символов.',
    'sendPackage.validation.budget': 'Бюджет должен быть числом',
    'sendPackage.validation.budgetPositive': 'Бюджет должен быть положительным',
    'sendPackage.validation.purchaseRequired': 'Если требуется покупка, пожалуйста, заполните список покупок и предполагаемый бюджет.',
    
    // Smart Tools Menu
    'smartTools.title': 'Функции на основе ИИ и другое',
    'smartTools.aiRecommendations': 'Рекомендации ИИ',
    'smartTools.nutritionalAdvisor': 'Консультант по питанию',
    'smartTools.foodRadar': 'Радар еды и тренды',
    'smartTools.surpriseWheel': 'Колесо сюрпризов',
    'smartTools.travelMode': 'Режим путешествий',
    
    // Spin Wheel Page
    'spinWheel.title': 'Колесо Фортуны',
    'spinWheel.subtitle': 'Крутите колесо и узнайте, какой приз вас ждет!',
    'spinWheel.prizes.discount10': '10% скидка',
    'spinWheel.prizes.discount10Desc': 'На ваш следующий заказ (свыше 50₽) в том же заведении',
    'spinWheel.prizes.freeDessert': 'Бесплатный десерт',
    'spinWheel.prizes.freeDessertDesc': 'В участвующих ресторанах при следующем заказе в том же заведении',
    'spinWheel.prizes.freeDelivery': 'Бесплатная доставка',
    'spinWheel.prizes.freeDeliveryDesc': 'До 15₽ стоимости для следующего заказа в том же заведении',
    'spinWheel.prizes.tryAgain': 'Попробуйте снова',
    'spinWheel.prizes.dailySurprise': 'Ежедневный сюрприз',
    'spinWheel.prizes.dailySurpriseDesc': 'Код купона будет отправлен вам в ближайшее время!',
    'spinWheel.prizes.discount5': '5% скидка',
    'spinWheel.prizes.discount5Desc': 'На ваш следующий заказ в том же заведении',
    'spinWheel.spinning': 'Крутится... Удачи!',
    'spinWheel.spinNow': 'Крутить сейчас',
    'spinWheel.spinLater': 'Вы можете крутить позже',
    'spinWheel.comeBackLater': 'Вернитесь позже',
    'spinWheel.dailyAttemptUsed': 'Ежедневная попытка использована',
    'spinWheel.spinAgainIn': 'Вы можете крутить снова через {time}.',
    'spinWheel.youWon': '🎉 Вы выиграли: {prize}! 🎉',
    'spinWheel.benefitAdded': 'Бонус добавлен на ваш счет (Демо).',
    'spinWheel.redeemBenefit': 'Использовать бонус (Демо)',
    'spinWheel.benefitRedeemed': 'Бонус использован (Демо)',
    'spinWheel.benefitRedeemedDesc': 'Бонус "{benefit}" активирован для вас. Вы увидите его в корзине/при оплате следующего заказа в том же заведении.',
    'spinWheel.share': 'Поделиться',
    'spinWheel.shareDesc': 'Поделитесь с другом и получите дополнительную попытку вращения! (Демо этой функциональности).',
    'spinWheel.oneSpinPerDay': 'Разрешено одно вращение в день. Попробуйте снова через',
    'spinWheel.canSpinSoon': 'Вы сможете крутить снова скоро!',
    'spinWheel.shareForExtra': 'Поделитесь с другом для дополнительной попытки',
    'spinWheel.rules': 'Разрешено одно вращение в день – каждый приз настоящий',
    'spinWheel.terms': 'Правила колеса и акций',
    'spinWheel.goodLuck': 'Удачи!',
    'spinWheel.disclaimer': 'Приложение демонстрирует концепцию колеса удачи. Полная игра с продвинутыми анимациями, звуком, реальным серверным управлением призами и продвинутыми ограничениями использования будет разработана позже.',
    'spinWheel.spins': 'Вращения',
    'spinWheel.muteSound': 'Отключить звук',
    'spinWheel.enableSound': 'Включить звук',
    'spinWheel.pointer': 'Указатель',
    'spinWheel.totalSpins': 'Всего вращений',
    'spinWheel.lastResult': 'Последний результат',
    
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
    'ai.chef.title': 'Ваш ИИ-Шеф',
    'ai.chef.subtitle': 'Персональные рекомендации на основе ИИ',
    'ai.chef.suggestion': 'Идеальное воскресенье! Как насчет роскошного бранча для начала недели? Яйца бенедикт из "Кафе Грег" звучит божественно!',
    'ai.more': 'Больше рекомендаций',
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
    // LivePick Sale (ZIPP Sale)
    'livepick.title': 'ZIPP Sale – Горячие сюрприз‑пакеты в конце дня!',
    'livepick.subtitle': 'Ловите выгодные предложения на качественные товары от магазинов, рынков и павильонов со скидкой в конце дня. Меньше отходов, больше экономии!',
    'livepick.back': 'Назад к заведениям',
    'livepick.closed': 'Акция ZIPP Sale сейчас закрыта.',
    'livepick.activeHours': 'Акция активна между {start}:00 – {end}:00. Проверьте другие заведения или возвращайтесь позже!',
    'livepick.soldout': 'Упс! Похоже, сегодняшние сюрприз‑пакеты разобрали.',
    'livepick.checkLater': 'Загляните позже или посмотрите другие заведения!',
    'livepick.badge': 'ZIPP Sale',
    'livepick.by': 'От',
    'livepick.original': 'Изначально',
    'livepick.left': 'Осталось',
    'livepick.addToCart': 'Добавить сюрприз‑пакет в корзину',
    'livepick.added': 'Сюрприз‑пакет добавлен в корзину!',
    'livepick.added.desc': 'Пакет "{name}" от {restaurant} добавлен.',
    'livepick.bag': 'Сюрприз‑пакет',
    'livepick.category': 'ZIPP Sale',
    'livepick.disclaimer': 'Каждый пакет помечен как "Вкусный сюрприз дешевле чашки кофе". Содержимое может отличаться! (Демо)',
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
    'restaurant.cuisine.healthy': 'طعام صحي',
    
    // Restaurant Names
    'restaurant.name.pizzaPalace': 'قصر البيتزا',
    'restaurant.name.burgerBonanza': 'برغر بونانزا', 
    'restaurant.name.pastaPerfection': 'باستا بيرفيكشن',
    'restaurant.name.saladSensations': 'سلطة سينسيشنز',
    'restaurant.name.seasonalFlowers': 'زهور الموسم',
    
    // Restaurant Descriptions
    'restaurant.desc.pizzaPalace': 'بيتزا إيطالية أصيلة مخبوزة للكمال مع أطازج المكونات.',
    'restaurant.desc.burgerBonanza': 'أفضل البرغر في المدينة، مشوي بالطريقة الصحيحة. اشعر بالفرق!',
    'restaurant.desc.pastaPerfection': 'أطباق باستا لذيذة مصنوعة بحب ووصفات تقليدية.',
    'restaurant.desc.saladSensations': 'سلطات طازجة وصحية لوجبة لذيذة بدون شعور بالذنب.',
    'restaurant.desc.seasonalFlowers': 'باقات طازجة وترتيبات زهور مذهلة لكل مناسبة.',
    
    // Restaurants Page
    'restaurants.title': 'اكتشف المطاعم والشركات',
    'restaurants.subtitle': 'ابحث عن مجموعة واسعة من المأكولات والخدمات واكتشف وجبتك أو خدمتك المفضلة التالية.',
    'restaurants.search.placeholder': 'ابحث عن المطاعم أو الشركات أو المأكولات...',
    'restaurants.search.ariaLabel': 'البحث عن المطاعم أو الشركات أو المأكولات',
    'restaurants.zippSale.active': '🔥 عروض ZIPP Sale نشطة الآن!',
    'restaurants.zippSale.description': 'أكياس مفاجآت نهاية اليوم بأسعار خاصة! أسرع قبل انتهائها.',
    'restaurants.zippSale.from': 'من:',
    'restaurants.zippSale.addToCart': 'أضف إلى السلة',
    'restaurants.zippSale.viewAll': 'عرض جميع عروض ZIPP Sale...',
    'restaurants.filters.cuisine': 'نوع المطبخ/الشركة',
    'restaurants.filters.rating': 'الحد الأدنى للتقييم',
    'restaurants.filters.distance': 'المسافة',
    'restaurants.filters.all': 'الكل',
    'restaurants.filters.allTypes': 'جميع الأنواع',
    'restaurants.filters.allRatings': 'جميع التقييمات',
    'restaurants.filters.allDistances': 'جميع المسافات (قريباً)',
    'restaurants.filters.stars45': '4.5+ نجوم',
    'restaurants.filters.stars4': '4.0+ نجوم',
    'restaurants.filters.stars35': '3.5+ نجوم',
    'restaurants.filters.distance1km': '< 1 كم (قريباً)',
    'restaurants.filters.distance3km': '< 3 كم (قريباً)',
    'restaurants.filters.distance5km': '< 5 كم (قريباً)',
    'restaurants.filters.more': 'المزيد من المرشحات',
    'restaurants.filters.moreToast.title': 'المزيد من المرشحات قريباً!',
    'restaurants.filters.moreToast.description': 'سيتم إضافة خيارات تصفية متقدمة في تحديث مستقبلي.',
    'restaurants.noResults.title': 'لم يتم العثور على مطاعم أو شركات تطابق بحثك أو مرشحاتك.',
    'restaurants.noResults.suggestion': 'جرب تغيير مصطلحات البحث أو المرشحات.',
    
    // Marketplace Page
    'marketplace.title': 'SwiftServe مستعمل - لوحة المجتمع',
    'marketplace.subtitle': 'اشتر وبع العناصر المستعملة داخل مجتمع SwiftServe. ابحث عن صفقات أو أفرغ مساحة في المنزل!',
    'marketplace.publishNew': 'نشر منتج جديد',
    'marketplace.filtersTitle': 'تصفية وبحث الإعلانات',
    'marketplace.search.label': 'بحث حر',
    'marketplace.search.placeholder': 'ابحث بالعنوان، الوصف، الموقع...',
    'marketplace.category.label': 'الفئة',
    'marketplace.category.all': 'جميع الفئات',
    'marketplace.sort.label': 'ترتيب حسب',
    'marketplace.sort.placeholder': 'ترتيب...',
    'marketplace.sort.newest': 'الأحدث',
    'marketplace.sort.priceAsc': 'السعر: من المنخفض إلى المرتفع',
    'marketplace.sort.priceDesc': 'السعر: من المرتفع إلى المنخفض',
    'marketplace.moreFilters': 'المزيد من المرشحات',
    'marketplace.moreFilters.toast.title': 'المزيد من المرشحات',
    'marketplace.moreFilters.toast.description': 'سيتم إضافة خيارات تصفية متقدمة مثل نطاق السعر وتقييم البائع والمزيد. (عرض توضيحي)',
    'marketplace.noResults.title': 'لم يتم العثور على منتجات تطابق بحثك.',
    'marketplace.noResults.suggestion': 'جرب تغيير مصطلحات البحث أو المرشحات.',
    'marketplace.loadMore': 'تحميل المزيد',
    'marketplace.loadMore.toast': 'تحميل المزيد من المنتجات (عرض توضيحي).',
    
    // Send Package Page
    'sendPackage.title': 'إرسال طرد / تنفيذ مهام',
    'sendPackage.subtitle': 'أرسل أي شيء، إلى أي مكان. املأ التفاصيل وسنجد لك ساعي.',
    'sendPackage.deliveryDetails': 'تفاصيل التوصيل',
    'sendPackage.pickupAddress': 'عنوان الاستلام الكامل',
    'sendPackage.pickupAddress.placeholder': 'الشارع، رقم المنزل، المدينة',
    'sendPackage.destinationAddress': 'عنوان الوجهة الكامل',
    'sendPackage.destinationAddress.placeholder': 'الشارع، رقم المنزل، المدينة',
    'sendPackage.packageDescription': 'وصف الطرد/المهمة',
    'sendPackage.packageDescription.placeholder': 'مثال: مفاتيح، مستندات، استلام قميص من متجر ABC',
    'sendPackage.contactDetails': 'تفاصيل الاتصال (اختياري)',
    'sendPackage.pickupContact': 'جهة اتصال الاستلام',
    'sendPackage.pickupContactName.placeholder': 'الاسم',
    'sendPackage.pickupContactPhone': 'هاتف الاستلام',
    'sendPackage.pickupContactPhone.placeholder': 'رقم الهاتف',
    'sendPackage.destinationContact': 'جهة اتصال الوجهة',
    'sendPackage.destinationContactName.placeholder': 'الاسم',
    'sendPackage.destinationContactPhone': 'هاتف الوجهة',
    'sendPackage.destinationContactPhone.placeholder': 'رقم الهاتف',
    'sendPackage.purchaseRequired': 'هل يحتاج الساعي لشراء عناصر لي؟',
    'sendPackage.purchaseDetails': 'تفاصيل الشراء',
    'sendPackage.shoppingList': 'قائمة التسوق (عنصر واحد في كل سطر)',
    'sendPackage.shoppingList.placeholder': 'مثال: خبز، حليب 3%، 6 بيضات L',
    'sendPackage.estimatedBudget': 'الميزانية المقدرة للشراء ($)',
    'sendPackage.estimatedBudget.placeholder': 'مثال: 50',
    'sendPackage.specialInstructions': 'تعليمات خاصة للساعي (اختياري)',
    'sendPackage.specialInstructions.placeholder': 'مثال: يرجى الاتصال قبل الوصول، اتركه مع الحارس',
    'sendPackage.submit': 'طلب التوصيل',
    'sendPackage.processing': 'معالجة الطلب...',
    'sendPackage.success': 'تم إرسال الطلب بنجاح!',
    'sendPackage.validationError': 'خطأ في التحقق',
    'sendPackage.submitError': 'خطأ في إرسال الطلب',
    'sendPackage.submitError.description': 'حدث خطأ. يرجى المحاولة مرة أخرى لاحقاً.',
    'sendPackage.validation.pickupAddress': 'يجب أن يحتوي عنوان الاستلام على 5 أحرف على الأقل.',
    'sendPackage.validation.destinationAddress': 'يجب أن يحتوي عنوان الوجهة على 5 أحرف على الأقل.',
    'sendPackage.validation.packageDescription': 'يجب أن يحتوي وصف الطرد على 3 أحرف على الأقل.',
    'sendPackage.validation.budget': 'يجب أن تكون الميزانية رقماً',
    'sendPackage.validation.budgetPositive': 'يجب أن تكون الميزانية موجبة',
    'sendPackage.validation.purchaseRequired': 'إذا كانت المشتريات مطلوبة، يرجى ملء قائمة التسوق والميزانية المقدرة.',
    
    // Smart Tools Menu
    'smartTools.title': 'ميزات مدعومة بالذكاء الاصطناعي والمزيد',
    'smartTools.aiRecommendations': 'توصيات الذكاء الاصطناعي',
    'smartTools.nutritionalAdvisor': 'مستشار التغذية',
    'smartTools.foodRadar': 'رادار الطعام والاتجاهات',
    'smartTools.surpriseWheel': 'عجلة المفاجآت',
    'smartTools.travelMode': 'وضع السفر',
    
    // Spin Wheel Page
    'spinWheel.title': 'عجلة الحظ',
    'spinWheel.subtitle': 'أدر العجلة واكتشف أي جائزة تنتظرك!',
    'spinWheel.prizes.discount10': 'خصم 10%',
    'spinWheel.prizes.discount10Desc': 'على طلبك التالي (أكثر من 50₪) من نفس المؤسسة',
    'spinWheel.prizes.freeDessert': 'حلوى مجانية',
    'spinWheel.prizes.freeDessertDesc': 'من المطاعم المشاركة في طلبك التالي من نفس المؤسسة',
    'spinWheel.prizes.freeDelivery': 'توصيل مجاني',
    'spinWheel.prizes.freeDeliveryDesc': 'حتى تكلفة 15₪ لطلبك التالي من نفس المؤسسة',
    'spinWheel.prizes.tryAgain': 'حاول مرة أخرى',
    'spinWheel.prizes.dailySurprise': 'مفاجأة يومية',
    'spinWheel.prizes.dailySurpriseDesc': 'سيتم إرسال رمز القسيمة إليك قريباً!',
    'spinWheel.prizes.discount5': 'خصم 5%',
    'spinWheel.prizes.discount5Desc': 'على طلبك التالي من نفس المؤسسة',
    'spinWheel.spinning': 'تدور... حظاً سعيداً!',
    'spinWheel.spinNow': 'أدر الآن',
    'spinWheel.spinLater': 'يمكنك الدوران مرة أخرى لاحقاً',
    'spinWheel.comeBackLater': 'عد لاحقاً',
    'spinWheel.dailyAttemptUsed': 'تم استخدام المحاولة اليومية',
    'spinWheel.spinAgainIn': 'يمكنك الدوران مرة أخرى خلال {time}.',
    'spinWheel.youWon': '🎉 فزت بـ: {prize}! 🎉',
    'spinWheel.benefitAdded': 'تمت إضافة المنفعة إلى حسابك (عرض توضيحي).',
    'spinWheel.redeemBenefit': 'استخدام المنفعة (عرض توضيحي)',
    'spinWheel.benefitRedeemed': 'تم استخدام المنفعة (عرض توضيحي)',
    'spinWheel.benefitRedeemedDesc': 'تم تفعيل المنفعة "{benefit}" لك. ستراها في سلتك/الدفع في طلبك التالي من نفس المؤسسة.',
    'spinWheel.share': 'مشاركة',
    'spinWheel.shareDesc': 'شارك مع صديق واحصل على محاولة دوران إضافية! (عرض توضيحي لهذه الوظيفة).',
    'spinWheel.oneSpinPerDay': 'مسموح بدورة واحدة في اليوم. جرب مرة أخرى خلال',
    'spinWheel.canSpinSoon': 'يمكنك الدوران مرة أخرى قريباً!',
    'spinWheel.shareForExtra': 'شارك مع صديق لمحاولة إضافية',
    'spinWheel.rules': 'مسموح بدورة واحدة في اليوم – كل جائزة حقيقية',
    'spinWheel.terms': 'قواعد العجلة والعروض الترويجية',
    'spinWheel.goodLuck': 'حظاً سعيداً!',
    'spinWheel.disclaimer': 'التطبيق يوضح مفهوم عجلة الحظ. لعبة كاملة مع رسوم متحركة متقدمة، صوت، إدارة جوائز حقيقية من جانب الخادم وقيود استخدام متقدمة سيتم تطويرها لاحقاً.',
    'spinWheel.spins': 'دورات',
    'spinWheel.muteSound': 'كتم الصوت',
    'spinWheel.enableSound': 'تشغيل الصوت',
    'spinWheel.pointer': 'مؤشر',
    'spinWheel.totalSpins': 'إجمالي الدورات',
    'spinWheel.lastResult': 'النتيجة الأخيرة',
    
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
    'ai.chef.title': 'الشيف الذكي',
    'ai.chef.subtitle': 'توصيات شخصية مدعومة بالذكاء الاصطناعي',
    'ai.chef.suggestion': 'أحد مثالي! ما رأيك في بدء الأسبوع بفطور متأخر فاخر؟ بيض بنديكت من "كافيه جريج" يبدو رائعاً!',
    'ai.more': 'المزيد من التوصيات',
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
    // LivePick Sale (ZIPP Sale)
    'livepick.title': 'ZIPP Sale – حقائب مفاجأة ساخنة لنهاية اليوم!',
    'livepick.subtitle': 'احصل على عروض رائعة على منتجات عالية الجودة من المتاجر والأسواق والأكشاك بخصومات نهاية اليوم. هدر أقل، توفير أكثر!',
    'livepick.back': 'العودة إلى الأعمال',
    'livepick.closed': 'عروض ZIPP Sale مغلقة حالياً.',
    'livepick.activeHours': 'النشاط بين {start}:00 و {end}:00. تحقق من أعمال أخرى أو عد لاحقاً!',
    'livepick.soldout': 'عذراً! يبدو أن حقائب المفاجأة لليوم قد نفدت.',
    'livepick.checkLater': 'يرجى المحاولة لاحقاً أو استكشاف أعمال أخرى!',
    'livepick.badge': 'ZIPP Sale',
    'livepick.by': 'من',
    'livepick.original': 'السعر الأصلي',
    'livepick.left': 'متبقي',
    'livepick.addToCart': 'أضف حقيبة المفاجأة إلى السلة',
    'livepick.added': 'تمت إضافة حقيبة المفاجأة إلى السلة!',
    'livepick.added.desc': 'تمت إضافة الحقيبة "{name}" من {restaurant}.',
    'livepick.bag': 'حقيبة مفاجأة',
    'livepick.category': 'ZIPP Sale',
    'livepick.disclaimer': 'كل حقيبة تأتي بوسم "مفاجأة لذيذة بسعر أقل من القهوة". المحتويات قد تختلف! (تجريبي)',
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
