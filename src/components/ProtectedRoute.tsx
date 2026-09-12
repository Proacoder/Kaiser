import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Lock, ArrowRight, Home, Building2, UserCheck } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "Officer" | "Citizen";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = "Officer" }) => {
  const { user, loading, isOfficer } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Verifying Security Clearance...</p>
      </div>
    );
  }

  // If officer role is required and user is not an officer
  if (requiredRole === "Officer" && !isOfficer) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full bg-white rounded-2xl border-2 border-rose-200 shadow-xl overflow-hidden">
          {/* Header Stripe */}
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-black tracking-widest text-amber-300 uppercase">BMC Official Portal</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
              Access Restricted
            </span>
          </div>

          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-center justify-center mx-auto text-rose-600 shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900">
                Official Ward Officer Clearance Required
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                The <strong>Officer Control Room & Dispatch Console</strong> is strictly restricted to authorized 
                Municipal Ward Officers and Assistant Municipal Commissioners (AMCs).
              </p>
            </div>

            {/* Current user role banner */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                  {user?.name?.charAt(0) || "G"}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{user?.name || "Guest Resident"}</div>
                  <div className="text-[10px] text-slate-500">Current Role: <span className="font-semibold text-rose-600">{user?.role || "Citizen"}</span></div>
                </div>
              </div>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 rounded font-bold uppercase">
                Citizen Level
              </span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-left flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
              <p className="text-[11px] text-amber-800 leading-normal">
                To triage municipal reports, dispatch field contractors, and manage resolution SLAs, please log in with your verified BMC Officer Service ID.
              </p>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => navigate("/login/officer")}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Officer Secure Sign In</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <Link
                to="/"
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-slate-500" />
                <span>Return to Citizen Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
