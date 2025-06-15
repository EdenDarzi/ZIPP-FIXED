
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { identifyDishFromImage, IdentifyDishInput, IdentifyDishOutput } from '@/ai/flows/identify-dish-flow';
import { Camera, ImageUp, Loader2, Sparkles, Utensils } from 'lucide-react';
import Image from 'next/image';

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
          title: "Image too large",
          description: "Please upload an image smaller than 4MB.",
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
      toast({ title: 'No image selected', description: 'Please upload an image to search.', variant: 'destructive' });
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
        title: 'Error',
        description: 'Could not get suggestions for the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <Camera className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">Visual Dish Search</CardTitle>
          <CardDescription>
            Got a picture of something tasty? Upload it, and our AI will try to identify it and suggest similar items on SwiftServe!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="imageUpload" className="mb-2 block text-sm font-medium text-foreground">Upload Food Image</Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
             <p className="text-xs text-muted-foreground mt-1">Max file size: 4MB.</p>
          </div>

          {imagePreview && (
            <div className="mt-4 border rounded-lg overflow-hidden shadow-inner">
              <Image src={imagePreview} alt="Uploaded food preview" width={500} height={300} objectFit="contain" className="mx-auto max-h-[300px]" data-ai-hint="food image preview"/>
            </div>
          )}

          <div>
            <Label htmlFor="userQuery" className="mb-2 block text-sm font-medium text-foreground">Optional: What are you looking for?</Label>
            <Textarea
              id="userQuery"
              placeholder="e.g., 'Is this spicy?', 'Find vegan options like this', 'What cuisine is this?'"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading || !imageDataUri} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Image...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" /> Get AI Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {aiResponse && (
        <Card className="shadow-lg animate-fadeIn bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-primary font-headline">
              <Utensils className="mr-2 h-6 w-6" /> AI Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="text-lg font-semibold">{aiResponse.identifiedDishName}</h3>
            <p className="text-foreground/90 whitespace-pre-wrap">{aiResponse.suggestedText}</p>
            <p className="text-xs text-muted-foreground pt-2">
                Tip: You can use the identified dish name or keywords from the suggestions in the main search bar to find items on SwiftServe.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
