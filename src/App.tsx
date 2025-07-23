
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import ForexTrading from "./pages/ForexTrading";
import FitnessTraining from "./pages/FitnessTraining";
import KarateTraining from "./pages/KarateTraining";
import FitnessJourney from "./pages/FitnessJourney";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/forex-trading" element={<ForexTrading />} />
            <Route path="/fitness-training" element={<FitnessTraining />} />
            <Route path="/fitness-journey" element={<FitnessJourney />} />
            <Route path="/karate-training" element={<KarateTraining />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
