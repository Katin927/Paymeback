import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import PrivateRoute from './components/PrivateRoute'; // Make sure PrivateRoute checks `isLoggedIn`
import { ErrorBoundary } from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Invoice from './pages/Invoice';
import PayInvoice from './pages/PayInvoice';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

function AppContent() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status when the component mounts
  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem('token')));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div className="app-wrapper">
      <NavBar
        onToggleTheme={toggleTheme}
        currentTheme={theme}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoice"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <ErrorBoundary>
                <Invoice />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/pay"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <ErrorBoundary>
                <PayInvoice />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/pay/:invoiceId"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <ErrorBoundary>
                <PayInvoice />
              </ErrorBoundary>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <Settings />
            </PrivateRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isMobile && <BottomNav />}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
