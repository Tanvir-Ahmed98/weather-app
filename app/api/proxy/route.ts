import { NextResponse } from 'next/server';
import { apiRegistry } from '../../../lib/apiRegistry';
import { fetchExternal } from '../../../lib/fetcher';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const service = url.searchParams.get('service');
  const path = url.searchParams.get('path') ?? '/';

  if (!service) {
    return NextResponse.json({ error: 'Missing "service" query parameter.' }, { status: 400 });
  }

  const cfg = apiRegistry[service];
  if (!cfg) {
    return NextResponse.json({ error: `Unknown service: ${service}` }, { status: 400 });
  }

  // Build target URL — include all query params except 'service' and 'path'
  const targetUrl = new URL(cfg.baseUrl + (path.startsWith('/') ? path : `/${path}`));
  url.searchParams.forEach((value, key) => {
    if (key === 'service' || key === 'path') return;
    targetUrl.searchParams.set(key, value);
  });

  const headers: Record<string, string> = {};
  if (cfg.authType === 'bearer' && cfg.envKey) {
    const token = process.env[cfg.envKey];
    if (!token) {
      return NextResponse.json({ error: `Server misconfiguration: ${cfg.envKey} not set.` }, { status: 500 });
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Forward the request and return the response body/status
  const resp = await fetchExternal(targetUrl.toString(), { headers });
  return NextResponse.json(resp.body, { status: resp.status });
}
