import { useCallback, useState } from 'react';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callService = useCallback(async (service: string, path = '/', params: Record<string, string | number | boolean> = {}) => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ service, path });
      Object.entries(params).forEach(([k, v]) => q.set(k, String(v)));
      const res = await fetch(`/api/proxy?${q.toString()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Error');
      return json;
    } catch (err: any) {
      setError(err.message || 'Network error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { callService, loading, error };
}
