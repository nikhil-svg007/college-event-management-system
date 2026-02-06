import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login, register } from '../api/authApi.js';

const AuthContext = createContext(null); // global container

export const AuthProvider = ({ children }) => { // brain
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  //It checks if the user is logged in, fetches their profile if yes, 
  //logs them out if the token is bad, and stops the loading state.
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await getMe(token);
        setUser(me);
      } catch (err) {
        console.error(err);
        setToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);
 
  //Login is for getting the token.
  //This useEffect is for using the token.

  const handleLogin = async (credentials) => {
    const data = await login(credentials);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const handleRegister = async (payload) => {
    const data = await register(payload);
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login: handleLogin, register: handleRegister, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

