import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { LandingLayout } from "@/components/layout/LandingLayout";
import Dashboard from "@/pages/Dashboard";
import CaseQueue from "@/pages/CaseQueue";
import CaseDetails from "@/pages/CaseDetails";
import VisualAnalysis from "@/pages/VisualAnalysis";
import RiskReasoning from "@/pages/RiskReasoning";
import ActionsApprovals from "@/pages/ActionsApprovals";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page with full-screen layout */}
          <Route path="/" element={
            <LandingLayout>
              <Dashboard />
            </LandingLayout>
          } />
          
          {/* Internal app pages with sidebar */}
          <Route path="/cases" element={
            <AppLayout>
              <CaseQueue />
            </AppLayout>
          } />
          <Route path="/cases/:id" element={
            <AppLayout>
              <CaseDetails />
            </AppLayout>
          } />
          <Route path="/cases/:id/visual" element={
            <AppLayout>
              <VisualAnalysis />
            </AppLayout>
          } />
          <Route path="/cases/:id/risk" element={
            <AppLayout>
              <RiskReasoning />
            </AppLayout>
          } />
          <Route path="/cases/:id/actions" element={
            <AppLayout>
              <ActionsApprovals />
            </AppLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
