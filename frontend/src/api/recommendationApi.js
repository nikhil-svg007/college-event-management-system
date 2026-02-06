import axiosClient from './axiosClient.js';

export const fetchRecommendations = async () => {
  const { data } = await axiosClient.get('/recommendations');
  return data;
};

