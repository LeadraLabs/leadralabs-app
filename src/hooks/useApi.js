import { useCallback } from 'react';
import { supabase } from '../config/supabase';

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const FALLBACK_MESSAGE = "We're having a moment — please try again in a few seconds.";

async function request(path, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(FALLBACK_MESSAGE, 0);
  }

  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    throw new ApiError(body?.error || FALLBACK_MESSAGE, res.status);
  }

  return body;
}

export function useApi() {
  const getProfile = useCallback(() => request('/users/profile'), []);

  const createOrUpdateProfile = useCallback(
    (data) => request('/users/profile', { method: 'POST', body: JSON.stringify(data) }),
    []
  );

  const submitJournalEntry = useCallback(
    (data) => request('/journal/entry', { method: 'POST', body: JSON.stringify(data) }),
    []
  );

  const refreshMicroAction = useCallback(
    (insightId) => request(`/journal/entry/${insightId}/refresh-action`, { method: 'POST' }),
    []
  );

  const getJournalEntries = useCallback(() => request('/journal/entries'), []);

  const getJournalEntry = useCallback((id) => request(`/journal/entries/${id}`), []);

  const getRecentInsights = useCallback(() => request('/insights/recent'), []);

  const getLatestSummary = useCallback(() => request('/summaries/latest'), []);

  const getAllSummaries = useCallback(() => request('/summaries/all'), []);

  const getMonthlyPatterns = useCallback(() => request('/patterns/monthly'), []);

  const getNotifications = useCallback(() => request('/notifications'), []);

  const markNotificationRead = useCallback(
    (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
    []
  );

  const markAllNotificationsRead = useCallback(
    () => request('/notifications/read-all', { method: 'POST' }),
    []
  );

  const submitFeedback = useCallback(
    (data) => request('/feedback', { method: 'POST', body: JSON.stringify(data) }),
    []
  );

  return {
    getProfile,
    createOrUpdateProfile,
    submitJournalEntry,
    refreshMicroAction,
    getJournalEntries,
    getJournalEntry,
    getRecentInsights,
    getLatestSummary,
    getAllSummaries,
    getMonthlyPatterns,
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    submitFeedback,
  };
}
