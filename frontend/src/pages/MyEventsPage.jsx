import React, { useEffect, useState } from 'react';
import { fetchMyRegistrations } from '../api/registrationApi.js';

const MyEventsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMyRegistrations();
        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">My Registered Events</h1>
        <p className="text-sm text-slate-400">Track all events you've registered for</p>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-3 text-slate-400">Loading...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12">
          <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-slate-400 mb-2">You have not registered for any events yet.</p>
          <a href="/events" className="text-primary-400 hover:text-primary-300 text-sm font-medium">
            Browse Events →
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((reg) => (
            <div key={reg._id} className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-100">{reg.event?.title}</h3>
                  <span className="badge badge-primary text-xs">{reg.event?.category}</span>
                </div>
                <p className="text-sm text-slate-400 mb-2">
                  {reg.event?.society?.name || 'Society'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {reg.event?.dateTime &&
                      new Date(reg.event.dateTime).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge ${
                  reg.status === 'registered' ? 'badge-success' : 
                  reg.status === 'cancelled' ? 'badge-warning' : 
                  'badge-primary'
                }`}>
                  {reg.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEventsPage;

