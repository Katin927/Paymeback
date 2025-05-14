// src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../assets/logo.png';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function NavBar({ onToggleTheme, currentTheme, isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
  const toggleMenu = () => setOpen(!open);

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="PayMeBack logo" className="navbar__logo-img" />
        <Link to="/" className="navbar__logo-link">PayMeBack</Link>
      </div>

      <div className="navbar__controls">
        <button
          className="navbar__menu-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {currentTheme === 'dark' ? <FiSun size={20}/> : <FiMoon size={20}/>}
        </button>
      </div>

      {open && (
        <div className="navbar__dropdown">
          <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
          <Link to="/invoice" onClick={() => setOpen(false)}> Invoice</Link>
          <Link to="/pay" onClick={() => setOpen(false)}>Pay</Link>
          <Link to="/settings" onClick={() => setOpen(false)}>Settings</Link>
          <hr />
          {!isLoggedIn ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
            </>
          ) : (
            <button
              className="navbar__logout"
              onClick={() => { setOpen(false); onLogout(); }}
            >Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
