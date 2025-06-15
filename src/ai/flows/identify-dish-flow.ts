
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
A user has uploaded an image of a food item, possibly from a social media trend.
Image: {{media url=imageDataUri}}

{{#if userQuery}}User's query related to the image: "{{{userQuery}}}"{{/if}}

1.  First, try to identify the main food item or dish in the image. Be as specific as possible (e.g., "Korean Cheese Corn Dog", "Cronut with Matcha Glaze"). If you are not sure, say "Food item detected" or "Interesting dish detected".
2.  Then, provide a helpful and engaging response.
    *   If there was a user query, answer it in relation to the image.
    *   If no query, briefly describe what you see or comment on its trendiness if applicable (e.g., "This looks like the viral [Dish Name] everyone is talking about!").
3.  Suggest 1-2 similar dishes or types of cuisine that might be available on SwiftServe. You can invent plausible dish names or restaurant types that would fit the identified item and mention that users can search for them on the app. Keep this part brief, appealing, and actionable.
    *   Example: "You might find similar cheesy corn dogs at 'Seoul Food Express' on SwiftServe, or try searching for 'Crispy Fried Mozzarella Sticks' for a different cheesy delight!"
    *   Example: "That trendy looking [Dish Name] is all the rage! For a similar vibe on SwiftServe, check out 'Fusion Bites Cafe' or search for 'gourmet dessert waffles'."

Example Output (if no user query, identified trendy item):
identifiedDishName: "Korean Cheese Corn Dog"
suggestedText: "Wow, that's the famous Korean Cheese Corn Dog! It's super popular right now. On SwiftServe, you could look for 'Cheesy Sausage Sticks' at 'Street Food Mania' or explore our 'Korean Fusion' category for more exciting bites!"

Example Output (with user query "is this healthy?"):
identifiedDishName: "Avocado Toast with Poached Egg"
suggestedText: "This appears to be Avocado Toast with Poached Egg. It's generally a nutritious choice, packed with healthy fats and protein! If you're looking for other healthy options on SwiftServe, try searching for 'Quinoa Salad with Grilled Chicken' or browse restaurants under our 'Healthy Eats' tag."

Output format should be JSON. Be creative and helpful!
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
        identifiedDishName: "לא הצלחתי לנתח את התמונה",
        suggestedText: "מצטערים, לא הצלחתי לעבד את התמונה כרגע. אנא נסה/י תמונה אחרת או חפש/י ידנית."
      }
    }
    return output;
  }
);

