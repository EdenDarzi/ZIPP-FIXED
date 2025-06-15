
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Zap, CheckCircle, ShieldQuestion } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { DeliveryPreference } from '@/types';

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    itemCount, 
    totalPrice,
    deliveryPreference,
    setDeliveryPreference,
    deliveryFee,
    finalPriceWithDelivery
  } = useCart();

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/restaurants">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  const estimatedPreparationTime = Math.max(15, itemCount * 5); // Mock calculation

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-headline text-primary">Your Shopping Cart</h1>
        <p className="text-lg text-muted-foreground">Review your items and select delivery options.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <Card key={item.menuItemId} className="flex flex-col sm:flex-row items-center p-4 gap-4 shadow-md">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.imageUrl || 'https://placehold.co/100x100.png'}
                  alt={item.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={item.dataAiHint || "food item"}
                />
              </div>
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-foreground">{item.name}</h2>
                <p className="text-sm text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0 my-2 sm:my-0">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)} aria-label="Decrease quantity">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)} aria-label="Increase quantity">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold text-lg text-primary w-20 text-right flex-shrink-0">${(item.price * item.quantity).toFixed(2)}</p>
              <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.menuItemId)} className="text-destructive hover:text-destructive/80 flex-shrink-0" aria-label="Remove item">
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-headline text-primary">Delivery Options</CardTitle>
              <CardDescription>Choose how you&apos;d like your order delivered.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                defaultValue={deliveryPreference} 
                onValueChange={(value) => setDeliveryPreference(value as DeliveryPreference)}
                className="space-y-3"
              >
                <Label htmlFor="arena-delivery" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                  <RadioGroupItem value="arena" id="arena-delivery" className="mr-3" />
                  <div className="flex-grow">
                    <div className="font-semibold flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-accent" /> Delivery Arena (Default)
                    </div>
                    <p className="text-sm text-muted-foreground">Couriers compete for your order, potentially saving you money. Estimated delivery time varies.</p>
                  </div>
                  <span className="font-semibold text-green-600 ml-2">FREE</span>
                </Label>
                <Label htmlFor="fastest-delivery" className="flex items-center p-4 border rounded-md cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                  <RadioGroupItem value="fastest" id="fastest-delivery" className="mr-3" />
                  <div className="flex-grow">
                    <div className="font-semibold flex items-center">
                       <CheckCircle className="h-5 w-5 mr-2 text-primary" /> Fastest Delivery
                    </div>
                    <p className="text-sm text-muted-foreground">Prioritized delivery for the quickest arrival. Fixed additional fee.</p>
                  </div>
                  <span className="font-semibold text-primary ml-2">+$5.00</span>
                </Label>
              </RadioGroup>
              <p className="mt-4 text-sm text-muted-foreground p-3 bg-muted/30 rounded-md flex items-start">
                <ShieldQuestion className="h-5 w-5 mr-2 mt-0.5 text-primary flex-shrink-0" />
                <span>Deliveries in the area are now competing for your order – if you choose Delivery Arena, we&apos;ll find the best option for you. If you&apos;re in a hurry, choose Fastest Delivery!</span>
              </p>
            </CardContent>
          </Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-xl sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Prep Time</span>
                <span className="font-medium">~{estimatedPreparationTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className={`font-medium ${deliveryFee > 0 ? 'text-primary' : 'text-green-600'}`}>
                  {deliveryFee > 0 ? `$${deliveryFee.toFixed(2)}` : 'Free'}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total</span>
                <span>${finalPriceWithDelivery.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button size="lg" asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg">
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" onClick={clearCart} className="w-full">
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
