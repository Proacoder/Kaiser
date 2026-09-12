import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Building2, User, ShieldAlert, ArrowRight, CheckCircle2, 
  Sparkles, Award, Lock, FileText, MapPin, Phone
} from "lucide-react";

export const Login: React.FC = () => {
  const [selectedPortal, setSelectedPortal] = useState<"citizen" | "officer">("citizen");
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-red-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs">
            <Building2 className="w-4 h-4 text-red-400" />
            <span>Brihanmumbai Municipal Corporation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Choose Your Authentication Portal
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Select your portal to access AI-powered civic grievance triage or municipal dispatch controls.
          </p>
        </div>

        {/* Dual Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Citizen Portal */}
          <div className="bg-white rounded-3xl border-2 border-red-200 hover:border-red-600 shadow-md hover:shadow-xl transition-all p-7 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-md">
                <User className="w-7 h-7 text-white" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-red-600 uppercase tracking-wider">
                  Public Resident Access
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Citizen Portal</h2>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Report civic hazards (potholes, garbage dumps, water bursts, dark streetlights) with real-time AI image verification and live tracking.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>File geotagged grievances with photo evidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Upvote & track neighborhood issue resolution</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Direct communication with your Ward Officer</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/login/citizen"
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Citizen Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-500">
                <span>New resident? </span>
                <Link to="/register?role=Citizen" className="text-red-600 font-bold hover:underline">
                  Sign up here
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Ward Officer Portal */}
          <div className="bg-slate-900 rounded-3xl border-2 border-slate-800 hover:border-red-500 shadow-md hover:shadow-xl transition-all p-7 flex flex-col justify-between space-y-6 text-white relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-slate-800 border border-red-500/40 text-red-400 rounded-2xl flex items-center justify-center shadow-md font-black">
                <ShieldAlert className="w-7 h-7 text-red-400" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-red-400 uppercase tracking-wider">
                  Municipal Officers & AMCs
                </span>
                <h2 className="text-2xl font-black text-white mt-1">Ward Officer Console</h2>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Access the official BMC Dispatch Control Room, AI severity ranking triage, SLA tracking, and contractor crew management.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Exclusive access to Officer Dispatch Control Room</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Automated AI severity scoring & action triage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
                  <span>Assign work orders & enforce 24-48h SLA targets</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                to="/login/officer"
                className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Officer Secure Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-xs text-slate-400">
                <span>Municipal staff onboarding? </span>
                <Link to="/register?role=Officer" className="text-red-400 font-bold hover:underline">
                  Officer Registration
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Demo Help Banner */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>Need instant access for testing? Both portals feature <strong>1-click demo accounts</strong>.</span>
          </div>
          <div className="flex items-center gap-2 font-bold">
            <Link to="/login/citizen" className="text-red-600 hover:underline">Demo Citizen</Link>
            <span>•</span>
            <Link to="/login/officer" className="text-slate-900 hover:underline">Demo Officer</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
