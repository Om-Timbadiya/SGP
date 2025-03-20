import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Profile from './pages/Profile';
import HelpCenter from './pages/HelpCenter';
import Discussion from './pages/Discussion';
import Certificates from './pages/Certificates';
import Badges from './pages/Badges';
import AIChatSupport from './components/AIChatSupport';
import AccessibilityPanel from './components/AccessibilityPanel';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <DatabaseProvider>
            <AccessibilityProvider>
              <div className="min-h-screen bg-gray-50">
                <Toaster position="top-right" />
                <Routes>
                  <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                  <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                  <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                  <Route
                    path="/*"
                    element={
                      <PrivateRoute>
                        <div className="flex">
                          <Navbar />
                          <main className="flex-1 overflow-auto">
                            <Routes>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/assessment/:id?" element={<Assessment />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/help" element={<HelpCenter />} />
                              <Route path="/discussion" element={<Discussion />} />
                              <Route path="/certificates" element={<Certificates />} />
                              <Route path="/badges" element={<Badges />} />
                            </Routes>
                          </main>
                        </div>
                      </PrivateRoute>
                    }
                  />
                </Routes>

                <AccessibilityPanel />
                <AIChatSupport />
              </div>
            </AccessibilityProvider>
          </DatabaseProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>

  );
}

export default App;