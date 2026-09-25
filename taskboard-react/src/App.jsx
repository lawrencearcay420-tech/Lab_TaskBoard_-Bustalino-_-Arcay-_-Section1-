import { useEffect, useState } from 'react';
import LoginForm from './LoginForm.jsx';
import ProjectList from './Projects.jsx';
import AddProjectForm from './AddProjectForm.jsx';
import LogoutButton from './LogoutButton.jsx';
import './App.css';

function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  if (!token) {
    return <LoginForm onLogin={setToken} />;
  }

  const handleProjectAdded = (project) => {
    setProjects((current) => [...current, project]);
  };

  return (
    <main>
      <header>
        <h1>Taskboard</h1>
        <LogoutButton onLogout={() => setToken(null)} />
      </header>

      <ProjectList projects={projects} setProjects={setProjects} />
      <AddProjectForm onProjectAdded={handleProjectAdded} />
    </main>
  );
}

export default App;
