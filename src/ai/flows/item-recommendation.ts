// src/ai/flows/item-recommendation.ts
'use server';

/**
 * @fileOverview A flow for providing personalized item recommendations based on user preferences and order history.
 *
 * - getItemRecommendations - A function that returns item recommendations for a user.
 * - ItemRecommendationInput - The input type for the getItemRecommendations function.
 * - ItemRecommendationOutput - The return type for the getItemRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ItemRecommendationInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate recommendations for.'),
  orderHistory: z.array(z.string()).describe('A list of item IDs the user has previously ordered.'),
  userPreferences: z.string().describe('The user specified preferences.'),
});
export type ItemRecommendationInput = z.infer<typeof ItemRecommendationInputSchema>;

const ItemRecommendationOutputSchema = z.object({
  recommendedItems: z.array(z.string()).describe('A list of recommended item IDs based on the user history.'),
});
export type ItemRecommendationOutput = z.infer<typeof ItemRecommendationOutputSchema>;

export async function getItemRecommendations(input: ItemRecommendationInput): Promise<ItemRecommendationOutput> {
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
    return output!;
  }
);
