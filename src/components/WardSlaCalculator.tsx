import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  Calculator, Clock, ShieldCheck, Phone, ArrowRight, 
  Building2, AlertTriangle, CheckCircle2, ChevronRight, Sparkles
} from "lucide-react";

export const WardSlaCalculator: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWardId, setSelectedWardId] = useState<number>(9); // Ward H/W (Bandra)
  const [selectedCategory, setSelectedCategory] = useState<string>("Pothole");

  const selectedWard = MUMBAI_WARDS_DATA.find((w) => w.id === selectedWardId) || MUMBAI_WARDS_DATA[0];

  const categorySlaMap: Record<string, {
    slaHours: number;
    department: string;
    squadName: string;
    urgencyLevel: "HIGH" | "CRITICAL" | "STANDARD";
    penaltyClause: string;
  }> = {
    Pothole: {
      slaHours: 24,
      department: "Roads & Traffic Planning Division",
      squadName: "Asphalt Rapid Patching Squad #3",
      urgencyLevel: "HIGH",
      penaltyClause: "₹5,000 contractor penalty per delayed day",
    },
    "Water Leakage": {
      slaHours: 12,
      department: "Hydraulic Engineer's Department",
      squadName: "Mainline Valve Isolation Crew #1",
      urgencyLevel: "CRITICAL",
      penaltyClause: "Immediate escalation to Chief Engineer",
    },
    Garbage: {
      slaHours: 18,
      department: "Solid Waste Management (SWM)",
      squadName: "Compactor & Sanitation Team #4",
      urgencyLevel: "HIGH",
      penaltyClause: "₹2,500 contractor penalty per uncollected ton",
    },
    Drainage: {
      slaHours: 24,
      department: "Stormwater Drains (SWD) Cell",
      squadName: "Suction & De-silting Unit #2",
      urgencyLevel: "HIGH",
      penaltyClause: "Mandatory site inspection within 4 hours",
    },
    Streetlight: {
      slaHours: 48,
      department: "Mechanical & Electrical (M&E)",
      squadName: "Aerial Ladder & Cable Unit #1",
      urgencyLevel: "STANDARD",
      penaltyClause: "Replacement warranty SLA enforcement",
    },
    Other: {
      slaHours: 48,
      department: "Ward General Maintenance Section",
      squadName: "Ward Inspection Squad",
      urgencyLevel: "STANDARD",
      penaltyClause: "Statutory SLA review under RTS Act",
    },
  };

  const slaInfo = categorySlaMap[selectedCategory] || categorySlaMap["Other"];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-slate-900 text-red-400 text-[10px] font-black uppercase tracking-wider">
              INTERACTIVE SLA SIMULATOR
            </span>
            <span className="text-slate-500 text-xs font-semibold">Maharashtra Right to Public Services Act</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1.5 tracking-tight flex items-center gap-2">
            <Calculator className="w-6 h-6 text-red-600" />
            <span>Ward Resolution Turnaround & Officer Calculator</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Select your residential ward and civic issue to calculate guaranteed resolution timelines, duty officer, and assigned field squad.
          </p>
        </div>
      </div>

      {/* Selector Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ward Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            1. Select Mumbai Municipal Ward
          </label>
          <select
            value={selectedWardId}
            onChange={(e) => setSelectedWardId(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 cursor-pointer"
          >
            {MUMBAI_WARDS_DATA.map((w) => (
              <option key={w.id} value={w.id}>
                Ward {w.code} ({w.name}) - {w.primaryRailwayStations}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Select Civic Hazard Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Pothole", "Water Leakage", "Garbage", "Drainage", "Streetlight", "Other"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-red-600 text-white border-red-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculated Results Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-200 items-center">
        {/* SLA Clock Box */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 text-center shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Mandated Resolution SLA
          </span>
          <div className="text-3xl font-black text-red-600 font-mono">
            {slaInfo.slaHours} Hours
          </div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-50 text-red-700 border border-red-200 uppercase">
            {slaInfo.urgencyLevel} Priority Target
          </span>
          <div className="text-[10px] text-slate-500 pt-1 font-medium">
            {slaInfo.penaltyClause}
          </div>
        </div>

        {/* Assigned Division & Squad */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Responsible Municipal Division</span>
            <span className="font-bold text-slate-900 block">{slaInfo.department}</span>
            <span className="text-[11px] text-slate-500 font-mono">Squad: {slaInfo.squadName}</span>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">In-Charge Ward Officer</span>
              <span className="font-bold text-slate-900">{selectedWard.officer.name}</span>
            </div>
            <a
              href={`tel:${selectedWard.officer.contact}`}
              className="px-3 py-1.5 bg-slate-900 text-white font-bold text-[11px] rounded-lg flex items-center gap-1 hover:bg-slate-800"
            >
              <Phone className="w-3 h-3 text-red-400" /> Call
            </a>
          </div>
        </div>

        {/* Action Button */}
        <div className="lg:col-span-3">
          <button
            onClick={() => navigate(`/report?ward=${selectedWard.code}&category=${encodeURIComponent(selectedCategory)}`)}
            className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <span>File This Grievance Now</span>
              <ArrowRight className="w-4 h-4" />
            </span>
            <span className="text-[10px] text-red-100 font-normal">
              Pre-fills Ward {selectedWard.code} & {selectedCategory}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
