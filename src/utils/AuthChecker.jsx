import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      // No token? Send to login (/)
      navigate('/', { replace: true });
      return;
    }

    // Check JWT expiry (optional but recommended)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      if (Date.now() > expiry) {
        sessionStorage.removeItem('token');
        navigate('/', { replace: true });
      }
    } catch {
      // Invalid token fallback
      sessionStorage.removeItem('token');
      navigate('/', { replace: true });
    }
  }, [location, navigate]); // runs on every route change

  return children;
};

export default AuthChecker;
