import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track user activity to prevent refreshing tokens for abandoned tabs
  const lastActive = useRef(Date.now());
  const ACTIVE_WINDOW = 5 * 60 * 1000; // 5 minutes
  const BUFFER = 60 * 1000; // Refresh 60 seconds before token expires

  useEffect(() => {
    const markActivity = () => { lastActive.current = Date.now(); };

    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    events.forEach((e) => window.addEventListener(e, markActivity));
    return () => events.forEach((e) => window.removeEventListener(e, markActivity));
  }, []);

  // Check logged-in status on initial load/reload
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/profile');
        setUser(response.user);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Schedule automatic background token refresh
  useEffect(() => {
    if (!user) return;
    let timer;

    const scheduleRefresh = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      let exp;
      try {
        exp = jwtDecode(token).exp;
      } catch {
        logout();
        return;
      }

      // Calculate time remaining until token expiration minus buffer (in ms)
      const delay = Math.max(exp * 1000 - Date.now() - BUFFER, 0);

      timer = setTimeout(async () => {
        const isActive = Date.now() - lastActive.current < ACTIVE_WINDOW;
        if (!isActive) {
          logout();
          return;
        }

        try {
          const response = await api.post('/users/refresh');
          const newToken = response.token

          if(newToken) {
            localStorage.setItem('token', newToken);
            scheduleRefresh();
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }, delay);
    };

    scheduleRefresh();
    return () => clearTimeout(timer);
  }, [user]);

  const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const { token, user: userData } = response;

    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const register = async (firstName, lastName, phone, email, password) => {
    const response = await api.post('/users/register', { firstName, lastName, phone, email, password });
    const { token, user: userData } = response;

    localStorage.setItem('token', token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);