import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event, onRegister, isStudent }) => {
  const isClosed = !event.isRegistrationOpen;

  return (
    <div className="card flex flex-col justify-between gap-4 group">
      <div>
        {event.posterUrl && (
          <div className="mb-4 overflow-hidden rounded-xl">
            <img
              src={event.posterUrl}
              alt={event.title}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-100 leading-tight">{event.title}</h3>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="badge badge-primary">
            {event.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-400">{event.society?.name}</span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-slate-300 leading-relaxed">
          {event.description}
        </p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="space-y-2 text-xs text-slate-400 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-slate-300">{new Date(event.dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-slate-300 truncate">{event.venue || event.onlineLink || 'TBA'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-slate-300">
              <span className="font-semibold text-primary-400">{event.registrationCount}</span> / {event.maxParticipants} registered
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-3">
          <Link
            to={`/events/${event._id}`}
            className="btn-secondary text-xs flex-1 text-center"
          >
            View Details
          </Link>
          {isStudent && (
            <button
              disabled={isClosed}
              onClick={() => onRegister && onRegister(event)}
              className={`text-xs font-medium px-4 py-2 rounded-lg transition-all duration-200 flex-1 ${
                isClosed
                  ? 'cursor-not-allowed bg-slate-800/50 text-slate-500 border border-slate-700'
                  : 'btn-primary'
              }`}
            >
              {isClosed ? 'Closed' : 'Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;

