
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Lightbulb, TrendingUp, ThumbsUp, Search, PlusCircle, AlertTriangle, Info, DollarSign } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { IdentifyDishOutput } from '@/ai/flows/identify-dish-flow';

const mockTrendingInsights: IdentifyDishOutput[] = [
  {
    identifiedDishName: "Korean Corndogs with Cheese Pull",
    isTrend: true,
    trendSource: "TikTok & Instagram",
    generalSuggestion: "משתמשים אוהבים את משיכת הגבינה הדרמטית! פריטים דומים ניתן למצוא בחיפוש 'נקניקיות גורמה' או 'חטיפי גבינה מטוגנים'.",
    businessOpportunity: {
      suggestedItemName: "הקורנדוג הגבינתי האולטימטיבי של SwiftServe",
      suggestedPriceRange: "₪28-₪35",
      suggestedDescription: "קורנדוג פריך מצופה פנקו עם ליבת מוצרלה נמסה, מושלם למשיכת גבינה מספקת. מוגש עם רוטב לבחירה.",
      suggestedTags: ["חדש", "להיט טיקטוק", "גבינתי", "אוכל רחוב"],
      rationale: "מעורבות גבוהה ברשתות חברתיות ומושך ויזואלית. יכול למשוך קהלים צעירים וקניות אימפולסיביות."
    }
  },
  {
    identifiedDishName: "קערת אתגר ראמן חריף",
    isTrend: true,
    trendSource: "אתגרי יוטיוב ורשתות חברתיות",
    generalSuggestion: "טרנד 'האתגר החריף' ממשיך. משתמשים המחפשים חריפות קיצונית יכולים לבדוק את אפשרויות הראמן החריפות ביותר שלנו.",
    businessOpportunity: {
      suggestedItemName: "אתגר נודלס אינפרנו",
      suggestedPriceRange: "₪45-₪55 (כולל חלב קטן)",
      suggestedDescription: "העזו לנסות את הראמן הכי חריף שלנו אי פעם? עמוס בפלפלי רפאים ותערובת תבלינים סודית. סיימו אותו ותקבלו את תמונתכם על קיר התהילה שלנו!",
      suggestedTags: ["אתגר", "חריף", "ראמן", "הצעה לזמן מוגבל"],
      rationale: "מניע מעורבות ותוכן שנוצר על ידי משתמשים. מצוין לשיווק ברשתות חברתיות."
    }
  },
  {
    identifiedDishName: "קפה דלגונה (קפה מוקצף)",
    isTrend: true,
    trendSource: "טיקטוק (טרנד עבר, עניין חוזר)",
    generalSuggestion: "טרנד נוסטלגי שעדיין זוכה לחיפושים. הציעו גרסת גורמה או טוויסט עונתי.",
    businessOpportunity: {
      suggestedItemName: "לאטה מוקצף ענן תשע",
      suggestedPriceRange: "₪18-₪24",
      suggestedDescription: "קפה מוקצף חלק וקטיפתי על חלב קר, עם נגיעת וניל וזילוף קרמל. קלאסיקה משודרגת.",
      suggestedTags: ["קפה", "משקה טרנדי", "אינסטגרמי"],
      rationale: "קל להכנה, רווחיות גבוהה ומושך ויזואלית לשיתוף חברתי. פונה לאוהבי קפה המחפשים משהו שונה."
    }
  },
  {
    identifiedDishName: "טוסט אבוקדו (ארטיזנלי)",
    isTrend: false, 
    generalSuggestion: "מועדף תמידי. SwiftServe מציעה בתי קפה רבים עם אפשרויות טוסט אבוקדו מעולות. משתמשים יכולים לסנן לפי 'ארוחת בוקר' או 'בית קפה'.",
  }
];

export default function TrendingInsightsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [insights, setInsights] = useState<IdentifyDishOutput[]>(mockTrendingInsights);

  const handleQuickAddToMenu = (suggestion: IdentifyDishOutput['businessOpportunity']) => {
    if (!suggestion) return;
    toast({
      title: "מוצר נוסף לתפריט (דמו)",
      description: `"${suggestion.suggestedItemName}" נוסף לתפריט שלך עם תיוג 'בהשראת לקוחות'. ניתן לערוך אותו בדף ניהול המוצרים.`,
      action: <ThumbsUp className="text-green-500" />,
    });
  };
  
  const filteredInsights = insights.filter(insight => 
    (insight.identifiedDishName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (insight.businessOpportunity?.suggestedItemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (insight.trendSource?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleExplorePartnership = (trendName: string) => {
    toast({
        title: "חקירת שותפות (בקרוב!)",
        description: `נשלחה בקשה לבדיקת אפשרויות שותפות עבור הטרנד: ${trendName}. נציג יחזור אליך בקרוב.`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <Lightbulb className="mr-2 h-6 w-6 text-primary" /> תובנות טרנדים מבוססות AI
          </CardTitle>
          <CardDescription>
            גלה מה חם עכשיו בשוק! המערכת מזהה טרנדים קולינריים וחברתיים על בסיס פעילות משתמשים (חיפושים, שיתופים, העלאות תמונות) ומציעה רעיונות לעסק שלך. עסקים מקבלים התראות וסטטיסטיקות על טרנדים רלוונטיים באזורם.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-4 relative max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                    type="search"
                    placeholder="חפש טרנדים או הצעות..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <p className="text-sm text-muted-foreground p-2 bg-blue-50 border border-blue-200 rounded-md flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>מוצגות הצעות טרנדים מבוססות על נתוני דמה. במערכת חיה, אלו יתעדכנו בזמן אמת ויכללו סטטיסטיקות כמו מספר חיפושים, שיתופים ובקשות דומות לכל טרנד.</span>
            </p>
        </CardContent>
      </Card>

      {filteredInsights.length === 0 && (
        <Card className="text-center py-10">
            <CardContent>
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">לא נמצאו תובנות טרנדים התואמות לחיפוש שלך.</p>
            </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredInsights.map((insight, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-semibold text-primary">{insight.identifiedDishName}</CardTitle>
                {insight.isTrend && (
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/50">
                        <TrendingUp className="mr-1 h-3 w-3"/> טרנד חם
                    </Badge>
                )}
              </div>
              {insight.trendSource && <CardDescription className="text-xs">מקור טרנד (משוער): {insight.trendSource}</CardDescription>}
              <p className="text-sm text-muted-foreground mt-1">{insight.generalSuggestion}</p>
               {/* Mock Statistics */}
              <div className="text-xs text-muted-foreground mt-2 space-x-2 rtl:space-x-reverse">
                <span>אזכורי משתמשים: {Math.floor(Math.random() * 100) + 10}+</span>
                <span>חיפושים אחרונים: {Math.floor(Math.random() * 50) + 5}+</span>
              </div>
            </CardHeader>
            
            {insight.businessOpportunity ? (
              <>
                <CardContent className="space-y-3 pt-0 pb-3 flex-grow">
                  <div className="p-3 rounded-md bg-muted/40 border border-dashed">
                    <h4 className="text-md font-semibold mb-2 text-accent-foreground flex items-center">
                      <Lightbulb className="mr-2 h-4 w-4 text-yellow-500"/> הצעה לעסק שלך:
                    </h4>
                    <p className="text-sm"><strong>שם מוצע למנה:</strong> {insight.businessOpportunity.suggestedItemName}</p>
                    <p className="text-sm"><strong>טווח מחיר מוצע:</strong> {insight.businessOpportunity.suggestedPriceRange}</p>
                    <p className="text-sm"><strong>תיאור מוצע:</strong> <em>{insight.businessOpportunity.suggestedDescription}</em></p>
                    <div className="mt-2">
                      <strong>תגיות מוצעות:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {insight.businessOpportunity.suggestedTags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                      </div>
                    </div>
                    <div className="mt-3 relative aspect-video bg-gray-200 rounded overflow-hidden">
                        <Image 
                            src={`https://placehold.co/300x200.png`} 
                            alt={`AI preview for ${insight.businessOpportunity.suggestedItemName}`}
                            layout="fill" 
                            objectFit="cover"
                            data-ai-hint={insight.businessOpportunity.suggestedItemName?.toLowerCase().split(' ').slice(0,2).join(' ') || "food concept"}
                        />
                        <p className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1 rounded">תצוגת AI (דמו)</p>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2"><strong>נימוק:</strong> {insight.businessOpportunity.rationale}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleQuickAddToMenu(insight.businessOpportunity)} 
                    className="w-full sm:flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4"/> הוסף לתפריט (מהיר)
                  </Button>
                  <Button variant="outline" onClick={() => handleExplorePartnership(insight.identifiedDishName)} className="w-full sm:flex-1">
                    <DollarSign className="mr-2 h-4 w-4" /> חקור שותפות מותג (בקרוב)
                  </Button>
                </CardFooter>
              </>
            ) : (
                <CardContent className="pt-0 pb-3 flex-grow">
                     <p className="text-sm text-muted-foreground text-center py-4">אין הצעה עסקית ספציפית לטרנד זה כרגע.</p>
                </CardContent>
            )}
          </Card>
        ))}
      </div>
       <p className="text-xs text-muted-foreground text-center mt-4">
        תובנות אלו הן המלצות בלבד. עסקים יכולים לבחור לאמץ, לדחות או לערוך כל הצעה. מנות שנוספו דרך "הוספה מהירה" יסומנו כ"בהשראת לקוחות".
      </p>
    </div>
  );
}
