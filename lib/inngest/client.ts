import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'ai-trading-agent',
  name: 'AI Trading Agent',
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
