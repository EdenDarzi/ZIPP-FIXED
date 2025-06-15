
'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Home, Utensils, Brain, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Badge } from '@/components/ui/badge';

const Header = () => {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary font-headline">
          SwiftServe
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Button variant="ghost" asChild size="sm">
            <Link href="/" className="flex items-center">
              <Home className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/restaurants" className="flex items-center">
              <Utensils className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Restaurants</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/recommendations" className="flex items-center">
              <Brain className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">AI Recs</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild size="sm">
            <Link href="/courier/open-bids" className="flex items-center">
              <Truck className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Courier Portal</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild size="icon" className="relative">
            <Link href="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login" className="flex items-center">
              <UserCircle className="h-4 w-4 mr-0 sm:mr-2" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
