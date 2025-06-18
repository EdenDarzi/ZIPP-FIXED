
'use server';
/**
 * @fileOverview An AI flow for generating a surprise meal suggestion.
 *
 * This module defines a Genkit flow that creates an inventive and playful meal
 * suggestion for a user seeking a surprise. It includes a fictional dish name,
 * restaurant name, description, and a fun reasoning.
 *
 * @module ai/flows/surprise-meal-flow
 * @exports getSurpriseMealSuggestion - The main function to get a surprise meal.
 * @exports SurpriseMealInput - Zod schema for the input to the surprise meal flow.
 * @exports SurpriseMealOutput - Zod schema for the output from the surprise meal flow.
 * @exports type SurpriseMealInputType - TypeScript type for the input.
 * @exports type SurpriseMealOutputType - TypeScript type for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * @description Zod schema for the input to the surprise meal suggestion flow.
 * Requires a userId and optional user preferences or mood.
 */
const SurpriseMealInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting a surprise.'),
  preferences: z.string().optional().describe('Optional user preferences, likes, dislikes, or mood (e.g., "spicy, no seafood", "something comforting").'),
});
/**
 * @description TypeScript type for the surprise meal input, inferred from SurpriseMealInputSchema.
 */
export type SurpriseMealInputType = z.infer<typeof SurpriseMealInputSchema>;

/**
 * @description Zod schema for the output of the surprise meal suggestion flow.
 * Includes an invented dish name, restaurant name, description, and playful reasoning.
 */
const SurpriseMealOutputSchema = z.object({
  itemName: z.string().describe("The inventive name of the suggested surprise dish."),
  restaurantName: z.string().describe("A plausible but fictional name for the restaurant serving this dish."),
  itemDescription: z.string().describe("An enticing, brief description of the surprise dish."),
  playfulReasoning: z.string().describe("A short, fun, and playful reason why this dish was chosen for the user."),
});
/**
 * @description TypeScript type for the surprise meal output, inferred from SurpriseMealOutputSchema.
 */
export type SurpriseMealOutputType = z.infer<typeof SurpriseMealOutputSchema>;

/**
 * Generates a creative and surprising meal suggestion for the user.
 * This function wraps the Genkit flow `surpriseMealFlow`.
 *
 * @async
 * @function getSurpriseMealSuggestion
 * @param {SurpriseMealInputType} input - User ID and optional preferences.
 * @returns {Promise<SurpriseMealOutputType>} A promise that resolves to a surprise meal suggestion.
 * @throws {Error} If the AI flow fails to generate a suggestion.
 */
export async function getSurpriseMealSuggestion(input: SurpriseMealInputType): Promise<SurpriseMealOutputType> {
  return surpriseMealFlow(input);
}

const surpriseMealPrompt = ai.definePrompt({
  name: 'surpriseMealPrompt',
  input: { schema: SurpriseMealInputSchema },
  output: { schema: SurpriseMealOutputSchema },
  prompt: `You are the LivePick Surprise Culinary Curator, known for your wit and wildly imaginative (but delicious-sounding) food creations!
A user (ID: {{{userId}}}) is feeling adventurous and wants a surprise meal.
{{#if preferences}}Their stated preferences/mood: "{{{preferences}}}"{{/if}}

Your task is to invent:
1.  **A unique and exciting dish name.** Think creative, memorable, maybe even a little quirky (e.g., "Volcano Vortex Veggie Burger", "Moonbeam Mango Macarons", "Kraken's Kiss Calamari Tacos").
2.  **A plausible-sounding but fictional restaurant name** that might serve such a dish (e.g., "The Alchemist's Kitchenette", "Pixel Plate Bistro", "Nomad Noodle Bar").
3.  **A brief, enticing description of the dish** (1-2 sentences). Make it sound irresistible!
4.  **A short, playful, and slightly personalized reason** why you picked this particular surprise for them, perhaps subtly referencing their preferences if provided, or just general good vibes.

Keep the tone fun, enthusiastic, and engaging. Make the user smile and feel excited about their "discovery."
Ensure all output fields (itemName, restaurantName, itemDescription, playfulReasoning) are populated.
Output ONLY the JSON object as specified by the schema.
All text output should be in Hebrew.
`,
});

const surpriseMealFlow = ai.defineFlow(
  {
    name: 'surpriseMealFlow',
    inputSchema: SurpriseMealInputSchema,
    outputSchema: SurpriseMealOutputSchema,
  },
  async (input) => {
    const { output } = await surpriseMealPrompt(input);
    if (!output) {
      // Fallback in case the AI fails to generate structured output
      return {
        itemName: "מנצ'יז מסתורי",
        restaurantName: "מסעדת התעלומה",
        itemDescription: "הפתעה מענגת שתגרה את בלוטות הטעם שלך! מה זה יכול להיות? יש רק דרך אחת לגלות.",
        playfulReasoning: "כי היום מרגיש כמו יום למסתורין טעים! בואו נפתיע קצת, נכון?"
      };
    }
    return output;
  }
);
