import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Lock } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline text-primary">Secure Checkout</CardTitle>
          <CardDescription>Complete your SwiftServe order.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
            {/* In a real app, fetch cart summary here or pass as props */}
            <div className="p-4 bg-muted/50 rounded-md space-y-2">
              <div className="flex justify-between"><span>Margherita Pizza (x1)</span><span>$12.99</span></div>
              <div className="flex justify-between"><span>Coca-Cola (x2)</span><span>$5.00</span></div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold"><span>Total</span><span>$17.99</span></div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Payment Information</h3>
            <p className="text-muted-foreground mb-4">
              This is a placeholder for the payment integration. In a real application,
              you would integrate a payment gateway like Stripe here.
            </p>
            <div className="p-6 border border-dashed rounded-md text-center">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="font-semibold text-lg">Stripe Payment Gateway</p>
              <p className="text-sm text-muted-foreground">Securely process your payment.</p>
            </div>
          </div>
          
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg">
            <Lock className="mr-2 h-5 w-5" /> Pay Now (Mock)
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
