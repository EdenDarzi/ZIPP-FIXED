
'use server';
/**
 * @fileOverview An AI flow for identifying a dish from an image, with a focus on social media trends, and providing suggestions.
 *
 * - identifyDishFromImage - A function that identifies a dish/trend and suggests similar items or business opportunities.
 * - IdentifyDishInput - The input type for the identifyDishFromImage function.
 * - IdentifyDishOutput - The return type for the identifyDishFromImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyDishInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "A photo of a food item, potentially a culinary trend from social media, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  userQuery: z.string().optional().describe('Optional user query related to the image, e.g., "Is this spicy?" or "Where can I find this trend?".'),
});
export type IdentifyDishInput = z.infer<typeof IdentifyDishInputSchema>;

const IdentifyDishOutputSchema = z.object({
  identifiedDishName: z.string().describe("The name of the dish/trend identified in the image. If unsure, state 'Food item detected' or similar."),
  suggestedText: z.string().describe("A helpful response. If it's a trend, comment on it. Suggest similar items/cuisines on SwiftServe, or note how businesses could offer it."),
});
export type IdentifyDishOutput = z.infer<typeof IdentifyDishOutputSchema>;

export async function identifyDishFromImage(input: IdentifyDishInput): Promise<IdentifyDishOutput> {
  return identifyDishFlow(input);
}

const identifyDishPrompt = ai.definePrompt({
  name: 'identifyDishPrompt',
  input: { schema: IdentifyDishInputSchema },
  output: { schema: IdentifyDishOutputSchema },
  prompt: `You are the SwiftServe AI TrendScanner, an expert in identifying food dishes and culinary trends from images, especially those popular on social media like TikTok or Instagram.

A user has uploaded an image: {{media url=imageDataUri}}
{{#if userQuery}}User's query about the image: "{{{userQuery}}}"{{/if}}

Your task:
1.  **Identify the Dish/Trend:**
    *   Try to specifically name the food item or culinary trend (e.g., "Korean Cheese Corn Dog," "Cloud Bread," "Ramen Sandwich," "Pistachio Matcha Latte").
    *   If you're unsure, state "Food item detected" or "Interesting dish detected."
2.  **Provide Insightful Suggestions & Commentary:**
    *   **If a trend is identified:** Briefly comment on its popularity or origin if known (e.g., "This looks like the viral [Dish Name] from TikTok!").
    *   **Answer User Query:** If the user provided a query, address it in context of the image.
    *   **Suggest Similar Items on SwiftServe:** Recommend 1-2 similar dishes, cuisines, or flavor profiles that users can search for on the SwiftServe app. Invent plausible dish names or restaurant types if needed. (e.g., "You might find similar spicy ramen challenges at 'Fire Noodle House' on SwiftServe," or "For a pistachio-flavored drink, try searching for 'Pistachio Cream Lattes' at our specialty cafes.")
    *   **Business Opportunity (If applicable):** If it's a very new or niche trend, you can add a playful note like, "Hey SwiftServe businesses, see this? Maybe it's your next hit menu item!" or "This trend is hot! Businesses on SwiftServe could offer their own unique take on it."
    *   Keep the overall tone engaging, helpful, and slightly enthusiastic.

Example Output (Identified TikTok Trend, no user query):
identifiedDishName: "Spicy Honey Butter Chicken Wings"
suggestedText: "Wow, these look like the super trendy Spicy Honey Butter Chicken Wings taking over TikTok! For a similar fiery and sweet kick on SwiftServe, try searching for 'Korean Fried Chicken with Honey Glaze' at 'Seoul Food Express' or explore our 'Wings World' category. SwiftServe restaurants, are you seeing this heat? 🔥 Could be a great special!"

Example Output (General dish, user query "Is this healthy?"):
identifiedDishName: "Quinoa Salad with Roasted Vegetables"
suggestedText: "This appears to be a Quinoa Salad with Roasted Vegetables. It's generally a healthy and balanced choice! On SwiftServe, you can find many healthy salad options by searching for 'grain bowls' or 'roasted veggie salads' under our 'Healthy Eats' tag."

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
    const { output } = await identifyDishPrompt(input);
    if (!output) {
      return {
        identifiedDishName: "לא הצלחתי לנתח את התמונה",
        suggestedText: "מצטערים, לא הצלחתי לעבד את התמונה כרגע. אנא נסה/י תמונה אחרת או חפש/י ידנית. ייתכן שתכונה זו עדיין בפיתוח עבור סוגי תמונות מסוימים."
      }
    }
    return output;
  }
);
