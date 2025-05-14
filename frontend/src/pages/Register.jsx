// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import './Register.css';
import logo from '../assets/logo.png';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    console.log('Submitting register', form);

    try {
      const { data } = await API.post('/auth/register', form);
      console.log('Register success:', data);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Register failed:', err.response?.status, err.response?.data);
      if (err.response?.status === 409) {
        setError('That email is already registered. Please log in or use another email.');
      } else {
        setError(err.response?.data?.error || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <img src={logo} alt="PayMeBack Logo" className="register__logo-img" />
        <h2>Create Account</h2>

        {error && <div className="register__error">{error}</div>}

        <form className="register__form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
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
            Sign Up
          </button>
        </form>

        <div className="register__signin">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
