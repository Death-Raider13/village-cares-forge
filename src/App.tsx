import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AuthGuard } from '@/components/auth/AuthGuard';
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
import Community from '@/pages/Community';
import EmailVerification from '@/components/auth/EmailVerification';
import VerificationSuccess from '@/components/auth/VerificationSuccess';
import { SessionManager } from '@/components/auth/SessionManager';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <NotificationsProvider>
              <SearchProvider>
                <div className="min-h-screen bg-vintage-warm-cream">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/forex-training" element={<ForexTraining />} />
                    <Route path="/forex-trading" element={<ForexTraining />} />
                    <Route path="/fitness-training" element={<FitnessTraining />} />
                    <Route path="/karate-training" element={<KarateTraining />} />

                    {/* Auth routes */}
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/verify-email" element={<EmailVerification />} />
                    <Route path="/verification-success" element={<VerificationSuccess />} />

                    {/* Protected routes - require authentication and email verification */}
                    <Route
                      path="/fitness-journey"
                      element={
                        <AuthGuard requireVerification={true}>
                          <FitnessJourney />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/karate-journey"
                      element={
                        <AuthGuard requireVerification={true}>
                          <KarateJourney />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/community"
                      element={
                        <AuthGuard requireVerification={true}>
                          <Community />
                        </AuthGuard>
                      }
                    />

                    {/* Admin routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                  <SessionManager />
                  <Toaster />
                </div>
              </SearchProvider>
            </NotificationsProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;