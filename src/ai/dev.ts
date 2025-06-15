
import { config } from 'dotenv';
config();

import '@/ai/flows/item-recommendation.ts';
import '@/ai/flows/courier-matching-flow.ts';
import '@/ai/flows/culinary-assistant-flow.ts';
import '@/ai/flows/chat-assistant-flow.ts';
import '@/ai/flows/identify-dish-flow.ts';
import '@/ai/flows/surprise-meal-flow.ts'; // Added new flow

