
'use server';
/**
 * @fileOverview An AI flow for identifying a dish or culinary trend from an image, video, or text description,
 * and providing suggestions for businesses on the ZIPP platform that might offer similar items.
 *
 * This module uses Genkit to define a flow that takes various inputs (image, video, text).
 * It then attempts to identify the dish/trend and suggests relevant businesses on ZIPP.
 *
 * @module ai/flows/identify-dish-flow
 * @exports identifyDishFromImage - The main function to trigger the dish identification flow.
 * @exports IdentifyDishInputType - Zod schema for the input to the flow.
 * @exports IdentifyDishOutputType - Zod schema for the output from the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * @description Zod schema for a suggested business on ZIPP.
 */
const SuggestedBusinessSchema = z.object({
    name: z.string().describe("שם העסק המומלץ ב-ZIPP."),
    reason: z.string().describe("מדוע עסק זה עשוי להציע את הטרנד או משהו דומה."),
    mockRestaurantId: z.string().describe("מזהה מדומה של העסק (לצורך קישור בהדגמה)."),
    imageUrl: z.string().url().optional().describe("כתובת URL לתמונת העסק או המנה הרלוונטית."),
    dataAiHint: z.string().optional().describe("רמז AI לתמונה אם זו תמונת Placeholder."),
});

/**
 * @description Zod schema for the input to the "Identify Dish from Image/Video/Text" flow.
 */
const IdentifyDishInputSchema = z.object({
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "A photo of a food item, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  videoDataUri: z
    .string()
    .optional()
    .describe(
      "A short video of a food item/trend, as a data URI. Currently treated as an image by AI. Format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  trendDescription: z
    .string()
    .optional()
    .describe(
        "תיאור טקסטואלי של הטרנד, המנה, או המרכיבים שהמשתמש מחפש."
    ),
  userQuery: z
    .string()
    .optional()
    .describe('Optional user query related to the image/video/description, e.g., "Is this spicy?" or "Where can I find this trend?".'),
});
export type IdentifyDishInputType = z.infer<typeof IdentifyDishInputSchema>;


/**
 * @description Zod schema for a business opportunity suggestion derived from an identified food trend.
 * This is used if no direct business match is found.
 */
const BusinessOpportunitySchema = z.object({
    suggestedItemName: z.string().describe("A catchy, menu-ready name for a new item based on the trend."),
    suggestedPriceRange: z.string().optional().describe("A suggested price range, e.g., '₪30-₪40', '$8-$12'."),
    suggestedDescription: z.string().describe("A brief, enticing description for the new menu item."),
    suggestedTags: z.array(z.string()).optional().describe("Relevant tags for the new item, e.g., ['New', 'TikTok Inspired', 'Spicy']."),
    rationale: z.string().describe("A short reason why this trend might be a good opportunity for a local business."),
});

/**
 * @description Zod schema for the output of the "Identify Dish from Image/Video/Text" flow.
 */
const IdentifyDishOutputSchema = z.object({
  identifiedDishName: z.string().describe("The name of the dish/trend identified from the input. If unsure, state 'פריט מזון זוהה' or similar."),
  isTrend: z.boolean().optional().describe("Indicates if the identified item is considered a significant social media trend."),
  trendSource: z.string().optional().describe("If it's a trend, mention potential source (e.g., 'TikTok', 'Instagram')."),
  generalSuggestion: z.string().describe("A helpful response for the user, possibly guiding them to search ZIPP or providing context."),
  suggestedBusinesses: z.array(SuggestedBusinessSchema).optional().describe("A list of businesses on ZIPP that might offer this trend or similar items."),
  businessOpportunity: BusinessOpportunitySchema.optional().describe("If no direct business match is found BUT a strong trend is identified, provide a structured suggestion for businesses on ZIPP."),
});
export type IdentifyDishOutputType = z.infer<typeof IdentifyDishOutputSchema>;


export async function identifyDishFromImage(input: IdentifyDishInputType): Promise<IdentifyDishOutputType> {
  // Check if AI is available
  const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!hasApiKey) {
    return {
      identifiedDishName: "זיהוי תמונה זמנית לא זמין",
      isTrend: false,
      generalSuggestion: "מצטער, שירות זיהוי התמונה זמנית לא זמין. אנא נסה לחפש ידנית במסעדות שלנו!",
      suggestedBusinesses: []
    };
  }
  
  try {
    return await identifyDishFlow(input);
  } catch (error) {
    console.error('Identify dish error:', error);
    return {
      identifiedDishName: "שגיאה בזיהוי תמונה",
      isTrend: false,
      generalSuggestion: "מצטער, נתקלתי בבעיה בזיהוי התמונה. אנא נסה שוב מאוחר יותר.",
      suggestedBusinesses: []
    };
  }
}

const identifyDishPrompt = ai.definePrompt({
  name: 'identifyDishPrompt',
  input: { schema: IdentifyDishInputSchema },
  output: { schema: IdentifyDishOutputSchema },
  prompt: `You are the ZIPP AI TrendScanner, an expert in identifying food dishes and culinary trends from images, videos (treat videoDataUri as an image for now), or text descriptions. Your primary goal is to help users find businesses on the ZIPP platform that offer these trends or similar items. You also provide actionable insights for businesses on ZIPP.

User input:
{{#if imageDataUri}}Image: {{media url=imageDataUri}}{{/if}}
{{#if videoDataUri}}Video (analyze as image): {{media url=videoDataUri}}{{/if}}
{{#if trendDescription}}Trend Description: "{{{trendDescription}}}"{{/if}}
{{#if userQuery}}User's specific query: "{{{userQuery}}}"{{/if}}

Your task (all text output must be in Hebrew):
1.  **Identify the Dish/Trend:**
    *   Based on ALL provided inputs (image, video, text description), name the food item or culinary trend (e.g., "Korean Cheese Corn Dog," "Cloud Bread," "Pistachio Matcha Latte", "Folded Kimbap", "Pasta with Vodka Sauce and Burrata").
    *   If unsure, state "פריט מזון זוהה" or "טרנד קולינרי מעניין זוהה."
    *   Set 'isTrend' to true if this is a notable social media trend, otherwise false.
    *   If 'isTrend' is true, mention the likely 'trendSource' (e.g., "TikTok", "Instagram", "רשתות חברתיות כלליות").

2.  **Suggest Businesses on ZIPP ('suggestedBusinesses'):**
    *   This is your PRIMARY GOAL. Based on the identified dish/trend, suggest 1-3 plausible (fictional, for this demo) businesses *available on the ZIPP platform* that might offer this item or something very similar.
    *   For each suggested business:
        *   'name': A plausible business name (e.g., "הפינה הקוריאנית של דוד", "קפה ענן", "האיטלקיה הטרנדית").
        *   'reason': A short explanation why this business is a good match (e.g., "מתמחים באוכל רחוב קוריאני", "ידועים במשקאות מיוחדים", "מגישים פסטות עם טוויסט מודרני").
        *   'mockRestaurantId': A fictional ID like 'zippBiz123', 'zippBiz456'.
        *   'imageUrl': A placeholder image URL like 'https://placehold.co/80x80.png'.
        *   'dataAiHint': A 1-2 word hint for the image, e.g., "korean street food", "specialty coffee".
    *   If no direct matches are found, this array can be empty or omitted.

3.  **Provide General Suggestion for User ('generalSuggestion'):**
    *   Compose a helpful response. If businesses were suggested, briefly mention them.
    *   If no businesses were found, explain that and suggest how users can search more broadly on ZIPP (e.g., "לא מצאנו עסק ספציפי המציע את הטרנד הזה כרגע, אך תוכל/י לחפש 'אוכל קוריאני' או 'קינוחים מיוחדים' באפליקציית ZIPP.").
    *   Address the user's query if provided.

4.  **Business Opportunity Insight (IF no direct business matches are found AND 'isTrend' is true and significant, populate 'businessOpportunity'):**
    *   This is a FALLBACK if no ZIPP businesses are found for a clear trend.
    *   'suggestedItemName': Create a catchy, menu-ready name.
    *   'suggestedDescription': Write an enticing menu description.
    *   'rationale': Explain why this trend could be good for *any* ZIPP business.
    *   (Optional fields: 'suggestedPriceRange', 'suggestedTags').

Example Output (Identified Trend, Found ZIPP Businesses):
{
  "identifiedDishName": "סופגניות מוצ'י במילוי גלידה",
  "isTrend": true,
  "trendSource": "TikTok, Instagram",
  "generalSuggestion": "טרנד המוצ'י-גלידה כובש את הרשת! מצאנו כמה מקומות ב-ZIPP שעשויים להתאים לך: 'קינוחי טוקיו' בזכות ההתמחות שלהם בקינוחים יפניים, ו'גלידת הפלא' שידועה בטעמים המיוחדים. כדאי לבדוק את התפריטים שלהם!",
  "suggestedBusinesses": [
    { "name": "קינוחי טוקיו", "reason": "מתמחים בקינוחים יפניים ועשויים להציע גרסה משלהם למוצ'י.", "mockRestaurantId": "zippBiz001", "imageUrl": "https://placehold.co/80x80.png", "dataAiHint": "japanese dessert" },
    { "name": "גלידת הפלא", "reason": "ידועים בגלידות ארטיזנליות בטעמים מיוחדים, אולי יש להם מוצ'י ממולא.", "mockRestaurantId": "zippBiz002", "imageUrl": "https://placehold.co/80x80.png", "dataAiHint": "ice cream shop" }
  ]
}

Example Output (Identified Trend, NO ZIPP Businesses Found, Suggest Business Opportunity):
{
  "identifiedDishName": "לחמניית ענן אוורירית",
  "isTrend": true,
  "trendSource": "רשתות חברתיות",
  "generalSuggestion": "לחמניות ענן הן טרנד אפייה ויראלי! לא מצאנו עסקים ספציפיים ב-ZIPP שמציעים אותן כרגע, אבל זה בהחלט משהו שכדאי לחפש תחת קטגוריית 'מאפיות' או 'קינוחים מיוחדים'.",
  "businessOpportunity": {
    "suggestedItemName": "ענני ZIPP המתוקים",
    "suggestedDescription": "לחמניות ענן אווריריות וקלות במגוון טעמים מפתיעים. הקינוח המושלם לצד הקפה או סתם כשבא משהו מתוק ומיוחד.",
    "rationale": "טרנד ויראלי עם פוטנציאל משיכה גבוה, קל יחסית להכנה וניתן להתאמה למגוון טעמים וצבעים."
  }
}

Output format should be JSON. Be creative and helpful! Ensure all text in the output is in Hebrew.
Prioritize finding matching ZIPP businesses.
If imageDataUri and videoDataUri are both present, prioritize imageDataUri.
If only trendDescription is present, base your identification and suggestions on that.
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
        identifiedDishName: "ניתוח AI נכשל",
        isTrend: false,
        generalSuggestion: "מצטערים, לא הצלחנו לנתח את הקלט כרגע. אנא נסה/י שוב עם תמונה/וידאו/תיאור ברורים יותר או חפש/י ידנית ב-ZIPP."
      }
    }
    // Ensure suggestedBusinesses is an array even if AI omits it when empty
    if (!output.suggestedBusinesses) {
        output.suggestedBusinesses = [];
    }
    return output;
  }
);
    