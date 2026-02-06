import React, { useState } from 'react';
import { createEvent } from '../../api/eventApi.js';
import { generateDescription } from '../../api/aiApi.js';

const EventForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Tech',
    dateTime: '',
    venue: '',
    onlineLink: '',
    maxParticipants: 100,
    registrationDeadline: '',
    poster: null
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, poster: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();          //FormData → special object used to send files + text data to backend
      Object.keys(form).forEach((key) => {      //Object.keys(form) → gets all field names from form
        if (key === 'poster' && form[key]) {    //checks if the field is poster && form[key] → makes sure a file exists
          formData.append('poster', form[key]); //append → adds data to FormData, 'poster' → field name sent to backend, form[key] → actual file
        } else if (key !== 'poster') {
          formData.append(key, form[key]);
        }
      });

      const created = await createEvent(formData);
      onCreated && onCreated(created);
      setForm((prev) => ({ ...prev, title: '', description: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescription = async () => {
    setAiLoading(true);
    setError('');
    try {
      const { description } = await generateDescription({
        title: form.title || 'Our Event',
        category: form.category,
        shortPrompt: ''
      });
      setForm((prev) => ({ ...prev, description }));
    } catch (err) {
      setError('Failed to generate description');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-700/50">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Create New Event</h2>
          <p className="text-sm text-slate-400 mt-1">Fill in the details to publish your event</p>
        </div>
        <button
          type="button"
          onClick={handleGenerateDescription}
          disabled={aiLoading || !form.title}
          className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {aiLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </span>
          ) : (
            '✨ AI Description'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g., Annual Tech Fest 2026"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Dance">Dance</option>
            <option value="Singing">Singing</option>
            <option value="Seminar">Seminar</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Date & Time</label>
          <input
            type="datetime-local"
            name="dateTime"
            value={form.dateTime}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Registration Deadline</label>
          <input
            type="datetime-local"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            required
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Venue</label>
          <input
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="Main Auditorium"
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Online Link (optional)</label>
          <input
            name="onlineLink"
            value={form.onlineLink}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Max Participants</label>
          <input
            type="number"
            name="maxParticipants"
            value={form.maxParticipants}
            onChange={handleChange}
            min={1}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Poster Image</label>
          <input
            type="file"
            name="poster"
            onChange={handleFileChange}
            accept="image/*"
            className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={5}
          placeholder="Describe your event in detail..."
          className="input-field resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Event...
          </span>
        ) : (
          'Create Event'
        )}
      </button>
    </form>
  );
};

export default EventForm;

