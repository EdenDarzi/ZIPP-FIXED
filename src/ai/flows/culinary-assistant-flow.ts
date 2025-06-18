
'use server';
/**
 * @fileOverview A flow for providing personalized culinary suggestions using AI.
 *
 * This module defines a Genkit flow that generates a food or meal suggestion
 * for a user, potentially based on their ID and the current day. It aims to
 * provide engaging and appealing recommendations.
 *
 * @module ai/flows/culinary-assistant-flow
 * @exports getCulinarySuggestion - The main function to retrieve a culinary suggestion.
 * @exports CulinaryAssistantInput - Zod schema for the input to the culinary assistant.
 * @exports CulinaryAssistantOutput - Zod schema for the output from the culinary assistant.
 * @exports type CulinaryAssistantInputType - TypeScript type for the input.
 * @exports type CulinaryAssistantOutputType - TypeScript type for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

/**
 * @description Zod schema for the input to the culinary assistant flow.
 * Defines the information needed to generate a personalized culinary suggestion.
 */
const CulinaryAssistantInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate a suggestion for.'),
  currentDay: z.string().optional().describe('The current day of the week, e.g., "Tuesday".'),
  // Future inputs: weather, mood, detailed order history, etc.
});
/**
 * @description TypeScript type for the culinary assistant input, inferred from CulinaryAssistantInputSchema.
 */
export type CulinaryAssistantInputType = z.infer<typeof CulinaryAssistantInputSchema>;

/**
 * @description Zod schema for the output from the culinary assistant flow.
 * Defines the structure of the generated culinary suggestion.
 */
const CulinaryAssistantOutputSchema = z.object({
  suggestion: z.string().describe('A personalized culinary suggestion for the user.'),
});
/**
 * @description TypeScript type for the culinary assistant output, inferred from CulinaryAssistantOutputSchema.
 */
export type CulinaryAssistantOutputType = z.infer<typeof CulinaryAssistantOutputSchema>;

/**
 * Retrieves a personalized culinary suggestion for the user.
 * This function acts as a wrapper around the Genkit flow.
 *
 * @async
 * @function getCulinarySuggestion
 * @param {CulinaryAssistantInputType} input - The input data, including userId and optionally the current day.
 * @returns {Promise<CulinaryAssistantOutputType>} A promise that resolves to the culinary suggestion.
 * @throws {Error} If the AI flow fails to generate a suggestion.
 */
export async function getCulinarySuggestion(input: CulinaryAssistantInputType): Promise<CulinaryAssistantOutputType> {
  return culinaryAssistantFlow(input);
}

const culinaryAssistantPrompt = ai.definePrompt({
  name: 'culinaryAssistantPrompt',
  input: {
    schema: CulinaryAssistantInputSchema,
  },
  output: {
    schema: CulinaryAssistantOutputSchema,
  },
  prompt: `You are a friendly and insightful Culinary Assistant for LivePick.
User ID: {{{userId}}}
{{#if currentDay}}היום {{{currentDay}}}.{{/if}}

Based on typical user behavior (you can invent some plausible typical behavior for {{{userId}}} if none is explicitly provided), provide a short, engaging suggestion for what they might like to order.
Keep it brief and appealing. Response should be in Hebrew.

Example (if user often orders Thai on Tuesdays, and currentDay is Tuesday):
"היום {{{currentDay}}}! מתחשק לך פאד תאי מהרגיל מ'תאי ספייס'? או שאולי מרגיש הרפתקני היום?"

Example (general suggestion):
"מרגיש/ה רעב/ה, {{{userId}}}? מה דעתך לחקור כמה אפשרויות איטלקיות טעימות בקרבתך?"

If no specific preference can be inferred, provide a general inviting suggestion in Hebrew.
Focus on a single, concise suggestion.
`,
});

const culinaryAssistantFlow = ai.defineFlow(
  {
    name: 'culinaryAssistantFlow',
    inputSchema: CulinaryAssistantInputSchema,
    outputSchema: CulinaryAssistantOutputSchema,
  },
  async (input) => {
    // In a real app, you might fetch user's actual order history here
    // and pass more context to the prompt.
    // For now, the prompt invents plausible behavior.

    const { output } = await culinaryAssistantPrompt(input);
    if (!output) {
        // Fallback suggestion in Hebrew
        return { suggestion: `משתמש יקר (${input.userId}), LivePick מציעה מגוון רחב של מאכלים לבחירתך! למה לא לבדוק את המסעדות החדשות באזור או לחפש את המנה האהובה עליך?` };
    }
    return output;
  }
);
