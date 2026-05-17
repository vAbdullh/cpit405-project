import apiClient from './axios';

// --- Expenses ---

/**
 * Fetch all expenses (including splits) for a trip
 * @param {string|number} tripId 
 */
export const getExpenses = (tripId) =>
  apiClient.get(`/trips/${tripId}/expenses`).then((r) => r.data);

/**
 * Create a new expense split in a trip
 * @param {string|number} tripId 
 * @param {object} data { title, amount, paidById, splits: [{ userId, amount, isPaid }] }
 */
export const createExpense = (tripId, data) =>
  apiClient.post(`/trips/${tripId}/expenses`, data).then((r) => r.data);

/**
 * Delete an entire expense
 * @param {string|number} tripId 
 * @param {string|number} expenseId 
 */
export const deleteExpense = (tripId, expenseId) =>
  apiClient.delete(`/trips/${tripId}/expenses/${expenseId}`).then((r) => r.data);

/**
 * Update the payment status of an individual member's share
 * @param {string|number} tripId 
 * @param {string|number} expenseId 
 * @param {string|number} userId 
 * @param {boolean} isPaid 
 */
export const updateSplitStatus = (tripId, expenseId, userId, isPaid) =>
  apiClient.patch(`/trips/${tripId}/expenses/${expenseId}/splits/${userId}`, { isPaid }).then((r) => r.data);
