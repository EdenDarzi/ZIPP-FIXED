
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Gift, Share2, Store, TrendingUp, DollarSign, Star, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { AutoTranslateText } from '@/components/translation/auto-translate-text';
import { useLanguage } from '@/context/language-context';

const affiliateBenefits = [
  { icon: DollarSign, titleKey: "affiliate.benefits.earnMoney.title", titleFallback: "Earn Money/Points", descriptionKey: "affiliate.benefits.earnMoney.description", descriptionFallback: "Get rewarded for every order made through your personal link or successful sharing." },
  { icon: Star, titleKey: "affiliate.benefits.earnStars.title", titleFallback: "Earn Stars Faster", descriptionKey: "affiliate.benefits.earnStars.description", descriptionFallback: "Get bonus stars in the SocialDrop program for successful referrals." },
  { icon: Store, titleKey: "affiliate.benefits.personalStore.title", titleFallback: "Personal Recommendations Store", descriptionKey: "affiliate.benefits.personalStore.description", descriptionFallback: "Create a personal page with your favorite products and businesses and share it." },
  { icon: TrendingUp, titleKey: "affiliate.benefits.trackingTools.title", titleFallback: "Tracking Tools", descriptionKey: "affiliate.benefits.trackingTools.description", descriptionFallback: "Track your performance, number of referrals and earnings in a personal dashboard." },
  { icon: Gift, titleKey: "affiliate.benefits.exclusiveBenefits.title", titleFallback: "Exclusive Partner Benefits", descriptionKey: "affiliate.benefits.exclusiveBenefits.description", descriptionFallback: "Access to special promotions, additional discounts and prizes for outstanding partners." },
];

export default function AffiliateProgramPage() {
  const { toast } = useToast();
  const { isRTL } = useLanguage();

  const handleStartNowClick = () => {
    toast({
      title: "Join Affiliate Program",
      description: "Your application has been received! A representative will contact you soon with more details. (Registration process is a demo).",
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <Card className="shadow-xl bg-gradient-to-br from-green-500 via-teal-500 to-blue-500 text-white">
        <CardHeader className="text-center items-center pt-8">
          <Users className="h-16 w-16 mb-4" />
          <AutoTranslateText 
            translationKey="affiliate.title" 
            fallback="ZIPP Affiliate Program"
            as={CardTitle}
            className="text-4xl font-headline"
          />
          <AutoTranslateText 
            translationKey="affiliate.subtitle" 
            fallback="Become a referrer, share your love for ZIPP, and earn rewards!"
            as={CardDescription}
            className="text-xl text-green-100 mt-2"
          />
        </CardHeader>
        <CardContent className="text-center px-6 py-8">
          <AutoTranslateText 
            translationKey="affiliate.description" 
            fallback="Love ZIPP? Why not earn from it? Our affiliate program allows you to recommend businesses and products, and get rewarded for every new customer or order that comes through you."
            as="p"
            className="text-lg mb-8 text-green-50"
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <AutoTranslateText 
            translationKey="affiliate.whyJoin" 
            fallback="Why Should You Join?"
            as={CardTitle}
            className="text-2xl font-semibold text-primary text-center"
          />
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid md:grid-cols-2 gap-4">
            {affiliateBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start p-3 bg-muted/30 rounded-md">
                <benefit.icon className="h-8 w-8 mr-4 text-primary flex-shrink-0 mt-1" />
                <div>
                  <AutoTranslateText 
                    translationKey={benefit.titleKey} 
                    fallback={benefit.titleFallback}
                    as="h3"
                    className="font-semibold text-foreground"
                  />
                  <AutoTranslateText 
                    translationKey={benefit.descriptionKey} 
                    fallback={benefit.descriptionFallback}
                    as="p"
                    className="text-sm text-muted-foreground"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg text-center">
        <CardHeader>
          <AutoTranslateText 
            translationKey="affiliate.howItWorks" 
            fallback="How Does It Work?"
            as={CardTitle}
            className="text-2xl font-semibold text-accent"
          />
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
            <p>1. <Share2 className="inline h-5 w-5 text-primary"/> <AutoTranslateText translationKey="affiliate.step1" fallback="Share: Share links to products, businesses or ZIPP itself." as="strong" /></p>
            <p>2. <Users className="inline h-5 w-5 text-green-500"/> <AutoTranslateText translationKey="affiliate.step2" fallback="Refer: Friends, followers or anyone else looking for an excellent delivery solution." as="strong" /></p>
            <p>3. <DollarSign className="inline h-5 w-5 text-accent"/> <AutoTranslateText translationKey="affiliate.step3" fallback="Earn: Get commissions, points or prizes for every success!" as="strong" /></p>
        </CardContent>
      </Card>

      <Card className="shadow-lg text-center bg-primary/5 border-primary/20">
        <CardHeader>
            <AutoTranslateText 
              translationKey="affiliate.readyToStart" 
              fallback="Ready to Start?"
              as={CardTitle}
              className="text-2xl font-semibold text-accent"
            />
        </CardHeader>
        <CardContent>
            <AutoTranslateText 
              translationKey="affiliate.joinToday" 
              fallback="Join the affiliate program today and start earning by recommending ZIPP!"
              as="p"
              className="text-muted-foreground mb-6"
            />
            <Button size="lg" onClick={handleStartNowClick} className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg shadow-md">
                <AutoTranslateText translationKey="affiliate.becomePartner" fallback="Become a ZIPP Partner" /> <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`}/>
            </Button>
        </CardContent>
         <CardFooter className="justify-center">
           <AutoTranslateText 
             translationKey="affiliate.termsNote" 
             fallback="Full details and program terms are available after registration."
             as="p"
             className="text-xs text-muted-foreground text-center"
           />
        </CardFooter>
      </Card>
    </div>
  );
}
