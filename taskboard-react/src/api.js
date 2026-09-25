const API_URL = 'http://localhost:8000/api';

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return null;
  }

  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}
