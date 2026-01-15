import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import { PublicLayout } from "@/components/layout/PublicLayout";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventRegistration from "./pages/EventRegistration";
import Support from "./pages/Support";
import Contact from "./pages/Contact";
import Rules from "./pages/Rules";
import Help from "./pages/Help";
import Docs from "./pages/Docs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import Disclaimer from "./pages/Disclaimer";
import ContactSupport from "./pages/ContactSupport";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";

// Admin imports
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminEvents } from "./pages/admin/AdminEvents";
import { AdminEventDetail } from "./pages/admin/AdminEventDetail";
import { AdminLegal } from "./pages/admin/AdminLegal";
import HoverReceiver from "@/visual-edits/VisualEditsMessenger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HoverReceiver />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Routes with shared layout for persistent mobile navbar */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/register" element={<EventRegistration />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/help" element={<Help />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/docs/:slug" element={<Docs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/contact-support" element={<ContactSupport />} />
            </Route>
            
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes with Layout */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="events/:eventId" element={<AdminEventDetail />} />
              <Route path="legal" element={<AdminLegal />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
