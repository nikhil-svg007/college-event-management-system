import axiosClient from './axiosClient.js';

export const generateDescription = async (payload) => {
  const { data } = await axiosClient.post('/ai/generate-description', payload);
  return data;
};

export const chatWithAI = async (message) => {
  const { data } = await axiosClient.post('/ai/chat', { message });
  return data;
};

