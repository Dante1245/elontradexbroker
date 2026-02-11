
'use server';
/**
 * @fileOverview An AI agent that can answer questions about the ElonTradeX admin panel.
 *
 * - adminAgent - A function that handles conversational queries about the admin panel.
 * - AdminAgentInput - The input type for the adminAgent function.
 * - AdminAgentOutput - The return type for the adminAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminAgentInputSchema = z.object({
  query: z.string().describe("The admin's question about the platform's features or data."),
});
export type AdminAgentInput = z.infer<typeof AdminAgentInputSchema>;

const AdminAgentOutputSchema = z.string().describe("The AI agent's response.");
export type AdminAgentOutput = z.infer<typeof AdminAgentOutputSchema>;

export async function adminAgent(input: AdminAgentInput): Promise<AdminAgentOutput> {
  return adminAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminAgentPrompt',
  input: {schema: AdminAgentInputSchema},
  output: {schema: AdminAgentOutputSchema.nullable()},
  prompt: `You are a helpful AI assistant for the administrators of the "ElonTradeX" platform.

Your role is to provide clear and concise answers about the functionalities of the admin panel based *only* on the information provided below. Do not invent features.

***

## ElonTradeX Admin Panel Information

**Core Purpose:**
The admin panel is the central hub for managing the ElonTradeX platform, its users, and its core settings.

**Key Features:**

*   **Dashboard:**
    *   Provides a high-level overview of key metrics.
    *   Displays: Total Users, Signups in the last 24 hours, Pending Withdrawals, and Total Transactions.

*   **User Management:**
    *   View a list of all registered users.
    *   Search for users by name or email.
    *   Edit individual user details, including:
        *   **Balance:** Modify the user's account balance (in USD).
        *   **Wallet Address:** Update the user's primary wallet address. This will also update their deposit QR code.
        *   **Transactions:** Manually add or remove transaction records (Deposit, Withdrawal, Bonus) for a user.

*   **Withdrawal Requests:**
    *   Review all pending withdrawal requests from users.
    *   Each request shows the user ID, asset, amount, and destination address.
    *   Admins can **Approve** or **Decline** each request. The status is updated accordingly.

*   **Broadcast Messages:**
    *   Send site-wide announcements or messages to all registered users simultaneously.

*   **Site Settings:**
    *   Manage global settings for the platform.
    *   The primary function is to update the **Main Wallet Deposit Address (BTC)**. This is the address shown to all users for making deposits.

***

Admin's Question: {{{query}}}
`,
});

const adminAgentFlow = ai.defineFlow(
  {
    name: 'adminAgentFlow',
    inputSchema: AdminAgentInputSchema,
    outputSchema: AdminAgentOutputSchema,
  },
  async (input) => {
    const {text} = await prompt(input);
    return text ?? "Sorry, I am unable to answer that at the moment. Please refer to the documentation or contact support.";
  }
);
