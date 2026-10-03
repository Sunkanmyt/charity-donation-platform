import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/users/me');
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
const lastActive = useRef(Date.now());
  const ACTIVE_WINDOW = 5 * 60 * 1000;
  const BUFFER = 60 * 1000;

  useEffect(() => {
    const mark = () => { lastActive.current = Date.now(); };
    const events = ['click', 'keydown', 'mousemove', 'scroll'];
    events.forEach((e) => window.addEventListener(e, mark));
    return () => events.forEach((e) => window.removeEventListener(e, mark));
  }, []);

  useEffect(() => {
    if (!user) return;
    let timer;

    const schedule = () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      let exp;
      try {
        exp = jwtDecode(token).exp;
      } catch {
        logout();
        return;
      }

      const delay = Math.max(exp * 1000 - Date.now() - BUFFER, 0);

      timer = setTimeout(async () => {
        const isActive = Date.now() - lastActive.current < ACTIVE_WINDOW;
        if (!isActive) {
          logout();
          return;
        }
        try {
          const response = await api.post('/users/refresh');
          localStorage.setItem('token', response.token);
          schedule();
        } catch {
          logout();
        }
      }, delay);
    };

    schedule();
    return () => clearTimeout(timer);
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);