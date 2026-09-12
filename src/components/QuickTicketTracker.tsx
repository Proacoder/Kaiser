import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { 
  Search, Clock, MapPin, CheckCircle2, AlertCircle, 
  ArrowRight, ShieldCheck, X, Cpu, Phone
} from "lucide-react";

interface QuickTicketTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickTicketTracker: React.FC<QuickTicketTrackerProps> = ({ isOpen, onClose }) => {
  const [ticketId, setTicketId] = useState("");
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = ticketId.trim().toUpperCase().replace("#", "").replace("BMC-", "");
    if (!cleanId) return;

    setLoading(true);
    setError(null);
    setSearchedComplaint(null);

    try {
      // Try direct ID lookup or search through all complaints
      const res = await complaintService.getAll();
      const match = res.data.find(
        (c) =>
          c.id.toLowerCase() === cleanId.toLowerCase() ||
          c.id.toLowerCase().includes(cleanId.toLowerCase())
      );

      if (match) {
        setSearchedComplaint(match);
      } else {
        // Try fallback to first matching query
        const queryRes = await complaintService.getAll({ q: cleanId });
        if (queryRes.data.length > 0) {
          setSearchedComplaint(queryRes.data[0]);
        } else {
          setError(`No municipal grievance record found for ticket "${ticketId}".`);
        }
      }
    } catch (err) {
      console.error("Tracking error", err);
      setError("Failed to track ticket. Please verify the ID.");
    } finally {
      setLoading(false);
    }
  };

  const timelineSteps = ["Reported", "Assigned", "In Progress", "Resolved"];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white max-w-xl w-full rounded-3xl border border-slate-200 shadow-2xl overflow-hidden space-y-5 p-6 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
              24x7 REAL-TIME TRACKING
            </span>
            <h3 className="text-xl font-black text-slate-950 mt-1">
              Live Grievance Ticket Tracker
            </h3>
            <p className="text-xs text-slate-500">
              Enter your grievance ID (e.g. 101, 102, or full code) to check live status & assigned squad.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleTrack} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
              placeholder="Enter Ticket ID (e.g. 101, 102, Bandra)..."
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Tracking..." : "Track Status"}
          </button>
        </form>

        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {searchedComplaint && (
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                Ticket #{searchedComplaint.id}
              </span>
              <span className="text-[11px] font-bold text-slate-500">
                Filed on {new Date(searchedComplaint.createdAt).toLocaleDateString("en-IN")}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">{searchedComplaint.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 mt-1">{searchedComplaint.description}</p>
            </div>

            {/* Lifecycle Timeline */}
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold">
              {timelineSteps.map((step, idx) => {
                const currentIdx = timelineSteps.indexOf(searchedComplaint.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={step}
                    className={`py-2 px-1 rounded-lg border ${
                      isCurrent
                        ? "bg-red-600 text-white border-red-600 font-black shadow-xs"
                        : isPassed
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-400 border-slate-200"
                    }`}
                  >
                    {step}
                  </div>
                );
              })}
            </div>

            {/* Ward & Department Info */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Ward Jurisdiction</span>
                <span className="font-bold text-slate-900">{searchedComplaint.wardName}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned Division</span>
                <span className="font-bold text-slate-900">{searchedComplaint.assignedDepartment}</span>
              </div>
            </div>

            <button
              onClick={() => {
                navigate(`/complaint/${searchedComplaint.id}`);
                onClose();
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Full Resolution Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Suggested demo tickets */}
        {!searchedComplaint && (
          <div className="pt-2 text-xs text-slate-500">
            <span className="font-bold text-slate-700 block mb-1.5">Try sample active tickets:</span>
            <div className="flex flex-wrap gap-1.5">
              {["101", "102", "103", "104"].map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTicketId(id);
                  }}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 rounded-lg text-xs font-mono font-bold text-slate-700 transition-colors border border-slate-200 cursor-pointer"
                >
                  #{id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
