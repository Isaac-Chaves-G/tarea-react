import { createContext, useMemo, useState } from 'react';
import { login as loginService } from '../services/authService';
import { getStoredToken, removeStoredToken, setStoredToken } from '../services/client';

export const AuthContext = createContext(null);

function getStoredUser() {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

function extractToken(payload) {
  return payload?.token || payload?.accessToken || payload?.jwt || payload?.data?.token || null;
}

function extractUser(payload) {
  return {
    id: payload?.id || payload?.user?.id || null,
    username: payload?.username || payload?.user?.username || '',
    email: payload?.email || payload?.user?.email || '',
  };
}

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  const login = async ({ username, password }) => {
    const payload = await loginService(username, password);
    const nextToken = extractToken(payload);

    if (!nextToken) {
      throw new Error('El backend no envio un token de autenticacion.');
    }

    const nextUser = extractUser(payload);
    setStoredToken(nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);

    return payload;
  };

  const logout = () => {
    removeStoredToken();
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setUser,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
