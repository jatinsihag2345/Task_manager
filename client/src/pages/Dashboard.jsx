import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Plus, CheckCircle, Clock, AlertCircle, BarChart3, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projRes, statsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/tasks/stats')
      ]);
      setProjects(projRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Workspace Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track delivery, priorities, and team progress</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card glass flex items-center gap-4">
          <div style={{ background: 'rgba(79, 70, 229, 0.1)', padding: '12px', borderRadius: '12px' }}>
            <BarChart3 color="var(--primary)" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats?.totalTasks || 0}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Total Tasks</div>
          </div>
        </div>
        <div className="card glass flex items-center gap-4">
          <div style={{ background: 'rgba(34, 197, 94, 0.2)', padding: '12px', borderRadius: '12px' }}>
            <CheckCircle color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {stats?.tasksByStatus?.find(s => s.status === 'Done')?.count || 0}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Completed</div>
          </div>
        </div>
        <div className="card glass flex items-center gap-4">
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: '12px' }}>
            <Clock color="var(--warning)" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {stats?.tasksByStatus?.find(s => s.status === 'In Progress')?.count || 0}
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>In Progress</div>
          </div>
        </div>
        <div className="card glass flex items-center gap-4">
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '12px', borderRadius: '12px' }}>
            <AlertCircle color="var(--danger)" />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats?.overdueTasks || 0}</div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Overdue</div>
          </div>
        </div>
      </div>

      <h2 className="mb-8">Project Boards</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {projects.map(project => (
          <Link key={project.id} to={`/project/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <motion.div whileHover={{ y: -5 }} className="card glass">
              <h3 style={{ marginBottom: '12px' }}>{project.name}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                {project.description || 'No description provided.'}
              </p>
              <div className="flex items-center gap-4" style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                <span className="flex items-center gap-1">
                  <Users size={14} />
                  {project.ProjectMember?.role || 'Member'}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px', color: 'var(--text-muted)' }}>
            No projects yet. Create one to get started!
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="card glass" style={{ width: '500px' }}>
            <h2 className="mb-8">New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="input-group">
                <label>Project Name</label>
                <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea rows="4" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">Create</button>
                <button type="button" className="btn" style={{ background: 'var(--glass-bg)' }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Dashboard;
