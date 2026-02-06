import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/eventApi.js';
import EventCard from '../components/events/EventCard.jsx';
import RecommendedEvents from '../components/events/RecommendedEvents.jsx';
import { registerForEvent } from '../api/registrationApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      <section className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-slate-100 via-primary-300 to-primary-400 bg-clip-text text-transparent">
          Discover and Manage College Events
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base text-slate-400 leading-relaxed">
          Students can explore fests, tech talks, cultural nights and more. Societies can
          publish events, track registrations and reach the right audience.
        </p>
      </section>

      <RecommendedEvents />

      <section className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-100">Upcoming Events</h2>
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
            <p className="text-slate-400">No upcoming events yet.</p>
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
      </section>
    </div>
  );
};

export default HomePage;

