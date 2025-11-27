import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import ApplyLeave from "./pages/ApplyLeave";
import Approvals from "./pages/Approvals";
import LeaveCalendar from "./pages/LeaveCalendar";
import Payroll from "./pages/Payroll";
import Payslips from "./pages/Payslips";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/employees" element={<ProtectedRoute><Layout><Employees /></Layout></ProtectedRoute>} />
          <Route path="/apply-leave" element={<ProtectedRoute><Layout><ApplyLeave /></Layout></ProtectedRoute>} />
          <Route path="/approvals" element={<ProtectedRoute><Layout><Approvals /></Layout></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Layout><LeaveCalendar /></Layout></ProtectedRoute>} />
          <Route path="/payroll" element={<ProtectedRoute><Layout><Payroll /></Layout></ProtectedRoute>} />
          <Route path="/payslips" element={<ProtectedRoute><Layout><Payslips /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
