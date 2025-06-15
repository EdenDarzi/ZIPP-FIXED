
'use server';
/**
 * @fileOverview An AI flow for initiating a Peer-to-Peer (P2P) or custom errand delivery request.
 *
 * - requestP2PDelivery - A function that processes a custom delivery request.
 * - P2PDeliveryRequestInput - The input type for the requestP2PDelivery function.
 * - P2PDeliveryRequestOutput - The return type for the requestP2PDelivery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const P2PDeliveryRequestInputSchema = z.object({
  pickupAddress: z.string().min(5, "Pickup address must be at least 5 characters").describe("Full address for package pickup."),
  destinationAddress: z.string().min(5, "Destination address must be at least 5 characters").describe("Full address for package delivery."),
  packageDescription: z.string().min(3, "Package description is required").describe("Brief description of the item(s) being sent."),
  pickupContactName: z.string().optional().describe("Name of the contact person at pickup location."),
  pickupContactPhone: z.string().optional().describe("Phone number of the contact person at pickup location."),
  destinationContactName: z.string().optional().describe("Name of the contact person at destination location."),
  destinationContactPhone: z.string().optional().describe("Phone number of the contact person at destination location."),
  isPurchaseRequired: z.boolean().default(false).describe("Does the courier need to purchase items?"),
  shoppingList: z.string().optional().describe("If purchase is required, list of items to buy."),
  estimatedBudget: z.number().optional().describe("If purchase is required, the estimated budget for items."),
  specialInstructions: z.string().optional().describe("Any special instructions for the courier."),
  requestedPickupTime: z.string().optional().describe("Preferred pickup time (e.g., 'ASAP', specific ISO time)."),
});
export type P2PDeliveryRequestInput = z.infer<typeof P2PDeliveryRequestInputSchema>;

const P2PDeliveryRequestOutputSchema = z.object({
  requestId: z.string().describe("A unique ID for this delivery request."),
  status: z.enum(['REQUESTED', 'MATCHING_COURIER', 'FAILED_VALIDATION']).describe("Current status of the request."),
  estimatedCost: z.number().optional().describe("Rough estimate of the delivery cost (excluding purchases)."),
  estimatedPickupEtaMinutes: z.number().optional().describe("Estimated time for a courier to arrive at pickup."),
  message: z.string().describe("A message to the user regarding their request."),
});
export type P2PDeliveryRequestOutput = z.infer<typeof P2PDeliveryRequestOutputSchema>;

export async function requestP2PDelivery(input: P2PDeliveryRequestInput): Promise<P2PDeliveryRequestOutput> {
  // This is a mock implementation.
  // In a real system, this would involve:
  // 1. Validating addresses (e.g., using a geocoding service).
  // 2. Calculating a preliminary cost based on distance, package size (if provided), urgency.
  // 3. If purchase is required, validating shopping list and budget.
  // 4. Initiating the courier matching process (similar to restaurant orders but adapted for P2P).
  // 5. Storing the request in a database.

  // For now, we'll simulate a successful request initiation.
  const p2pDeliveryFlow = ai.defineFlow(
    {
      name: 'p2pDeliveryRequestFlow',
      inputSchema: P2PDeliveryRequestInputSchema,
      outputSchema: P2PDeliveryRequestOutputSchema,
    },
    async (flowInput) => {
      // Mock AI interaction to generate a "summary" or "understanding"
      // This prompt doesn't do much heavy lifting in the mock, but shows where AI could be used.
      const summaryPrompt = ai.definePrompt({
          name: 'p2pDeliverySummaryPrompt',
          input: { schema: P2PDeliveryRequestInputSchema },
          output: { schema: z.object({ summary: z.string() }) },
          prompt: `A user wants to send a package.
          From: {{{pickupAddress}}}
          To: {{{destinationAddress}}}
          Package: {{{packageDescription}}}
          {{#if isPurchaseRequired}}
          Purchase Required: Yes. Budget: ₪{{{estimatedBudget}}}. List: {{{shoppingList}}}
          {{/if}}
          Special Instructions: {{{specialInstructions}}}
          Confirm understanding of this request with a very brief summary for internal logging.
          `,
      });
      
      try {
        const { output: summaryOutput } = await summaryPrompt(flowInput);
        console.log("P2P Delivery Request Summary:", summaryOutput?.summary);
      } catch (e) {
        console.error("Error generating P2P summary:", e);
      }


      const requestId = `p2p_${Date.now()}`;
      const isRequestValid = flowInput.pickupAddress.length > 4 && flowInput.destinationAddress.length > 4 && flowInput.packageDescription.length > 2;

      if (!isRequestValid) {
        return {
          requestId: "",
          status: 'FAILED_VALIDATION',
          message: "בקשה לא תקינה. אנא בדוק את כתובת האיסוף, היעד ותיאור החבילה.",
        };
      }
      
      // Simulate cost and ETA based on simple logic (very basic)
      const mockDistanceKm = Math.floor(Math.random() * 10) + 1; // 1 to 10 km
      let estimatedCost = 10 + (mockDistanceKm * 1.5); // Base + per km
      if (flowInput.isPurchaseRequired) {
        estimatedCost += 5; // Small fee for purchasing service
      }
      const estimatedPickupEtaMinutes = 10 + Math.floor(Math.random() * 20); // 10 to 30 mins

      return {
        requestId,
        status: 'MATCHING_COURIER', // Assume direct to matching for now
        estimatedCost: parseFloat(estimatedCost.toFixed(2)),
        estimatedPickupEtaMinutes,
        message: `הבקשה שלך (ID: ${requestId.slice(-6)}) התקבלה! אנו מחפשים כעת שליח. עלות משוערת: ₪${estimatedCost.toFixed(2)}. זמן הגעה משוער לאיסוף: ${estimatedPickupEtaMinutes} דקות.`,
      };
    }
  );

  return p2pDeliveryFlow(input);
}

    