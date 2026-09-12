import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  Search, MapPin, Building2, PhoneCall, PlusCircle, LayoutDashboard,
  ShieldAlert, Award, FileText, ArrowRight, X, Sparkles, Navigation,
  TrendingUp, Activity, Zap
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "actions" | "wards" | "analytics" | "emergency">("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global shortcut listener: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          const event = new CustomEvent("open-command-palette");
          window.dispatchEvent(event);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Helper to compute Ward Health Grade
  const getWardHealthGrade = (resRate: number, citizenSat: number) => {
    const score = (resRate * 0.6) + (citizenSat * 20 * 0.4);
    if (score >= 93) return { grade: "A+", label: "Outstanding", color: "bg-emerald-500 text-white" };
    if (score >= 88) return { grade: "A", label: "Good", color: "bg-green-500 text-white" };
    if (score >= 82) return { grade: "B", label: "Average", color: "bg-amber-500 text-white" };
    return { grade: "C", label: "Needs Improvement", color: "bg-red-500 text-white" };
  };

  // Quick Action Items
  const allActions = [
    {
      id: "report",
      category: "actions",
      title: "File Civic Grievance",
      subtitle: "AI image verification, YOLO detection, GPS pin & ward dispatch",
      icon: PlusCircle,
      badge: "Action",
      action: () => { navigate("/report"); onClose(); },
    },
    {
      id: "dashboard",
      category: "actions",
      title: "Browse All Grievances",
      subtitle: "Live feed of reported municipal issues across 24 wards",
      icon: LayoutDashboard,
      badge: "Explore",
      action: () => { navigate("/dashboard"); onClose(); },
    },
    {
      id: "map",
      category: "actions",
      title: "Mumbai Ward Spatial Map (GIS)",
      subtitle: "Interactive 24-ward boundary GIS & real-time point-in-polygon engine",
      icon: MapPin,
      badge: "Map",
      action: () => { navigate("/map"); onClose(); },
    },
    {
      id: "admin",
      category: "analytics",
      title: "Officer Control Room & AI Triage",
      subtitle: "Automated priority dispatch, SLA escalation & before/after verification",
      icon: ShieldAlert,
      badge: "Officer Hub",
      action: () => { navigate("/admin"); onClose(); },
    },
    {
      id: "analytics",
      category: "analytics",
      title: "Executive Analytics & KPI Dashboard",
      subtitle: "24-ward civic health rankings, SLA velocity & resolution metrics",
      icon: TrendingUp,
      badge: "Executive",
      action: () => { navigate("/analytics"); onClose(); },
    },
    {
      id: "hotspots",
      category: "analytics",
      title: "Ward Hotspots & Spatial Clusters",
      subtitle: "DBSCAN spatial clustering of recurring municipal defects",
      icon: Activity,
      badge: "GIS Hotspots",
      action: () => { navigate("/hotspots"); onClose(); },
    },
    {
      id: "top10",
      category: "actions",
      title: "Priority Triage Leaderboard",
      subtitle: "Highest severity community complaints requiring urgent AMC action",
      icon: Award,
      badge: "Leaderboard",
      action: () => { navigate("/top10"); onClose(); },
    },
    {
      id: "officers",
      category: "actions",
      title: "24-Ward Officers Directory",
      subtitle: "Assistant Municipal Commissioners (AMC) & Executive Engineers",
      icon: Building2,
      badge: "Directory",
      action: () => { navigate("/officers"); onClose(); },
    },
    {
      id: "helpline-1916",
      category: "emergency",
      title: "Call BMC Emergency 1916",
      subtitle: "24x7 Municipal Disaster Control Room & Flood Emergency Cell",
      icon: PhoneCall,
      badge: "BMC Hotline",
      action: () => { window.location.href = "tel:1916"; onClose(); },
    },
    {
      id: "helpline-108",
      category: "emergency",
      title: "Call Disaster Ambulance 108",
      subtitle: "Emergency Medical & Disaster Response Service",
      icon: Zap,
      badge: "Ambulance",
      action: () => { window.location.href = "tel:108"; onClose(); },
    },
  ];

  // Filtered wards
  const filteredWards = MUMBAI_WARDS_DATA.filter((w) => {
    if (activeCategory !== "all" && activeCategory !== "wards") return false;
    const q = query.toLowerCase().trim();
    if (!q) return true;
    const health = getWardHealthGrade(w.officer.resolutionRate, w.officer.citizenSatisfaction);
    return (
      w.name.toLowerCase().includes(q) ||
      w.code.toLowerCase().includes(q) ||
      w.officer.name.toLowerCase().includes(q) ||
      w.areaDescription.toLowerCase().includes(q) ||
      w.primaryRailwayStations.toLowerCase().includes(q) ||
      health.grade.toLowerCase().includes(q) ||
      health.label.toLowerCase().includes(q)
    );
  });

  const filteredActions = allActions.filter((a) => {
    if (activeCategory !== "all" && activeCategory !== a.category) return false;
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.title.toLowerCase().includes(q) || 
      a.subtitle.toLowerCase().includes(q) ||
      a.badge.toLowerCase().includes(q)
    );
  });

  // Flattened list for keyboard selection
  const selectableItems = [
    ...filteredActions.map(a => ({ type: "action" as const, item: a })),
    ...filteredWards.slice(0, 8).map(w => ({ type: "ward" as const, item: w }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, selectableItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + selectableItems.length) % Math.max(1, selectableItems.length));
    } else if (e.key === "Enter" && selectableItems[selectedIndex]) {
      e.preventDefault();
      const current = selectableItems[selectedIndex];
      if (current.type === "action") {
        current.item.action();
      } else {
        navigate(`/dashboard?ward=${current.item.id}`);
        onClose();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-red-600 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search ward (e.g., H/West, Dadar), health score, action, or call emergency..."
              className="w-full bg-transparent text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center gap-2 shrink-0">
              <kbd className="hidden sm:inline-block px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-mono font-bold">
                ESC
              </kbd>
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { key: "all", label: "All Shortcuts" },
              { key: "actions", label: "Quick Actions" },
              { key: "wards", label: "Wards & Health" },
              { key: "analytics", label: "AI & Intelligence" },
              { key: "emergency", label: "Emergency Hotlines" }
            ].map(cat => (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveCategory(cat.key as any);
                  setSelectedIndex(0);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-200/70 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-3 space-y-4 max-h-[60vh]">
          {/* Quick Actions / Shortcuts */}
          {filteredActions.length > 0 && (
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span>System Quick Actions ({filteredActions.length})</span>
                <span className="text-[9px] text-slate-400">Use ↑ ↓ & Enter</span>
              </div>
              <div className="space-y-1">
                {filteredActions.map((action) => {
                  const globalIdx = selectableItems.findIndex(s => s.type === "action" && s.item.id === action.id);
                  const isSelected = globalIdx === selectedIndex;
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.id}
                      onClick={action.action}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-red-50/80 border border-red-200 text-red-900 shadow-sm" 
                          : "hover:bg-slate-100 border border-transparent text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-red-600 text-white" : "bg-red-50 text-red-600"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className={`text-xs font-bold truncate ${isSelected ? "text-red-700" : "text-slate-900"}`}>
                            {action.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            {action.subtitle}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                        isSelected ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {action.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Mumbai Wards & Health Performance */}
          {filteredWards.length > 0 && (
            <div>
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-1.5 flex items-center justify-between">
                <span>Mumbai Municipal Wards & Health Score ({filteredWards.length})</span>
                <span className="text-[9px] font-medium text-slate-400">Click to filter dashboard</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {filteredWards.slice(0, 8).map((ward) => {
                  const globalIdx = selectableItems.findIndex(s => s.type === "ward" && s.item.id === ward.id);
                  const isSelected = globalIdx === selectedIndex;
                  const health = getWardHealthGrade(ward.officer.resolutionRate, ward.officer.citizenSatisfaction);

                  return (
                    <button
                      key={ward.id}
                      onClick={() => {
                        navigate(`/dashboard?ward=${ward.id}`);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-red-500 bg-red-50/80 text-slate-900 shadow-sm"
                          : "border-slate-200 hover:border-red-400 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-md bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {ward.code}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {ward.name.split("(")[0].trim()}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${health.color}`}>
                              Grade {health.grade}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">
                            Rank #{ward.officer.rank} • SLA {ward.officer.resolutionRate}%
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-red-600" : "text-slate-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredActions.length === 0 && filteredWards.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
              <div className="text-xs font-bold text-slate-600">No matching shortcuts or wards found</div>
              <div className="text-[11px] text-slate-400">
                Try searching for "Bandra", "Hotspots", "Emergency", or "Grade A"
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Shortcut: <strong className="text-slate-900">Ctrl + K</strong></span>
            <span>•</span>
            <span>Navigate: <strong className="text-slate-900">↑ ↓ Enter</strong></span>
          </div>
          <span className="font-extrabold text-red-600">KAISER Civic Intelligence</span>
        </div>
      </div>
    </div>
  );
};

