
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock, ShoppingBag, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const { cart, itemCount, finalPriceWithDelivery, deliveryPreference, deliveryFee, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();

  if (itemCount === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline text-primary mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Add some items to your cart before proceeding to checkout.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/restaurants">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  const handleMockPayment = () => {
    // Simulate payment processing
    toast({
      title: "Payment Successful (Mock)",
      description: "Your order is being processed!",
    });

    // Create a mock order ID
    const mockOrderId = `mockOrder${Date.now()}`;
    
    // In a real app, you would save the order to a database here.
    // For now, we'll just navigate.

    // Clear cart after successful "payment"
    // clearCart(); // Optional: clear cart now or after viewing order status

    router.push(`/order-tracking/${mockOrderId}`);
  };


  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Secure Checkout</CardTitle>
          <CardDescription>Review your order and complete your purchase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Order Summary</h3>
            <div className="p-4 bg-muted/30 rounded-md space-y-3">
              {cart.map(item => (
                <div key={item.menuItemId} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Image 
                      src={item.imageUrl || 'https://placehold.co/40x40.png'} 
                      alt={item.name} 
                      width={40} 
                      height={40} 
                      className="rounded mr-3"
                      data-ai-hint={item.dataAiHint || "item"}
                    />
                    <span>{item.name} (x{item.quantity})</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 mt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${(finalPriceWithDelivery - deliveryFee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery ({deliveryPreference === 'fastest' ? 'Fastest' : 'Arena'})</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-primary pt-1">
                  <span>Total</span>
                  <span>${finalPriceWithDelivery.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Payment Information</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              This is a placeholder for payment integration. Click "Pay Now" to simulate a successful payment.
            </p>
            <div className="p-6 border border-dashed rounded-md text-center bg-muted/20">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="font-semibold text-lg">Mock Payment Gateway</p>
              <p className="text-sm text-muted-foreground">Securely process your payment.</p>
            </div>
          </div>
          
          {deliveryPreference === 'arena' && (
             <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700 flex items-start">
                <Zap className="h-5 w-5 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                <span>You&apos;ve selected Delivery Arena! After payment, we&apos;ll find the best courier for you. This might take a moment.</span>
            </div>
          )}

          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg" onClick={handleMockPayment}>
            <Lock className="mr-2 h-5 w-5" /> Pay ${finalPriceWithDelivery.toFixed(2)} (Mock)
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By clicking &quot;Pay Now&quot;, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardContent>
        <CardFooter>
            <Button variant="outline" asChild className="w-full">
                <Link href="/cart">Back to Cart</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
