
// src/ai/flows/item-recommendation.ts
'use server';

/**
 * @fileOverview A Genkit flow for providing personalized item recommendations.
 *
 * This module defines an AI flow that suggests items to a user based on their
 * order history and stated preferences. It's designed to be integrated into
 * a delivery app like LivePick to enhance user experience.
 *
 * @module ai/flows/item-recommendation
 * @exports getItemRecommendations - The main function to get item recommendations.
 * @exports ItemRecommendationInput - Zod schema for the input to the recommendation flow.
 * @exports ItemRecommendationOutput - Zod schema for the output from the recommendation flow.
 * @exports type ItemRecommendationInputType - TypeScript type for the input.
 * @exports type ItemRecommendationOutputType - TypeScript type for the output.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * @description Zod schema for the input to the item recommendation flow.
 * Requires userId, a list of previously ordered item IDs, and user preferences as a string.
 */
const ItemRecommendationInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  orderHistory: z.array(z.string()).describe('A list of item IDs the user has previously ordered.'),
  userPreferences: z.string().describe('The user specified preferences.'),
});
/**
 * @description TypeScript type for the item recommendation input, inferred from ItemRecommendationInputSchema.
 */
export type ItemRecommendationInputType = z.infer<typeof ItemRecommendationInputSchema>;

/**
 * @description Zod schema for the output of the item recommendation flow.
 * Returns a list of recommended item IDs.
 */
const ItemRecommendationOutputSchema = z.object({
  recommendedItems: z.array(z.string()).describe('A list of recommended item IDs based on the user history.'),
});
/**
 * @description TypeScript type for the item recommendation output, inferred from ItemRecommendationOutputSchema.
 */
export type ItemRecommendationOutputType = z.infer<typeof ItemRecommendationOutputSchema>;

/**
 * Retrieves personalized item recommendations for a user.
 * This function wraps the Genkit flow `itemRecommendationFlow`.
 *
 * @async
 * @function getItemRecommendations
 * @param {ItemRecommendationInputType} input - User ID, order history, and preferences.
 * @returns {Promise<ItemRecommendationOutputType>} A promise that resolves to a list of recommended item IDs.
 * @throws {Error} If the AI flow fails to generate recommendations.
 */
export async function getItemRecommendations(input: ItemRecommendationInputType): Promise<ItemRecommendationOutputType> {
  return itemRecommendationFlow(input);
}

const itemRecommendationPrompt = ai.definePrompt({
  name: 'itemRecommendationPrompt',
  input: {
    schema: ItemRecommendationInputSchema,
  },
  output: {
    schema: ItemRecommendationOutputSchema,
  },
  prompt: `You are an AI assistant specializing in providing personalized item recommendations for users of a delivery app.

  Based on the user's order history and stated preferences, you will suggest items that the user is likely to enjoy.

  User ID: {{{userId}}}
  Order History: {{#if orderHistory}}{{#each orderHistory}}- {{{this}}}
{{/each}}{{else}}No order history available.{{/if}}
  User Preferences: {{{userPreferences}}}

  Provide a list of recommended item IDs the user may like.  Do not recommend items already in the order history.
  Ensure that the item IDs you return actually exist.
  `,  
});

const itemRecommendationFlow = ai.defineFlow(
  {
    name: 'itemRecommendationFlow',
    inputSchema: ItemRecommendationInputSchema,
    outputSchema: ItemRecommendationOutputSchema,
  },
  async input => {
    const {output} = await itemRecommendationPrompt(input);
    // Ensure there's always an output, even if it's an empty list
    return output || { recommendedItems: [] };
  }
);
