export type ApiConfig = {
  id: string;
  baseUrl: string;
  envKey?: string;
  authType?: 'bearer' | 'none';
};

export const apiRegistry: Record<string, ApiConfig> = {
  weatherai: {
    id: 'weatherai',
    baseUrl: 'https://api.weather-ai.co/v1',
    envKey: 'WEATHER_AI_API_KEY',
    authType: 'bearer',
  },
};
