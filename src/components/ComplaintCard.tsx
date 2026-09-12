import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Complaint } from "../types";
import { SeverityMeter } from "./SeverityMeter";
import { ThumbsUp, MessageSquare, MapPin, Clock, ArrowRight, ShieldCheck, Cpu, Tag } from "lucide-react";
import { complaintService } from "../services/api";

interface ComplaintCardProps {
  complaint: Complaint;
  onUpdate?: () => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, onUpdate }) => {
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(complaint.upvote_count);
  const [isUpvoted, setIsUpvoted] = useState(complaint.upvotes.includes("usr-citizen-current"));
  const [isUpvoting, setIsUpvoting] = useState(false);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpvoting) return;

    setIsUpvoting(true);
    const nextState = !isUpvoted;
    setIsUpvoted(nextState);
    setUpvotes((prev) => (nextState ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (nextState) {
        await complaintService.upvote(complaint.id);
      } else {
        await complaintService.removeUpvote(complaint.id);
      }
      onUpdate?.();
    } catch {
      // Rollback on network issue
      setIsUpvoted(!nextState);
      setUpvotes((prev) => (nextState ? prev - 1 : prev + 1));
    } finally {
      setIsUpvoting(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-[#2b59d1] text-white border-[#2b59d1]";
      case "In Progress":
        return "bg-[#cfdaf5] text-[#242424] border-[#cecac8]";
      case "Assigned":
        return "bg-[#f6f3f1] text-[#242424] border-[#cecac8]";
      default:
        return "bg-[#f6f3f1] text-[#797776] border-[#cecac8]";
    }
  };

  const formattedDate = new Date(complaint.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const refCode = `#BMC-2026-${complaint.id.slice(0, 5).toUpperCase()}`;

  return (
    <div
      onClick={() => navigate(`/complaint/${complaint.id}`)}
      className="group glass-card rounded-[32px] hover-lift cursor-pointer overflow-hidden flex flex-col justify-between p-6 sm:p-7 shadow-sm transition-all"
    >
      <div className="space-y-4">
        {/* Ticket Ref Header */}
        <div className="flex items-center justify-between gap-2 text-[11px] font-mono pb-2 border-b border-[#cecac8]">
          <span className="font-medium text-[#242424] bg-white px-2.5 py-0.5 rounded-full border border-[#cecac8]">
            {refCode}
          </span>
          <span className="text-[#797776] flex items-center gap-1 shrink-0 uppercase">
            <Clock className="w-3.5 h-3.5 text-[#2b59d1]" />
            {formattedDate}
          </span>
        </div>

        {/* Header Metadata Pills */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            <span className="px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white text-[#242424] border border-[#cecac8]">
              {complaint.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border ${getStatusStyle(complaint.status)}`}>
              {complaint.status}
            </span>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-[#cfdaf5] text-[#242424] text-[10px] font-mono font-medium border border-[#cecac8] shrink-0 uppercase">
            SLA: 24h
          </span>
        </div>

        {/* Title — Playfair Display Serif Weight 400 */}
        <h3 className="font-serif font-normal text-[#242424] text-xl leading-snug group-hover:text-[#2b59d1] transition-colors line-clamp-2">
          {complaint.title}
        </h3>

        {/* Description */}
        <p className="text-xs font-mono text-[#4e4d4d] line-clamp-2 leading-relaxed font-normal">
          {complaint.description}
        </p>

        {/* AI Triage Briefing */}
        {complaint.aiSummary && (
          <div className="bg-[#cfdaf5]/50 border border-[#cecac8] rounded-[20px] p-3 text-[11px] font-mono text-[#242424] flex items-start gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#2b59d1] shrink-0 mt-0.5" />
            <p className="line-clamp-1">
              <strong className="text-[#242424] uppercase">Triage:</strong> {complaint.aiSummary}
            </p>
          </div>
        )}

        {/* Severity Bar */}
        <div>
          <SeverityMeter score={complaint.severity} size="sm" />
        </div>

        {/* Location & Ward Jurisdiction */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#797776] pt-3 border-t border-[#cecac8]">
          <MapPin className="w-3.5 h-3.5 text-[#2b59d1] shrink-0" />
          <span className="font-medium text-[#242424] truncate uppercase">{complaint.wardName}</span>
          <span className="text-[#cecac8]">•</span>
          <span className="truncate text-[#4e4d4d]">{complaint.locationAddress}</span>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 pt-3 border-t border-[#cecac8] flex items-center justify-between text-xs font-mono text-[#242424]">
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            aria-label={`Support issue, ${upvotes} upvotes`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border text-[11px] font-medium transition-all active:scale-95 cursor-pointer uppercase ${
              isUpvoted
                ? "bg-[#2b59d1] text-white border-[#2b59d1]"
                : "bg-white text-[#242424] border-[#cecac8] hover:bg-[#cfdaf5]"
            }`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? "fill-current" : "text-[#2b59d1]"}`} />
            <span>{upvotes} Endorsements</span>
          </button>

          <div className="flex items-center gap-1 text-[11px] text-[#797776] font-mono">
            <MessageSquare className="w-3.5 h-3.5 text-[#2b59d1]" />
            <span>{complaint.comment_count}</span>
          </div>
        </div>

        <span className="text-[#2b59d1] font-medium text-[11px] uppercase flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Inspect <ArrowRight className="w-3.5 h-3.5 text-[#2b59d1]" />
        </span>
      </div>
    </div>
  );
};
