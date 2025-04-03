import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import Index from "./pages/Index";
import FacultyDashboard from "./pages/faculty/Dashboard";
import NewRequest from "./pages/requests/NewRequest";
import NotFound from "./pages/NotFound";
import Drop from "./test/Drop";
import Venues from "./components/layout/Venues";
const queryClient = new QueryClient();
import Admin from "./pages/Admin"

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/student/dashboard/:id" element={<Index />} />
          <Route path="/faculty/dashboard/:id" element={<FacultyDashboard />} />
          <Route path="/requests/new/:id" element={<NewRequest />} />
          <Route path="/venues" element={<Venues />} />
          <Route path="/admin/dashboard/:id" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
