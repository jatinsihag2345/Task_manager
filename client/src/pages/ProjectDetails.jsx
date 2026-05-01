import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../App';
import { Plus, UserPlus, Trash2, Calendar, Flag, MoreHorizontal } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedToId: '' });
  const [memberEmail, setMemberEmail] = useState('');

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, ProjectId: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedToId: '' });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/projects/${id}/members`, { email: memberEmail });
      setShowMemberModal(false);
      setMemberEmail('');
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding member');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ color: 'var(--text-main)', padding: '20px' }}>Loading...</div>;

  const isAdmin = project.Users.find(u => u.id === user.id)?.ProjectMember.role === 'Admin';

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{project.name}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
        </div>
        <div className="flex gap-4">
          <button className="btn" style={{ background: 'var(--glass-bg)' }} onClick={() => setShowMemberModal(true)}>
            <UserPlus size={18} />
            Members ({project.Users.length})
          </button>
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', minHeight: '600px' }}>
        {columns.map(status => (
          <div key={status} className="glass" style={{ padding: '16px', background: 'rgba(241, 245, 249, 0.5)' }}>
            <h3 className="mb-8 flex items-center justify-between">
              {status}
              <span style={{ fontSize: '12px', background: 'var(--glass-bg)', padding: '2px 8px', borderRadius: '10px' }}>
                {project.Tasks.filter(t => t.status === status).length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {project.Tasks.filter(t => t.status === status).map(task => (
                <motion.div layout key={task.id} className="card glass" style={{ padding: '16px', cursor: 'pointer' }}>
                  <div className="flex justify-between items-start mb-4">
                    <h4 style={{ fontSize: '16px' }}>{task.title}</h4>
                    <div className="flex gap-2">
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        style={{ padding: '2px', fontSize: '10px', width: 'auto' }}
                      >
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button onClick={() => deleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>{task.description}</p>
                  
                  <div className="flex justify-between items-center" style={{ fontSize: '11px' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ 
                        color: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)',
                        fontWeight: 'bold'
                      }}>
                        <Flag size={12} /> {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                          <Calendar size={12} /> {task.dueDate}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1" title={task.assignee?.name}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                        {task.assignee?.name[0].toUpperCase()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="card glass" style={{ width: '500px' }}>
            <h2 className="mb-8">New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Title</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="flex gap-4 mb-4">
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Assign To</label>
                <select value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.Users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="btn btn-primary">Create Task</button>
                <button type="button" className="btn" style={{ background: 'var(--glass-bg)' }} onClick={() => setShowTaskModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="card glass" style={{ width: '400px' }}>
            <h2 className="mb-8">Manage Members</h2>
            <div className="mb-8">
              <h4 className="mb-4" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Current Members</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {project.Users.map(u => (
                  <div key={u.id} className="flex justify-between items-center" style={{ fontSize: '14px' }}>
                    <span>{u.name} ({u.email})</span>
                    <span style={{ fontSize: '12px', color: 'var(--primary)' }}>{u.ProjectMember.role}</span>
                  </div>
                ))}
              </div>
            </div>
            {isAdmin && (
              <form onSubmit={handleAddMember}>
                <div className="input-group">
                  <label>Add Member (Email)</label>
                  <div className="flex gap-2">
                    <input type="email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required placeholder="user@example.com" />
                    <button type="submit" className="btn btn-primary" style={{ padding: '8px' }}>Add</button>
                  </div>
                </div>
              </form>
            )}
            <button className="btn" style={{ width: '100%', justifyContent: 'center', background: 'var(--glass-bg)' }} onClick={() => setShowMemberModal(false)}>Close</button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetails;
