import React, { useEffect, useState } from 'react';
import { fetchRecommendations } from '../../api/recommendationApi.js';
import EventCard from './EventCard.jsx';
import { registerForEvent } from '../../api/registrationApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const RecommendedEvents = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRecommendations();
        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'student') {
      load();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleRegister = async (event) => {
    try {
      await registerForEvent(event._id);
      alert('Registered successfully');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to register');
    }
  };

  if (!user || user.role !== 'student') return null;
  if (loading) return null;
  if (!items.length) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Recommended For You</h2>
          <p className="text-sm text-slate-400 mt-1">
            Based on your interests and activity
          </p>
        </div>
        <div className="badge badge-primary">
          AI Powered
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ event, score }) => (
          <EventCard
            key={event._id}
            event={event}
            isStudent
            onRegister={handleRegister}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedEvents;

