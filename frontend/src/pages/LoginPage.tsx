import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      const data = response.data as { access: string; refresh: string };
      localStorage.setItem('token', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      setToken(data.access);
      navigate('/tasks');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.username === 'admin' && token) {
      setShowToken(true);
    } else {
      setShowToken(false);
    }
  }, [formData.username, token]);

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Giriş Yap</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Kullanıcı adınızı girin"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Şifrenizi girin"
            />
          </div>

          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="register-link">
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => window.open('http://localhost:8000/admin', '_blank')}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              marginTop: 8,
            }}
          >
            Admin Paneli
          </button>
        </div>

        {showToken && token && (
          <div style={{ marginTop: 24, background: '#f8f9fa', padding: 16, borderRadius: 8, wordBreak: 'break-all', border: '1px solid #dee2e6' }}>
            <strong>JWT Token:</strong>
            <div style={{ fontSize: 13, marginTop: 8 }}>{token}</div>
            <button onClick={() => {navigator.clipboard.writeText(token);}} style={{ marginTop: 8, padding: '6px 12px', borderRadius: 6, background: '#667eea', color: 'white', border: 'none', cursor: 'pointer' }}>Kopyala</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
