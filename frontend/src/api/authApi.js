import axiosClient from './axiosClient.js';

export const login = async ({ email, password }) => {
  const { data } = await axiosClient.post('/auth/login', { email, password });
  return data;
};

export const register = async (payload) => {
  const { data } = await axiosClient.post('/auth/register', payload);
  return data;
};

export const getMe = async (token) => {
  const { data } = await axiosClient.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
};

