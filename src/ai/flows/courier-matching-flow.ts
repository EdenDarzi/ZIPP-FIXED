
'use server';
/**
 * @fileOverview AI flow for matching the best courier to an order based on bids.
 *
 * - selectBestCourierBid - A function that selects the most suitable courier bid from a list.
 * - CourierMatchingInput - The input type for the selectBestCourierBid function.
 * - CourierMatchingOutput - The return type for the selectBestCourierBid function.
 */

import { ai } from '@/ai/genkit';
import type { DeliveryVehicle } from '@/types'; // Keep type import for DeliveryVehicle enum
import { z } from 'genkit';

// Define Zod schemas based on TypeScript types
const LocationSchema = z.object({ lat: z.number(), lng: z.number() });

const DeliveryVehicleEnum = z.enum(['motorcycle', 'car', 'bicycle', 'foot', 'scooter']);

const CourierProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number().describe("Average performance rating (1-5)"),
  trustScore: z.number().describe("AI-calculated reliability score (0-100)"),
  vehicleType: DeliveryVehicleEnum,
  areaCoverageRadiusKm: z.number().describe("Max distance willing to travel for pickup"),
  currentLocation: LocationSchema.describe("For geographical matching"),
  currentSpeedKmh: z.optional(z.number()).describe("Real-time speed"),
  batteryPercent: z.optional(z.number()).describe("For electric vehicles"),
  isActive: z.boolean().describe("Is courier currently working/accepting offers"),
  transportationModeDetails: z.optional(z.string()).describe("e.g. 'Honda PCX 150', 'Trek FX 2'"),
});


const CourierBidSchema = z.object({
  bidId: z.string(),
  orderId: z.string(),
  courierId: z.string(),
  courierName: z.string().describe('Name of the courier for display purposes.'),
  distanceToRestaurantKm: z.number().describe("Courier's current distance to the restaurant in kilometers."),
  bidAmount: z.number().describe('Total commission courier is asking for this delivery (base + any bonus).'),
  proposedEtaMinutes: z.number().describe("Courier's estimated time to deliver, including pickup and travel to customer, in minutes."),
  courierRating: z.number().describe("Courier's performance rating at the time of bid (scale 1-5)."),
  courierTrustScore: z.number().describe("Courier's reliability score at the time of bid (scale 0-100)."),
  vehicleType: DeliveryVehicleEnum.describe("Type of vehicle the courier will use."),
  timestamp: z.string().describe('ISO string representing when the bid was placed.'),
  isFastPickup: z.boolean().describe('Indicates if the courier committed to an expedited pickup (e.g., within 4 minutes).'),
  status: z.optional(z.enum(['pending', 'accepted', 'rejected', 'expired'])).describe('Current status of the bid.'),
  courierProfileSnapshot: z.optional(CourierProfileSchema.partial()).describe("A snapshot of the courier's profile at the time of bidding, for context."),
});

const OrderDetailsForBiddingSchema = z.object({
  orderId: z.string(),
  restaurantName: z.string(),
  restaurantLocation: LocationSchema.describe("Geographical coordinates of the restaurant."),
  deliveryAddress: z.string().describe("Customer's delivery address."),
  deliveryLocation: LocationSchema.describe("Geographical coordinates for the delivery destination."),
  estimatedDistanceKm: z.number().describe("Initial 'as the crow flies' estimated travel distance for delivery in kilometers."),
  estimatedRouteDistanceKm: z.optional(z.number()).describe("More accurate route distance from a mapping service, if available."),
  baseCommission: z.number().describe("Base payment offered for completing the delivery."),
  itemsDescription: z.string().describe('Brief description of items in the order (e.g., "Pizza, Drinks").'),
  expectedPickupTime: z.string().describe('Expected time for food preparation to be complete or when courier should pick up (e.g., "ASAP ~10 min prep", "15:30").'),
  requiredVehicleType: z.optional(z.array(DeliveryVehicleEnum)).describe('Specific vehicle types suitable for this order, if any.'),
  orderValue: z.optional(z.number()).describe("Total value of the customer's order, can be used for courier prioritization."),
  customerNotes: z.optional(z.string()).describe("Any special instructions from the customer for the delivery."),
});


export const CourierMatchingInputSchema = z.object({
  orderDetails: OrderDetailsForBiddingSchema.describe("Details of the order needing a courier."),
  bids: z.array(CourierBidSchema).describe('A list of bids received from couriers for this order.'),
  // Future: could include real-time traffic conditions, weather, etc.
});
export type CourierMatchingInput = z.infer<typeof CourierMatchingInputSchema>;

export const CourierMatchingOutputSchema = z.object({
  selectedBid: CourierBidSchema.optional().describe('The winning courier bid. Undefined if no suitable bid was found.'),
  reasoning: z.string().optional().describe('Explanation for the selection or why no bid was selected, considering all factors.'),
  fallbackRequired: z.boolean().describe('True if no bids were provided or no suitable bid was found, indicating a fallback mechanism should be used.'),
});
export type CourierMatchingOutput = z.infer<typeof CourierMatchingOutputSchema>;

// Ranking function based on the provided logic
function rankBids(bids: z.infer<typeof CourierBidSchema>[]): z.infer<typeof CourierBidSchema>[] {
  return bids.sort((a, b) => {
    // Score: trustScore (30%), ETA (lower is better, max 100 points), rating (scaled), bidAmount (lower is better), fast pickup bonus
    const aScore =
      (a.courierTrustScore * 0.3) +
      (Math.max(0, 100 - a.proposedEtaMinutes * 2)) + // Max 100 points, 2 points per minute under 50min
      (a.courierRating * 10) - // Max 50 points
      (a.bidAmount * 2) + // Penalty for higher bids
      (a.isFastPickup ? 15 : 0); // Increased bonus for fast pickup

    const bScore =
      (b.courierTrustScore * 0.3) +
      (Math.max(0, 100 - b.proposedEtaMinutes * 2)) +
      (b.courierRating * 10) -
      (b.bidAmount * 2) +
      (b.isFastPickup ? 15 : 0);

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
      const { text: reasoning } = await ai.generate({
        prompt: `No bids were received for order ${orderDetails.orderId} from ${orderDetails.restaurantName} heading to ${orderDetails.deliveryAddress}. The order value is approximately ${orderDetails.orderValue || 'N/A'}. Items: ${orderDetails.itemsDescription}. Suggest a reason or a next step, like increasing the base commission of ₪${orderDetails.baseCommission} or dispatching via a fallback mechanism.`,
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
      eligibleBids = bids.filter(bid => orderDetails.requiredVehicleType!.includes(bid.vehicleType as DeliveryVehicle)); // Cast as DeliveryVehicle from enum
    }

    if (eligibleBids.length === 0) {
        const { text: reasoning } = await ai.generate({
            prompt: `For order ${orderDetails.orderId} (${orderDetails.itemsDescription}), bids were received but none met the vehicle requirements (${orderDetails.requiredVehicleType?.join(', ')}). Original bids: ${JSON.stringify(bids.map(b => ({ c: b.courierName, v:b.vehicleType })))}`,
        });
        return {
            selectedBid: undefined,
            reasoning: reasoning || `No bids met the vehicle requirements.`,
            fallbackRequired: true,
        };
    }

    const rankedBids = rankBids(eligibleBids);
    const bestBid = rankedBids[0];

    // LLM provides a more detailed reasoning.
    const promptForReasoning = `
      Order Analysis for ID: ${orderDetails.orderId}
      Restaurant: ${orderDetails.restaurantName}
      Delivery To: ${orderDetails.deliveryAddress} (Est. Route: ${orderDetails.estimatedRouteDistanceKm || orderDetails.estimatedDistanceKm} km)
      Items: ${orderDetails.itemsDescription} (Value: ₪${orderDetails.orderValue || 'N/A'})
      Base Commission: ₪${orderDetails.baseCommission}
      Expected Pickup: ${orderDetails.expectedPickupTime}
      Customer Notes: ${orderDetails.customerNotes || 'None'}

      A selection of courier bids were received and ranked. The top bid chosen is from ${bestBid.courierName}.
      Bid Details:
      - Courier ID: ${bestBid.courierId}
      - Bid Amount: ₪${bestBid.bidAmount}
      - Proposed ETA: ${bestBid.proposedEtaMinutes} minutes
      - Courier Rating: ${bestBid.courierRating}/5
      - Courier Trust Score: ${bestBid.courierTrustScore}%
      - Vehicle: ${bestBid.vehicleType} (${bestBid.courierProfileSnapshot?.transportationModeDetails || 'N/A'})
      - Distance to Restaurant: ${bestBid.distanceToRestaurantKm} km
      - Fast Pickup Offered: ${bestBid.isFastPickup ? 'Yes' : 'No'}

      Context of All Eligible Bids (summarized):
      ${JSON.stringify(eligibleBids.map(b => ({
        name: b.courierName,
        bid: b.bidAmount,
        eta: b.proposedEtaMinutes,
        rating: b.courierRating,
        trust: b.courierTrustScore,
        vehicle: b.vehicleType,
        fastPickup: b.isFastPickup,
        distToRest: b.distanceToRestaurantKm,
      })))}

      Chosen Bid (Full): ${JSON.stringify(bestBid)}

      Provide a concise reasoning for why ${bestBid.courierName}'s bid was selected as the best option.
      Consider factors such as bid amount vs. base commission, proposed ETA, courier reliability (rating & trust score),
      vehicle suitability, distance to restaurant, and if fast pickup was offered.
      The goal is to balance speed, reliability, and cost-effectiveness for SwiftServe and the customer.
      If the bid amount is higher than base, justify if other factors make it worthwhile.
    `;

    const { text: selectionReasoning } = await ai.generate({
      prompt: promptForReasoning,
    });

    return {
      selectedBid: bestBid,
      reasoning: selectionReasoning || `Selected ${bestBid.courierName} based on overall score.`,
      fallbackRequired: false,
    };
  }
);
