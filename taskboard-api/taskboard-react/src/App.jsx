import { useEffect, useState } from 'react';
import { api } from './api';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      const { token } = await api('/login', {
        method: 'POST',
        body: { email, password },
      });
      localStorage.setItem('token', token);
      onLogin();
    } catch (failure) {
      setError(failure?.message ?? failure?.errors?.email?.[0] ?? 'Unable to log in.');
    }
  }

  return (
    <form className="auth-panel" onSubmit={handleSubmit}>
      <p className="eyebrow">TASKBOARD / ACCESS</p>
      <h1>Keep the next thing visible.</h1>
      <p className="muted">Sign in to pick up where your team left off.</p>
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
      <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
      {error && <p className="error" role="alert">{error}</p>}
      <button type="submit">Sign in <span aria-hidden="true">-&gt;</span></button>
    </form>
  );
}

function ProjectList({ projects, loading, error }) {
  if (loading) return <p className="muted">Loading your projects...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!projects.length) return <p className="empty">No projects yet. Add the first one below.</p>;

  return <div className="project-list">{projects.map((project) => (
    <article className="project" key={project.id}>
      <div><h2>{project.name}</h2><p>{project.description || 'No description yet.'}</p></div>
      <strong>{project.tasks_count ?? 0}<small> tasks</small></strong>
    </article>
  ))}</div>;
}

function AddProjectForm({ onCreated }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const { data } = await api('/projects', { method: 'POST', body: { name } });
      onCreated(data);
      setName('');
    } catch (failure) {
      setError(failure?.errors?.name?.[0] ?? 'Could not create project.');
    }
  }

  return <form className="add-form" onSubmit={handleSubmit}>
    <label>New project<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Capstone Prep" required /></label>
    <button type="submit">Add project <span aria-hidden="true">+</span></button>
    {error && <p className="error">{error}</p>}
  </form>;
}

function LogoutButton({ onLogout }) {
  async function handleLogout() {
    try { await api('/logout', { method: 'POST' }); } finally {
      localStorage.removeItem('token');
      onLogout();
    }
  }
  return <button className="logout" onClick={handleLogout}>Log out</button>;
}

function Dashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/projects')
      .then(({ data }) => setProjects(data))
      .catch(() => setError('Your projects could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  return <main className="shell">
    <header className="topbar"><div><p className="eyebrow">TASKBOARD / TODAY</p><h1>Your projects</h1></div><LogoutButton onLogout={onLogout} /></header>
    <section className="intro"><p>Small steps, clearly placed.</p><span>{projects.length} active {projects.length === 1 ? 'project' : 'projects'}</span></section>
    <ProjectList projects={projects} loading={loading} error={error} />
    <AddProjectForm onCreated={(project) => setProjects((current) => [project, ...current])} />
  </main>;
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(localStorage.getItem('token')));
  return authenticated
    ? <Dashboard onLogout={() => setAuthenticated(false)} />
    : <LoginForm onLogin={() => setAuthenticated(true)} />;
}
