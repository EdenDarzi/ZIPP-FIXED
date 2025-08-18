import type { Restaurant, MenuItem } from '@/types';

// Enhanced menu items with realistic Israeli restaurant data
const enhancedMenuItems: Omit<MenuItem, 'restaurantId'>[] = [
  // Pizza Palace Items
  {
    id: 'pizza1',
    name: 'פיצה מרגריטה קלאסית',
    description: 'פיצה איטלקית אותנטית עם רוטב עגבניות טרי, מוצרלה איכותית ובזיליקום טרי',
    price: 48.00,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=600&h=400&fit=crop',
    dataAiHint: 'pizza margherita italian tomato mozzarella',
    category: 'פיצות',
    isAvailable: true,
    addons: [
      { 
        id: 'addon-group-pizza-size', 
        title: 'בחר גודל', 
        type: 'radio', 
        required: true, 
        options: [ 
          {id: 's1', name: 'אישית (25 ס"מ)', price: 0, selectedByDefault: true}, 
          {id: 's2', name: 'בינונית (30 ס"מ)', price: 8}, 
          {id: 's3', name: 'משפחתית (35 ס"מ)', price: 15} 
        ]
      },
      { 
        id: 'addon-group-pizza-toppings', 
        title: 'תוספות (עד 4)', 
        type: 'checkbox', 
        minSelection: 0, 
        maxSelection: 4, 
        options: [ 
          {id: 't1', name: 'זיתים שחורים', price: 3}, 
          {id: 't2', name: 'פטריות טריות', price: 4}, 
          {id: 't3', name: 'בצל סגול', price: 2}, 
          {id: 't4', name: 'פפרוני', price: 6},
          {id: 't5', name: 'גבינת פרמזן', price: 5},
          {id: 't6', name: 'עגבניות שרי', price: 3}
        ]
      }
    ]
  },
  {
    id: 'pizza2',
    name: 'פיצה פפרוני מיוחדת',
    description: 'פיצה עם פפרוני איכותי, גבינת מוצרלה כפולה ורוטב עגבניות מתובל',
    price: 58.00,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop',
    dataAiHint: 'pizza pepperoni italian spicy',
    category: 'פיצות',
    isAvailable: true,
  },
  {
    id: 'pizza3',
    name: 'פיצה ירקות צלויים',
    description: 'פיצה טבעונית עם חצילים, פלפלים, קישואים וגבינת עיזים על בסיס פסטו',
    price: 52.00,
    imageUrl: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=600&h=400&fit=crop',
    dataAiHint: 'pizza vegetables roasted vegan',
    category: 'פיצות',
    isAvailable: true,
  },
  {
    id: 'pizza4',
    name: 'פיצה טונה ובצל',
    description: 'פיצה עם טונה איכותית, בצל לבן, זיתים וגבינת מוצרלה',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop',
    dataAiHint: 'pizza tuna onion mediterranean',
    category: 'פיצות',
    isAvailable: true,
  },

  // Burger Bonanza Items
  {
    id: 'burger1',
    name: 'המבורגר קלאסי',
    description: 'קציצת בשר בקר 200 גרם, חסה, עגבנייה, בצל וברוטב הבית המיוחד',
    price: 42.00,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop',
    dataAiHint: 'burger classic american beef',
    category: 'המבורגרים',
    isAvailable: true,
    addons: [
      { 
        id: 'addon-group-burger-cheese', 
        title: 'תוספת גבינה', 
        type: 'radio', 
        options: [ 
          {id: 'c0', name: 'ללא גבינה', price: 0, selectedByDefault: true}, 
          {id: 'c1', name: 'צ\'דר', price: 4}, 
          {id: 'c2', name: 'גבינה כחולה', price: 6},
          {id: 'c3', name: 'גבינת עיזים', price: 5} 
        ]
      },
      { 
        id: 'addon-group-burger-extras', 
        title: 'תוספות נוספות', 
        type: 'checkbox', 
        minSelection: 0, 
        maxSelection: 3, 
        options: [ 
          {id: 'e1', name: 'בצל מטוגן', price: 3}, 
          {id: 'e2', name: 'פטריות מוקפצות', price: 4}, 
          {id: 'e3', name: 'ביצת עין', price: 5},
          {id: 'e4', name: 'בייקון', price: 7},
          {id: 'e5', name: 'אבוקדו', price: 6}
        ]
      }
    ]
  },
  {
    id: 'burger2',
    name: 'צ\'יקן בורגר פיקנטי',
    description: 'חזה עוף בגריל עם רוטב חריף, חסה, עגבנייה ומלפפון חמוץ',
    price: 38.00,
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e2d53352?w=600&h=400&fit=crop',
    dataAiHint: 'chicken burger spicy grilled',
    category: 'המבורגרים',
    isAvailable: true,
  },
  {
    id: 'burger3',
    name: 'בורגר טבעוני',
    description: 'קציצה טבעונית מפטריות ושעועית, אבוקדו, חסה ורוטב טחינה',
    price: 36.00,
    imageUrl: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=600&h=400&fit=crop',
    dataAiHint: 'vegan burger mushroom plant based',
    category: 'המבורגרים',
    isAvailable: true,
  },
  {
    id: 'side1',
    name: 'צ\'יפס בלגי',
    description: 'צ\'יפס בלגי עבה וקריספי עם מלח ים וזעתר',
    price: 18.00,
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&h=400&fit=crop',
    dataAiHint: 'french fries belgian crispy',
    category: 'תוספות',
    isAvailable: true,
  },

  // Pasta Perfection Items
  {
    id: 'pasta1',
    name: 'ספגטי קרבונרה',
    description: 'ספגטי קלאסי עם ביצים, פרמזן, פנצ\'טה ופלפל שחור טרי טחון',
    price: 48.00,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop',
    dataAiHint: 'pasta carbonara italian creamy',
    category: 'פסטה',
    isAvailable: true,
  },
  {
    id: 'pasta2',
    name: 'פטוצ\'יני אלפרדו',
    description: 'פטוצ\'יני ברוטב קרם עשיר עם פרמזן, חמאה ומעט שום',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&h=400&fit=crop',
    dataAiHint: 'pasta alfredo creamy cheese',
    category: 'פסטה',
    isAvailable: true,
  },
  {
    id: 'pasta3',
    name: 'פנה ארביאטה',
    description: 'פסטה פנה ברוטב עגבניות חריף עם שום, בזיליקום ופלפל צ\'ילי',
    price: 42.00,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=600&h=400&fit=crop',
    dataAiHint: 'pasta arrabbiata spicy tomato',
    category: 'פסטה',
    isAvailable: true,
  },
  {
    id: 'pasta4',
    name: 'לזניה בולונז',
    description: 'לזניה ביתית עם רוטב בולונז, בשמל ושלוש גבינות',
    price: 52.00,
    imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&h=400&fit=crop',
    dataAiHint: 'lasagna bolognese cheese baked',
    category: 'פסטה',
    isAvailable: true,
  },

  // Salad Sensations Items
  {
    id: 'salad1',
    name: 'סלט קיסר קלאסי',
    description: 'עלי חסה רומיין, פרמזן, קרוטונים וברוטב קיסר ביתי',
    price: 36.00,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=600&h=400&fit=crop',
    dataAiHint: 'caesar salad classic romaine',
    category: 'סלטים',
    isAvailable: true,
    addons: [
      { 
        id: 'addon-group-salad-protein', 
        title: 'הוסף חלבון', 
        type: 'radio', 
        options: [
          {id: 'p0', name: 'ללא תוספת', price: 0, selectedByDefault: true},
          {id: 'p1', name: 'חזה עוף בגריל', price: 12},
          {id: 'p2', name: 'סלמון מעושן', price: 18},
          {id: 'p3', name: 'גבינת עיזים', price: 8},
          {id: 'p4', name: 'טונה', price: 10}
        ]
      }
    ]
  },
  {
    id: 'salad2',
    name: 'סלט יווני מסורתי',
    description: 'עגבניות, מלפפונים, זיתים, גבינת פטה, בצל סגול וזעתר',
    price: 32.00,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop',
    dataAiHint: 'greek salad mediterranean feta',
    category: 'סלטים',
    isAvailable: true,
  },
  {
    id: 'salad3',
    name: 'בול קינואה וירקות',
    description: 'קינואה עם ירקות קלויים, אבוקדו, זרעי חמנייה וטחינה',
    price: 38.00,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
    dataAiHint: 'quinoa bowl healthy vegetables',
    category: 'סלטים',
    isAvailable: true,
  },
  {
    id: 'salad4',
    name: 'סלט ניקואז',
    description: 'סלט צרפתי עם טונה, ביצים קשות, זיתים, שעועית ירוקה ועגבניות',
    price: 42.00,
    imageUrl: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&h=400&fit=crop',
    dataAiHint: 'nicoise salad french tuna',
    category: 'סלטים',
    isAvailable: true,
  },

  // Asian Fusion Items
  {
    id: 'asian1',
    name: 'פאד תאי מסורתי',
    description: 'אטריות אורז מוקפצות עם ביצה, נבטים, בוטנים ורוטב תמרינד',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=600&h=400&fit=crop',
    dataAiHint: 'pad thai noodles asian traditional',
    category: 'מנות עיקריות',
    isAvailable: true,
  },
  {
    id: 'asian2',
    name: 'סושי מיקס',
    description: 'מגוון של 12 חתיכות סושי וסשימי טריות עם ווסאבי וג\'ינג\'ר',
    price: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop',
    dataAiHint: 'sushi mix japanese fresh',
    category: 'מנות עיקריות',
    isAvailable: true,
  },

  // Mexican Items
  {
    id: 'mexican1',
    name: 'בוריטו בשר',
    description: 'טורטייה עם בשר בקר, שעועית, אורז, גבינה וגוואקמולה',
    price: 42.00,
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop',
    dataAiHint: 'beef burrito mexican wrap',
    category: 'מנות עיקריות',
    isAvailable: true,
  },
  {
    id: 'mexican2',
    name: 'קוואסדיה גבינות',
    description: 'טורטייה עם תערובת של 3 גבינות, פלפלים ובצל',
    price: 36.00,
    imageUrl: 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=600&h=400&fit=crop',
    dataAiHint: 'cheese quesadilla mexican grilled',
    category: 'מנות עיקריות',
    isAvailable: true,
  },

  // Drinks for all restaurants
  {
    id: 'drink1',
    name: 'קוקה קולה',
    description: 'קוקה קולה קלאסית 330 מ"ל',
    price: 8.00,
    imageUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=600&h=400&fit=crop',
    dataAiHint: 'coca cola soda drink',
    category: 'משקאות',
    isAvailable: true,
  },
  {
    id: 'drink2',
    name: 'מים מינרליים',
    description: 'מים מינרליים טבעיים 500 מ"ל',
    price: 6.00,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&h=400&fit=crop',
    dataAiHint: 'mineral water natural',
    category: 'משקאות',
    isAvailable: true,
  },
  {
    id: 'drink3',
    name: 'מיץ תפוזים טבעי',
    description: 'מיץ תפוזים טרי וטבעי 330 מ"ל',
    price: 12.00,
    imageUrl: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&h=400&fit=crop',
    dataAiHint: 'orange juice fresh natural',
    category: 'משקאות',
    isAvailable: true,
  },
  {
    id: 'drink4',
    name: 'בירה גולדסטאר',
    description: 'בירה ישראלית קלאסית 330 מ"ל',
    price: 15.00,
    imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=400&fit=crop',
    dataAiHint: 'goldstar beer israeli',
    category: 'משקאות',
    isAvailable: true,
  },
  {
    id: 'drink5',
    name: 'לימונדה ביתית',
    description: 'לימונדה טרייה עם נענע ולימון',
    price: 14.00,
    imageUrl: 'https://images.unsplash.com/photo-1523371683702-4ab18220e5c8?w=600&h=400&fit=crop',
    dataAiHint: 'lemonade fresh mint',
    category: 'משקאות',
    isAvailable: true,
  }
];

export const enhancedRestaurants: Restaurant[] = [
  {
    id: 'restaurant1',
    name: 'פיצה פאלאס', 
    description: 'פיצות איטלקיות אותנטיות עם מרכיבים טריים ואיכותיים. נאפות בתנור אבן מסורתי.', 
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
    dataAiHint: 'pizza italian restaurant authentic',
    location: 'רחוב ראשי 123, אבן יהודה', 
    cuisineType: 'איטלקי', 
    rating: 4.5,
    deliveryTimeEstimate: '25-35 דקות', 
    menu: enhancedMenuItems.filter(item => 
      item.category === 'פיצות' || 
      item.category === 'משקאות'
    ).map(item => ({ ...item, restaurantId: 'restaurant1' })),
    hasDeliveryArena: true,
    tags: ['Popular', 'Fast Delivery'],
    livePickSaleConfig: { 
      enabled: true,
      startTime: "19:00",
      bagCount: 10,
      bagPrice: 20
    },
    supportsTakeaway: true,
    supportsCurbsidePickup: true,
  },
  {
    id: 'restaurant2',
    name: 'בורגר בוננזה', 
    description: 'המבורגרים הטובים בעיר, צלויים בדיוק הנכון. טעמו את ההבדל!', 
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    dataAiHint: 'burger american restaurant grill',
    location: 'שדרות האלון 456, אבן יהודה', 
    cuisineType: 'אמריקאי', 
    rating: 4.2,
    deliveryTimeEstimate: '20-30 דקות', 
    menu: enhancedMenuItems.filter(item => 
      item.category === 'המבורגרים' || 
      item.category === 'תוספות' || 
      item.category === 'משקאות'
    ).map(item => ({ ...item, restaurantId: 'restaurant2' })),
    hasDeliveryArena: false,
    tags: ['Recommended', 'Hot Now'],
    supportsTakeaway: true,
    supportsCurbsidePickup: false,
  },
  {
    id: 'restaurant3',
    name: 'פסטה פרפקשן', 
    description: 'מנות פסטה טעימות עם אהבה ומתכונים מסורתיים. כמו באיטליה!', 
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop',
    dataAiHint: 'pasta italian restaurant traditional',
    location: 'סמטת האורן 789, אבן יהודה', 
    cuisineType: 'איטלקי', 
    rating: 4.8,
    deliveryTimeEstimate: '30-40 דקות', 
    menu: enhancedMenuItems.filter(item => 
      item.category === 'פסטה' || 
      item.category === 'משקאות'
    ).map(item => ({ ...item, restaurantId: 'restaurant3' })),
    hasDeliveryArena: true,
    tags: ['New', 'Recommended'],
    supportsTakeaway: false,
    supportsCurbsidePickup: false,
  },
  {
    id: 'restaurant4',
    name: 'סלט סנסיישנס', 
    description: 'סלטים טריים ובריאים לארוחה טעימה ללא אשמה. הזמינו עכשיו!', 
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop',
    dataAiHint: 'salad healthy restaurant fresh',
    location: 'דרך המייפל 101, אבן יהודה', 
    cuisineType: 'בריא', 
    rating: 4.0,
    deliveryTimeEstimate: '15-25 דקות', 
    menu: enhancedMenuItems.filter(item => 
      item.category === 'סלטים' || 
      item.category === 'משקאות'
    ).map(item => ({ ...item, restaurantId: 'restaurant4' })),
    hasDeliveryArena: true,
    tags: ['Fast Delivery', 'Delivery Arena'],
    supportsTakeaway: true,
    supportsCurbsidePickup: true,
  },
  {
    id: 'restaurant5',
    name: 'אסיה פיוז\'ן',
    description: 'מטבח אסייתי מודרני עם נגיעות מסורתיות. סושי, פאד תאי ועוד.',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=800&h=600&fit=crop',
    dataAiHint: 'asian fusion restaurant sushi thai',
    location: 'רחוב הבמבוק 15, אבן יהודה',
    cuisineType: 'אסייתי',
    rating: 4.6,
    deliveryTimeEstimate: '35-45 דקות',
    menu: enhancedMenuItems.filter(item => 
      item.category === 'מנות עיקריות' && (item.id.startsWith('asian')) ||
      item.category === 'משקאות'
    ).map(item => ({ ...item, restaurantId: 'restaurant5' })),
    hasDeliveryArena: true,
    tags: ['New', 'Popular'],
    supportsTakeaway: true,
    supportsCurbsidePickup: false,
  },
  {
    id: 'restaurant6',
    name: 'מקסיקו לוקו',
    description: 'טעמים מקסיקניים אותנטיים. בוריטו, קוואסדיה וטאקו חריפים.',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=800&h=600&fit=crop',
    dataAiHint: 'mexican restaurant burrito tacos spicy',
    location: 'כיכר המקסיקו 8, אבן יהודה',
    cuisineType: 'מקסיקני',
    rating: 4.3,
    deliveryTimeEstimate: '25-35 דקות',
    menu: enhancedMenuItems.filter(item => 
      item.category === 'מנות עיקריות' && item.id.startsWith('mexican') ||
      item.category === 'משקאות'
    ).map(item => ({ ...item, restaurantId: 'restaurant6' })),
    hasDeliveryArena: false,
    tags: ['Hot Now', 'Recommended'],
    supportsTakeaway: true,
    supportsCurbsidePickup: true,
  },
  {
    id: 'florist1',
    name: 'פרחי העונה',
    description: 'זרי פרחים טריים וסידורי פרחים מרהיבים לכל אירוע.',
    imageUrl: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&h=600&fit=crop',
    dataAiHint: 'flowers bouquets arrangements',
    location: 'שדרות הפרחים 5, עיר הגנים',
    cuisineType: 'חנות פרחים',
    rating: 4.9,
    deliveryTimeEstimate: 'שעה - שעתיים',
    menu: [
        { 
          id: 'flower1', 
          name: 'זר ורדים אדומים קלאסי', 
          description: '12 ורדים אדומים טריים באריזת מתנה מהודרת.', 
          price: 120.00, 
          imageUrl: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&h=400&fit=crop', 
          dataAiHint: 'red roses bouquet romantic', 
          category: 'זרים', 
          restaurantId: 'florist1', 
          isAvailable: true 
        },
        { 
          id: 'flower2', 
          name: 'סידור סחלבים לבנים', 
          description: 'סחלב לבן מרשים בכלי דקורטיבי מיוחד.', 
          price: 180.00, 
          imageUrl: 'https://images.unsplash.com/photo-1487700160041-babef9c3cb55?w=600&h=400&fit=crop', 
          dataAiHint: 'white orchid arrangement elegant', 
          category: 'עציצים', 
          restaurantId: 'florist1', 
          isAvailable: true 
        },
        { 
          id: 'flower3', 
          name: 'זר פרחי בר צבעוני', 
          description: 'זר מגוון ועליז של פרחי בר בצבעים שונים.', 
          price: 85.00, 
          imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&h=400&fit=crop', 
          dataAiHint: 'wildflowers colorful bouquet', 
          category: 'זרים', 
          restaurantId: 'florist1', 
          isAvailable: true 
        },
    ],
    hasDeliveryArena: true,
    tags: ['ZIPP Choice', 'Recommended'],
    supportsTakeaway: true,
    supportsCurbsidePickup: false,
  },
  {
    id: 'bakery1',
    name: 'מאפיית הבוקר',
    description: 'לחמים טריים, מאפים מתוקים ומלוחים, ועוגות מיוחדות.',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop',
    dataAiHint: 'bakery bread pastries fresh',
    location: 'רחוב הקונדיטוריה 10, קרית מאפה',
    cuisineType: 'מאפייה',
    rating: 4.7,
    deliveryTimeEstimate: '30-45 דקות',
    menu: [
        { 
          id: 'bake1', 
          name: 'קרואסון חמאה', 
          description: 'קרואסון צרפתי קלאסי, פריך ועשיר בחמאה.', 
          price: 12.00, 
          imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f4afe2a?w=600&h=400&fit=crop', 
          dataAiHint: 'croissant pastry buttery', 
          category: 'מאפים', 
          restaurantId: 'bakery1', 
          isAvailable: true 
        },
        { 
          id: 'bake2', 
          name: 'עוגת גבינה פירורים', 
          description: 'עוגת גבינה קרה עם בסיס פריך וציפוי פירורים.', 
          price: 85.00, 
          imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=400&fit=crop', 
          dataAiHint: 'cheesecake crumbs dessert', 
          category: 'עוגות', 
          restaurantId: 'bakery1', 
          isAvailable: true 
        },
        { 
          id: 'bake3', 
          name: 'חלה מקמח מלא', 
          description: 'חלה מקמח מלא עם זרעי שומשום וכמון שחור.', 
          price: 18.00, 
          imageUrl: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&h=400&fit=crop', 
          dataAiHint: 'challah whole wheat bread', 
          category: 'לחמים', 
          restaurantId: 'bakery1', 
          isAvailable: true 
        },
        { 
          id: 'bake4', 
          name: 'בורקס גבינה ותרד', 
          description: 'בורקס פריך במילוי גבינת צפת ותרד טרי.', 
          price: 15.00, 
          imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop', 
          dataAiHint: 'burekas cheese spinach pastry', 
          category: 'מאפים', 
          restaurantId: 'bakery1', 
          isAvailable: true 
        },
    ],
    hasDeliveryArena: true,
    tags: ['Popular', 'Fast Delivery'],
    supportsTakeaway: true,
    supportsCurbsidePickup: true,
  }
];

export const getEnhancedRestaurantById = (id: string): Restaurant | undefined => {
  return enhancedRestaurants.find(r => r.id === id);
};

export const getEnhancedItemById = (restaurantId: string, itemId: string): MenuItem | undefined => {
  const restaurant = getEnhancedRestaurantById(restaurantId);
  return restaurant?.menu.find(item => item.id === itemId);
};

export const getAllEnhancedItems = (): MenuItem[] => {
  return enhancedRestaurants.reduce((acc, curr) => acc.concat(curr.menu), [] as MenuItem[]);
};

// Additional cuisine types for better filtering
export const cuisineTypes = [
  'הכל',
  'איטלקי',
  'אמריקאי', 
  'אסייתי',
  'מקסיקני',
  'בריא',
  'מאפייה',
  'חנות פרחים',
  'מזון ים',
  'בשרי',
  'צמחוני',
  'טבעוני'
];
