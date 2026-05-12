import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Guards
import Layout from '../components/Layout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Team from '../pages/Team';
import Auth from '../pages/Auth';
import AppPage from '../pages/AppPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Team />} />
        <Route path="auth" element={<Auth />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<AppPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
