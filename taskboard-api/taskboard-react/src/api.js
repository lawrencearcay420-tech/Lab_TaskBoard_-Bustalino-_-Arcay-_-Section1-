const API_URL = 'http://localhost:8000/api';

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  const data = await response.json();
  if (!response.ok) throw data;
  return data;
}
