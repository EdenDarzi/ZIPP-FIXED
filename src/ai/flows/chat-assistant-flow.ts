
'use server';
/**
 * @fileOverview A flow for handling chat interactions with the AI ordering assistant.
 *
 * - getChatResponse - A function that returns a response from the AI assistant.
 * - ChatAssistantInput - The input type for the getChatResponse function.
 * - ChatAssistantOutput - The return type for the getChatResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatAssistantInputSchema = z.object({
  userInput: z.string().describe("The user's message to the chat assistant."),
  // Optional: chatHistory: z.array(z.object({ sender: z.enum(['user', 'ai']), text: z.string() })).optional(),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

const ChatAssistantOutputSchema = z.object({
  assistantResponse: z.string().describe("The AI assistant's response to the user."),
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

export async function getChatResponse(input: ChatAssistantInput): Promise<ChatAssistantOutput> {
  return chatAssistantFlow(input);
}

const chatAssistantPrompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: {
    schema: ChatAssistantInputSchema,
  },
  output: {
    schema: ChatAssistantOutputSchema,
  },
  prompt: `You are a friendly and helpful AI Ordering Assistant for SwiftServe, a food delivery app.
Your goal is to help users find what they want to eat and guide them through the ordering process if needed.
Keep your responses concise, helpful, and slightly enthusiastic.

User's message: "{{{userInput}}}"

Consider the user's input and provide a relevant response.
If the user asks for recommendations, you can suggest specific items or categories.
For example, if the user says "I'm hungry for something light, inexpensive, without meat", you could suggest:
"How about a fresh Tofu Salad from GreenWay? It's only ₪28, ready in about 12 minutes, and packed with flavor! Or perhaps a warm Vegetable Soup (₪22, 10 min) or a hearty Lentil Curry (₪30, 15 min)?"

If the user asks about an order, you can (eventually) provide status updates (currently, just acknowledge).
If the user asks a general question, answer it if you can, or politely say you can't help with that specific query.

Respond directly to the user's message.
`,
});

const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatAssistantInputSchema,
    outputSchema: ChatAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await chatAssistantPrompt(input);
    if (!output) {
        return { assistantResponse: "I'm sorry, I didn't quite catch that. Could you please rephrase?" };
    }
    return output;
  }
);
