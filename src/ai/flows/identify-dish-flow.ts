
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
});
export type IdentifyDishInput = z.infer<typeof IdentifyDishInputSchema>;

const BusinessSuggestionSchema = z.object({
    suggestedItemName: z.string().describe("A catchy, menu-ready name for a new item based on the trend."),
    suggestedPriceRange: z.string().describe("A suggested price range, e.g., '₪30-₪40', '$8-$12'."),
    suggestedDescription: z.string().describe("A brief, enticing description for the new menu item."),
    suggestedTags: z.array(z.string()).describe("Relevant tags for the new item, e.g., ['New', 'TikTok Inspired', 'Spicy']."),
    rationale: z.string().describe("A short reason why this trend might be a good opportunity for a local business."),
});

const IdentifyDishOutputSchema = z.object({
  identifiedDishName: z.string().describe("The name of the dish/trend identified in the image. If unsure, state 'Food item detected' or similar."),
  isTrend: z.boolean().describe("Indicates if the identified item is considered a significant social media trend."),
  trendSource: z.string().optional().describe("If it's a trend, mention potential source (e.g., 'TikTok', 'Instagram')."),
  generalSuggestion: z.string().describe("A helpful response for the user (e.g., how to find similar items on SwiftServe, or context about the dish)."),
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
  prompt: `You are the SwiftServe AI TrendScanner, an expert in identifying food dishes and culinary trends from images, especially those popular on social media like TikTok or Instagram. You also provide actionable insights for businesses on the SwiftServe platform. User uploads contribute to trend identification.

A user has uploaded an image: {{media url=imageDataUri}}
{{#if userQuery}}User's query about the image: "{{{userQuery}}}"{{/if}}

Your task:
1.  **Identify the Dish/Trend:**
    *   Specifically name the food item or culinary trend (e.g., "Korean Cheese Corn Dog," "Cloud Bread," "Ramen Sandwich," "Pistachio Matcha Latte", "Folded Kimbap").
    *   If you're unsure, state "פריט מזון זוהה" or "מנה מעניינת זוהתה."
    *   Set 'isTrend' to true if you believe this is a notable social media trend, otherwise false.
    *   If 'isTrend' is true, briefly mention the likely 'trendSource' (e.g., "TikTok", "Instagram", "רשתות חברתיות כלליות").

2.  **Provide General Suggestion for User ('generalSuggestion'):**
    *   Compose a helpful response for the user in Hebrew. This should address their query (if any).
    *   Suggest how users can search for similar dishes, cuisines, or flavor profiles on the SwiftServe app. Invent plausible dish names or restaurant types if needed. (e.g., "תוכל/י למצוא אתגרי ראמן חריפים דומים ב'בית הנודלס הלוהט' ב-SwiftServe," or "למשקה בטעם פיסטוק, נסה/י לחפש 'לאטה קרם פיסטוק' בבתי הקפה המיוחדים שלנו.")
    *   If it's a trend, you can add a brief comment about its popularity or unique aspects.

3.  **Provide Business Opportunity Insight (IF 'isTrend' is true and significant, populate 'businessOpportunity'):**
    *   If you identify a significant, actionable trend, populate the 'businessOpportunity' object. This is for businesses on SwiftServe. All suggestions should be in Hebrew.
    *   'suggestedItemName': Create a catchy, menu-ready name for a new item a local business could offer.
    *   'suggestedPriceRange': Suggest a plausible price range (e.g., "₪25-₪35", "$8-$12").
    *   'suggestedDescription': Write a brief, enticing menu description for this new item.
    *   'suggestedTags': Provide 2-3 relevant tags (e.g., "חדש", "להיט טיקטוק", "אתגר חריף", "זמן מוגבל", "בהשראת לקוחות").
    *   'rationale': Briefly explain why this trend could be a good opportunity for a local business on SwiftServe (e.g., "מעורבות משתמשים גבוהה בקטגוריה זו," "פוטנציאל ויראלי," "ממלא פער בהיצע המקומי הנוכחי," "קל להתאמה למטבחים קיימים").
    *   If the trend is minor or not actionable for a business, 'businessOpportunity' can be omitted.

Example Output (Significant TikTok Trend, no user query, in Hebrew):
{
  "identifiedDishName": "כנפי עוף ברוטב חמאת דבש חריפה",
  "isTrend": true,
  "trendSource": "TikTok",
  "generalSuggestion": "וואו, אלה נראות כמו כנפי העוף ברוטב חמאת דבש חריפה הטרנדיות שכובשות את טיקטוק! המנה הזו ידועה בשילוב הטעמים המדהים של מתוק, מלוח וחריף. לטעם דומה של אש ודבש ב-SwiftServe, נסה/י לחפש 'עוף קוריאני מטוגן בגלייז דבש' ב'סיאול פוד אקספרס' או גלה/י את קטגוריית 'עולם הכנפיים' שלנו.",
  "businessOpportunity": {
    "suggestedItemName": "כנפי הדבש הלוהטות של SwiftServe",
    "suggestedPriceRange": "₪35-₪45",
    "suggestedDescription": "כנפי עוף פריכות בגלייז חמאת דבש חריפה ייחודי שלנו. סנסציה ויראלית שתוכל/י לנסות עכשיו, בהשראת הטרנדים החמים בטיקטוק!",
    "suggestedTags": ["חדש", "ויראלי בטיקטוק", "חריף ומתוק", "בהשראת לקוחות"],
    "rationale": "פרופיל הטעם הזה של כנפיים זוכה לשיתופים רבים ברשתות החברתיות ומעיד על עניין רב מצד המשתמשים. הצגת גרסה ייחודית יכולה למשוך תשומת לב משמעותית ולרכוב על הגל הוויראלי."
  }
}

Example Output (General dish, user query "האם זה בריא?", in Hebrew):
{
  "identifiedDishName": "סלט קינואה עם ירקות קלויים",
  "isTrend": false,
  "generalSuggestion": "זו נראית כמו סלט קינואה עם ירקות קלויים. זו בדרך כלל בחירה בריאה ומאוזנת, עשירה בסיבים וחלבון! ב-SwiftServe, תוכל/י למצוא אפשרויות רבות של סלטים בריאים על ידי חיפוש 'קערות דגנים' או 'סלטי ירקות קלויים' תחת תגית 'אוכל בריא' שלנו.",
}
Output format should be JSON. Be creative and helpful! Ensure all text in the output is in Hebrew if the context is Hebrew.
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
        identifiedDishName: "לא זוהתה מנה",
        isTrend: false,
        generalSuggestion: "מצטערים, לא הצלחתי לנתח את התמונה כרגע. אנא נסה/י תמונה אחרת או חפש/י ידנית."
      }
    }
    return output;
  }
);
