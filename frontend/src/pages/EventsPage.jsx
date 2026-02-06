import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/eventApi.js';
import EventCard from '../components/events/EventCard.jsx';
import { registerForEvent } from '../api/registrationApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const load = async (cat) => {
    setLoading(true);
    try {
      const data = await fetchEvents(cat ? { category: cat } : {});
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(category);
  }, [category]);

  const handleRegister = async (event) => {
    try {
      await registerForEvent(event._id);
      alert('Registered successfully');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">All Upcoming Events</h1>
          <p className="mt-2 text-sm text-slate-400">Browse and discover events happening on campus</p>
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field w-full max-w-xs"
        >
          <option value="">All Categories</option>
          <option value="Dance">Dance</option>
          <option value="Singing">Singing</option>
          <option value="Seminar">Seminar</option>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-slate-400">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-slate-400">No events found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard
              key={e._id}
              event={e}
              isStudent={user?.role === 'student'}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;

