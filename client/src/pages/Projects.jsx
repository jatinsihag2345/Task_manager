import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, FolderKanban } from 'lucide-react';
import api from '../api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects();
  }, [fetchProjects]);

  const total = useMemo(() => projects.length, [projects.length]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="ai-page-head">
        <div>
          <div className="ai-page-kicker">Projects</div>
          <h1 className="ai-page-title">Boards and workstreams</h1>
          <div className="ai-page-sub">Create, join, and manage project boards.</div>
        </div>
        <div className="ai-page-actions">
          <div className="ai-pill" title="Total boards">
            <FolderKanban size={16} />
            <span>{total} boards</span>
          </div>
          <button className="ai-btn ai-btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      <div className="ai-grid">
        {projects.map((project) => (
          <Link key={project.id} to={`/project/${project.id}`} className="ai-card-link">
            <motion.div whileHover={{ y: -4 }} className="ai-card">
              <div className="ai-card-title">{project.name}</div>
              <div className="ai-card-body">
                {project.description || 'No description yet. Add one to clarify scope.'}
              </div>
              <div className="ai-card-foot">
                <div className="ai-chip">
                  <Users size={14} />
                  <span>{project.ProjectMember?.role || 'Member'}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
        {projects.length === 0 ? (
          <div className="ai-panel" style={{ gridColumn: '1 / -1' }}>
            <div className="ai-empty">
              No projects yet. Create one and start moving work through the pipeline.
            </div>
          </div>
        ) : null}
      </div>

      {showModal && (
        <div className="ai-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ai-modal">
            <div className="ai-modal-head">
              <div>
                <div className="ai-modal-title">New Project</div>
                <div className="ai-modal-sub">Spin up a board in seconds.</div>
              </div>
              <button className="ai-icon-btn" onClick={() => setShowModal(false)} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="ai-form">
              <div className="ai-field">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="ai-field">
                <label>Description</label>
                <textarea
                  rows="4"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div className="ai-form-actions">
                <button type="submit" className="ai-btn ai-btn-primary">
                  Create
                </button>
                <button type="button" className="ai-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Projects;
