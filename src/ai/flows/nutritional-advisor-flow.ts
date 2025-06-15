
'use server';
/**
 * @fileOverview An AI flow for providing nutritional advice and dish recommendations.
 *
 * - getNutritionalAdvice - A function that returns dish recommendations based on nutritional goals.
 * - NutritionalAdvisorInput - The input type for the getNutritionalAdvice function.
 * - NutritionalAdvisorOutput - The return type for the getNutritionalAdvice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { NutritionalGoal, DishRecommendation } from '@/types';

const NutritionalGoalEnum = z.enum(['TONING', 'WEIGHT_LOSS', 'ENERGY_BOOST', 'GENERAL_HEALTHY']);

const NutritionalAdvisorInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting advice.'),
  goal: NutritionalGoalEnum.describe('The nutritional goal selected by the user.'),
  preferences: z.string().optional().describe('User dietary preferences, restrictions, likes, or dislikes (e.g., "vegetarian, no gluten", "loves spicy food").'),
});
export type NutritionalAdvisorInput = z.infer<typeof NutritionalAdvisorInputSchema>;

const DishRecommendationSchema = z.object({
  dishName: z.string().describe("The name of the recommended dish."),
  restaurantName: z.string().describe("A plausible fictional restaurant name or type of restaurant (e.g., 'Green Leaf Cafe', 'Protein Powerhouse Kitchen')."),
  description: z.string().describe("A brief, enticing description of the dish and its benefits for the goal."),
  estimatedCalories: z.number().optional().describe("An estimated calorie count for the dish."),
  estimatedProteinGrams: z.number().optional().describe("An estimated amount of protein in grams."),
  reasoning: z.string().describe("A short explanation of why this dish is suitable for the user's goal and preferences."),
});

const NutritionalAdvisorOutputSchema = z.object({
  recommendations: z.array(DishRecommendationSchema).describe('A list of 2-3 dish recommendations tailored to the user.'),
  generalAdvice: z.string().optional().describe("A piece of general nutritional advice related to the goal."),
});
export type NutritionalAdvisorOutput = z.infer<typeof NutritionalAdvisorOutputSchema>;

export async function getNutritionalAdvice(input: NutritionalAdvisorInput): Promise<NutritionalAdvisorOutput> {
  return nutritionalAdvisorFlow(input);
}

const nutritionalAdvisorPrompt = ai.definePrompt({
  name: 'nutritionalAdvisorPrompt',
  input: { schema: NutritionalAdvisorInputSchema },
  output: { schema: NutritionalAdvisorOutputSchema },
  prompt: `You are an AI Nutritional Advisor for SwiftServe, a food delivery app.
Your goal is to help users achieve their nutritional objectives by recommending suitable dishes.
User ID: {{{userId}}}
Nutritional Goal: {{{goal}}}
{{#if preferences}}User Preferences/Restrictions: "{{{preferences}}}"{{/if}}

Based on the user's goal and preferences, provide 2-3 diverse dish recommendations.
For each recommendation, include:
1.  'dishName': A specific and appealing name for the dish.
2.  'restaurantName': A plausible fictional restaurant name or a type of restaurant that would serve such a dish (e.g., "The Lean Machine", "Salad Bar Supreme", "Energy Fuel Stop").
3.  'description': A brief (1-2 sentences) enticing description of the dish, highlighting its key ingredients and how it supports the user's goal.
4.  'estimatedCalories': A plausible estimate (e.g., 300-600).
5.  'estimatedProteinGrams': A plausible estimate (e.g., 15-40).
6.  'reasoning': A short, clear explanation of why this particular dish aligns with the user's goal and any stated preferences/restrictions.

Consider these example dish archetypes and their suitability for different goals when making your recommendations. You can use these as inspiration or recommend variations.
*   **Grilled Chicken Salad:** (Good for: TONING, WEIGHT_LOSS, GENERAL_HEALTHY) - High protein, low carb.
*   **Quinoa Bowl with Roasted Vegetables & Chickpeas:** (Good for: ENERGY_BOOST, GENERAL_HEALTHY, WEIGHT_LOSS) - Balanced complex carbs, fiber, protein.
*   **Lentil Soup:** (Good for: GENERAL_HEALTHY, WEIGHT_LOSS) - High fiber, plant-based protein.
*   **Baked Salmon with Steamed Asparagus and Brown Rice:** (Good for: TONING, ENERGY_BOOST, GENERAL_HEALTHY) - High protein, omega-3s, complex carbs.
*   **Fruit Smoothie with Protein Powder & Spinach:** (Good for: ENERGY_BOOST, TONING) - Quick nutrients, protein.
*   **Tofu Stir-fry with Mixed Vegetables and a light soy-ginger sauce:** (Good for: WEIGHT_LOSS, GENERAL_HEALTHY, VEGAN_OPTION) - Plant-based protein, lots of veggies.
*   **Greek Yogurt Parfait with Berries and Nuts:** (Good for: ENERGY_BOOST, TONING, GENERAL_HEALTHY) - Protein, fiber, healthy fats.

Also, provide one short piece of 'generalAdvice' (1-2 sentences) related to the user's selected nutritional goal that is encouraging and actionable.

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
          dishName: "Chef's Balanced Bowl",
          restaurantName: "Healthy Habits Cafe",
          description: "A versatile bowl adaptable to many goals, typically featuring lean protein, whole grains, and fresh vegetables.",
          estimatedCalories: 450,
          estimatedProteinGrams: 25,
          reasoning: "This is a general healthy option. Please refine your preferences for more specific advice!"
        }],
        generalAdvice: "Remember to stay hydrated and listen to your body's hunger cues!"
      };
    }
    return output;
  }
);

