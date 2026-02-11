import { config } from 'dotenv';
config();

import '@/ai/flows/generate-mock-purchase-notifications.ts';
import '@/ai/flows/support-chat-flow.ts';
import '@/ai/flows/admin-agent-flow.ts';
import '@/ai/flows/translate-text-flow.ts';
