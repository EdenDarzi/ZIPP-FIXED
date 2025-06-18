# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## חזון ארכיטקטוני עתידי (SwiftServe v1.0 – Architecture Blueprint)

התכנון הארכיטקטוני המוצע עבור מערכת SwiftServe בגרסתה הראשונה (v1.0) מבוסס על שירותים מודולריים וניתנים להרחבה:

```text
Client (Web & Mobile via Capacitor)
│
├── API Gateway (REST + WebSockets)
│   ├── Auth Service (NextAuth / Firebase)
│   ├── Delivery Engine (matching, pricing, routing)
│   ├── Order Manager
│   ├── Wallet/Payments (Stripe Connect)
│   └── AI Engine (Genkit Runtime, Vector Store, LLMs)
│
├── Database (PostgreSQL + Redis)
├── Storage (Firebase S3 for media)
└── Realtime Service (PubSub or Firestore listeners)
```

**פירוט הרכיבים:**

*   **Client (Web & Mobile via Capacitor):** אפליקציית צד לקוח שנכתבה ב-Next.js ו-React, עם אפשרות לעטוף אותה באמצעות Capacitor להפצה בחנויות האפליקציות (iOS/Android) וגישה ליכולות חומרה.
*   **API Gateway (REST + WebSockets):** נקודת הכניסה המרכזית לבקשות מהלקוח. תומך ב-REST API לפעולות סטנדרטיות וב-WebSockets לתקשורת דו-כיוונית בזמן אמת (למשל, עדכוני הזמנות, צ'אט).
*   **Auth Service:** אחראי על אימות וניהול משתמשים והרשאותיהם (למשל, באמצעות NextAuth.js או Firebase Authentication).
*   **Delivery Engine:** ליבת המערכת הלוגיסטית. כולל אלגוריתמים להתאמת שליחים, תמחור דינמי, ואופטימיזציית מסלולים.
*   **Order Manager:** מטפל בכל הלוגיקה הקשורה לניהול הזמנות – יצירה, עדכון סטטוסים, היסטוריה.
*   **Wallet/Payments:** ניהול ארנקים דיגיטליים לכל סוגי המשתמשים ואינטגרציה עם ספקי תשלום (למשל, Stripe Connect) לביצוע סליקה, העברות ותשלומים.
*   **AI Engine:** מנוע הבינה המלאכותית, המבוסס על Genkit Runtime עצמאי. כולל גישה למודלי שפה גדולים (LLMs) ואולי ל-Vector Store לצורך חיפושים סמנטיים והמלצות מתקדמות.
*   **Database (PostgreSQL + Redis):** בסיס נתונים ראשי (למשל, PostgreSQL) לשמירת נתונים רלציוניים ומובנים, עם שימוש ב-Redis עבור Caching וניהול נתונים מהירים (כמו מיקומי שליחים בזמן אמת).
*   **Storage (Firebase S3 for media):** פתרון אחסון לקבצי מדיה כמו תמונות (לוגואים, מנות, פריטי יד2).
*   **Realtime Service (PubSub or Firestore listeners):** שירות להעברת הודעות ועדכונים בזמן אמת בין רכיבי המערכת השונים (למשל, עדכון הלקוח על סטטוס הזמנה חדש).

ארכיטקטורה זו נועדה לספק גמישות, יכולת גדילה (scalability) ואפשרות לתחזוקה נוחה של כל רכיב בנפרד.
