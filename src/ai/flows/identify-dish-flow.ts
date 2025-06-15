
'use server';
/**
 * @fileOverview An AI flow for identifying a dish from an image, with a focus on social media trends, and providing suggestions, including actionable business insights.
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
  // Future: userLocation, recentSearches in area to better inform business suggestions
});
export type IdentifyDishInput = z.infer<typeof IdentifyDishInputSchema>;

const BusinessSuggestionSchema = z.object({
    suggestedItemName: z.string().describe("A catchy, menu-ready name for a new item based on the trend."),
    suggestedPriceRange: z.string().describe("A suggested price range, e.g., '₪30-₪40'."),
    suggestedDescription: z.string().describe("A brief, enticing description for the new menu item."),
    suggestedTags: z.array(z.string()).describe("Relevant tags for the new item, e.g., ['New', 'TikTok Inspired', 'Spicy']."),
    rationale: z.string().describe("A short reason why this trend might be a good opportunity for a local business."),
});

const IdentifyDishOutputSchema = z.object({
  identifiedDishName: z.string().describe("The name of the dish/trend identified in the image. If unsure, state 'Food item detected' or similar."),
  isTrend: z.boolean().describe("Indicates if the identified item is considered a significant social media trend."),
  trendSource: z.string().optional().describe("If it's a trend, mention potential source (e.g., 'TikTok', 'Instagram')."),
  generalSuggestion: z.string().describe("A helpful response for the user (e.g., how to find similar items on SwiftServe)."),
  businessOpportunity: BusinessSuggestionSchema.optional().describe("If a strong trend is identified, provide a structured suggestion for businesses on SwiftServe."),
});
export type IdentifyDishOutput = z.infer<typeof IdentifyDishOutputSchema>;

export async function identifyDishFromImage(input: IdentifyDishInput): Promise<IdentifyDishOutput> {
  return identifyDishFlow(input);
}

const identifyDishPrompt = ai.definePrompt({
  name: 'identifyDishPrompt',
  input: { schema: IdentifyDishInputSchema },
  output: { schema: IdentifyDishOutputSchema },
  prompt: `You are the SwiftServe AI TrendScanner, an expert in identifying food dishes and culinary trends from images, especially those popular on social media like TikTok or Instagram. You also provide actionable insights for businesses on the SwiftServe platform.

A user has uploaded an image: {{media url=imageDataUri}}
{{#if userQuery}}User's query about the image: "{{{userQuery}}}"{{/if}}

Your task:
1.  **Identify the Dish/Trend:**
    *   Specifically name the food item or culinary trend (e.g., "Korean Cheese Corn Dog," "Cloud Bread," "Ramen Sandwich," "Pistachio Matcha Latte").
    *   If you're unsure, state "Food item detected" or "Interesting dish detected."
    *   Set 'isTrend' to true if you believe this is a notable social media trend, otherwise false.
    *   If 'isTrend' is true, briefly mention the likely 'trendSource' (e.g., "TikTok", "Instagram", "General Social Media").

2.  **Provide General Suggestion for User:**
    *   Compose a 'generalSuggestion' for the user. This should address their query (if any).
    *   Suggest how users can search for similar dishes, cuisines, or flavor profiles on the SwiftServe app. Invent plausible dish names or restaurant types if needed. (e.g., "You might find similar spicy ramen challenges at 'Fire Noodle House' on SwiftServe," or "For a pistachio-flavored drink, try searching for 'Pistachio Cream Lattes' at our specialty cafes.")

3.  **Provide Business Opportunity Insight (IF 'isTrend' is true and significant):**
    *   If you identify a significant, actionable trend, populate the 'businessOpportunity' object.
    *   'suggestedItemName': Create a catchy, menu-ready name for a new item a local business could offer based on this trend.
    *   'suggestedPriceRange': Suggest a plausible price range (e.g., "₪25-₪35", "$8-$12").
    *   'suggestedDescription': Write a brief, enticing menu description for this new item.
    *   'suggestedTags': Provide 2-3 relevant tags (e.g., "New", "TikTok Famous", "Spicy Challenge", "Limited Time").
    *   'rationale': Briefly explain why this trend could be a good opportunity for a local business on SwiftServe (e.g., "High user engagement in this category," "Viral potential," "Fills a gap in current local offerings").
    *   If the trend is minor or not actionable for a business, 'businessOpportunity' can be omitted.

Example Output (Significant TikTok Trend, no user query):
{
  "identifiedDishName": "Spicy Honey Butter Chicken Wings",
  "isTrend": true,
  "trendSource": "TikTok",
  "generalSuggestion": "Wow, these look like the super trendy Spicy Honey Butter Chicken Wings taking over TikTok! For a similar fiery and sweet kick on SwiftServe, try searching for 'Korean Fried Chicken with Honey Glaze' at 'Seoul Food Express' or explore our 'Wings World' category.",
  "businessOpportunity": {
    "suggestedItemName": "SwiftServe Fiery Honey Wings",
    "suggestedPriceRange": "₪35-₪45",
    "suggestedDescription": "Crispy chicken wings tossed in our signature spicy honey butter glaze. A viral sensation you can now try!",
    "suggestedTags": ["New", "TikTok Viral", "Spicy & Sweet"],
    "rationale": "This wing flavor profile is highly shared on social media and shows strong user interest. Offering a unique version could attract significant attention."
  }
}

Example Output (General dish, user query "Is this healthy?"):
{
  "identifiedDishName": "Quinoa Salad with Roasted Vegetables",
  "isTrend": false,
  "generalSuggestion": "This appears tobe a Quinoa Salad with Roasted Vegetables. It's generally a healthy and balanced choice! On SwiftServe, you can find many healthy salad options by searching for 'grain bowls' or 'roasted veggie salads' under our 'Healthy Eats' tag.",
  "businessOpportunity": null
}

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
        isTrend: false,
        generalSuggestion: "מצטערים, לא הצלחתי לעבד את התמונה כרגע. אנא נסה/י תמונה אחרת או חפש/י ידנית. ייתכן שתכונה זו עדיין בפיתוח עבור סוגי תמונות מסוימים."
        // businessOpportunity will be undefined by default
      }
    }
    return output;
  }
);

