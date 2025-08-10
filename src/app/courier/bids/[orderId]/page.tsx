'use client';

import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CourierBidPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { toast } = useToast();

  const { data: order, error } = useSWR(`/api/courier/bids/${orderId}`, fetcher);

  if (error) return <div>Error loading order details.</div>;
  if (!order) return <div>Loading...</div>;

  const [customBid, setCustomBid] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bidPlaced, setBidPlaced] = useState<boolean>(false);

  const handleBidSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit bid logic here
      setBidPlaced(true);
      toast({ title: 'Bid placed successfully!' });
    } catch (err) {
      toast({ title: 'Failed to place bid.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="mb-4">
        <strong>Restaurant:</strong> {order.restaurantName}
      </div>
      <div className="mb-4">
        <strong>Delivery Address:</strong> {order.deliveryAddress}
      </div>
      <div className="mb-4">
        <strong>Base Commission:</strong> ₪{order.baseCommission.toFixed(2)}
      </div>
      <div className="mb-4">
        <strong>Items:</strong> {order.itemsDescription}
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-4">Place Your Bid</h2>
      <Input
        type="number"
        value={customBid}
        onChange={(e) => setCustomBid(e.target.value)}
        placeholder="Enter your bid amount"
        className="mb-4"
        disabled={isSubmitting || bidPlaced}
        min={(order.baseCommission * 0.8).toFixed(2)}
        max={(order.baseCommission * 2.5).toFixed(2)}
        step="0.50"
        aria-label="סכום הצעה מותאם אישית בשקלים"
      />
      <Button onClick={handleBidSubmit} disabled={isSubmitting || bidPlaced} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Bid'}
      </Button>

      <h2 className="text-xl font-semibold mt-6 mb-4">Other Bids</h2>
      {order.bids.length > 0 ? (
        order.bids.map((bid: any) => (
          <div key={bid.bidId} className="p-4 mb-4 border rounded-md">
            <p>
              <strong>Courier:</strong> {bid.courierName}
            </p>
            <p>
              <strong>Bid Amount:</strong> ₪{bid.bidAmount.toFixed(2)}
            </p>
            <p>
              <strong>ETA:</strong> {bid.proposedEtaMinutes} minutes
            </p>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">No other bids placed yet.</p>
      )}

      {isSubmitting && (
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 rtl:mr-4 text-lg">טוען הזדמנות הצעה...</p>
        </div>
      )}
    </div>
  );
}
