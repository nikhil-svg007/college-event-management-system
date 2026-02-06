import React, { useEffect, useState } from 'react';
import { deleteEvent, fetchEvents } from '../api/eventApi.js';
import EventForm from '../components/events/EventForm.jsx';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreatedOrUpdated = async () => {
    setEditingEvent(null);
    await load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event permanently?')) return;
    try {
      await deleteEvent(id);
      await load();
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          Event Dashboard
        </h1>
        <p className="text-sm text-slate-400">
          Create and manage your society's events
        </p>
      </div>

      {/* Create / Edit Form */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-100">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h2>

          {editingEvent && (
            <button
              onClick={() => setEditingEvent(null)}
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <EventForm
          initialData={editingEvent}
          onSuccess={handleCreatedOrUpdated}
        />
      </div>

      {/* Event List */}
      <section>
        <h2 className="mb-6 text-xl font-bold text-slate-100">
          Your Upcoming Events
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-slate-400">Loading...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-slate-400">
              No events created yet. Create your first event above!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Event Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {event.title}
                    </h3>
                    <span className="badge badge-primary text-xs">
                      {event.category}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mb-2">
                    {event.society?.name || 'Society'} •{' '}
                    {new Date(event.dateTime).toLocaleString()}
                  </p>

                  <p className="text-sm text-slate-300">
                    <span className="font-semibold text-primary-400">
                      {event.registrationCount}
                    </span>{' '}
                    / {event.maxParticipants} registered
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingEvent(event)}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(event._id)}
                    className="btn-danger text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminEventsPage;
