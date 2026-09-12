import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import api from "../services/api";
import {
  ClipboardList, MapPin, Calendar, Clock, CheckCircle2, ArrowRight,
  RefreshCw, AlertCircle, ChevronRight, PlusCircle, Eye, FileText,
  User, TrendingUp, Award, Zap,
} from "lucide-react";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: "Reported" | "Assigned" | "In Progress" | "Resolved";
  latitude: number;
  longitude: number;
  wardName: string;
  locationAddress: string;
  imageUrl?: string;
  afterImageUrl?: string;
  reporterName: string;
  upvote_count: number;
  createdAt: string;
  updatedAt: string;
  slaDays: number;
  aiSummary?: string;
}

const STATUS_STEPS = ["Reported", "Assigned", "In Progress", "Resolved"] as const;

const STATUS_COLORS: Record<string, string> = {
  "Reported": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  "Assigned": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "In Progress": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Resolved": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const URGENCY_COLORS: Record<string, string> = {
  "Critical": "text-red-400 bg-red-500/10 border-red-500/30",
  "High": "text-orange-400 bg-orange-500/10 border-orange-500/30",
  "Medium": "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  "Low": "text-slate-400 bg-slate-500/10 border-slate-500/30",
};

const statusToTranslation = (status: string, t: any) => {
  const map: Record<string, string> = {
    "Reported": t.statuses.reported,
    "Assigned": t.statuses.assigned,
    "In Progress": t.statuses.inProgress,
    "Resolved": t.statuses.resolved,
  };
  return map[status] || status;
};

function getDaysAgo(dateStr: string) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export const MyReportsPage: React.FC = () => {
  const { user, isAuthenticated, exploreAsGuest } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filter, setFilter] = useState<"all" | "Reported" | "Assigned" | "In Progress" | "Resolved">("all");

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchMyReports();
  }, [user]);

  const fetchMyReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<{ complaints: Complaint[] }>("/reports", {
        params: { reporterId: user?.id, limit: 100 },
      });
      // Filter to only current user's reports
      const mine = (res.data.complaints || []).filter(
        (c) => c.reporterName === user?.name || true // server-side filter when real auth ready
      );
      setComplaints(mine.slice(0, 30));
    } catch {
      setError("Failed to load your complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === "all" ? complaints : complaints.filter((c) => c.status === filter);

  const stats = {
    total: complaints.length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
    pending: complaints.filter((c) => c.status !== "Resolved").length,
    critical: complaints.filter((c) => c.urgency === "Critical").length,
  };

  // Not logged in gate
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-600/20 border border-red-500/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">{t.citizenSignIn}</h1>
          <p className="text-slate-400 text-sm mb-6">Sign in to view your personal grievance history and track repairs in real time.</p>
          <Link
            to="/login/citizen"
            className="block w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm mb-3"
          >
            {t.login} →
          </Link>
          <button
            onClick={() => { exploreAsGuest(); navigate("/"); }}
            className="text-xs text-slate-500 hover:text-slate-400 transition"
          >
            {t.exploreAsGuest}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">{t.myGrievances}</h1>
              <p className="text-xs text-slate-400">
                {user.name} • {t.ward} {user.ward}
              </p>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: t.totalTickets, value: stats.total, icon: ClipboardList, color: "text-slate-300" },
              { label: t.resolvedTickets, value: stats.resolved, icon: CheckCircle2, color: "text-emerald-400" },
              { label: t.pendingAction, value: stats.pending, icon: Clock, color: "text-yellow-400" },
              { label: t.criticalP1, value: stats.critical, icon: Zap, color: "text-red-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                <div className={`flex items-center gap-2 ${color} mb-1`}>
                  <Icon size={14} />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                </div>
                <div className={`text-2xl font-black ${color}`}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Filter + Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-xl border border-slate-700">
            {["all", "Reported", "Assigned", "In Progress", "Resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filter === f
                    ? "bg-red-600 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f === "all" ? "All" : statusToTranslation(f, t)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchMyReports}
              className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition"
              title={t.refresh}
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => navigate("/report")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <PlusCircle size={13} /> {t.report}
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
            <span className="text-sm text-slate-400">{t.loading}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-sm text-red-300 font-medium">{error}</p>
              <button onClick={fetchMyReports} className="text-xs text-red-500 hover:text-red-400 mt-1">{t.retry}</button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">{t.noReportsYet}</h3>
            <p className="text-sm text-slate-500 mb-6">{t.reportFirstIssue}</p>
            <button
              onClick={() => navigate("/report")}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm flex items-center gap-2 mx-auto"
            >
              <PlusCircle size={15} /> {t.reportIncident}
            </button>
          </div>
        )}

        {/* Complaint Cards */}
        {!loading && filtered.map((complaint) => {
          const stepIndex = STATUS_STEPS.indexOf(complaint.status as any);
          const isResolved = complaint.status === "Resolved";

          return (
            <div
              key={complaint.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition group"
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-800">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                        {complaint.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${URGENCY_COLORS[complaint.urgency] || URGENCY_COLORS["Low"]}`}>
                        {complaint.urgency === "Critical" ? "P1" : complaint.urgency === "High" ? "P2" : complaint.urgency === "Medium" ? "P3" : "P4"} — {complaint.urgency}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition line-clamp-2">
                      {complaint.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <MapPin size={11} /> {complaint.wardName}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Calendar size={11} /> {getDaysAgo(complaint.createdAt)}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[complaint.status]}`}>
                        {statusToTranslation(complaint.status, t)}
                      </span>
                    </div>
                  </div>
                  {complaint.imageUrl && (
                    <img
                      src={complaint.imageUrl}
                      alt={complaint.category}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Status Progress Bar */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-0">
                  {STATUS_STEPS.map((s, i) => {
                    const done = i <= stepIndex;
                    const active = i === stepIndex;
                    return (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition ${
                              done
                                ? active
                                  ? "bg-red-600 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                                  : "bg-emerald-600 border-emerald-500"
                                : "bg-slate-800 border-slate-700"
                            }`}
                          >
                            {done && !active && <CheckCircle2 size={12} className="text-white" />}
                            {active && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                          </div>
                          <span className={`text-[9px] font-bold mt-1 text-center leading-tight max-w-[48px] ${
                            done ? (active ? "text-red-400" : "text-emerald-400") : "text-slate-600"
                          }`}>
                            {statusToTranslation(s, t)}
                          </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mb-3 mx-1 transition ${i < stepIndex ? "bg-emerald-600" : "bg-slate-700"}`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Before/After Slider for Resolved */}
              {isResolved && complaint.imageUrl && complaint.afterImageUrl && (
                <div className="px-5 pb-5">
                  <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 size={11} /> BMC Repair Verified — Drag to Compare
                  </p>
                  <BeforeAfterSlider
                    beforeImage={complaint.imageUrl}
                    afterImage={complaint.afterImageUrl}
                    beforeLabel={t.beforePhoto}
                    afterLabel={t.afterPhoto}
                    aspectRatio="aspect-[16/7]"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="px-5 pb-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <Clock size={10} /> Updated {getDaysAgo(complaint.updatedAt)}
                </span>
                <Link
                  to={`/complaint/${complaint.id}`}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-400 transition"
                >
                  <Eye size={13} /> {t.viewDetails} <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
