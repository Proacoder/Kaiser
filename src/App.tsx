import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ActivityProvider } from "./context/ActivityContext";
import { ToastContainer } from "./components/ToastContainer";
import { AIAssistant } from "./components/AIAssistant";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthGateModal } from "./components/AuthGateModal";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { CommandPalette } from "./components/CommandPalette";
import { QuickTicketTracker } from "./components/QuickTicketTracker";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { MapViewPage } from "./pages/MapViewPage";
import { OfficersPage } from "./pages/OfficersPage";
import { ReportPage } from "./pages/ReportPage";
import { ComplaintDetailsPage } from "./pages/ComplaintDetailsPage";
import { AdminHub } from "./pages/AdminHub";
import { AdminUserManagement } from "./pages/AdminUserManagement";
import { Login } from "./pages/Login";
import { CitizenLogin } from "./pages/CitizenLogin";
import { OfficerLogin } from "./pages/OfficerLogin";
import { Register } from "./pages/Register";
import { MyReportsPage } from "./pages/MyReportsPage";
import { PublicServiceQRRating } from "./components/PublicServiceQRRating";
import { CitizenGamificationLeaderboard } from "./components/CitizenGamificationLeaderboard";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false);
  const [ticketTrackerOpen, setTicketTrackerOpen] = React.useState(false);

  React.useEffect(() => {
    const handleOpen = () => setCommandPaletteOpen(true);
    window.addEventListener("open-command-palette", handleOpen);
    return () => window.removeEventListener("open-command-palette", handleOpen);
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <ToastProvider>
          <ActivityProvider>
          <Router>
            <ScrollProgressBar />
            <ScrollToTopButton />
            <CommandPalette
              isOpen={commandPaletteOpen}
              onClose={() => setCommandPaletteOpen(false)}
            />
            <QuickTicketTracker
              isOpen={ticketTrackerOpen}
              onClose={() => setTicketTrackerOpen(false)}
            />
            <AuthGateModal />
            <AIAssistant />
            <div className="relative flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-red-500 selection:text-white">
              <Navbar 
                onOpenCommandPalette={() => setCommandPaletteOpen(true)}
                onOpenTracker={() => setTicketTrackerOpen(true)}
              />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/officers" element={<OfficersPage />} />
                  <Route path="/map" element={<MapViewPage />} />
                  <Route path="/top10" element={<Navigate to="/dashboard?sortBy=upvotes" replace />} />
                  <Route path="/analytics" element={<Dashboard />} />
                  <Route path="/hotspots" element={<MapViewPage />} />
                  <Route path="/report" element={<ReportPage />} />
                  <Route path="/my-reports" element={<MyReportsPage />} />
                  <Route path="/complaint/:id" element={<ComplaintDetailsPage />} />
                  <Route path="/qr-rating" element={<div className="py-8 px-4"><PublicServiceQRRating /></div>} />
                  <Route path="/rewards" element={<CitizenGamificationLeaderboard />} />
                  
                  {/* Protected Ward Officer Control Room */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute requiredRole="Officer">
                        <AdminHub />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Protected Administrator Member Directory */}
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute requiredRole="Officer">
                        <AdminUserManagement />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Dedicated Authentication Portals */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/login/citizen" element={<CitizenLogin />} />
                  <Route path="/login/officer" element={<OfficerLogin />} />
                  <Route path="/register" element={<Register />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <ToastContainer />
          </Router>
          </ActivityProvider>
        </ToastProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
