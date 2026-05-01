import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../authContext';
import api from '../api';
import { Sparkles } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);

  const handleGoogleResponse = useCallback(async (response) => {
    try {
      setError('');
      const res = await api.post('/auth/google', { credential: response.credential });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed');
    }
  }, [login, navigate]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      googleButtonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
      });
    };

    const existingScript = document.querySelector('script[data-google-identity="true"]');
    if (existingScript) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = 'true';
    script.onload = renderGoogleButton;
    document.body.appendChild(script);
  }, [handleGoogleResponse]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
            <div className="ai-auth-sub">Sign in to continue.</div>
          </div>
        </div>

        {error ? <div className="ai-alert ai-alert-bad">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div className="ai-field">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="ai-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="ai-btn ai-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            Login
          </button>
        </form>

        {import.meta.env.VITE_GOOGLE_CLIENT_ID && (
          <>
            <div className="ai-auth-or">or</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div ref={googleButtonRef} />
            </div>
          </>
        )}

        <div className="ai-auth-foot">
          <span>Don't have an account?</span>
          <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
