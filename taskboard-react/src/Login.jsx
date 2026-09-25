import { api } from './api';

export default async function login(email, password) {
  const { token } = await api('/login', {
    method: 'POST',
    body: { email, password },
  });
  localStorage.setItem('token', token);
  return token;
}
