// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import './Register.css';
import logo from '../assets/logo.png';

export default function Register({ onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await API.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      onLogin();                  // notify App that we're logged in
      navigate('/dashboard');
    } catch (err) {
      console.error('Register failed response data:', err.response?.data);
      if (!err.response) {
        setError('Network error—please check your connection and try again.');
      } else {
        const status = err.response.status;
        const serverMsg = err.response.data?.error;
        if (status === 400) {
          setError(serverMsg || 'Please fill out all fields correctly.');
        } else if (status === 409) {
          setError('That email is already registered. Please log in or use another email.');
        } else {
          setError(serverMsg || 'Registration failed. Please try again.');
        }
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
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
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
