'use client';

import React, { useEffect, useState } from 'react';

type HourlyItem = {
  time: string;
  temperature: number;
  precipitation_probability?: number;
  icon?: string;
};

type DailyItem = {
  date: string;
  temp_min: number;
  temp_max: number;
  icon?: string;
};

type WeatherData = {
  location?: any;
  current?: any;
  hourly?: HourlyItem[];
  daily?: DailyItem[];
  [key: string]: any;
};

export default function HomePage() {
  const [lat, setLat] = useState('-1.2921');
  const [lon, setLon] = useState('36.8219');
  const [days, setDays] = useState('3');
  const [ai, setAi] = useState('true');
  const [units, setUnits] = useState('metric');
  const [lang, setLang] = useState('en');

  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(latVal: string, lonVal: string) {
    let didCancel = false;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const q = new URLSearchParams({ lat: latVal, lon: lonVal, days, ai, units, lang });
      const res = await fetch(`/api/weather?${q.toString()}`);
      const json = await res.json();
      if (!didCancel) {
        if (!res.ok) setError(json.error || 'Failed to fetch weather');
        else setData(json);
      }
    } catch (err) {
      if (!didCancel) setError('Network error');
    } finally {
      if (!didCancel) setLoading(false);
    }

    return () => {
      didCancel = true;
    };
  }

  useEffect(() => {
    // request browser location and fetch automatically
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const latStr = String(latitude);
          const lonStr = String(longitude);
          setLat(latStr);
          setLon(lonStr);
          fetchWeather(latStr, lonStr);
        },
        () => {
          // user denied or unavailable — fallback to existing defaults
          fetchWeather(lat, lon);
        }
      );
    } else {
      // no geolocation support — use defaults
      fetchWeather(lat, lon);
    }
  // only run once on mount; API is fetched from browser-provided coordinates
  }, []);

  function refreshLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latStr = String(pos.coords.latitude);
          const lonStr = String(pos.coords.longitude);
          setLat(latStr);
          setLon(lonStr);
          fetchWeather(latStr, lonStr);
        },
        () => {
          fetchWeather(lat, lon);
        }
      );
    } else {
      fetchWeather(lat, lon);
    }
  }

  return (
    <main className="prose prose-slate mx-auto">
      <h2 className="text-2xl font-bold">Weather AI</h2>
      <p className="text-slate-600">Auto-detects your coordinates (if allowed) and shows current, hourly, and daily forecasts.</p>

      <section className="mt-4">
        <div className="flex justify-end">
          <button
            onClick={refreshLocation}
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Loading…' : 'Refresh location'}
          </button>
        </div>
      </section>

      {error ? <div className="text-red-600 mt-4">{error}</div> : null}

      {data ? (
        <section className="mt-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-md shadow-sm">
            <div>
              <div className="text-sm text-slate-500">Location</div>
              <div className="text-lg font-medium">{data.location?.timezone ?? ''} — {data.location?.country ?? ''}</div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              {data.current?.icon ? (
                <img src={data.current.icon} alt="icon" width={96} height={96} className="rounded" />
              ) : null}
              <div>
                <div className="text-3xl font-bold">{data.current?.temperature}°</div>
                <div className="text-sm text-slate-600">{data.current?.time} • Wind {data.current?.wind_speed} m/s</div>
              </div>
            </div>
          </div>

          {data.ai || data.summary ? (
            <div className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-sm text-slate-500">AI Summary</div>
              <div className="mt-2 text-slate-800">{(data.ai && data.ai.summary) || data.summary || JSON.stringify(data.ai ?? {})}</div>
            </div>
          ) : null}

          <div>
            <h3 className="text-lg font-semibold mb-2">Hourly</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {data.hourly?.slice(0, 24).map((h: any) => (
                <div key={h.time} className="bg-white p-3 rounded-md text-center">
                  <div className="text-xs text-slate-500">{new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  {h.icon ? <img src={h.icon} alt="icon" className="mx-auto" width={48} height={48} /> : null}
                  <div className="font-medium mt-1">{h.temperature}°</div>
                  <div className="text-xs text-slate-500">{h.precipitation_probability ?? 0}%</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Daily</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {data.daily?.map((d: any) => (
                <div key={d.date} className="bg-white p-4 rounded-md">
                  <div className="font-medium">{d.date}</div>
                  {d.icon ? <img src={d.icon} alt="icon" width={48} height={48} /> : null}
                  <div className="text-sm text-slate-600">{d.temp_min}° — {d.temp_max}°</div>
                  <div className="text-sm text-slate-500">Precip: {d.precipitation_probability ?? d.precipitation_sum ?? 0}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
