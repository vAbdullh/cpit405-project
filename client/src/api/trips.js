import apiClient from './axios';

// --- Trips ---

export const getTrips = () =>
  apiClient.get('/trips').then((r) => r.data);

export const getTrip = (tripId) =>
  apiClient.get(`/trips/${tripId}`).then((r) => r.data);

export const createTrip = (data) =>
  apiClient.post('/trips', data).then((r) => r.data);

export const deleteTrip = (tripId) =>
  apiClient.delete(`/trips/${tripId}`).then((r) => r.data);

// --- Members ---

export const getMembers = (tripId) =>
  apiClient.get(`/trips/${tripId}/members`).then((r) => r.data);

export const removeMember = (tripId, userId) =>
  apiClient.delete(`/trips/${tripId}/members/${userId}`).then((r) => r.data);

// --- Invitations (trip-scoped, creator view) ---

export const getTripInvitations = (tripId) =>
  apiClient.get(`/trips/${tripId}/invitations`).then((r) => r.data);

export const inviteMember = (tripId, email) =>
  apiClient.post(`/trips/${tripId}/invite`, { email }).then((r) => r.data);

// --- Invitations (user-scoped, invitee view) ---

export const getPendingInvitations = () =>
  apiClient.get('/invitations/pending').then((r) => r.data);

export const acceptInvitation = (invitationId) =>
  apiClient.post(`/invitations/${invitationId}/accept`).then((r) => r.data);

export const rejectInvitation = (invitationId) =>
  apiClient.post(`/invitations/${invitationId}/reject`).then((r) => r.data);
