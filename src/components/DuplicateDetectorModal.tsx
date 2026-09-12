import React from "react";
import { AlertCircle, MapPin, ThumbsUp, ArrowRight, Layers } from "lucide-react";
import { Complaint } from "../types";

interface DuplicateDetectorModalProps {
  existingComplaint: Complaint;
  distanceMeters: number;
  onUpvoteExisting: () => void;
  onContinueFiling: () => void;
}

export const DuplicateDetectorModal: React.FC<DuplicateDetectorModalProps> = ({
  existingComplaint,
  distanceMeters,
  onUpvoteExisting,
  onContinueFiling,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs font-mono">
      <div className="bg-[#242424] text-white border border-[#242424] rounded-[32px] p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold shrink-0">
            <Layers className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
              AI Spatial Deduplication Engine
            </div>
            <h3 className="text-xl font-serif font-normal text-white">
              Duplicate Grievance Detected ({distanceMeters}m away)
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#cecac8] leading-relaxed">
          An active <strong className="text-white">{existingComplaint.category}</strong> complaint was already reported nearby at{" "}
          <span className="text-[#cfdaf5] font-semibold">{existingComplaint.locationAddress}</span>.
        </p>

        {/* Existing Complaint Preview Card */}
        <div className="bg-white/5 border border-white/10 rounded-[20px] p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#cfdaf5] font-bold">Ticket #{existingComplaint.id}</span>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              {existingComplaint.status}
            </span>
          </div>
          <h4 className="font-serif font-normal text-white text-sm">{existingComplaint.title}</h4>
          <div className="flex items-center gap-1 text-[11px] text-[#797776]">
            <MapPin className="w-3.5 h-3.5 text-[#2b59d1]" />
            <span>{existingComplaint.locationAddress}</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={onUpvoteExisting}
            className="w-full py-3.5 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-bold text-xs uppercase tracking-wider rounded-full transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Upvote Existing Ticket (+1 Upvote & Prioritize)</span>
          </button>
          <button
            onClick={onContinueFiling}
            className="w-full py-3 bg-white/10 hover:bg-white/20 text-[#cecac8] font-bold text-xs uppercase tracking-wider rounded-full transition cursor-pointer"
          >
            <span>Proceed to File Separate Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
