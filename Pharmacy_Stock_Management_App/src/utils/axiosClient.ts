const BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:3000';

interface ResponseData<T = any> {
  data: T | null;
  status: number;
  ok: boolean;
}

async function request<T = any>(
  url: string,
  opts: RequestInit = {}
): Promise<ResponseData<T>> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opts.headers || {}),
  };

  const res = await fetch(`${BASE}${url}`, { ...opts, headers });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    throw {
      status: res.status,
      message:
        typeof data === 'object' && data !== null && 'message' in data
          ? (data as any).message
          : 'Erreur réseau',
      data,
    };
  }

  return { data, status: res.status, ok: true };
}

export default {
  get: <T = any>(url: string) => request<T>(url, { method: 'GET' }),
  post: <T = any>(url: string, body?: any) =>
    request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T = any>(url: string, body?: any) =>
    request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(url: string) =>
    request<T>(url, { method: 'DELETE' }),
};
