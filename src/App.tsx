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

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <SearchProvider>
              <Router>
                <SessionManager>
                  <div className="min-h-screen bg-vintage-warm-cream">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/forex-training" element={<ForexTraining />} />
                      <Route path="/forex-trading" element={<ForexTraining />} />
                      <Route path="/fitness-training" element={<FitnessTraining />} />
                      <Route path="/karate-training" element={<KarateTraining />} />
<<<<<<< HEAD
                      <Route 
                        path="/fitness-journey" 
=======
                      <Route
                        path="/fitness-journey"
>>>>>>> 5b4c829 (changes)
                        element={
                          <ProtectedRoute>
                            <FitnessJourney />
                          </ProtectedRoute>
<<<<<<< HEAD
                        } 
                      />
                      <Route 
                        path="/karate-journey" 
=======
                        }
                      />
                      <Route
                        path="/karate-journey"
>>>>>>> 5b4c829 (changes)
                        element={
                          <ProtectedRoute>
                            <KarateJourney />
                          </ProtectedRoute>
<<<<<<< HEAD
                        } 
=======
                        }
>>>>>>> 5b4c829 (changes)
                      />
                      <Route path="/auth" element={<Auth />} />
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
              </Router>
            </SearchProvider>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;