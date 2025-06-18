
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { identifyDishFromImage, IdentifyDishInputType, IdentifyDishOutputType } from '@/ai/flows/identify-dish-flow';
import { Camera, ImageUp, Loader2, Sparkles, Utensils, Share2, TrendingUp, Info, Star } from 'lucide-react';
import Image from 'next/image';
import { Label } from '@/components/ui/label'; 
import { Badge } from '@/components/ui/badge';

export default function AiTrendScannerPage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<IdentifyDishOutputType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { 
        toast({
          title: "התמונה גדולה מדי",
          description: "אנא העלה/י תמונה קטנה מ-4MB.",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        setImageDataUri(dataUri);
        setAiResponse(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageDataUri) {
      toast({ title: 'לא נבחרה תמונה', description: 'אנא העלה/י תמונה לזיהוי הטרנד.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const input: IdentifyDishInputType = { imageDataUri, userQuery };
      const result = await identifyDishFromImage(input); 
      setAiResponse(result);
      if (!result.identifiedDishName || result.identifiedDishName === "לא זוהתה מנה") {
        toast({ title: "לא הצלחנו לזהות", description: "לא הצלחנו לזהות את המנה בתמונה. נסה תמונה ברורה יותר.", variant: "default" });
      }
    } catch (error) {
      console.error('Error identifying dish trend:', error);
      toast({
        title: 'שגיאה בניתוח הטרנד',
        description: 'לא ניתן היה לנתח את התמונה. אנא נסה/י שוב.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareResults = () => {
    if (!aiResponse) return;
    toast({
      title: "שיתוף ממצאי טרנד",
      description: `זיהוי: ${aiResponse.identifiedDishName}. הצעה כללית: ${aiResponse.generalSuggestion.substring(0,50)}... (הדגמה של תהליך שיתוף).`,
    });
  };

  const handlePostToMyCorner = () => {
    if(!aiResponse) return;
    toast({
        title: "פרסום ב'פינה שלי'",
        description: `התגלית שלך "${aiResponse.identifiedDishName}" תשותף ב'פינה' האישית שלך. צבור עוקבים וזכה בקופונים! (הדגמה של פונקציונליות זו).`,
        action: <Star className="text-yellow-500"/>
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">LivePick TrendScanner - מנוע הטרנדים</CardTitle>
          <CardDescription>
            ראית טרנד קולינרי בטיקטוק או באינסטגרם? העלה/י תמונה, וה-AI שלנו ינסה לזהות אותו, להציע איפה למצוא משהו דומה, או אפילו לתת רעיונות לעסקים! תמונות שאתה מעלה עוזרות למערכת לזהות טרנדים לכל הקהילה ומקדמות אותך ב'פינה' האישית שלך.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="imageUpload" className="mb-2 block text-sm font-medium text-foreground">העלה/י תמונת טרנד אוכל</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 rtl:file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              aria-label="העלה תמונת טרנד אוכל"
            />
             <p className="text-xs text-muted-foreground mt-1">גודל קובץ מקסימלי: 4MB.</p>
          </div>

          {imagePreview && (
            <div className="mt-4 border rounded-lg overflow-hidden shadow-inner bg-muted/20">
              <Image src={imagePreview} alt="תצוגה מקדימה של תמונת טרנד" width={500} height={300} objectFit="contain" className="mx-auto max-h-[300px]" data-ai-hint="food trend image preview"/>
            </div>
          )}

          <div>
            <Label htmlFor="userQuery" className="mb-2 block text-sm font-medium text-foreground">הערות או שאלות לגבי הטרנד (אופציונלי)</Label>
            <Textarea
              id="userQuery"
              placeholder="לדוגמה: 'מאיזה מטבח זה?', 'יש לזה גרסה טבעונית?', 'האם זה פופולרי בישראל?'"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="min-h-[80px]"
              aria-label="הערות או שאלות לגבי הטרנד"
            />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading || !imageDataUri} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" aria-label="זהה טרנד והצע לי">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> סורק טרנדים...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" /> זהה טרנד והצע לי
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {aiResponse && (
        <Card className="shadow-lg animate-fadeInUp bg-muted/30">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center text-xl text-primary font-headline">
              <Utensils className="mr-2 h-6 w-6" /> ממצאי TrendScanner:
            </CardTitle>
             <Button variant="outline" size="icon" onClick={handleShareResults} aria-label="שתף ממצאים">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">שתף ממצאים</span>
              </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="text-lg font-semibold">{aiResponse.identifiedDishName}</h3>
            {aiResponse.isTrend && <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/50"><TrendingUp className="mr-1 h-3 w-3"/> טרנד {aiResponse.trendSource ? `מזוהה מ-${aiResponse.trendSource}` : 'מזוהה'}</Badge>}
            <p className="text-foreground/90 whitespace-pre-wrap">{aiResponse.generalSuggestion}</p>
            
            {aiResponse.businessOpportunity && (
              <div className="mt-4 p-3 border border-dashed border-green-500 rounded-md bg-green-50/50">
                <h4 className="text-md font-semibold text-green-700 flex items-center">
                  <Info className="mr-2 h-4 w-4"/> הצעה לעסקים ב-LivePick:
                </h4>
                <p className="text-sm text-green-600"><strong>שם מוצע למנה:</strong> {aiResponse.businessOpportunity.suggestedItemName}</p>
                <p className="text-sm text-green-600"><strong>טווח מחירים מוצע:</strong> {aiResponse.businessOpportunity.suggestedPriceRange}</p>
                <p className="text-sm text-green-600"><strong>תיאור לדוגמה:</strong> <em>{aiResponse.businessOpportunity.suggestedDescription}</em></p>
                <div className="mt-1">
                  <strong className="text-sm text-green-600">תגיות מוצעות:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {aiResponse.businessOpportunity.suggestedTags.map(tag => <Badge key={tag} variant="outline" className="border-green-400 text-green-700">{tag}</Badge>)}
                  </div>
                </div>
                 <div className="mt-2 relative aspect-video bg-gray-200 rounded overflow-hidden">
                    <Image 
                        src={`https://placehold.co/300x200.png`} 
                        alt={`AI preview for ${aiResponse.businessOpportunity.suggestedItemName}`}
                        layout="fill" 
                        objectFit="cover"
                        data-ai-hint={aiResponse.businessOpportunity.suggestedItemName?.toLowerCase().split(' ').slice(0,2).join(' ') || "food concept"}
                    />
                    <p className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1 rounded">תצוגת AI (הדגמה)</p>
                </div>
                <p className="text-xs text-green-500 mt-2"><strong>נימוק:</strong> {aiResponse.businessOpportunity.rationale}</p>
              </div>
            )}
            <p className="text-xs text-muted-foreground pt-2">
                טיפ: השתמש/י בשם המנה או במילות מפתח מההצעה כדי לחפש ב-LivePick.
            </p>
          </CardContent>
           <CardFooter className="pt-3 border-t">
              <Button onClick={handlePostToMyCorner} variant="outline" className="w-full" aria-label="הוסף לפינה שלי ושתף">
                <Camera className="mr-2 h-4 w-4" /> הוסף ל'פינה שלי' ושתף
              </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
