import { useEffect, useState } from 'react';
import { api } from './api';

export default function ProjectList({ projects, setProjects }) {
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        const data = await api('/projects');
        if (isMounted) {
          setProjects(Array.isArray(data) ? data : data?.data ?? []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Unable to load projects.');
        }
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [setProjects]);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section>
      <h2>Projects</h2>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id ?? project._id ?? project.name}>
              <strong>{project.name}</strong> — {project.tasks_count ?? 0} tasks
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
