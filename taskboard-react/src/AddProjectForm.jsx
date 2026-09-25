import { useState } from 'react';
import { api } from './api';

export default function AddProjectForm({ onProjectAdded }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Project name is required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const project = await api('/projects', {
        method: 'POST',
        body: { name: trimmed },
      });

      onProjectAdded?.(project?.data ?? project);
      setName('');
    } catch (err) {
      setError(err?.message || 'Unable to add project.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Project</h3>
      <label>
        Name
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Project'}
      </button>

      {error && <p role="alert">{error}</p>}
    </form>
  );
}
