
'use server';
/**
 * @fileOverview An AI flow for generating a weekly meal plan based on calorie targets and preferences.
 *
 * - generateWeeklyMenu - A function that returns a structured weekly meal plan.
 * - WeeklyMenuInput - The input type for the generateWeeklyMenu function.
 * - WeeklyMenuOutput - The return type for the generateWeeklyMenu function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define Zod schemas for input and output structures
const WeeklyMenuInputSchema = z.object({
  userId: z.string().describe('The ID of the user requesting the menu.'),
  targetDailyCalories: z.number().positive('Target daily calories must be a positive number.'),
  numberOfDays: z.number().int().min(1).max(7, 'Number of days must be between 1 and 7.'),
  preferences: z.string().optional().describe('User dietary preferences, restrictions, likes, or dislikes (e.g., "vegetarian, no gluten", "loves spicy food", "prefers quick meals").'),
});
export type WeeklyMenuInput = z.infer<typeof WeeklyMenuInputSchema>;

const MealSchema = z.object({
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']).describe("Type of the meal."),
  dishName: z.string().describe("Name of the dish for the meal."),
  estimatedCalories: z.number().int().positive().describe("Estimated calories for this dish."),
});

const DailyMealPlanSchema = z.object({
  day: z.string().describe("Label for the day (e.g., 'Day 1', 'Monday')."),
  meals: z.array(MealSchema).min(3, "Each day should have at least Breakfast, Lunch, and Dinner.").describe("List of meals for the day."),
  totalEstimatedCalories: z.number().int().positive().describe("Total estimated calories for the day."),
});

const WeeklyMenuOutputSchema = z.object({
  plan: z.array(DailyMealPlanSchema).describe('The generated weekly meal plan, with one entry per day.'),
  summaryNotes: z.string().optional().describe("General advice or notes about the meal plan, e.g., hydration, variety, snack timing."),
});
export type WeeklyMenuOutput = z.infer<typeof WeeklyMenuOutputSchema>;

export async function generateWeeklyMenu(input: WeeklyMenuInput): Promise<WeeklyMenuOutput> {
  return weeklyMenuPlannerFlow(input);
}

const weeklyMenuPlannerPrompt = ai.definePrompt({
  name: 'weeklyMenuPlannerPrompt',
  input: { schema: WeeklyMenuInputSchema },
  output: { schema: WeeklyMenuOutputSchema },
  prompt: `You are an AI Weekly Meal Planner for LivePick.
Your task is to create a structured meal plan for a user based on their calorie target, number of days, and preferences.

User ID: {{{userId}}}
Target Daily Calories: {{{targetDailyCalories}}} calories
Number of Days: {{{numberOfDays}}}
{{#if preferences}}User Preferences/Restrictions: "{{{preferences}}}"{{/if}}

For each day in the plan (from Day 1 to Day {{{numberOfDays}}}):
1.  Create meals for 'Breakfast', 'Lunch', and 'Dinner'. You can optionally add 1-2 'Snack' meals if it helps meet the calorie target.
2.  For each meal:
    *   'dishName': Provide a specific, appealing, and reasonably simple dish name. Assume dishes can be sourced from typical restaurants or easily prepared.
    *   'estimatedCalories': Assign a plausible calorie count for the dish.
3.  'totalEstimatedCalories': Sum the calories for all meals in that day. This sum should be reasonably close to the 'targetDailyCalories' (e.g., within 10-15%).
4.  Ensure variety across the days and meals. Avoid excessive repetition of the same dishes.
5.  If preferences are provided (e.g., "vegetarian", "low-carb", "no seafood"), strictly adhere to them. If "quick meals" is mentioned, suggest simpler dishes.
6.  Prioritize common, generally healthy food choices.

Example dishes for inspiration (adapt to calorie needs and preferences):
*   Breakfast: Oatmeal with Berries & Nuts, Scrambled Eggs with Whole Wheat Toast, Greek Yogurt with Granola, Smoothie (Fruit & Veg).
*   Lunch: Grilled Chicken Salad, Quinoa Bowl with Veggies & Chickpeas, Lentil Soup with Bread, Tuna Sandwich on Whole Wheat.
*   Dinner: Baked Salmon with Roasted Asparagus & Brown Rice, Tofu Stir-fry with Mixed Vegetables, Lean Beef Steak with Sweet Potato, Chicken Breast with Steamed Broccoli.
*   Snacks: Apple with Almond Butter, Handful of Almonds, Rice Cakes with Avocado, Hard-boiled Egg, Veggie Sticks with Hummus.

Finally, provide brief 'summaryNotes' (1-3 sentences) with general advice related to the plan, such as a reminder about hydration, the importance of variety, or adjusting portion sizes if needed.

Output the entire response as a single JSON object that strictly adheres to the WeeklyMenuOutputSchema.
The 'plan' should be an array of DailyMealPlanSchema objects.
Ensure 'day' labels are like "Day 1", "Day 2", etc.
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
      const fallbackDayPlan: WeeklyMenuOutput['plan'][0] = {
        day: "Day 1 (Sample)",
        meals: [
          { mealType: 'Breakfast', dishName: "Balanced Breakfast Bowl", estimatedCalories: Math.round(input.targetDailyCalories * 0.25) },
          { mealType: 'Lunch', dishName: "Healthy Lunch Plate", estimatedCalories: Math.round(input.targetDailyCalories * 0.35) },
          { mealType: 'Dinner', dishName: "Satisfying Dinner Option", estimatedCalories: Math.round(input.targetDailyCalories * 0.40) },
        ],
        totalEstimatedCalories: input.targetDailyCalories
      };
      return {
        plan: Array(input.numberOfDays).fill(null).map((_, i) => ({...fallbackDayPlan, day: `Day ${i+1} (Sample)`})),
        summaryNotes: "Failed to generate a detailed plan. This is a sample structure. Please try adjusting your inputs or try again later. Remember to focus on whole foods and portion control."
      };
    }
    // Ensure the plan length matches numberOfDays, or truncate/pad if necessary (simple version)
    if (output.plan.length !== input.numberOfDays) {
        console.warn(`AI generated plan for ${output.plan.length} days, user requested ${input.numberOfDays}. Adjusting.`);
        if (output.plan.length > input.numberOfDays) {
            output.plan = output.plan.slice(0, input.numberOfDays);
        } else {
            // Could add more days with a generic message, but for now just return what we have.
            // Or, provide a more robust fallback as above if length is 0.
        }
    }

    return output;
  }
);
