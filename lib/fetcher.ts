import axios, { AxiosRequestConfig } from 'axios';

export async function fetchExternal(url: string, opts?: RequestInit) {
  const axiosOpts: AxiosRequestConfig = {
    url,
    method: (opts && (opts.method as any)) || 'GET',
    headers: opts && (opts.headers as Record<string, string>),
    data: (opts as any)?.body,
    responseType: 'json',
    validateStatus: () => true,
  };

  try {
    const res = await axios(axiosOpts);
    return { status: res.status, headers: res.headers, body: res.data };
  } catch (err: any) {
    if (err.response) {
      return { status: err.response.status, headers: err.response.headers, body: err.response.data };
    }
    throw err;
  }
}
