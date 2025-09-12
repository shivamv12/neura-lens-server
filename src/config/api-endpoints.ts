export const BASE_URLS = {
  cloudFrontBaseUrl: process.env.AWS_CLOUD_FRONT_BASE_URL,
  openRouterBaseUrl: process.env.OPEN_ROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  // add more base urls here
} 

export const API_ENDPOINTS = {
  openRouterImageDetection: `${BASE_URLS.openRouterBaseUrl}/chat/completions`,
  // add more endpoints here
};
