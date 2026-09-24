const API_URL = '';

interface RequestOptions {
  headers?: Record<string, string>;
}

const getHeaders = (customHeaders?: Record<string, string>) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  return headers;
};

export const axiosInstance = {
  async get<T = any>(url: string, options?: RequestOptions): Promise<{ data: T }> {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers: getHeaders(options?.headers),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `GET request failed with status ${response.status}`);
    }

    const data = await response.json();
    return { data };
  },

  async post<T = any>(url: string, body?: any, options?: RequestOptions): Promise<{ data: T }> {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: getHeaders(options?.headers),
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `POST request failed with status ${response.status}`);
    }

    const data = await response.json();
    return { data };
  },
};
