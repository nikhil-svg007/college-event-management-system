import axiosClient from './axiosClient.js';

export const registerForEvent = async (eventId) => {
  const { data } = await axiosClient.post(`/registrations/${eventId}`);
  return data;
};

export const fetchMyRegistrations = async () => {
  const { data } = await axiosClient.get('/registrations/my');
  return data;
};

