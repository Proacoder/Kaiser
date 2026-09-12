import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Building2, User, ShieldAlert, ArrowRight, CheckCircle2, 
  Sparkles, ShieldCheck, Lock, UserPlus, LogIn, Eye, X
} from "lucide-react";

export const AuthGateModal: React.FC = () => {
  const { user, login, exploreAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loadingDemo, setLoadingDemo] = useState<string | null>(null);

  // Only show the gate on the home page — all other pages are publicly browsable.
  // Also hide on login/register pages and when the user is already authenticated.
  const isAuthPage = 
    location.pathname.startsWith("/login") || 
    location.pathname.startsWith("/register");

  const isHomePage = location.pathname === "/";

  if (user || isAuthPage || !isHomePage) return null;

  const handleQuickDemo = async (role: "Citizen" | "Officer") => {
    setLoadingDemo(role);
    try {
      if (role === "Officer") {
        await login("officer.hwest@civic.com", "officer123", "Officer", {
          serviceId: "BMC-OFF-0901",
          ward: 9,
        });
        navigate("/admin");
      } else {
        await login("aarav@example.com", "citizen123", "Citizen", { ward: 9 });
        navigate("/");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#000000]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono">
      <div className="bg-[#f6f3f1] w-full max-w-2xl rounded-[40px] border border-[#cecac8] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200 relative">
        {/* Top Accent Stripe — Monad Lake Blue */}
        <div className="h-1.5 w-full bg-[#2b59d1]"></div>

        {/* Modal Header — Monad Off-Black Ground */}
        <div className="bg-[#242424] text-white p-8 sm:p-10 text-center space-y-4 relative">
          {/* Close / Dismiss Button */}
          <button
            onClick={exploreAsGuest}
            className="absolute top-5 right-5 p-2 text-[#cecac8] hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            title="Dismiss & Browse as Guest"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-full bg-[#2b59d1] flex items-center justify-center mx-auto shadow-lg text-white">
            <Building2 className="w-7 h-7 text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#cfdaf5] border border-[#cecac8] text-[#242424] text-[10px] font-mono uppercase tracking-wider">
            <span>Government of Maharashtra • BMC</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-white leading-snug">
            Welcome to KAISER CivicConnect AI
          </h1>

          <p className="text-xs sm:text-sm text-[#cecac8] max-w-lg mx-auto font-mono leading-relaxed">
            Please sign in or create an account to access automated civic grievance reporting, AI image hazard triage, or the Ward Officer Control Room.
          </p>
        </div>

        {/* Dual Portal Selection Cards */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Resident Citizen Portal Choice */}
            <div className="p-6 rounded-[32px] border border-[#cecac8] bg-white hover:border-[#2b59d1] transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#2b59d1] text-white flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-base font-serif font-normal text-[#242424]">Resident Citizen</h3>
                <p className="text-xs text-[#797776] font-mono leading-normal">
                  Report civic issues (potholes, garbage, water leaks), track repairs, and upvote local ward priorities.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login/citizen")}
                  className="w-full py-3 px-4 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Citizen Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register?role=Citizen")}
                  className="w-full py-3 px-4 bg-[#f6f3f1] hover:bg-[#cfdaf5] border border-[#cecac8] text-[#242424] font-mono text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#2b59d1]" />
                  <span>Register Account</span>
                </button>
              </div>
            </div>

            {/* Ward Officer Portal Choice */}
            <div className="p-6 rounded-[32px] border border-[#242424] bg-[#242424] text-white hover:border-[#cfdaf5] transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#cfdaf5] text-[#242424] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-[#242424]" />
                </div>
                <h3 className="text-base font-serif font-normal text-white">Ward Officer / AMC</h3>
                <p className="text-xs text-[#cecac8] font-mono leading-normal">
                  Confidential console for BMC officers. Review AI severity triage, dispatch maintenance crews, and manage SLAs.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login/officer")}
                  className="w-full py-3 px-4 bg-[#cfdaf5] hover:bg-white text-[#242424] font-mono text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Officer Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register?role=Officer")}
                  className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#cfdaf5]" />
                  <span>Officer Onboarding</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Demo Instant Buttons */}
          <div className="bg-white p-4 rounded-[24px] border border-[#cecac8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#242424]">
              <Sparkles className="w-4 h-4 text-[#2b59d1] shrink-0" />
              <span className="font-mono text-xs">Test with 1-Click Demo:</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => handleQuickDemo("Citizen")}
                disabled={loadingDemo !== null}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#f6f3f1] hover:bg-[#cfdaf5] border border-[#cecac8] text-[#242424] font-mono text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                {loadingDemo === "Citizen" ? "Logging in..." : "Demo Citizen"}
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("Officer")}
                disabled={loadingDemo !== null}
                className="flex-1 sm:flex-none px-4 py-2 bg-[#242424] hover:bg-[#000000] text-white font-mono text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
              >
                {loadingDemo === "Officer" ? "Logging in..." : "Demo Officer"}
              </button>
            </div>
          </div>

          {/* Guest Pass */}
          <div className="text-center pt-1">
            <button
              onClick={exploreAsGuest}
              className="text-xs text-[#797776] hover:text-[#242424] font-mono uppercase tracking-wider transition-colors underline inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#2b59d1]" />
              <span>Explore Public Portal as Guest</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
