
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-muted/50 border-t border-border py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-4 mb-2 rtl:space-x-reverse">
          <Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
            <Link href="/terms">תנאי שימוש</Link>
          </Button>
          <Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
            <Link href="/privacy">מדיניות פרטיות</Link>
          </Button>
          <Button variant="link" asChild className="text-muted-foreground hover:text-primary p-0 h-auto">
            <Link href="/support">תמיכה</Link>
          </Button>
        </div>
        <p>&copy; {currentYear} LivePick. כל הזכויות שמורות.</p>
        <p className="mt-1">נוצר באהבה לנוחיותך.</p>
      </div>
    </footer>
  );
};

export default Footer;
