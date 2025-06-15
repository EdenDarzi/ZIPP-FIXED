
'use server';
/**
 * @fileOverview AI flow for matching the best courier to an order based on bids.
 *
 * - selectBestCourierBid - A function that selects the most suitable courier bid from a list.
 * - CourierMatchingInput - The input type for the selectBestCourierBid function.
 * - CourierMatchingOutput - The return type for the selectBestCourierBid function.
 */

import { ai } from '@/ai/genkit';
import type { CourierBid, OrderDetailsForBidding } from '@/types';
import { z } from 'genkit';

// Define Zod schemas based on TypeScript types
const CourierBidSchema = z.object({
  bidId: z.string(),
  orderId: z.string(),
  courierId: z.string(),
  courierName: z.string(),
  distanceToRestaurantKm: z.number(),
  bidAmount: z.number().describe('Total commission courier is asking (base + bonus)'),
  proposedEtaMinutes: z.number().describe("Courier's estimated time to deliver (pickup + travel to customer)"),
  courierRating: z.number().describe("Courier's performance rating at time of bid (1-5)"),
  courierTrustScore: z.number().describe("Courier's trust score at time of bid (0-100)"),
  vehicleType: z.enum(['motorcycle', 'car', 'bicycle', 'foot']),
  timestamp: z.string().describe('ISO string for when the bid was placed'),
  isFastPickup: z.boolean().describe('If courier committed to faster pickup'),
  status: z.optional(z.enum(['pending', 'accepted', 'rejected', 'expired'])),
});

const OrderDetailsForBiddingSchema = z.object({
  orderId: z.string(),
  restaurantName: z.string(),
  restaurantLocation: z.object({ lat: z.number(), lng: z.number() }),
  deliveryAddress: z.string(),
  deliveryLocation: z.object({ lat: z.number(), lng: z.number() }),
  estimatedDistanceKm: z.number(),
  baseCommission: z.number(),
  itemsDescription: z.string(),
  expectedPickupTime: z.string(),
  requiredVehicleType: z.optional(z.array(z.enum(['motorcycle', 'car', 'bicycle', 'foot']))),
});


export const CourierMatchingInputSchema = z.object({
  orderDetails: OrderDetailsForBiddingSchema.describe("Details of the order needing a courier."),
  bids: z.array(CourierBidSchema).describe('A list of bids received from couriers for this order.'),
});
export type CourierMatchingInput = z.infer<typeof CourierMatchingInputSchema>;

export const CourierMatchingOutputSchema = z.object({
  selectedBid: CourierBidSchema.optional().describe('The winning courier bid. Undefined if no suitable bid was found.'),
  reasoning: z.string().optional().describe('Explanation for the selection or why no bid was selected.'),
  fallbackRequired: z.boolean().describe('True if no bids were provided or no suitable bid was found, indicating a fallback mechanism should be used.'),
});
export type CourierMatchingOutput = z.infer<typeof CourierMatchingOutputSchema>;

// Ranking function based on the provided logic
function rankBids(bids: CourierBid[]): CourierBid[] {
  return bids.sort((a, b) => {
    // Score: trustScore (30%), ETA (lower is better, max 100 points), rating (scaled), bidAmount (lower is better)
    const aScore = 
      (a.courierTrustScore * 0.3) + 
      (Math.max(0, 100 - a.proposedEtaMinutes * 2)) + // Max 100 points, 2 points per minute under 50min
      (a.courierRating * 10) - // Max 50 points
      (a.bidAmount * 2) + // Penalty for higher bids
      (a.isFastPickup ? 10 : 0); // Bonus for fast pickup

    const bScore = 
      (b.courierTrustScore * 0.3) +
      (Math.max(0, 100 - b.proposedEtaMinutes * 2)) +
      (b.courierRating * 10) -
      (b.bidAmount * 2) +
      (b.isFastPickup ? 10 : 0);
      
    return bScore - aScore; // Higher score is better
  });
}


export async function selectBestCourierBid(input: CourierMatchingInput): Promise<CourierMatchingOutput> {
  return courierMatchingFlow(input);
}

const courierMatchingFlow = ai.defineFlow(
  {
    name: 'courierMatchingFlow',
    inputSchema: CourierMatchingInputSchema,
    outputSchema: CourierMatchingOutputSchema,
  },
  async (input) => {
    const { orderDetails, bids } = input;

    if (!bids || bids.length === 0) {
      // LLM can be used here for "AI Matching – choose a courier even if there are no bids: smart fallback"
      // For now, simple fallback.
      // Also, "Dynamic Price Adjuster" could be triggered here.
      const { text: reasoning } = await ai.generate({
        prompt: `No bids were received for order ${orderDetails.orderId} from ${orderDetails.restaurantName}. Suggest a reason or a next step, like increasing the base commission.`,
      });
      return {
        selectedBid: undefined,
        reasoning: reasoning || "No bids received. Consider fallback or dynamic price adjustment.",
        fallbackRequired: true,
      };
    }

    // Filter bids based on order requirements (e.g., vehicle type)
    let eligibleBids = bids;
    if (orderDetails.requiredVehicleType && orderDetails.requiredVehicleType.length > 0) {
      eligibleBids = bids.filter(bid => orderDetails.requiredVehicleType!.includes(bid.vehicleType));
    }

    if (eligibleBids.length === 0) {
        const { text: reasoning } = await ai.generate({
            prompt: `For order ${orderDetails.orderId}, bids were received but none met the vehicle requirements (${orderDetails.requiredVehicleType?.join(', ')}). Original bids: ${JSON.stringify(bids)}`,
        });
        return {
            selectedBid: undefined,
            reasoning: reasoning || `No bids met the vehicle requirements.`,
            fallbackRequired: true,
        };
    }
    
    const rankedBids = rankBids(eligibleBids);
    const bestBid = rankedBids[0];

    // LLM can provide a more detailed reasoning.
    const { text: selectionReasoning } = await ai.generate({
      prompt: `Order ${orderDetails.orderId}: Selected courier ${bestBid.courierName} (Bid ID: ${bestBid.bidId}). 
      Their bid was ₪${bestBid.bidAmount} with an ETA of ${bestBid.proposedEtaMinutes} minutes. 
      The courier has a rating of ${bestBid.courierRating} and trust score of ${bestBid.courierTrustScore}.
      They are ${bestBid.distanceToRestaurantKm}km from the restaurant. Fast pickup: ${bestBid.isFastPickup}.
      Briefly explain why this bid was chosen based on a balance of speed, reliability, and cost.
      Original bids considered (after filtering): ${JSON.stringify(eligibleBids.map(b => ({n:b.courierName, b:b.bidAmount, e:b.proposedEtaMinutes, r:b.courierRating, t:b.courierTrustScore})))}.
      Chosen bid was: ${JSON.stringify({n:bestBid.courierName, b:bestBid.bidAmount, e:bestBid.proposedEtaMinutes, r:bestBid.courierRating, t:bestBid.courierTrustScore})}`,
    });

    return {
      selectedBid: bestBid,
      reasoning: selectionReasoning || `Selected ${bestBid.courierName} based on overall score.`,
      fallbackRequired: false,
    };
  }
);
