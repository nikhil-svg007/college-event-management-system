import axiosClient from './axiosClient.js';

export const fetchEvents = async (params = {}) => {
  const { data } = await axiosClient.get('/events', { params });
  return data;
};

export const fetchEventById = async (id) => {
  const { data } = await axiosClient.get(`/events/${id}`);
  return data;
};

export const createEvent = async (payload) => {
  const { data } = await axiosClient.post('/events', payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const updateEvent = async (id, payload) => {
  const { data } = await axiosClient.put(`/events/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteEvent = async (id) => {
  const { data } = await axiosClient.delete(`/events/${id}`);
  return data;
};

