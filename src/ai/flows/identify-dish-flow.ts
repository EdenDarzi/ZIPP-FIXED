
'use server';
/**
 * @fileOverview An AI flow for identifying a dish from an image and providing suggestions.
 *
 * - identifyDishFromImage - A function that identifies a dish and suggests similar items.
 * - IdentifyDishInput - The input type for the identifyDishFromImage function.
 * - IdentifyDishOutput - The return type for the identifyDishFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyDishInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userQuery: z.string().optional().describe('Optional user query related to the image, e.g., "Is this spicy?" or "Find vegan options like this".'),
});
export type IdentifyDishInput = z.infer<typeof IdentifyDishInputSchema>;

const IdentifyDishOutputSchema = z.object({
  identifiedDishName: z.string().describe("The name of the dish identified in the image. If unsure, state 'Food item detected' or similar."),
  suggestedText: z.string().describe("A short text paragraph suggesting similar items or cuisines available on SwiftServe based on the identified dish, or responding to the user query in context of the image."),
});
export type IdentifyDishOutput = z.infer<typeof IdentifyDishOutputSchema>;

export async function identifyDishFromImage(input: IdentifyDishInput): Promise<IdentifyDishOutput> {
  return identifyDishFlow(input);
}

const identifyDishPrompt = ai.definePrompt({
  name: 'identifyDishPrompt',
  input: { schema: IdentifyDishInputSchema },
  output: { schema: IdentifyDishOutputSchema },
  prompt: `You are an AI assistant for SwiftServe, a food delivery app.
A user has uploaded an image of a food item.
Image: {{media url=imageDataUri}}

{{#if userQuery}}User's query related to the image: "{{{userQuery}}}"{{/if}}

1.  First, try to identify the main food item in the image. Be concise. If you are not sure, say "Food item detected".
2.  Then, provide a helpful response. If there was a user query, answer it in relation to the image.
3.  Suggest 1-2 similar dishes or types of cuisine that might be available on SwiftServe. You can invent plausible dish names or restaurant types and mention that users can search for them on the app. Keep this part brief and engaging.

Example Output (if no user query):
identifiedDishName: "Pepperoni Pizza"
suggestedText: "That looks like a delicious Pepperoni Pizza! You can find similar pizzas at 'Pizza Palace' or search for 'Pepperoni Special' on SwiftServe. We also have great calzones!"

Example Output (with user query "is this healthy?"):
identifiedDishName: "Caesar Salad with Grilled Chicken"
suggestedText: "This appears to be a Caesar Salad with Grilled Chicken, which can be a healthy option! For other healthy choices on SwiftServe, try searching for 'Grilled Salmon Salad' or check out restaurants under our 'Healthy Eats' category."
`,
});

const identifyDishFlow = ai.defineFlow(
  {
    name: 'identifyDishFlow',
    inputSchema: IdentifyDishInputSchema,
    outputSchema: IdentifyDishOutputSchema,
  },
  async (input) => {
    // The default model in ai/genkit.ts (gemini-2.0-flash) supports multimodal input.
    const { output } = await identifyDishPrompt(input);
    if (!output) {
      return {
        identifiedDishName: "Could not analyze image",
        suggestedText: "Sorry, I wasn't able to process the image at this time. Please try another image or search manually."
      }
    }
    return output;
  }
);
