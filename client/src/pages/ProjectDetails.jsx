import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../authContext';
import { Plus, UserPlus, Trash2, Calendar, Flag, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', assignedToId: '' });
  const [memberEmail, setMemberEmail] = useState('');

  const fetchProject = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProject();
  }, [fetchProject]);

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

  if (loading) return <div style={{ color: 'var(--text)', padding: '20px' }}>Loading...</div>;

  const isAdmin = project.Users.find(u => u.id === user.id)?.ProjectMember.role === 'Admin';

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
      <div className="ai-page-head">
        <div>
          <button className="ai-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="ai-page-kicker">Board</div>
          <h1 className="ai-page-title">{project.name}</h1>
          <div className="ai-page-sub">{project.description || 'No description.'}</div>
        </div>
        <div className="ai-page-actions">
          <button className="ai-btn" onClick={() => setShowMemberModal(true)}>
            <UserPlus size={18} />
            Members ({project.Users.length})
          </button>
          <button className="ai-btn ai-btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      <div className="ai-kanban">
        {columns.map(status => (
          <div key={status} className="ai-column">
            <div className="ai-column-head">
              <div className="ai-column-title">{status}</div>
              <div className="ai-badge">{project.Tasks.filter(t => t.status === status).length}</div>
            </div>
            
            <div className="ai-column-body">
              {project.Tasks.filter(t => t.status === status).map(task => (
                <motion.div layout key={task.id} className="ai-task">
                  <div className="ai-task-top">
                    <div className="ai-task-title">{task.title}</div>
                    <div className="ai-task-actions">
                      <select 
                        value={task.status} 
                        onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                        className="ai-mini-select"
                      >
                        {columns.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <button className="ai-icon-btn" onClick={() => deleteTask(task.id)} aria-label="Delete task">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {task.description ? <div className="ai-task-desc">{task.description}</div> : null}
                  
                  <div className="ai-task-foot">
                    <div className="ai-task-meta">
                      <div className={`ai-chip ai-chip-${task.priority?.toLowerCase?.() || 'medium'}`}>
                        <Flag size={12} />
                        <span>{task.priority}</span>
                      </div>
                      {task.dueDate ? (
                        <div className="ai-chip">
                          <Calendar size={12} />
                          <span>{task.dueDate}</span>
                        </div>
                      ) : null}
                    </div>
                    <div className="ai-avatar" title={task.assignee?.name || 'Unassigned'}>
                      {task.assignee?.name ? task.assignee.name[0].toUpperCase() : '–'}
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
        <div className="ai-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ai-modal">
            <div className="ai-modal-head">
              <div>
                <div className="ai-modal-title">New Task</div>
                <div className="ai-modal-sub">Add work into the pipeline.</div>
              </div>
              <button className="ai-icon-btn" onClick={() => setShowTaskModal(false)} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="ai-form">
              <div className="ai-field">
                <label>Title</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="ai-field">
                <label>Description</label>
                <textarea value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="ai-row">
                <div className="ai-field">
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div className="ai-field">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="ai-field">
                <label>Assign To</label>
                <select value={newTask.assignedToId} onChange={e => setNewTask({...newTask, assignedToId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {project.Users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="ai-form-actions">
                <button type="submit" className="ai-btn ai-btn-primary">Create Task</button>
                <button type="button" className="ai-btn" onClick={() => setShowTaskModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="ai-modal-backdrop" role="dialog" aria-modal="true">
          <div className="ai-modal">
            <div className="ai-modal-head">
              <div>
                <div className="ai-modal-title">Members</div>
                <div className="ai-modal-sub">Access and roles for this board.</div>
              </div>
              <button className="ai-icon-btn" onClick={() => setShowMemberModal(false)} aria-label="Close">
                ×
              </button>
            </div>

            <div className="ai-panel" style={{ marginBottom: 14 }}>
              <div className="ai-panel-head">
                <div className="ai-panel-title">Current</div>
                <div className="ai-panel-sub">{project.Users.length} members</div>
              </div>
              <div className="ai-members">
                {project.Users.map((u) => (
                  <div key={u.id} className="ai-member">
                    <div className="ai-member-left">
                      <div className="ai-avatar">{u.name?.[0]?.toUpperCase?.() || '?'}</div>
                      <div>
                        <div className="ai-member-name">{u.name}</div>
                        <div className="ai-member-email">{u.email}</div>
                      </div>
                    </div>
                    <div className="ai-badge ai-badge-soft">{u.ProjectMember.role}</div>
                  </div>
                ))}
              </div>
            </div>

            {isAdmin ? (
              <form onSubmit={handleAddMember} className="ai-form">
                <div className="ai-field">
                  <label>Add member (email)</label>
                  <div className="ai-row">
                    <input type="email" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} required placeholder="user@example.com" />
                    <button type="submit" className="ai-btn ai-btn-primary">Add</button>
                  </div>
                </div>
              </form>
            ) : null}

            <div className="ai-form-actions">
              <button className="ai-btn" type="button" onClick={() => setShowMemberModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectDetails;
