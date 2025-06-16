
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-12 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <FileText className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline text-primary">תנאי שימוש</CardTitle>
          <CardDescription>תנאי השימוש של פלטפורמת LivePick.</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base max-w-none text-right" dir="rtl">
          <h2>1. הקדמה</h2>
          <p>ברוכים הבאים ל-LivePick (להלן: "הפלטפורמה"). השימוש בפלטפורמה, לרבות השירותים והתכנים המוצעים בה, כפוף לתנאים המפורטים להלן (להלן: "תנאי השימוש"). אנא קרא/י בעיון תנאים אלו.</p>
          
          <h2>2. השירותים המוצעים</h2>
          <p>הפלטפורמה מאפשרת למשתמשים להזמין מוצרים ושירותים מעסקים שונים, לבצע משלוחי P2P, להשתתף בפעילויות קהילתיות וליהנות מפיצ'רים מבוססי AI. השירותים ניתנים "כפי שהם" (AS IS).</p>

          <h2>3. אחריות המשתמש</h2>
          <p>המשתמש אחראי לכל פעולה שתבוצע דרך חשבונו, לרבות שמירה על סודיות פרטי ההתחברות. המשתמש מתחייב לספק מידע נכון ומדויק.</p>

          <h2>4. קניין רוחני</h2>
          <p>כל זכויות הקניין הרוחני בפלטפורמה, לרבות עיצוב, קוד, תוכן, סמלילים וסימני מסחר, שייכים ל-LivePick או לצדדים שלישיים שהעניקו לה רישיון שימוש. אין להעתיק, לשכפל, להפיץ או לעשות כל שימוש מסחרי ללא אישור מראש ובכתב.</p>

          <h2>5. הגבלת אחריות</h2>
          <p>LivePick אינה אחראית לאיכות המוצרים/שירותים המסופקים על ידי העסקים או השליחים, לזמני משלוח, או לכל נזק ישיר או עקיף שייגרם כתוצאה מהשימוש בפלטפורמה. הפלטפורמה משמשת כמתווכת בלבד.</p>

          <h2>6. פרטיות</h2>
          <p>מדיניות הפרטיות של LivePick, המהווה חלק בלתי נפרד מתנאי שימוש אלו, מפרטת כיצד אנו אוספים ומשתמשים במידע. אנא עיין/י ב<Link href="/privacy" className="text-primary hover:underline">מדיניות הפרטיות</Link>.</p>
          
          <h2>7. שינויים בתנאי השימוש</h2>
          <p>LivePick שומרת לעצמה את הזכות לעדכן או לשנות תנאי שימוש אלו מעת לעת. המשך השימוש בפלטפורמה לאחר עדכון מהווה הסכמה לתנאים המעודכנים.</p>

          <h2>8. סיום שימוש</h2>
          <p>LivePick רשאית לחסום או להפסיק את גישת המשתמש לפלטפורמה, לפי שיקול דעתה הבלעדי, במקרה של הפרת תנאי השימוש או מכל סיבה אחרת.</p>
          
          <p className="mt-6 text-xs">תאריך עדכון אחרון: [תאריך הדמו]</p>
        </CardContent>
      </Card>
    </div>
  );
}
