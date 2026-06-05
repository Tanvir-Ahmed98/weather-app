# Weather App

Next.js app using the App Router structure with a proxy API route for Weather AI.

## Features

- Uses `app/layout.tsx` and `app/page.tsx` for page structure
- Implements `app/api/weather/route.ts` to proxy requests to `https://api.weather-ai.co/v1/weather`
- Supports query params: `lat`, `lon`, `days`, `ai`, `units`, `lang`

## Setup

1. Copy `.env.example` to `.env.local`
2. Set `WEATHER_AI_API_KEY=wai_<your_api_key>`
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`

Notes:
- The app uses Tailwind CSS — dev dependencies include `tailwindcss`, `postcss`, and `autoprefixer`.
- The API key is required in `.env.local`. Keep it secret and do not commit it to version control.

## Example request

`GET /api/weather?lat=-1.2921&lon=36.8219&days=3&ai=true&units=metric&lang=en`

Run locally:

```bash
npm install
npm run dev
# then open http://localhost:3000 in your browser and allow location access
```

Project structure for many integrations
--------------------------------------

I set up folders and helpers so you can integrate many external APIs (30–40+) with minimal friction:

- `app/api/proxy/route.ts`: Generic server-side proxy that forwards requests to registered external APIs. Use query params `service` and `path` (plus service-specific params).
- `lib/apiRegistry.ts`: Central registry for external API base URLs and the env var that holds their auth token.
- `lib/fetcher.ts`: Small wrapper that fetches external APIs and normalizes response bodies.
- `hooks/useApi.ts`: Client-side hook to call the `app/api/proxy` endpoint consistently.
- `components/`: Reusable UI components for weather and other integrations.

To add a new API:
1. Add a registry entry in `lib/apiRegistry.ts` with `id`, `baseUrl`, and `envKey`.
2. Add the credential to `.env.local` (e.g. `NEWAPI_KEY=...`).
3. Use `useApi().callService('newapi', '/some/endpoint', { q: '1' })` from the client, or call `/api/proxy?service=newapi&path=/some/endpoint&...` directly.

This pattern keeps server-side secrets off the client and centralizes auth and base URLs.
