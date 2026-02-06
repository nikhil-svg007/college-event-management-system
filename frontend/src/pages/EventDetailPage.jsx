import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEventById } from '../api/eventApi.js';
import { registerForEvent } from '../api/registrationApi.js';
import { useAuth } from '../context/AuthContext.jsx';

const EventDetailPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRegister = async () => {
    if (!event) return;
    try {
      await registerForEvent(event._id);
      alert('Registered successfully');
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to register');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-slate-400">Loading event...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400">Event not found.</p>
        </div>
      </div>
    );
  }

  const isClosed = !event.isRegistrationOpen;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <div className="card space-y-6">
        {event.posterUrl && (
          <div className="overflow-hidden rounded-xl">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="h-80 w-full object-cover"
            />
          </div>
        )}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="badge badge-primary">{event.category}</span>
            <span className="text-slate-500">•</span>
            <span className="text-sm text-slate-400">{event.society?.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-4">{event.title}</h1>
        </div>
        
        <div className="prose prose-invert max-w-none">
          <p className="text-base text-slate-300 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>

        <div className="grid gap-6 pt-6 border-t border-slate-700/50 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Date & Time</p>
              <p className="text-sm text-slate-200 font-medium">
                {new Date(event.dateTime).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Venue / Link</p>
              <p className="text-sm text-slate-200 font-medium">
                {event.venue || event.onlineLink || 'TBA'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Registration Deadline</p>
              <p className="text-sm text-slate-200 font-medium">
                {new Date(event.registrationDeadline).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Participants</p>
              <p className="text-sm text-slate-200 font-medium">
                <span className="text-primary-400 font-bold">{event.registrationCount}</span> / {event.maxParticipants} registered
              </p>
            </div>
          </div>
        </div>
        
        {user?.role === 'student' && (
          <button
            disabled={isClosed}
            onClick={handleRegister}
            className={`w-full mt-6 ${
              isClosed
                ? 'btn-secondary cursor-not-allowed opacity-50'
                : 'btn-primary'
            }`}
          >
            {isClosed ? 'Registration Closed' : 'Register for this Event'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;

