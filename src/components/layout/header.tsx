
'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Home, Utensils, Brain, Truck, ChefHat, Camera, Languages, Send, HeartPulse } from 'lucide-react'; // Added Camera
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Placeholder for language toggle logic
  const handleLanguageToggle = () => {
    alert("Language toggle clicked. Full i18n setup required for functionality.");
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary font-headline">
          SwiftServe
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/"><span className="flex items-center"><Home className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">בית</span></span></Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/restaurants"><span className="flex items-center"><Utensils className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">מסעדות</span></span></Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/send-package"><span className="flex items-center"><Send className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">שלח חבילה</span></span></Link>
          </Button>
           <Button variant="ghost" asChild size="sm">
            <Link href="/visual-search"><span className="flex items-center"><Camera className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">חיפוש חזותי</span></span></Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/nutritional-advisor"><span className="flex items-center"><HeartPulse className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">יועץ תזונה</span></span></Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/recommendations"><span className="flex items-center"><Brain className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">המלצות AI</span></span></Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/courier/open-bids"><span className="flex items-center"><Truck className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">שליחים</span></span></Link>
          </Button>
           <Button variant="ghost" asChild size="sm">
            <Link href="/restaurant-admin"><span className="flex items-center"><ChefHat className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">ניהול עסק</span></span></Link>
          </Button>
          <Button variant="ghost" asChild size="icon" className="relative">
            <Link href="/cart" aria-label="Cart"><span className="relative flex items-center justify-center w-full h-full">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </span></Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login"><span className="flex items-center"><UserCircle className="h-4 w-4 mr-0 sm:mr-2" /><span className="hidden sm:inline">כניסה</span></span></Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLanguageToggle} className="flex items-center" aria-label="Toggle language">
            <span className="flex items-center">
                <Languages className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">EN</span>
            </span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
