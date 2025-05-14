// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Login.css';
import logo from '../assets/logo.png';
import API from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const navigate                = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login">
      <div className="login__container" data-aos="fade-up">
        <img src={logo} alt="PayMeBack Logo" className="login__logo" />
        <h2>Welcome Back</h2>
        {error && <div className="login__error">{error}</div>}
        <form className="login__form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>
        <p className="login__signup">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
);
}
