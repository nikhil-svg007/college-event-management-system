import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import MyEventsPage from './pages/MyEventsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import AdminEventsPage from './pages/AdminEventsPage.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import ChatBot from './components/common/ChatBot.jsx';

const App = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        <Route element={<ProtectedRoute roles={['student']} />}>
          <Route path="/my-events" element={<MyEventsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['society_admin']} />}>
          <Route path="/admin/events" element={<AdminEventsPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <ChatBot />
    </div>
  );
};

export default App;

