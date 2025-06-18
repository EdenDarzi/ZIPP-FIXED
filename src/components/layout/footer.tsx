
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare, ShoppingCart, UserCircle, HomeIcon } from 'lucide-react'; // Added HomeIcon

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted/60 border-t border-border py-8 text-center text-muted-foreground shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-3">LivePick</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/about">אודותינו (בקרוב)</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/careers">קריירה (בקרוב)</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/blog">בלוג (בקרוב)</Link></Button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">שירות לקוחות</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/support">מרכז התמיכה</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/terms">תנאי שימוש</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/privacy">מדיניות פרטיות</Link></Button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">הצטרפו אלינו</h4>
            <ul className="space-y-1">
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/restaurant-admin">עסקים: הירשמו ל-LivePick</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/courier/dashboard">שליחים: הצטרפו לצוות</Link></Button></li>
              <li><Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto"><Link href="/affiliate">תוכנית שותפים</Link></Button></li>
            </ul>
          </div>
        </div>
        
        {/* Enhanced Mini-Footer Links - these could be part of a floating bar in a more complex setup */}
        <div className="border-t border-border pt-6 mb-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-sm">
            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                <Link href="/support" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4"/> יצירת קשר
                </Link>
            </Button>
            <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                <Link href="/restaurants" className="flex items-center gap-1">
                    <ShoppingCart className="h-4 w-4"/> הזמן עכשיו
                </Link>
            </Button>
             <Button variant="link" size="sm" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
                <Link href="/order-tracking/mockOrder_example" className="flex items-center gap-1"> {/* Example link */}
                    <UserCircle className="h-4 w-4"/> עקוב אחר הזמנה
                </Link>
            </Button>
        </div>

        <p className="text-xs">&copy; {currentYear} LivePick. כל הזכויות שמורות.</p>
        <p className="text-xs mt-1">נוצר באהבה לנוחיותך, עם קורטוב של AI.</p>
      </div>
    </footer>
  );
};

export default Footer;
