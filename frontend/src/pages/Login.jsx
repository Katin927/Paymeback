// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import './Register.css'; // reuse same styles
import logo from '../assets/logo.png';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await API.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      onLogin();               // notify App that we're logged in
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data);
      if (!err.response) {
        setError('Network error—please try again.');
      } else if (err.response.status === 400) {
        setError(err.response.data.error || 'Invalid credentials.');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <img src={logo} alt="PayMeBack Logo" className="register__logo-img" />
        <h2>Sign In</h2>

        {error && <div className="register__error">{error}</div>}

        <form className="register__form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">
            Log In
          </button>
        </form>

        <div className="register__signin">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
