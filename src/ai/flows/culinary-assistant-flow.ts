
'use server';
/**
 * @fileOverview A flow for providing personalized culinary suggestions.
 *
 * - getCulinarySuggestion - A function that returns a suggestion for a user.
 * - CulinaryAssistantInput - The input type for the getCulinarySuggestion function.
 * - CulinaryAssistantOutput - The return type for the getCulinarySuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CulinaryAssistantInputSchema = z.object({
  userId: z.string().describe('The ID of the user to generate a suggestion for.'),
  currentDay: z.string().optional().describe('The current day of the week, e.g., "Tuesday".'),
  // Future inputs: weather, mood, detailed order history, etc.
});
export type CulinaryAssistantInput = z.infer<typeof CulinaryAssistantInputSchema>;

const CulinaryAssistantOutputSchema = z.object({
  suggestion: z.string().describe('A personalized culinary suggestion for the user.'),
});
export type CulinaryAssistantOutput = z.infer<typeof CulinaryAssistantOutputSchema>;

export async function getCulinarySuggestion(input: CulinaryAssistantInput): Promise<CulinaryAssistantOutput> {
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
{{#if currentDay}}Today is {{{currentDay}}}.{{/if}}

Based on typical user behavior (you can invent some plausible typical behavior for {{{userId}}} if none is explicitly provided), provide a short, engaging suggestion for what they might like to order.
Keep it brief and appealing.

Example (if user often orders Thai on Tuesdays):
"It's {{{currentDay}}}! Craving your usual Pad Thai from Thai Spice? Or perhaps feeling adventurous today?"

Example (general suggestion):
"Feeling hungry, {{{userId}}}? How about exploring some delicious Italian options near you?"

If no specific preference can be inferred, provide a general inviting suggestion.
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
        // Fallback suggestion
        return { suggestion: `Welcome back, ${input.userId}! What culinary adventure are we embarking on today?` };
    }
    return output;
  }
);
