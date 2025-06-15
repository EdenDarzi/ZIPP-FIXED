
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Lightbulb, TrendingUp, ThumbsUp, Search, PlusCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { IdentifyDishOutput } from '@/ai/flows/identify-dish-flow'; // Assuming schema is defined and exported


// Mock data for trending insights - in a real app, this would come from the backend/AI system
const mockTrendingInsights: IdentifyDishOutput[] = [
  {
    identifiedDishName: "Korean Corndogs with Cheese Pull",
    isTrend: true,
    trendSource: "TikTok & Instagram",
    generalSuggestion: "Users are loving the dramatic cheese pull! Similar items can be found by searching 'gourmet hotdogs' or 'fried cheese snacks'.",
    businessOpportunity: {
      suggestedItemName: "The Ultimate SwiftServe Cheesy Corndog",
      suggestedPriceRange: "₪28-₪35",
      suggestedDescription: "Crispy panko-crusted corndog with a molten mozzarella center, perfect for that satisfying cheese pull. Served with your choice of dipping sauce.",
      suggestedTags: ["New", "TikTok Viral", "Cheesy", "Street Food"],
      rationale: "High social media engagement and visually appealing. Could attract younger audiences and impulse buys."
    }
  },
  {
    identifiedDishName: "Spicy Ramen Challenge Bowl",
    isTrend: true,
    trendSource: "YouTube & Social Challenges",
    generalSuggestion: "The 'spicy challenge' trend continues. Users looking for extreme heat can explore our spiciest ramen options.",
    businessOpportunity: {
      suggestedItemName: "Inferno Noodle Challenge",
      suggestedPriceRange: "₪45-₪55 (includes a small milk)",
      suggestedDescription: "Dare to try our hottest ramen ever? Packed with ghost peppers and a secret spice blend. Finish it and get your photo on our Wall of Flame!",
      suggestedTags: ["Challenge", "Spicy", "Ramen", "Limited Time Offer"],
      rationale: "Drives engagement and user-generated content. Great for social media marketing."
    }
  },
  {
    identifiedDishName: "Dalgona Coffee (Whipped Coffee)",
    isTrend: true,
    trendSource: "TikTok (Past Trend, Recurring Interest)",
    generalSuggestion: "A nostalgic trend that still sees searches. Offer a gourmet version or a seasonal twist.",
    businessOpportunity: {
      suggestedItemName: "Cloud Nine Whipped Latte",
      suggestedPriceRange: "₪18-₪24",
      suggestedDescription: "Velvety smooth whipped coffee layered over iced milk, with a hint of vanilla and caramel drizzle. An elevated classic.",
      suggestedTags: ["Coffee", "Trendy Drink", "Instagrammable"],
      rationale: "Easy to prepare, high-profit margin, and visually appealing for social sharing. Appeals to coffee lovers looking for something different."
    }
  },
  {
    identifiedDishName: "Avocado Toast (Artisanal)",
    isTrend: false, // Example of something not flagged as a *new* viral trend but still relevant
    generalSuggestion: "A perennial favorite. SwiftServe offers many cafes with great avocado toast options. Users can filter by 'breakfast' or 'cafe'.",
    // No specific new businessOpportunity here as it's already common
  }
];


export default function TrendingInsightsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [insights, setInsights] = useState<IdentifyDishOutput[]>(mockTrendingInsights);

  // In a real app, you'd fetch these insights or subscribe to updates.
  // useEffect(() => {
  //   // fetchInsights().then(setInsights);
  // }, []);

  const handleQuickAddToMenu = (suggestion: IdentifyDishOutput['businessOpportunity']) => {
    if (!suggestion) return;
    toast({
      title: "מוצר נוסף לתפריט (דמו)",
      description: `"${suggestion.suggestedItemName}" נוסף לתפריט שלך עם תיוג 'בהשראת לקוחות'. ניתן לערוך אותו בדף ניהול המוצרים.`,
      action: <ThumbsUp className="text-green-500" />,
    });
    // In a real app, this would either:
    // 1. Directly add a new menu item to the backend.
    // 2. Pre-fill the "Add New Item" form on the menu management page.
  };
  
  const filteredInsights = insights.filter(insight => 
    (insight.identifiedDishName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (insight.businessOpportunity?.suggestedItemName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (insight.trendSource?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center">
            <Lightbulb className="mr-2 h-6 w-6 text-primary" /> תובנות טרנדים מבוססות AI
          </CardTitle>
          <CardDescription>
            גלה מה חם עכשיו בשוק! המערכת מזהה טרנדים קולינריים וחברתיים על בסיס פעילות משתמשים (חיפושים, שיתופים, העלאות תמונות) ומציעה רעיונות לעסק שלך.
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
             <p className="text-sm text-muted-foreground">
              מוצגות הצעות טרנדים מבוססות על נתוני דמה. במערכת חיה, אלו יתעדכנו בזמן אמת.
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
                            src={`https://placehold.co/300x200.png?text=AI+Preview`} 
                            alt="AI generated preview" 
                            layout="fill" 
                            objectFit="cover"
                            data-ai-hint="ai generated food image concept"
                        />
                        <p className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1 rounded">תצוגת AI (דמו)</p>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2"><strong>נימוק:</strong> {insight.businessOpportunity.rationale}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button 
                    onClick={() => handleQuickAddToMenu(insight.businessOpportunity)} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4"/> הוסף לתפריט (הוספה מהירה - דמו)
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
        תובנות אלו הן המלצות בלבד. עסקים יכולים לבחור לאמץ, לדחות או לערוך כל הצעה.
      </p>
    </div>
  );
}
