
'use server';
/**
 * @fileOverview AI flow for matching the best courier to an order based on a scoring algorithm.
 *
 * This module is responsible for evaluating available couriers for a given order
 * and selecting the most suitable one based on factors including distance to pickup,
 * delivery route distance, current courier load (batching potential), and overall daily activity (load balancing).
 * It uses a Genkit flow to process this logic.
 *
 * @module ai/flows/courier-matching-flow
 * @exports selectBestCourierBid - The main function to select the best courier.
 * @exports CourierMatchingInput - Zod schema for the input to the courier matching flow.
 * @exports CourierMatchingOutput - Zod schema for the output from the courier matching flow.
 * @exports type CourierMatchingInputType - TypeScript type for the input.
 * @exports type CourierMatchingOutputType - TypeScript type for the output.
 */

import { ai } from '@/ai/genkit';
import type { DeliveryVehicle } from '@/types';
import { z } from 'genkit';

// Define Zod schemas based on TypeScript types
/**
 * @description Zod schema for a geographical location.
 */
const LocationSchema = z.object({ 
  lat: z.number().describe("Latitude"), 
  lng: z.number().describe("Longitude") 
});

/**
 * @description Zod enum for delivery vehicle types.
 */
const DeliveryVehicleEnum = z.enum(['motorcycle', 'car', 'bicycle', 'foot', 'scooter']);

/**
 * @description Zod schema for a courier's profile.
 * Contains comprehensive details about a courier.
 */
const CourierProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  rating: z.number().describe("Average performance rating (1-5)"),
  trustScore: z.number().describe("AI-calculated reliability score (0-100)"),
  vehicleType: DeliveryVehicleEnum,
  areaCoverageRadiusKm: z.number().describe("Max distance willing to travel for pickup"),
  currentLocation: LocationSchema.describe("Current geographical coordinates"),
  currentSpeedKmh: z.number().optional().describe("Real-time speed in km/h"),
  batteryPercent: z.number().optional().describe("Battery percentage for electric vehicles"),
  isActive: z.boolean().describe("Is courier currently working/accepting offers"),
  transportationModeDetails: z.string().optional().describe("e.g. 'Honda PCX 150', 'Trek FX 2'"),
  currentDeliveriesCount: z.number().optional().default(0).describe("Number of deliveries currently assigned or in progress by the courier."),
  totalDeliveriesToday: z.number().optional().default(0).describe("Total deliveries completed by the courier today."),
});

/**
 * @description Zod schema for a courier's bid on an order.
 * In this context, a "bid" represents an available courier being considered.
 * Details the terms of a courier's offer to deliver an order.
 */
const CourierBidSchema = z.object({
  bidId: z.string(), // Can be courierId if direct assignment
  orderId: z.string(),
  courierId: z.string(),
  courierName: z.string().describe('Name of the courier for display purposes.'),
  distanceToRestaurantKm: z.number().describe("Courier's current distance to the restaurant in kilometers."),
  bidAmount: z.number().describe('Standard commission or bid for this delivery.'), // Kept for schema compatibility, but new scoring focuses elsewhere
  proposedEtaMinutes: z.number().describe("Courier's estimated time to deliver, including pickup and travel to customer, in minutes."),
  courierRating: z.number().describe("Courier's performance rating (scale 1-5)."),
  courierTrustScore: z.number().describe("Courier's reliability score (scale 0-100)."),
  vehicleType: DeliveryVehicleEnum.describe("Type of vehicle the courier will use."),
  timestamp: z.string().datetime().describe('ISO string representing when the bid was placed/courier data was fetched.'),
  isFastPickup: z.boolean().describe('Indicates if the courier committed to an expedited pickup.'), // May influence distanceToRestaurantKm or proposedEtaMinutes
  status: z.enum(['pending', 'accepted', 'rejected', 'expired']).optional().describe('Current status of the bid/courier availability.'),
  courierProfileSnapshot: CourierProfileSchema.partial().optional().describe("A snapshot of the courier's profile at the time of matching, for context."),
});

/**
 * @description Zod schema for order details relevant to the courier matching process.
 */
const OrderDetailsForBiddingSchema = z.object({
  orderId: z.string(),
  restaurantName: z.string(),
  restaurantLocation: LocationSchema.describe("Geographical coordinates of the restaurant."),
  deliveryAddress: z.string().describe("Customer's delivery address."),
  deliveryLocation: LocationSchema.describe("Geographical coordinates for the delivery destination."),
  estimatedDistanceKm: z.number().describe("Initial 'as the crow flies' estimated travel distance for delivery in kilometers."),
  estimatedRouteDistanceKm: z.number().optional().describe("More accurate route distance from a mapping service, if available."),
  baseCommission: z.number().describe("Base payment offered for completing the delivery."),
  itemsDescription: z.string().describe('Brief description of items in the order (e.g., "Pizza, Drinks").'),
  expectedPickupTime: z.string().describe('Expected time for food preparation to be complete or when courier should pick up (e.g., "ASAP ~10 min prep", "15:30").'),
  requiredVehicleType: z.array(DeliveryVehicleEnum).optional().describe('Specific vehicle types suitable for this order, if any.'),
  orderValue: z.number().optional().describe("Total value of the customer's order, can be used for courier prioritization."),
  customerNotes: z.string().optional().describe("Any special instructions from the customer for the delivery."),
});

/**
 * @description Zod schema for the input to the courier matching flow.
 * Encapsulates all information needed to select the best courier.
 */
const CourierMatchingInputSchema = z.object({
  orderDetails: OrderDetailsForBiddingSchema.describe("Details of the order needing a courier."),
  bids: z.array(CourierBidSchema).min(0).describe('A list of available couriers (represented as bids) for this order. Can be empty.'),
});
/**
 * @description TypeScript type for the courier matching input, inferred from CourierMatchingInputSchema.
 */
export type CourierMatchingInputType = z.infer<typeof CourierMatchingInputSchema>;

/**
 * @description Zod schema for the output from the courier matching flow.
 * Contains the selected courier (bid) and reasoning for the decision.
 */
const CourierMatchingOutputSchema = z.object({
  selectedBid: CourierBidSchema.optional().describe('The selected courier. Undefined if no suitable courier was found.'),
  reasoning: z.string().optional().describe('Explanation for the selection or why no courier was selected, considering all factors.'),
  fallbackRequired: z.boolean().describe('True if no couriers were provided or no suitable courier was found, indicating a fallback mechanism should be used.'),
});
/**
 * @description TypeScript type for the courier matching output, inferred from CourierMatchingOutputSchema.
 */
export type CourierMatchingOutputType = z.infer<typeof CourierMatchingOutputSchema>;


const MAX_BATCH_SIZE = 3; // Maximum number of deliveries a courier can batch
const EPSILON = 0.1; // To prevent division by zero

/**
 * Ranks courier bids based on the new scoring algorithm.
 * The scoring considers distance to pickup, delivery route distance, batching potential, and load balancing.
 *
 * @function rankCouriers
 * @param {CourierBid[]} couriers - An array of available couriers (represented as bids).
 * @param {OrderDetailsForBidding} orderDetails - Details of the order.
 * @returns {CourierBid[]} The ranked array of couriers, with the best one first.
 * @private
 */
function rankCouriers(couriers: CourierBid[], orderDetails: OrderDetailsForBidding): CourierBid[] {
  const scoredCouriers = couriers.map(bid => {
    const profile = bid.courierProfileSnapshot;

    const pickupTimeScoreFactor = 1 / (bid.distanceToRestaurantKm + EPSILON);
    const deliveryDistanceScoreFactor = 1 / ((orderDetails.estimatedRouteDistanceKm || orderDetails.estimatedDistanceKm) + EPSILON);
    
    const currentDeliveries = profile?.currentDeliveriesCount || 0;
    const batchScoreValue = currentDeliveries < MAX_BATCH_SIZE ? 1.0 : 0.5;
    
    const totalDeliveriesToday = profile?.totalDeliveriesToday || 0;
    const loadBalancingScoreFactor = 1 / (totalDeliveriesToday + 1); // +1 to avoid division by zero and give new couriers a chance

    const score = 
      (pickupTimeScoreFactor * 0.4) +
      (deliveryDistanceScoreFactor * 0.3) +
      (batchScoreValue * 0.2) +
      (loadBalancingScoreFactor * 0.1);

    return { ...bid, score };
  });

  return scoredCouriers.sort((a, b) => (b.score || 0) - (a.score || 0)); // Higher score is better
}

/**
 * Selects the most suitable courier for a given order based on the new algorithm.
 * This function serves as the primary entry point for the courier matching logic.
 *
 * @async
 * @function selectBestCourierBid
 * @param {CourierMatchingInputType} input - The order details and the list of available couriers.
 * @returns {Promise<CourierMatchingOutputType>} A promise that resolves to the selected courier and reasoning.
 */
export async function selectBestCourierBid(input: CourierMatchingInputType): Promise<CourierMatchingOutputType> {
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
        prompt: `No couriers were available or provided for order ${orderDetails.orderId} from ${orderDetails.restaurantName}. Restaurant expected pickup: ${orderDetails.expectedPickupTime}. Destination: ${orderDetails.deliveryAddress}. Suggest a reason for no couriers or a next step, like alerting operations or using a fallback. Be concise.`,
      });
      return {
        selectedBid: undefined,
        reasoning: reasoning || "לא נמצאו שליחים זמינים. מומלץ לשקול שימוש במנגנון גיבוי או התראה למנהל תפעול.",
        fallbackRequired: true,
      };
    }

    // Filter couriers
    let eligibleCouriers = bids.filter(bid => bid.courierProfileSnapshot?.isActive === true);

    if (orderDetails.requiredVehicleType && orderDetails.requiredVehicleType.length > 0) {
      eligibleCouriers = eligibleCouriers.filter(bid => {
        const vehicle = bid.courierProfileSnapshot?.vehicleType || bid.vehicleType;
        return orderDetails.requiredVehicleType!.includes(vehicle as DeliveryVehicle);
      });
    }
    
    // Additional filter for overload (example, can be more sophisticated)
    eligibleCouriers = eligibleCouriers.filter(bid => (bid.courierProfileSnapshot?.currentDeliveriesCount || 0) < MAX_BATCH_SIZE + 1); // Allow one more than max if desperate


    if (eligibleCouriers.length === 0) {
        const { text: reasoning } = await ai.generate({
            prompt: `For order ${orderDetails.orderId} (${orderDetails.itemsDescription}), couriers were available but none met the filtering criteria (e.g., vehicle: ${orderDetails.requiredVehicleType?.join(', ')}, activity status, or current load). Original bids: ${JSON.stringify(bids.map(b => ({ courier: b.courierName, vehicle:b.vehicleType, active: b.courierProfileSnapshot?.isActive, load: b.courierProfileSnapshot?.currentDeliveriesCount})))}. Provide a concise reason.`,
        });
        return {
            selectedBid: undefined,
            reasoning: reasoning || `לא נמצאו שליחים העומדים בקריטריונים הנדרשים (סוג רכב, זמינות, עומס).`,
            fallbackRequired: true,
        };
    }

    const rankedCouriers = rankCouriers(eligibleCouriers, orderDetails);
    const bestCourierBid = rankedCouriers[0];

    const promptForReasoning = `
      Order ID: ${orderDetails.orderId}
      Restaurant: ${orderDetails.restaurantName} (Pickup: ${orderDetails.restaurantLocation.lat.toFixed(4)}, ${orderDetails.restaurantLocation.lng.toFixed(4)})
      Delivery To: ${orderDetails.deliveryAddress} (Est. Route: ${orderDetails.estimatedRouteDistanceKm || orderDetails.estimatedDistanceKm} km)
      Items: ${orderDetails.itemsDescription} (Order Value: ₪${orderDetails.orderValue || 'N/A'})
      Expected Restaurant Pickup: ${orderDetails.expectedPickupTime}

      The AI has selected ${bestCourierBid.courierName}'s bid as the most suitable for this delivery.
      Selected Courier Details:
      - Courier ID: ${bestCourierBid.courierId}
      - Distance to Restaurant: ${bestCourierBid.distanceToRestaurantKm.toFixed(1)} km
      - Vehicle: ${bestCourierBid.courierProfileSnapshot?.vehicleType || bestCourierBid.vehicleType} (${bestCourierBid.courierProfileSnapshot?.transportationModeDetails || 'N/A'})
      - Current Load: ${bestCourierBid.courierProfileSnapshot?.currentDeliveriesCount || 0} active deliveries
      - Deliveries Today: ${bestCourierBid.courierProfileSnapshot?.totalDeliveriesToday || 0}
      - Calculated Score (internal): ${(bestCourierBid as any).score?.toFixed(4) || 'N/A'} 
      (Original Bid Amount (for info): ₪${bestCourierBid.bidAmount.toFixed(2)}, ETA Estimate by Courier: ${bestCourierBid.proposedEtaMinutes} min, Rating: ${bestCourierBid.courierRating}/5, Trust: ${bestCourierBid.courierTrustScore}%)

      Summary of Top Eligible Couriers Considered (up to 3, scores are internal):
      ${JSON.stringify(rankedCouriers.slice(0, 3).map(b => ({
        name: b.courierName,
        distToRest: b.distanceToRestaurantKm.toFixed(1),
        load: b.courierProfileSnapshot?.currentDeliveriesCount || 0,
        deliveriesToday: b.courierProfileSnapshot?.totalDeliveriesToday || 0,
        vehicle: b.courierProfileSnapshot?.vehicleType || b.vehicleType,
        score: (b as any).score?.toFixed(4) || 'N/A'
      })))}

      Provide a concise, professional reasoning (1-2 sentences) for why ${bestCourierBid.courierName} was selected.
      Focus on the key factors from the NEW scoring:
      1. Proximity to restaurant (distanceToRestaurantKm - lower is better).
      2. Delivery route efficiency (estimatedRouteDistanceKm - lower is better).
      3. Courier's current load (currentDeliveriesCount - lower allows batching or faster focus).
      4. Courier's overall activity today (totalDeliveriesToday - for load balancing, giving chances to less busy couriers).
      The system aims for an optimal balance of speed, efficiency, and courier utilization.
    `;

    const { text: selectionReasoning } = await ai.generate({
      prompt: promptForReasoning,
    });

    return {
      selectedBid: bestCourierBid,
      reasoning: selectionReasoning || `הצעתו של ${bestCourierBid.courierName} נבחרה בהתבסס על שקלול של קרבה למסעדה, יעילות מסלול המשלוח, עומס נוכחי וניצולת כללית.`,
      fallbackRequired: false,
    };
  }
);


