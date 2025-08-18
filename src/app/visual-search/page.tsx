
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { identifyDishFromImage, IdentifyDishInputType, IdentifyDishOutputType } from '@/ai/flows/identify-dish-flow';
import { Camera, ImageUp, Loader2, Sparkles, Utensils, Share2, TrendingUp, Info, Star, Youtube, Facebook, Instagram, Link as LinkIcon, Video, UploadCloud, Film, Building, SearchIcon as SearchIconLucide } from 'lucide-react';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

interface SuggestedBusiness {
  name: string;
  reason: string;
  mockRestaurantId: string;
  imageUrl?: string;
  dataAiHint?: string;
}

const mockTrendingVideos = [
  { id: 'vid1', titleKey: 'trendScanner.video1', titleFallback: 'Viral Pancake Donut', source: 'TikTok', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'pancake donut trend' },
  { id: 'vid2', titleKey: 'trendScanner.video2', titleFallback: 'Stretchy Cheese Challenge', source: 'Instagram Reels', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'cheese pull challenge' },
  { id: 'vid3', titleKey: 'trendScanner.video3', titleFallback: 'Special 3-Layer Iced Coffee', source: 'YouTube Shorts', imageUrl: 'https://placehold.co/300x200.png', dataAiHint: 'layered iced coffee' },
];

export default function AiTrendScannerPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null); // For video file name or simple preview
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null); // Will behave like image for now
  const [trendDescription, setTrendDescription] = useState('');
  const [userQuery, setUserQuery] = useState(''); // Kept for specific questions
  const [aiResponse, setAiResponse] = useState<IdentifyDishOutputType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'image' | 'video' | 'text'>('image');

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // Increased limit for video, but still a frontend check
        toast({
          title: "File too large",
          description: `Please upload a file smaller than 10MB. (${fileType === 'image' ? 'Image' : 'Video'})`,
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        if (fileType === 'image') {
          setImagePreview(dataUri);
          setImageDataUri(dataUri);
          setVideoPreview(null);
          setVideoDataUri(null);
        } else {
          setVideoPreview(file.name); // Show file name for video
          setVideoDataUri(dataUri); // Will be treated as image by AI for now
          setImagePreview(null);
          setImageDataUri(null);
        }
        setAiResponse(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageDataUri && !videoDataUri && !trendDescription.trim()) {
      toast({ title: 'No input provided', description: 'Please upload an image, video or describe the trend.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setAiResponse(null);
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const input: IdentifyDishInputType = {
        imageDataUri: activeTab === 'image' && imageDataUri ? imageDataUri : undefined,
        videoDataUri: activeTab === 'video' && videoDataUri ? videoDataUri : undefined, // AI will treat as image for now
        trendDescription: trendDescription || undefined,
        userQuery: userQuery || undefined,
      };
      const result = await identifyDishFromImage(input);
      setAiResponse(result);
      if (!result.identifiedDishName || result.identifiedDishName === "לא זוהתה מנה" && (!result.suggestedBusinesses || result.suggestedBusinesses.length === 0)) {
        toast({ title: "No matches found", description: "Try clearer input or change the description.", variant: "default" });
      }
    } catch (error) {
      console.error('Error identifying dish trend:', error);
      toast({
        title: 'Trend analysis error',
        description: 'Could not analyze the input. Please try again.',
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
      description: `זיהוי: ${aiResponse.identifiedDishName}. מספר עסקים מומלצים: ${aiResponse.suggestedBusinesses?.length || 0}. (תהליך שיתוף מדומה).`,
    });
  };
  
  const handlePostToMyCorner = () => {
    if(!aiResponse) return;
    toast({
        title: "פרסום ב'פינה שלי'",
        description: `התגלית שלך "${aiResponse.identifiedDishName}" תשותף ב'פינה' האישית שלך. צבור עוקבים וזכה בקופונים! (פונקציונליות מדומה).`,
        action: <Star className="text-yellow-500"/>
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-3" />
          <CardTitle className="text-3xl font-headline text-primary">
            <AutoTranslateText 
              translationKey="trendScanner.title" 
              fallback="ZIPP TrendScanner - Trend Engine"
            />
          </CardTitle>
          <CardDescription>
            <AutoTranslateText 
              translationKey="trendScanner.description" 
              fallback="Saw a culinary trend? Upload an image, short video, or describe it, and our AI will try to find businesses on ZIPP offering something similar! Your contribution helps the community discover the next hot thing."
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-3 text-accent">
              <AutoTranslateText 
                translationKey="trendScanner.hotTrends" 
                fallback="Discover Hot Trends (TikTok Demo)"
              />
            </h3>
            <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-muted/30">
              {mockTrendingVideos.map(vid => (
                <Card key={vid.id} className="min-w-[180px] max-w-[180px] flex-shrink-0 shadow-md hover:shadow-lg transition-shadow">
                  <div className="relative h-24 w-full">
                    <Image src={vid.imageUrl} alt={vid.title} fill style={{objectFit: 'cover'}} className="rounded-t-md" data-ai-hint={vid.dataAiHint} />
                    <Badge variant="destructive" className="absolute top-1 right-1 text-xs px-1.5 py-0.5">{vid.source}</Badge>
                  </div>
                  <CardContent className="p-2">
                    <p className="text-xs font-medium truncate">
                      <AutoTranslateText 
                        translationKey={vid.titleKey} 
                        fallback={vid.titleFallback}
                      />
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
             <p className="text-xs text-muted-foreground mt-2">
               <AutoTranslateText 
                 translationKey="trendScanner.demoNote" 
                 fallback="(This carousel is for demonstration only. Full integration for TikTok discovery and playback will be developed later)"
               />
             </p>
          </div>
          <Separator />

          <div className="mb-4">
            <Label className="text-base font-semibold text-foreground">
              <AutoTranslateText 
                translationKey="trendScanner.whatTrend" 
                fallback="What trend would you like to find?"
              />
            </Label>
            <div className="flex border-b mt-2">
              {([
                ['image', 'trendScanner.uploadImage', 'Upload Image', ImageUp], 
                ['video', 'trendScanner.uploadVideo', 'Upload Video', Film], 
                ['text', 'trendScanner.describeTrend', 'Describe Trend', SearchIconLucide]
              ] as const).map(([tabKey, tabLabelKey, tabLabelFallback, Icon]) => (
                <Button
                  key={tabKey}
                  variant="ghost"
                  onClick={() => setActiveTab(tabKey)}
                  className={cn(
                    "flex-1 rounded-none border-b-2",
                    activeTab === tabKey ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                  )}
                >
                  <Icon className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
                  <AutoTranslateText 
                    translationKey={tabLabelKey} 
                    fallback={tabLabelFallback}
                  />
                </Button>
              ))}
            </div>
          </div>
          
          {activeTab === 'image' && (
            <div className="space-y-3 animate-fadeIn">
              <Label htmlFor="imageUpload" className="mb-1 block text-sm font-medium text-foreground">
                <AutoTranslateText 
                  translationKey="trendScanner.selectImage" 
                  fallback="Select image file"
                />
              </Label>
              <Input
                id="imageUpload"
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'image')}
                className="file:mr-4 rtl:file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
              {imagePreview && (
                <div className="mt-3 border rounded-lg overflow-hidden shadow-inner bg-muted/20">
                  <Image src={imagePreview} alt="Trend image preview" width={500} height={300} objectFit="contain" className="mx-auto max-h-[250px]" data-ai-hint="food trend image preview"/>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-3 animate-fadeIn">
              <Label htmlFor="videoUpload" className="mb-1 block text-sm font-medium text-foreground">
                <AutoTranslateText 
                  translationKey="trendScanner.selectVideo" 
                  fallback="Select video file (short)"
                />
              </Label>
              <Input
                id="videoUpload"
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                className="file:mr-4 rtl:file:ml-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
              />
               <p className="text-xs text-muted-foreground">
                 <AutoTranslateText 
                   translationKey="trendScanner.videoNote" 
                   fallback="AI will currently analyze a frame from the video as an image. Full video upload and analysis will be supported in the future."
                 />
               </p>
              {videoPreview && (
                <div className="mt-3 p-3 border rounded-lg bg-muted/20 text-center">
                  <Film className="h-8 w-8 mx-auto text-primary mb-1"/>
                  <p className="text-sm text-foreground">
                    <AutoTranslateText 
                      translationKey="trendScanner.videoSelected" 
                      fallback="Video file selected:"
                    /> <span className="font-medium">{videoPreview}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <AutoTranslateText 
                      translationKey="trendScanner.videoPreviewNote" 
                      fallback="(Video preview will be added)"
                    />
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'text' && (
            <div className="space-y-3 animate-fadeIn">
              <Label htmlFor="trendDescriptionInput" className="mb-1 block text-sm font-medium text-foreground">
                <AutoTranslateText 
                  translationKey="trendScanner.describeTrendLabel" 
                  fallback="Describe the trend or dish"
                />
              </Label>
              <Textarea
                id="trendDescriptionInput"
                placeholder="Example: 'Pink vodka sauce pasta with burrata', 'Matcha drink with oat milk and pistachio syrup', 'Spicy ramen with soft egg and ground meat'"
                value={trendDescription}
                onChange={(e) => setTrendDescription(e.target.value)}
                className="min-h-[100px]"
                aria-label="Trend or dish description"
              />
            </div>
          )}
          
          <div className="mt-4">
            <Label htmlFor="userQuery" className="mb-1 block text-sm font-medium text-foreground">
              <AutoTranslateText 
                translationKey="trendScanner.additionalNotes" 
                fallback="Additional notes or questions (optional)"
              />
            </Label>
            <Textarea
              id="userQuery"
              placeholder="Example: 'Is there a vegan version?', 'Where is it most popular?', 'Suitable for hosting?'"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="min-h-[60px]"
              aria-label="Additional notes or questions"
            />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading || (!imageDataUri && !videoDataUri && !trendDescription.trim())} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg mt-6 py-3" aria-label="Find businesses with this trend">
            {isLoading ? (
              <><Loader2 className={`h-5 w-5 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} /> <AutoTranslateText translationKey="trendScanner.searching" fallback="Searching for matches..." /></>
            ) : (
              <><SearchIconLucide className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} /> <AutoTranslateText translationKey="trendScanner.findBusinesses" fallback="Find businesses with this trend!" /></>
            )}
          </Button>
        </CardContent>
      </Card>

      {aiResponse && (
        <Card className="shadow-lg animate-fadeInUp bg-muted/30">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="flex items-center text-xl text-primary font-headline">
              <Utensils className={`h-6 w-6 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
              <AutoTranslateText 
                translationKey="trendScanner.results" 
                fallback="TrendScanner Results:"
              />
            </CardTitle>
             <Button variant="outline" size="icon" onClick={handleShareResults} aria-label="Share findings">
                <Share2 className="h-5 w-5" />
              </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <h3 className="text-lg font-semibold">
              <AutoTranslateText 
                translationKey="trendScanner.identification" 
                fallback="Trend/Dish Identification (Estimated):"
              /> {aiResponse.identifiedDishName}
            </h3>
            {aiResponse.isTrend && <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/50"><TrendingUp className="mr-1 h-3 w-3"/> טרנד {aiResponse.trendSource ? `מזוהה מ-${aiResponse.trendSource}` : 'מזוהה'}</Badge>}
            
            {aiResponse.suggestedBusinesses && aiResponse.suggestedBusinesses.length > 0 ? (
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground flex items-center">
                  <Building className={`h-4 w-4 text-green-600 ${isRTL ? 'ml-2' : 'mr-2'}`}/> 
                  <AutoTranslateText 
                    translationKey="trendScanner.recommendedBusinesses" 
                    fallback="Recommended businesses on ZIPP offering this trend (demo):"
                  />
                </h4>
                {aiResponse.suggestedBusinesses.map((biz, idx) => (
                  <Card key={idx} className="p-3 bg-background shadow-sm">
                    <div className="flex items-start gap-3">
                       <Image src={biz.imageUrl || `https://placehold.co/80x80.png`} alt={biz.name} width={60} height={60} className="rounded-md border" data-ai-hint={biz.dataAiHint || "restaurant logo"} />
                       <div>
                            <Link href={`/restaurants/${biz.mockRestaurantId}`} className="text-md font-semibold text-primary hover:underline">{biz.name}</Link>
                            <p className="text-xs text-muted-foreground">{biz.reason}</p>
                       </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                <AutoTranslateText 
                  translationKey="trendScanner.noBusinessesFound" 
                  fallback="No businesses currently found on ZIPP offering an exact match for this trend. Try searching for related terms!"
                />
              </p>
            )}

            {aiResponse.businessOpportunity && (
              <div className="mt-4 p-3 border border-dashed border-orange-500 rounded-md bg-orange-50/50">
                <h4 className="text-md font-semibold text-orange-700 flex items-center">
                  <Info className="mr-2 h-4 w-4"/> הזדמנות עסקית לבעלי עסקים ב-ZIPP:
                </h4>
                <p className="text-sm text-orange-600"><strong>שם מוצע למנה:</strong> {aiResponse.businessOpportunity.suggestedItemName}</p>
                <p className="text-sm text-orange-600"><strong>תיאור לדוגמה:</strong> <em>{aiResponse.businessOpportunity.suggestedDescription}</em></p>
              </div>
            )}
             <p className="text-xs text-muted-foreground pt-2">
                {aiResponse.generalSuggestion}
            </p>
          </CardContent>
           <CardFooter className="pt-3 border-t">
              <Button onClick={handlePostToMyCorner} variant="outline" className="w-full" aria-label="Add to My Corner and share">
                <Camera className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
                <AutoTranslateText 
                  translationKey="trendScanner.addToCorner" 
                  fallback="Add to 'My Corner' and share"
                />
              </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
    