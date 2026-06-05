import axios, { AxiosRequestConfig } from 'axios';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchExternal(url: string, opts?: RequestInit, maxRetries = 2) {
  const axiosOpts: AxiosRequestConfig = {
    url,
    method: (opts && (opts.method as any)) || 'GET',
    headers: opts && (opts.headers as Record<string, string>),
    data: (opts as any)?.body,
    responseType: 'json',
    validateStatus: () => true,
  };

  let attempt = 0;
  while (true) {
    try {
      const res = await axios(axiosOpts);
      if (res.status >= 500 && attempt < maxRetries) {
        attempt += 1;
        await sleep(200 * attempt);
        continue;
      }
      return { status: res.status, headers: res.headers, body: res.data };
    } catch (err: any) {
      if (err.response) {
        const status = err.response.status;
        if (status >= 500 && attempt < maxRetries) {
          attempt += 1;
          await sleep(200 * attempt);
          continue;
        }
        return { status, headers: err.response.headers, body: err.response.data };
      }
      if (attempt < maxRetries) {
        attempt += 1;
        await sleep(200 * attempt);
        continue;
      }
      throw err;
    }
  }
}
