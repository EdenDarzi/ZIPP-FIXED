
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShoppingCart, UserCircle, HomeIcon, Navigation } from 'lucide-react'; // Added HomeIcon
import { useLanguage } from '@/context/language-context';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  return (
    <footer className="bg-muted/60 border-t border-border py-8 text-center text-muted-foreground shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-3">ZIPP</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/about">{t('footer.about')}</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/careers">{t('footer.careers')}</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/blog">{t('footer.blog')}</Link></Button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.support')}</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/support">{t('footer.help')}</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/terms">{t('footer.terms')}</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/privacy">{t('footer.privacy')}</Link></Button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.joinUs')}</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/restaurant-admin">{t('footer.business')}</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/courier/dashboard">{t('footer.couriers')}</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/affiliate">{t('footer.partners')}</Link></Button></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 mb-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm">
            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                <Link href="/support" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4"/> {t('footer.contact')}
                </Link>
            </Button>
            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                <Link href="/restaurants" className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4"/> {t('footer.orderNow')}
                </Link>
            </Button>
             <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                <Link href="/order-tracking/mockOrder_example" className="flex items-center gap-1">
                    <Navigation className="h-4 w-4"/> {t('footer.trackOrder')}
                </Link>
            </Button>
        </div>

        <p className="text-xs">{t('footer.copyright', { year: currentYear })}</p>
        <p className="text-xs mt-2 text-muted-foreground/60">{t('footer.tagline')}</p>
      </div>
    </footer>
  );
};

export default Footer;
