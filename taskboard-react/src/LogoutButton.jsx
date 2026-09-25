import { api } from './api';

export default function LogoutButton({ onLogout }) {
  async function handleLogout() {
    try {
      await api('/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('token');
      onLogout?.();
    }
  }

  return <button type="button" onClick={handleLogout}>Logout</button>;
}
