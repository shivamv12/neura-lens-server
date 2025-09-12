import { registerAs } from '@nestjs/config';

export default registerAs('open-ai-config', () => ({
  openRouterSecretKey: process.env.OPEN_ROUTER_API_KEY,
  openRouterChatUrl: `${process.env.OPEN_ROUTER_BASE_URL}/chat/completions`,
  openRouterBaseUrl: process.env.OPEN_ROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
}));
