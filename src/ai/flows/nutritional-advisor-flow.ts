
'use server';
/**
 * @fileOverview An AI flow for providing nutritional advice and dish recommendations.
 *
 * This module defines a Genkit flow that helps users achieve their nutritional goals
 * by suggesting suitable dishes available through the LivePick app. It considers user
 * goals (e.g., toning, weight loss) and preferences.
 *
 * @module ai/flows/nutritional-advisor-flow
 * @exports getNutritionalAdvice - The main function to get nutritional advice and recommendations.
 * @exports NutritionalAdvisorInput - Zod schema for the input to the nutritional advisor.
 * @exports NutritionalAdvisorOutput - Zod schema for the output from the nutritional advisor.
 * @exports type NutritionalAdvisorInputType - TypeScript type for the input.
 * @exports type NutritionalAdvisorOutputType - TypeScript type for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { NutritionalGoal, DishRecommendation } from '@/types'; // Assuming these types are defined as per the Zod schemas below or elsewhere

/**
 * @description Zod enum for predefined nutritional goals.
 */
const NutritionalGoalEnum = z.enum([
  'TONING', 
  'WEIGHT_LOSS', 
  'ENERGY_BOOST', 
  'GENERAL_HEALTHY',
  'MUSCLE_GAIN',
  'SUGAR_BALANCE',
  'KETO',
  'VEGETARIAN',
  'PALEO'
]);

/**
 * @description Zod schema for the input to the nutritional advisor flow.
 * Requires a userId, a nutritional goal, and optional dietary preferences.
 */
const NutritionalAdvisorInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting advice.'),
  goal: NutritionalGoalEnum.describe('The nutritional goal selected by the user.'),
  preferences: z.string().optional().describe('User dietary preferences, restrictions, likes, or dislikes (e.g., "vegetarian, no gluten", "loves spicy food").'),
});
/**
 * @description TypeScript type for the nutritional advisor input, inferred from NutritionalAdvisorInputSchema.
 */
export type NutritionalAdvisorInputType = z.infer<typeof NutritionalAdvisorInputSchema>;

/**
 * @description Zod schema for a single dish recommendation.
 * Includes dish name, restaurant, description, estimated nutritional info, and reasoning.
 */
const DishRecommendationSchema = z.object({
  dishName: z.string().describe("The name of the recommended dish."),
  restaurantName: z.string().describe("A plausible fictional restaurant name or type of restaurant (e.g., 'Green Leaf Cafe', 'Protein Powerhouse Kitchen')."),
  description: z.string().describe("A brief, enticing description of the dish and its benefits for the goal."),
  estimatedCalories: z.number().optional().describe("An estimated calorie count for the dish."),
  estimatedProteinGrams: z.number().optional().describe("An estimated amount of protein in grams."),
  reasoning: z.string().describe("A short explanation of why this dish is suitable for the user's goal and preferences."),
});

/**
 * @description Zod schema for the output of the nutritional advisor flow.
 * Provides a list of dish recommendations and general advice.
 */
const NutritionalAdvisorOutputSchema = z.object({
  recommendations: z.array(DishRecommendationSchema).describe('A list of 2-3 dish recommendations tailored to the user.'),
  generalAdvice: z.string().optional().describe("A piece of general nutritional advice related to the goal."),
});
/**
 * @description TypeScript type for the nutritional advisor output, inferred from NutritionalAdvisorOutputSchema.
 */
export type NutritionalAdvisorOutputType = z.infer<typeof NutritionalAdvisorOutputSchema>;

/**
 * Retrieves nutritional advice and dish recommendations based on user's goals and preferences.
 * This function wraps the Genkit flow `nutritionalAdvisorFlow`.
 *
 * @async
 * @function getNutritionalAdvice
 * @param {NutritionalAdvisorInputType} input - User ID, nutritional goal, and dietary preferences.
 * @returns {Promise<NutritionalAdvisorOutputType>} A promise that resolves to dish recommendations and general advice.
 * @throws {Error} If the AI flow fails to generate advice.
 */
export async function getNutritionalAdvice(input: NutritionalAdvisorInputType): Promise<NutritionalAdvisorOutputType> {
  return nutritionalAdvisorFlow(input);
}

const nutritionalAdvisorPrompt = ai.definePrompt({
  name: 'nutritionalAdvisorPrompt',
  input: { schema: NutritionalAdvisorInputSchema },
  output: { schema: NutritionalAdvisorOutputSchema },
  prompt: `You are an AI Nutritional Advisor for LivePick, a food delivery app.
Your goal is to help users achieve their nutritional objectives by recommending suitable dishes.
User ID: {{{userId}}}
Nutritional Goal: {{{goal}}}
{{#if preferences}}User Preferences/Restrictions: "{{{preferences}}}"{{/if}}

Based on the user's goal and preferences, provide 2-3 diverse dish recommendations.
For each recommendation, include:
1.  'dishName': A specific and appealing name for the dish.
2.  'restaurantName': A plausible fictional restaurant name or a type of restaurant that would serve such a dish (e.g., "The Lean Machine", "Salad Bar Supreme", "Energy Fuel Stop", "Keto Kitchen", "Paleo Plate").
3.  'description': A brief (1-2 sentences) enticing description of the dish, highlighting its key ingredients and how it supports the user's goal.
4.  'estimatedCalories': A plausible estimate (e.g., 300-600).
5.  'estimatedProteinGrams': A plausible estimate (e.g., 15-40).
6.  'reasoning': A short, clear explanation of why this particular dish aligns with the user's goal and any stated preferences/restrictions.

Consider these example dish archetypes and their suitability for different goals when making your recommendations. You can use these as inspiration or recommend variations.
*   **Grilled Chicken Salad:** (Good for: TONING, WEIGHT_LOSS, GENERAL_HEALTHY, MUSCLE_GAIN) - High protein, low carb.
*   **Quinoa Bowl with Roasted Vegetables & Chickpeas:** (Good for: ENERGY_BOOST, GENERAL_HEALTHY, WEIGHT_LOSS, VEGETARIAN) - Balanced complex carbs, fiber, protein.
*   **Lentil Soup:** (Good for: GENERAL_HEALTHY, WEIGHT_LOSS, VEGETARIAN) - High fiber, plant-based protein.
*   **Baked Salmon with Steamed Asparagus and Brown Rice:** (Good for: TONING, ENERGY_BOOST, GENERAL_HEALTHY, MUSCLE_GAIN, SUGAR_BALANCE) - High protein, omega-3s, complex carbs.
*   **Fruit Smoothie with Protein Powder & Spinach:** (Good for: ENERGY_BOOST, TONING, MUSCLE_GAIN) - Quick nutrients, protein.
*   **Tofu Stir-fry with Mixed Vegetables and a light soy-ginger sauce:** (Good for: WEIGHT_LOSS, GENERAL_HEALTHY, VEGETARIAN) - Plant-based protein, lots of veggies.
*   **Greek Yogurt Parfait with Berries and Nuts:** (Good for: ENERGY_BOOST, TONING, GENERAL_HEALTHY, SUGAR_BALANCE) - Protein, fiber, healthy fats.
*   **Avocado and Egg on Whole Wheat Toast:** (Good for: KETO (modify bread), PALEO (no bread), SUGAR_BALANCE, GENERAL_HEALTHY) - Healthy fats, protein.
*   **Steak with Cauliflower Mash:** (Good for: KETO, PALEO, MUSCLE_GAIN, TONING) - High protein, low carb.

Also, provide one short piece of 'generalAdvice' (1-2 sentences) related to the user's selected nutritional goal that is encouraging and actionable.
Tailor the advice to the specific goal (e.g., for KETO, mention electrolytes; for MUSCLE_GAIN, mention protein timing).

Ensure your response strictly follows the output schema, providing an array for 'recommendations'.
If no preferences are given, make generally suitable suggestions for the goal.
If preferences are given (e.g., "vegetarian", "no nuts"), ensure your recommendations respect these.
Be creative and helpful!
`,
});

const nutritionalAdvisorFlow = ai.defineFlow(
  {
    name: 'nutritionalAdvisorFlow',
    inputSchema: NutritionalAdvisorInputSchema,
    outputSchema: NutritionalAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await nutritionalAdvisorPrompt(input);
    if (!output || !output.recommendations || output.recommendations.length === 0) {
      // Fallback in case the AI fails to generate structured output or no recommendations
      return {
        recommendations: [{
          dishName: "קערת השף המאוזנת",
          restaurantName: "קפה בריאות והרגלים טובים",
          description: "קערה ורסטילית המתאימה למטרות רבות, לרוב כוללת חלבון רזה, דגנים מלאים וירקות טריים.",
          estimatedCalories: 450,
          estimatedProteinGrams: 25,
          reasoning: "זוהי אופציה בריאה כללית. אנא דייק/י את העדפותיך לייעוץ ספציפי יותר!"
        }],
        generalAdvice: "זכור/י לשמור על שתייה מרובה ולהקשיב לאותות הרעב של גופך!"
      };
    }
    return output;
  }
);

    