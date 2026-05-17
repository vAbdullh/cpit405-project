import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Guards
import Layout from '../components/Layout';
import AppLayout from '../components/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Team from '../pages/Team';
import Auth from '../pages/Auth';
import AppPage from '../pages/AppPage';
import TripsPage from '../pages/TripsPage';
import TripDetails from '../pages/TripDetails';
import InvitationsPage from '../pages/InvitationsPage';
import Account from '../pages/Account';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes with standard Header/Footer */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="team" element={<Team />} />
        <Route path="auth" element={<Auth />} />
      </Route>

      {/* Protected App Routes with Sidebar Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="app" element={<AppPage />} />
          <Route path="app/trips" element={<TripsPage />} />
          <Route path="app/trips/:tripId" element={<TripDetails />} />
          <Route path="app/invitations" element={<InvitationsPage />} />
          <Route path="app/account" element={<Account />} />
        </Route>
      </Route>
    </Routes>
  );
}
