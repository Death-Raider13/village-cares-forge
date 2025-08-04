import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import ForexTraining from '@/pages/ForexTraining';
import FitnessTraining from '@/pages/FitnessTraining';
import KarateTraining from '@/pages/KarateTraining';
import FitnessJourney from '@/pages/FitnessJourney.refactored';
import KarateJourney from '@/pages/KarateJourney';
import Auth from '@/pages/Auth';
import AdminPage from '@/pages/AdminPage';
import AdminLogin from '@/pages/AdminLogin';
import { SessionManager } from '@/components/auth/SessionManager';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <NotificationsProvider>
              <SearchProvider>
                <SessionManager>
                  <div className="min-h-screen bg-vintage-warm-cream">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/forex-training" element={<ForexTraining />} />
                      <Route path="/forex-trading" element={<ForexTraining />} />
                      <Route path="/fitness-training" element={<FitnessTraining />} />
                      <Route path="/karate-training" element={<KarateTraining />} />
                      <Route
                        path="/fitness-journey"
                        element={
                          <ProtectedRoute>
                            <FitnessJourney />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/karate-journey"
                        element={
                          <ProtectedRoute>
                            <KarateJourney />
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/admin-login" element={<AdminLogin />} />
                      <Route
                        path="/admin"
                        element={
                          <ProtectedRoute>
                            <AdminPage />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                    <Toaster />
                  </div>
                </SessionManager>
              </SearchProvider>
            </NotificationsProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;