import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const ALL_INTERESTS = ['Dance', 'Music', 'Coding', 'AI', 'Public Speaking', 'Sports', 'Seminar', 'Tech'];

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    societyName: ''
  });
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, interests: selectedInterests });//It merges the form data with selected interests into a new object and sends it to the register API
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-2xl space-y-6"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Create Account</h1>
          <p className="text-sm text-slate-400">Join our community and start exploring events</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="student">Student</option>
              <option value="society_admin">Society / Club Admin</option>
            </select>
          </div>
        </div>

        {form.role === 'society_admin' && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Society / Club Name</label>
            <input
              name="societyName"
              value={form.societyName}
              onChange={handleChange}
              required
              placeholder="Tech Society"
              className="input-field"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Interests</label>
          <p className="text-xs text-slate-400 mb-3">
            Select topics to receive personalized event recommendations
          </p>
          <div className="flex flex-wrap gap-2">
            {ALL_INTERESTS.map((interest) => {
              const selected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200 ${
                    selected
                      ? 'border-primary-500 bg-primary-500/20 text-primary-300 shadow-lg shadow-primary-500/20'
                      : 'border-slate-700 text-slate-300 hover:border-primary-500/50 hover:bg-slate-800/50'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
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
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;

