import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { SessionManager } from '@/components/auth/SessionManager';
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
import { SessionManager } from '@/components/auth/SessionManager';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
<<<<<<< HEAD
        <AuthProvider>
          <NotificationsProvider>
            <SearchProvider>
              <Router>
                <SessionManager>
=======
        <NotificationsProvider>
          <SearchProvider>
            <AuthProvider>
              <SessionManager>
                <Router>
>>>>>>> 3da71c4 (aa)
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
>>>>>>> 3da71c4 (aa)
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
>>>>>>> 3da71c4 (aa)
                        element={
                          <ProtectedRoute>
                            <KarateJourney />
                          </ProtectedRoute>
<<<<<<< HEAD
                        } 
=======
                        }
>>>>>>> 3da71c4 (aa)
                      />
                      <Route path="/auth" element={<Auth />} />
                    </Routes>
                    <Toaster />
                  </div>
<<<<<<< HEAD
                </SessionManager>
              </Router>
            </SearchProvider>
          </NotificationsProvider>
        </AuthProvider>
=======
                </Router>
              </SessionManager>
            </AuthProvider>
          </SearchProvider>
        </NotificationsProvider>
>>>>>>> 3da71c4 (aa)
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;