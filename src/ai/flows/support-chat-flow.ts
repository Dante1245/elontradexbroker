'use server';
/**
 * @fileOverview A conversational AI flow for the ElonTradeX support bot.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportChatInputSchema = z.object({
  message: z.string().describe("The user's message or question to the support bot."),
});
export type SupportChatInput = z.infer<typeof SupportChatInputSchema>;

const SupportChatOutputSchema = z.string().describe("The support bot's response.");
export type SupportChatOutput = z.infer<typeof SupportChatOutputSchema>;

const prompt = ai.definePrompt({
  name: 'supportChatPrompt',
  input: {schema: SupportChatInputSchema},
  output: {schema: SupportChatOutputSchema.nullable()},
  prompt: `You are "Xavier", the friendly and helpful AI support assistant for ElonTradeX. Respond in the same language as the user.
  
  Knowledge Base:
  - ElonTradeX offers secure crypto trading.
  - New users get $200 USDT signup bonus.
  - Users can deposit/withdraw assets in the dashboard.
  - Contact: +1 209-650-1913 or support@elontradex.live
  
  User message: {{{message}}}`,
});

export const supportChatFlow = ai.defineFlow(
  {
    name: 'supportChatFlow',
    inputSchema: SupportChatInputSchema,
    outputSchema: SupportChatOutputSchema,
  },
  async (input) => {
    const {text} = await prompt(input);
    return text || "I am sorry, I couldn't process that.";
  }
);

export async function supportChat(input: SupportChatInput): Promise<SupportChatOutput> {
  return supportChatFlow(input);
}