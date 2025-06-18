
'use server';
/**
 * @fileOverview An AI flow for generating a weekly meal plan based on calorie targets and preferences.
 *
 * This module defines a Genkit flow that creates a structured meal plan for a specified
 * number of days, aiming to meet a target daily calorie intake and adhering to user
 * dietary preferences.
 *
 * @module ai/flows/weekly-menu-planner-flow
 * @exports generateWeeklyMenu - The main function to generate a weekly meal plan.
 * @exports WeeklyMenuInput - Zod schema for the input to the weekly menu planner.
 * @exports WeeklyMenuOutput - Zod schema for the output from the weekly menu planner.
 * @exports type WeeklyMenuInputType - TypeScript type for the input.
 * @exports type WeeklyMenuOutputType - TypeScript type for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { DailyMealPlan } from '@/types'; // Ensure DailyMealPlan is imported if used for type casting

// Define Zod schemas for input and output structures
/**
 * @description Zod schema for the input to the weekly menu planner flow.
 * Requires userId, target daily calories, number of days, and optional preferences.
 */
const WeeklyMenuInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting the menu.'),
  targetDailyCalories: z.number().positive('Target daily calories must be a positive number.'),
  numberOfDays: z.number().int().min(1).max(7, 'Number of days must be between 1 and 7.'),
  preferences: z.string().optional().describe('User dietary preferences, restrictions, likes, or dislikes (e.g., "vegetarian, no gluten", "loves spicy food", "prefers quick meals").'),
});
/**
 * @description TypeScript type for the weekly menu planner input, inferred from WeeklyMenuInputSchema.
 */
export type WeeklyMenuInputType = z.infer<typeof WeeklyMenuInputSchema>;

/**
 * @description Zod schema for a single meal within a daily plan.
 * Includes meal type, dish name, and estimated calories.
 */
const MealSchema = z.object({
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']).describe("Type of the meal."),
  dishName: z.string().describe("Name of the dish for the meal."),
  estimatedCalories: z.number().int().positive().describe("Estimated calories for this dish."),
});

/**
 * @description Zod schema for a daily meal plan.
 * Includes the day label, a list of meals, and total estimated calories for the day.
 */
const DailyMealPlanSchema = z.object({
  day: z.string().describe("Label for the day (e.g., 'Day 1', 'Monday')."),
  meals: z.array(MealSchema).min(3, "Each day should have at least Breakfast, Lunch, and Dinner.").describe("List of meals for the day."),
  totalEstimatedCalories: z.number().int().positive().describe("Total estimated calories for the day."),
});

/**
 * @description Zod schema for the output of the weekly menu planner flow.
 * Contains the generated meal plan (an array of daily plans) and optional summary notes.
 */
const WeeklyMenuOutputSchema = z.object({
  plan: z.array(DailyMealPlanSchema).describe('The generated weekly meal plan, with one entry per day.'),
  summaryNotes: z.string().optional().describe("General advice or notes about the meal plan, e.g., hydration, variety, snack timing."),
});
/**
 * @description TypeScript type for the weekly menu planner output, inferred from WeeklyMenuOutputSchema.
 */
export type WeeklyMenuOutputType = z.infer<typeof WeeklyMenuOutputSchema>;

/**
 * Generates a structured weekly meal plan based on user inputs.
 * This function wraps the Genkit flow `weeklyMenuPlannerFlow`.
 *
 * @async
 * @function generateWeeklyMenu
 * @param {WeeklyMenuInputType} input - User ID, calorie target, number of days, and preferences.
 * @returns {Promise<WeeklyMenuOutputType>} A promise that resolves to the generated weekly meal plan.
 * @throws {Error} If the AI flow fails to generate the menu.
 */
export async function generateWeeklyMenu(input: WeeklyMenuInputType): Promise<WeeklyMenuOutputType> {
  return weeklyMenuPlannerFlow(input);
}

const weeklyMenuPlannerPrompt = ai.definePrompt({
  name: 'weeklyMenuPlannerPrompt',
  input: { schema: WeeklyMenuInputSchema },
  output: { schema: WeeklyMenuOutputSchema },
  prompt: `You are an AI Weekly Meal Planner for LivePick.
Your task is to create a structured meal plan for a user based on their calorie target, number of days, and preferences.
All text output must be in Hebrew.

User ID: {{{userId}}}
Target Daily Calories: {{{targetDailyCalories}}} calories
Number of Days: {{{numberOfDays}}}
{{#if preferences}}User Preferences/Restrictions: "{{{preferences}}}"{{/if}}

For each day in the plan (from יום 1 to יום {{{numberOfDays}}}):
1.  Create meals for 'ארוחת בוקר', 'ארוחת צהריים', and 'ארוחת ערב'. You can optionally add 1-2 'נשנוש' meals if it helps meet the calorie target.
2.  For each meal:
    *   'dishName': Provide a specific, appealing, and reasonably simple dish name in Hebrew. Assume dishes can be sourced from typical restaurants or easily prepared.
    *   'estimatedCalories': Assign a plausible calorie count for the dish.
3.  'totalEstimatedCalories': Sum the calories for all meals in that day. This sum should be reasonably close to the 'targetDailyCalories' (e.g., within 10-15%).
4.  Ensure variety across the days and meals. Avoid excessive repetition of the same dishes.
5.  If preferences are provided (e.g., "צמחוני", "דל פחמימות", "ללא פירות ים"), strictly adhere to them. If "ארוחות מהירות" is mentioned, suggest simpler dishes.
6.  Prioritize common, generally healthy food choices.

Example dishes for inspiration (adapt to calorie needs and preferences, and translate to Hebrew for output):
*   Breakfast: Oatmeal with Berries & Nuts (שיבולת שועל עם פירות יער ואגוזים), Scrambled Eggs with Whole Wheat Toast (ביצים מקושקשות עם טוסט מחיטה מלאה), Greek Yogurt with Granola (יוגורט יווני עם גרנולה), Smoothie (Fruit & Veg) (שייק פירות וירקות).
*   Lunch: Grilled Chicken Salad (סלט עוף בגריל), Quinoa Bowl with Veggies & Chickpeas (קערת קינואה עם ירקות קלויים וגרגירי חומוס), Lentil Soup with Bread (מרק עדשים עם לחם), Tuna Sandwich on Whole Wheat (כריך טונה בלחם מחיטה מלאה).
*   Dinner: Baked Salmon with Roasted Asparagus & Brown Rice (סלמון אפוי עם אספרגוס ואורז מלא), Tofu Stir-fry with Mixed Vegetables (טופו מוקפץ עם ירקות), Lean Beef Steak with Sweet Potato (סטייק רזה עם בטטה), Chicken Breast with Steamed Broccoli (חזה עוף עם ברוקולי מאודה).
*   Snacks: Apple with Almond Butter (תפוח עם חמאת שקדים), Handful of Almonds (חופן שקדים), Rice Cakes with Avocado (פריכיות אורז עם אבוקדו), Hard-boiled Egg (ביצה קשה), Veggie Sticks with Hummus (מקלות ירקות עם חומוס).

Finally, provide brief 'summaryNotes' (1-3 sentences) in Hebrew with general advice related to the plan, such as a reminder about hydration, the importance of variety, or adjusting portion sizes if needed.

Output the entire response as a single JSON object that strictly adheres to the WeeklyMenuOutputSchema.
The 'plan' should be an array of DailyMealPlanSchema objects.
Ensure 'day' labels are like "יום 1", "יום 2", etc.
Meal types should be 'ארוחת בוקר', 'ארוחת צהריים', 'ארוחת ערב', 'נשנוש'.
`,
});

const weeklyMenuPlannerFlow = ai.defineFlow(
  {
    name: 'weeklyMenuPlannerFlow',
    inputSchema: WeeklyMenuInputSchema,
    outputSchema: WeeklyMenuOutputSchema,
  },
  async (input) => {
    const { output } = await weeklyMenuPlannerPrompt(input);
    if (!output || !output.plan || output.plan.length === 0) {
      // Fallback in case the AI fails to generate a structured plan
      const fallbackDayPlan: DailyMealPlan = { 
        day: "יום 1 (הדגמה)",
        meals: [
          { mealType: 'Breakfast', dishName: "ארוחת בוקר לדוגמה", estimatedCalories: Math.round(input.targetDailyCalories * 0.25) },
          { mealType: 'Lunch', dishName: "ארוחת צהריים לדוגמה", estimatedCalories: Math.round(input.targetDailyCalories * 0.35) },
          { mealType: 'Dinner', dishName: "ארוחת ערב לדוגמה", estimatedCalories: Math.round(input.targetDailyCalories * 0.40) },
        ],
        totalEstimatedCalories: input.targetDailyCalories
      };
      return {
        plan: Array(input.numberOfDays).fill(null).map((_, i) => ({...fallbackDayPlan, day: `יום ${i+1} (הדגמה)`})),
        summaryNotes: "לא הצלחנו ליצור תוכנית מפורטת כרגע. זוהי דוגמה למבנה. אנא נסה/י לשנות את הקלט או נסה/י שוב מאוחר יותר. זכור/י להתמקד במזונות מלאים ובקרת מנות."
      };
    }
    // Ensure the plan length matches numberOfDays, or adjust if necessary
    if (output.plan.length !== input.numberOfDays) {
        console.warn(`AI generated plan for ${output.plan.length} days, user requested ${input.numberOfDays}.`);
        if (output.plan.length > input.numberOfDays) {
            output.plan = output.plan.slice(0, input.numberOfDays);
        } else {
            // If AI generated fewer days than requested, pad with generic days.
            const numMissingDays = input.numberOfDays - output.plan.length;
            for (let i = 0; i < numMissingDays; i++) {
                 const fallbackDayPlan: DailyMealPlan = {
                    day: `יום ${output.plan.length + i + 1} (השלמה)`,
                    meals: [
                      { mealType: 'Breakfast', dishName: "ארוחה לדוגמה", estimatedCalories: Math.round(input.targetDailyCalories * 0.25) },
                      { mealType: 'Lunch', dishName: "ארוחה לדוגמה", estimatedCalories: Math.round(input.targetDailyCalories * 0.35) },
                      { mealType: 'Dinner', dishName: "ארוחה לדוגמה", estimatedCalories: Math.round(input.targetDailyCalories * 0.40) },
                    ],
                    totalEstimatedCalories: input.targetDailyCalories
                  };
                output.plan.push(fallbackDayPlan);
            }
        }
    }

    return output;
  }
);
