import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, FolderKanban, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import StatTile from '../components/StatTile';
import AIBars from '../components/AIBars';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const taskStatusCounts = useMemo(() => {
    const rows = stats?.tasksByStatus || [];
    const by = new Map(rows.map((r) => [r.status, r.count]));
    return {
      todo: by.get('To Do') || 0,
      inProgress: by.get('In Progress') || 0,
      done: by.get('Done') || 0,
    };
  }, [stats]);

  const completionRate = useMemo(() => {
    const total = Number(stats?.totalTasks) || 0;
    if (!total) return 0;
    return Math.round((taskStatusCounts.done / total) * 100);
  }, [stats, taskStatusCounts.done]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <div className="ai-page-head">
        <div>
          <div className="ai-page-kicker">Overview</div>
          <h1 className="ai-page-title">Workspace overview</h1>
          <div className="ai-page-sub">Progress, workload, and what needs attention.</div>
        </div>
        <div className="ai-page-actions">
          <button className="ai-btn ai-btn-primary" onClick={() => navigate('/projects')}>
            <FolderKanban size={18} />
            Open Projects
          </button>
        </div>
      </div>

      <div className="ai-tiles">
        <StatTile
          icon={BarChart3}
          label="Total tasks"
          value={stats?.totalTasks || 0}
          tone="neutral"
          hint="Across all boards"
        />
        <StatTile
          icon={CheckCircle2}
          label="Completed"
          value={taskStatusCounts.done}
          tone="good"
          hint={`${completionRate}% completion`}
        />
        <StatTile
          icon={Clock3}
          label="In progress"
          value={taskStatusCounts.inProgress}
          tone="warn"
          hint="Currently active"
        />
        <StatTile
          icon={AlertTriangle}
          label="Overdue"
          value={stats?.overdueTasks || 0}
          tone="bad"
          hint="Needs attention"
        />
      </div>

      <div className="ai-split">
        <AIBars
          title="Task status"
          items={[
            { key: 'todo', label: 'To do', value: taskStatusCounts.todo, tone: 'neutral' },
            { key: 'prog', label: 'In progress', value: taskStatusCounts.inProgress, tone: 'warn' },
            { key: 'done', label: 'Done', value: taskStatusCounts.done, tone: 'good' },
          ]}
        />

        <div className="ai-panel">
          <div className="ai-panel-head">
            <div className="ai-panel-title">Momentum</div>
            <div className="ai-panel-sub">Quick read on delivery</div>
          </div>
          <div className="ai-metric">
            <div className="ai-metric-big">{completionRate}%</div>
            <div className="ai-metric-sub">completion rate</div>
            <div className="ai-metric-row">
              <TrendingUp size={16} />
              <span>Keep WIP low to ship faster.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ai-section-head">
        <div>
          <div className="ai-section-title">Recent boards</div>
          <div className="ai-section-sub">Jump back into active workstreams.</div>
        </div>
        <Link to="/projects" className="ai-ghost-link">
          View all
        </Link>
      </div>

      <div className="ai-grid ai-grid-compact">
        {projects.slice(0, 6).map((project) => (
          <Link key={project.id} to={`/project/${project.id}`} className="ai-card-link">
            <motion.div whileHover={{ y: -4 }} className="ai-card">
              <div className="ai-card-title">{project.name}</div>
              <div className="ai-card-body">
                {project.description || 'No description yet.'}
              </div>
              <div className="ai-card-foot">
                <div className="ai-chip">
                  <FolderKanban size={14} />
                  <span>{project.ProjectMember?.role || 'Member'}</span>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
        {projects.length === 0 ? (
          <div className="ai-panel" style={{ gridColumn: '1 / -1' }}>
            <div className="ai-empty">No projects yet. Create one in Projects.</div>
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default Dashboard;
