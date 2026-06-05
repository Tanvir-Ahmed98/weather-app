import { NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'https://api.weather-ai.co/v1/weather';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get('lat');
  const lon = url.searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json({ error: 'lat and lon are required query parameters.' }, { status: 400 });
  }

  const query = new URLSearchParams();
  query.set('lat', lat);
  query.set('lon', lon);

  const optionalParams = ['days', 'ai', 'units', 'lang'];
  optionalParams.forEach((param) => {
    const value = url.searchParams.get(param);
    if (value) {
      query.set(param, value);
    }
  });

  const apiKey = process.env.WEATHER_AI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server misconfiguration: WEATHER_AI_API_KEY is not set.' },
      { status: 500 }
    );
  }

  const response = await fetch(`${EXTERNAL_API_BASE}?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
