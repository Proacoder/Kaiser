import React, { useState } from "react";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { WardOverviewCard } from "../components/WardOverviewCard";
import { useNavigate } from "react-router-dom";
import { 
  Award, Search, Building2, Phone, Star, ArrowUpRight
} from "lucide-react";

export const OfficersPage: React.FC = () => {
  const [selectedWardId, setSelectedWardId] = useState<number>(9); // Default H-West
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Sort officers by rank
  const sortedWards = [...MUMBAI_WARDS_DATA].sort((a, b) => a.officer.rank - b.officer.rank);

  const filteredWards = sortedWards.filter((w) => {
    const q = searchQuery.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.code.toLowerCase().includes(q) ||
      w.officer.name.toLowerCase().includes(q) ||
      w.areaDescription.toLowerCase().includes(q)
    );
  });

  const activeWard = MUMBAI_WARDS_DATA.find((w) => w.id === selectedWardId) || MUMBAI_WARDS_DATA[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-mono text-[#242424]">
      {/* Banner — Monad Off-Black Surface */}
      <div className="bg-[#242424] text-white rounded-[40px] p-8 sm:p-10 border border-[#242424] border-l-4 border-l-[#2b59d1] shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#cfdaf5] text-[#242424] text-xs font-mono uppercase tracking-wider">
          <Award className="w-4 h-4 text-[#2b59d1]" /> <span>Municipal Executive Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-white">
          Mumbai Ward Officers Directory & Telemetry Matrix
        </h1>
        <p className="text-xs sm:text-sm text-[#cecac8] font-mono leading-relaxed max-w-3xl">
          Real-time telemetry & performance metrics for Assistant Municipal Commissioners (AMCs) across all 24 BMC wards, resolution throughput, and official control room helplines.
        </p>
      </div>

      {/* Selected Ward Inspection Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#cecac8] pb-3">
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#242424] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#2b59d1]" /> <span>Ward Officer Profile</span>
          </h2>
          <span className="text-xs text-[#797776] font-mono uppercase">
            Select any ward below to view executive details
          </span>
        </div>

        <WardOverviewCard
          ward={activeWard}
          onReportIssueInWard={() => navigate(`/report?ward=${activeWard.id}`)}
        />
      </div>

      {/* Leaderboard & All Wards Directory */}
      <div className="glass-card rounded-[40px] p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cecac8] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#242424] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2b59d1]" /> <span>All 24 Ward Officers Roster</span>
            </h2>
            <p className="text-xs text-[#797776] font-mono uppercase mt-1">
              Ranked by resolution throughput, SLA compliance %, and citizen satisfaction rating
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#797776]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ward or officer name..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#cecac8] rounded-full text-xs font-mono text-[#242424] focus:outline-none focus:border-[#2b59d1]"
            />
          </div>
        </div>

        {/* Grid of All 24 Ward Officers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWards.map((w) => {
            const isSelected = w.id === selectedWardId;
            return (
              <div
                key={w.id}
                onClick={() => setSelectedWardId(w.id)}
                className={`p-5 rounded-[32px] border transition-all cursor-pointer space-y-4 hover-lift ${
                  isSelected
                    ? "bg-[#cfdaf5] border-[#2b59d1] shadow-md ring-1 ring-[#2b59d1]"
                    : "bg-white/90 border-[#cecac8] hover:border-[#2b59d1]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.officer.avatar}
                      alt={w.officer.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#cecac8]"
                    />
                    <div>
                      <span className="px-2.5 py-0.5 bg-[#2b59d1] text-white text-[10px] font-mono font-medium rounded-full uppercase">
                        Ward {w.code}
                      </span>
                      <h3 className="text-sm font-serif font-normal text-[#242424] mt-1 line-clamp-1">{w.officer.name}</h3>
                      <p className="text-[11px] text-[#797776] font-mono truncate">{w.name}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-[#797776] block uppercase">Rank</span>
                    <span className="text-xs font-mono font-bold text-[#2b59d1] flex items-center justify-end gap-0.5">
                      <Award className="w-3.5 h-3.5" /> #{w.officer.rank}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#cecac8]/60 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#797776] uppercase block">Solved</span>
                    <span className="font-bold text-[#242424]">{w.officer.problemsSolved}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#797776] uppercase block">SLA Rate</span>
                    <span className="font-bold text-[#2b59d1]">{w.officer.resolutionRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#797776] uppercase block">Rating</span>
                    <span className="font-bold text-[#242424] flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 text-[#2b59d1] fill-[#2b59d1]" /> {w.officer.citizenSatisfaction}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#242424] pt-0.5">
                  <span className="text-[11px] flex items-center gap-1 text-[#4e4d4d]">
                    <Phone className="w-3.5 h-3.5 text-[#2b59d1]" /> {w.officer.contact}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWardId(w.id);
                      window.scrollTo({ top: 120, behavior: "smooth" });
                    }}
                    className="text-[11px] font-mono text-[#2b59d1] hover:underline flex items-center gap-0.5 cursor-pointer uppercase"
                  >
                    Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
