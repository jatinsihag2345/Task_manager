import { useContext, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import {
  Boxes,
  LayoutGrid,
  KanbanSquare,
  Search,
  LogOut,
  Sparkles,
  User,
} from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const active = useMemo(() => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  }, [location.pathname, to]);

  return (
    <Link
      to={to}
      className={`ai-nav-item ${active ? 'is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
};

const Shell = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="ai-shell">
      <aside className="ai-sidebar">
        <div className="ai-brand">
          <div className="ai-brand-mark" aria-hidden="true">
            <Sparkles size={18} />
          </div>
          <div className="ai-brand-text">
            <div className="ai-brand-title">Task Assignment for Ethara</div>
            <div className="ai-brand-sub">Projects, tasks, and teamwork</div>
          </div>
        </div>

        <div className="ai-nav">
          <div className="ai-nav-label">Workspace</div>
          <NavItem to="/" icon={LayoutGrid} label="Overview" />
          <NavItem to="/projects" icon={KanbanSquare} label="Projects" />
        </div>

        <div className="ai-sidebar-footer">
          <div className="ai-user">
            <div className="ai-user-avatar" aria-hidden="true">
              <User size={16} />
            </div>
            <div className="ai-user-meta">
              <div className="ai-user-name">{user?.name || 'User'}</div>
              <div className="ai-user-email">{user?.email || ''}</div>
            </div>
          </div>
          <button className="ai-icon-btn" onClick={handleLogout} title="Logout" aria-label="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <div className="ai-main">
        <header className="ai-topbar">
          <div className="ai-topbar-left">
            <div className="ai-pill">
              <Boxes size={16} />
              <span>Workspace</span>
            </div>
          </div>

          <div className="ai-command">
            <Search size={16} />
            <input
              aria-label="Command bar"
              placeholder="Search projects and tasks…"
              onChange={() => {}}
            />
            <div className="ai-kbd" aria-hidden="true">
              ⌘ K
            </div>
          </div>

          <div className="ai-topbar-right">
            <Link to="/" className="ai-ghost-link">
              Home
            </Link>
          </div>
        </header>

        <main className="ai-content">{children}</main>
      </div>
    </div>
  );
};

export default Shell;
