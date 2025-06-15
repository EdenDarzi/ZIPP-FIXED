
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { identifyDishFromImage, IdentifyDishInput, IdentifyDishOutput } from '@/ai/flows/identify-dish-flow';
import { Camera, ImageUp, Loader2, Sparkles, Utensils, Share2 } from 'lucide-react'; // Added Share2
import Image from 'next/image';
import { Label } from '@/components/ui/label';

export default function VisualSearchPage() {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<IdentifyDishOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
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
        setImagePreview(dataUri); // For display
        setImageDataUri(dataUri); // For sending to AI
        setAiResponse(null); // Clear previous response
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageDataUri) {
      toast({ title: 'לא נבחרה תמונה', description: 'אנא העלה/י תמונה לחיפוש.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    try {
      const input: IdentifyDishInput = { imageDataUri, userQuery };
      const result = await identifyDishFromImage(input);
      setAiResponse(result);
    } catch (error) {
      console.error('Error identifying dish:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן היה לקבל הצעות לתמונה. אנא נסה/י שוב.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareResults = () => {
    if (!aiResponse) return;
    // const shareText = `Look what I found with SwiftServe Visual Search! Identified: ${aiResponse.identifiedDishName}. Suggestions: ${aiResponse.suggestedText}`;
    // const shareUrl = window.location.href; // Or a specific link to the results if available
    toast({
      title: "שיתוף תוצאות (דמו)",
      description: "תוצאות החיפוש החזותי שותפו!",
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <Camera className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">חיפוש מנות חזותי</CardTitle>
          <CardDescription>
            יש לך תמונה של משהו טעים? העלה/י אותה, וה-AI שלנו ינסה לזהות ולהציע פריטים דומים ב-SwiftServe!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="imageUpload" className="mb-2 block text-sm font-medium text-foreground">העלה/י תמונת אוכל</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" // Adjusted for RTL
            />
             <p className="text-xs text-muted-foreground mt-1">גודל קובץ מקסימלי: 4MB.</p>
          </div>

          {imagePreview && (
            <div className="mt-4 border rounded-lg overflow-hidden shadow-inner">
              <Image src={imagePreview} alt="תצוגה מקדימה של תמונת אוכל שהועלתה" width={500} height={300} objectFit="contain" className="mx-auto max-h-[300px]" data-ai-hint="food image preview"/>
            </div>
          )}

          <div>
            <Label htmlFor="userQuery" className="mb-2 block text-sm font-medium text-foreground">אופציונלי: מה את/ה מחפש/ת?</Label>
            <Textarea
              id="userQuery"
              placeholder="לדוגמה: 'האם זה חריף?', 'מצא אפשרויות טבעוניות כמו זו', 'איזה מטבח זה?'"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading || !imageDataUri} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg">
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-5 w-5 animate-spin" /> מנתח תמונה...
              </>
            ) : (
              <>
                <Sparkles className="ml-2 h-5 w-5" /> קבל הצעות AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {aiResponse && (
        <Card className="shadow-lg animate-fadeIn bg-muted/30">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center text-xl text-primary font-headline">
              <Utensils className="ml-2 h-6 w-6" /> תוצאת ניתוח AI
            </CardTitle>
             <Button variant="outline" size="icon" onClick={handleShareResults}>
                <Share2 className="h-5 w-5" />
                <span className="sr-only">שתף תוצאות</span>
              </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="text-lg font-semibold">{aiResponse.identifiedDishName}</h3>
            <p className="text-foreground/90 whitespace-pre-wrap">{aiResponse.suggestedText}</p>
            <p className="text-xs text-muted-foreground pt-2">
                טיפ: תוכל/י להשתמש בשם המנה שזוהתה או במילות מפתח מההצעות בשורת החיפוש הראשית כדי למצוא פריטים ב-SwiftServe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
