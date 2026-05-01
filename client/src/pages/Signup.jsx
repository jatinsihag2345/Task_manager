import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import api from '../api';
import { Sparkles } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="ai-auth">
      <div className="ai-auth-card">
        <div className="ai-auth-head">
          <div className="ai-auth-mark" aria-hidden="true">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="ai-auth-title">Task Assignment for Ethara</div>
            <div className="ai-auth-sub">Create an account to start.</div>
          </div>
        </div>

        {error ? <div className="ai-alert ai-alert-bad">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="ai-field">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="ai-field">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="ai-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="ai-btn ai-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Signup
          </button>
        </form>

        <div className="ai-auth-foot">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
