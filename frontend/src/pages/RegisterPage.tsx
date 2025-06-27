import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

    if (formData.password !== formData.password2) {
      setError('Şifreler eşleşmiyor.');
      setFormData({ username: '', password: '', password2: '' });
      return;
    }
    if (formData.password.length < 8) {
      setError('Şifre en az 8 karakter olmalı.');
      setFormData({ username: '', password: '', password2: '' });
      return;
    }

    setLoading(true);

    try {
      await authAPI.register({
        username: formData.username,
        password: formData.password,
      });
      setSuccess(true);
      setFormData({ username: '', password: '', password2: '' });
      setTimeout(() => {
        setSuccess(false);
        navigate('/login');
      }, 1500);
    } catch (err: any) {
      let msg = 'Kayıt olurken bir hata oluştu.';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          msg = err.response.data;
        } else if (typeof err.response.data === 'object') {
          msg = Object.values(err.response.data).flat().join(' ');
        }
      }
      setError(msg);
      setFormData({ username: '', password: '', password2: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Kayıt Ol</h1>
        <div className="password-rules" style={{ color: '#856404', background: '#fff3cd', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          Şifre en az 8 karakter olmalı, harf ve rakam içermelidir.
        </div>
        {error && <div className="error-message" style={{ fontWeight: 'bold', fontSize: '15px' }}>{error}</div>}
        {success && <div className="success-message" style={{ color: 'green', fontWeight: 'bold', fontSize: '15px' }}>Kayıt başarılı! Giriş ekranına yönlendiriliyorsunuz...</div>}
        <form onSubmit={handleSubmit} className="register-form">
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

          <div className="form-group">
            <label htmlFor="password2">Şifre Tekrar</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              placeholder="Şifrenizi tekrar girin"
            />
          </div>

          <button type="submit" disabled={loading} className="register-button">
            {loading ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="login-link">
          Zaten hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
