
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SearchProvider } from '@/contexts/SearchContext';
import { NotificationsProvider } from '@/contexts/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import ForexTrading from '@/pages/ForexTrading';
import FitnessTraining from '@/pages/FitnessTraining';
import KarateTraining from '@/pages/KarateTraining';
import FitnessJourney from '@/pages/FitnessJourney';
import KarateJourney from '@/pages/KarateJourney';
import Auth from '@/pages/Auth';

function App() {
  return (
    <ThemeProvider>
      <NotificationsProvider>
        <SearchProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-vintage-warm-cream">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/forex-trading" element={<ForexTrading />} />
                  <Route path="/fitness-training" element={<FitnessTraining />} />
                  <Route path="/karate-training" element={<KarateTraining />} />
                  <Route path="/fitness-journey" element={<FitnessJourney />} />
                  <Route path="/karate-journey" element={<KarateJourney />} />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </AuthProvider>
        </SearchProvider>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

export default App;
