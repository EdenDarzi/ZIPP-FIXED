
'use server';
/**
 * @fileOverview An AI flow for generating a surprise meal suggestion.
 *
 * - getSurpriseMealSuggestion - A function that returns a creative meal suggestion.
 * - SurpriseMealInput - The input type for the getSurpriseMealSuggestion function.
 * - SurpriseMealOutput - The return type for the getSurpriseMealSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SurpriseMealInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting a surprise.'),
  preferences: z.string().optional().describe('Optional user preferences, likes, dislikes, or mood (e.g., "spicy, no seafood", "something comforting").'),
});
export type SurpriseMealInput = z.infer<typeof SurpriseMealInputSchema>;

const SurpriseMealOutputSchema = z.object({
  itemName: z.string().describe("The inventive name of the suggested surprise dish."),
  restaurantName: z.string().describe("A plausible but fictional name for the restaurant serving this dish."),
  itemDescription: z.string().describe("An enticing, brief description of the surprise dish."),
  playfulReasoning: z.string().describe("A short, fun, and playful reason why this dish was chosen for the user."),
});
export type SurpriseMealOutput = z.infer<typeof SurpriseMealOutputSchema>;

export async function getSurpriseMealSuggestion(input: SurpriseMealInput): Promise<SurpriseMealOutput> {
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
        itemName: "Mystery Munchies",
        restaurantName: "The Enigma Eatery",
        itemDescription: "A delightful surprise that will tantalize your taste buds! What could it be? Only one way to find out.",
        playfulReasoning: "Because today feels like a day for a delicious mystery! Let's spice things up a bit, shall we?"
      };
    }
    return output;
  }
);
