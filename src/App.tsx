
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Collaboration from "./pages/Collaboration";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import NotFound from "./pages/NotFound";
import "./App.css";

// Add custom animation to support audio visualization
const style = document.createElement('style');
style.textContent = `
  @keyframes float {
    0% {
      height: var(--original-height);
    }
    50% {
      height: calc(var(--original-height) * 0.4);
    }
    100% {
      height: var(--original-height);
    }
  }
  
  .animate-float {
    animation: float 1s ease-in-out infinite;
    animation-delay: var(--delay, 0s);
  }
`;
document.head.appendChild(style);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/text" element={<Dashboard />} />
          <Route path="/dashboard/image" element={<Dashboard />} />
          <Route path="/dashboard/music" element={<Dashboard />} />
          <Route path="/dashboard/multimodal" element={<Dashboard />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/project/:projectId" element={<ProjectWorkspace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
