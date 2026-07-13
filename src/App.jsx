import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useApi } from './hooks/useApi';
import { needsOnboarding } from './utils/onboarding';
import AppLayout from './components/Layout/AppLayout';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Onboarding from './pages/Onboarding/Onboarding';
import Dashboard from './pages/Dashboard/Dashboard';
import Journal from './pages/Journal/Journal';
import JournalSuccess from './pages/Journal/JournalSuccess';
import Insights from './pages/Insights/Insights';
import Summaries from './pages/Summaries/Summaries';
import Profile from './pages/Profile/Profile';
import Capabilities from './pages/Capabilities/Capabilities';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { getProfile } = useApi();
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setDestination(null);
      return;
    }
    let cancelled = false;
    needsOnboarding(getProfile).then((needs) => {
      if (!cancelled) setDestination(needs ? '/onboarding' : '/dashboard');
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getProfile]);

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return destination ? <Navigate to={destination} replace /> : <LoadingSpinner />;

  return children;
}

function CatchAllRoute() {
  const { isAuthenticated, loading } = useAuth();
  const { getProfile } = useApi();
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setDestination('/login');
      return;
    }
    let cancelled = false;
    needsOnboarding(getProfile).then((needs) => {
      if (!cancelled) setDestination(needs ? '/onboarding' : '/dashboard');
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, getProfile]);

  if (loading || !destination) return <LoadingSpinner />;

  return <Navigate to={destination} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/success/:id" element={<JournalSuccess />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/summaries" element={<Summaries />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/capabilities" element={<Capabilities />} />
      </Route>

      <Route path="*" element={<CatchAllRoute />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
