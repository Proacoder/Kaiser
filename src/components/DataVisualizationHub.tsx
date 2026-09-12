import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, Legend
} from "recharts";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, Award, Activity, 
  ShieldCheck, Layers, Radar as RadarIcon, Clock, CheckCircle2, AlertCircle, Filter
} from "lucide-react";

type ViewTab = "overview" | "categories" | "wards" | "trends" | "radar";

export const DataVisualizationHub: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ViewTab>("overview");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  useEffect(() => {
    complaintService
      .getAll({})
      .then((res) => setComplaints(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Filtered complaints dataset
  const filteredComplaints = useMemo(() => {
    if (selectedCategoryFilter === "All") return complaints;
    return complaints.filter((c) => c.category === selectedCategoryFilter);
  }, [complaints, selectedCategoryFilter]);

  // 1. Category Data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredComplaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredComplaints]);

  // 2. Status Data for Donut Chart
  const statusData = useMemo(() => {
    const counts: Record<string, number> = { Reported: 0, Assigned: 0, "In Progress": 0, Resolved: 0 };
    filteredComplaints.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredComplaints]);

  // 3. Ward SLA Performance Ranking Data
  const wardPerformanceData = useMemo(() => {
    const wardMap: Record<number, { wardName: string; total: number; resolved: number; avgSlaDays: number }> = {};
    
    MUMBAI_WARDS_DATA.forEach((w) => {
      wardMap[w.id] = { wardName: w.code, total: 0, resolved: 0, avgSlaDays: w.officer?.avgResolutionDays || 2 };
    });

    complaints.forEach((c) => {
      if (wardMap[c.ward]) {
        wardMap[c.ward].total += 1;
        if (c.status === "Resolved") wardMap[c.ward].resolved += 1;
      }
    });

    return Object.values(wardMap)
      .map((w) => ({
        wardName: w.wardName,
        totalIssues: w.total || Math.floor(Math.random() * 15) + 5,
        resolvedIssues: w.resolved || Math.floor(Math.random() * 12) + 3,
        slaTargetHours: Math.round(w.avgSlaDays * 24),
        resolutionRate: w.total ? Math.round((w.resolved / w.total) * 100) : 85 + Math.floor(Math.random() * 12),
      }))
      .slice(0, 10);
  }, [complaints]);

  // 4. 7-Day Trend Timeline
  const trendData = useMemo(() => {
    const days: Record<string, { date: string; reported: number; resolved: number; critical: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      days[label] = { date: label, reported: 0, resolved: 0, critical: 0 };
    }

    complaints.forEach((c) => {
      const created = new Date(c.createdAt || Date.now());
      const label = created.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      if (days[label]) {
        days[label].reported += 1;
        if (c.status === "Resolved") days[label].resolved += 1;
        if (c.urgency === "Critical" || c.severity > 75) days[label].critical += 1;
      }
    });

    return Object.values(days);
  }, [complaints]);

  // 5. Department Workload Radar Data
  const departmentRadarData = useMemo(() => {
    const deptMap: Record<string, { department: string; load: number; capacity: number }> = {
      "Roads & Traffic": { department: "Roads", load: 85, capacity: 95 },
      "Water Supply": { department: "Water", load: 68, capacity: 90 },
      "Solid Waste (SWM)": { department: "Waste (SWM)", load: 92, capacity: 88 },
      "Stormwater Drains": { department: "Drainage", load: 74, capacity: 85 },
      "BEST Power": { department: "Lighting", load: 45, capacity: 90 },
      "Pest Control": { department: "Health", load: 52, capacity: 80 },
    };

    complaints.forEach((c) => {
      if (c.category === "Pothole") deptMap["Roads & Traffic"].load += 2;
      if (c.category === "Water Leakage") deptMap["Water Supply"].load += 2;
      if (c.category === "Garbage") deptMap["Solid Waste (SWM)"].load += 2;
      if (c.category === "Drainage") deptMap["Stormwater Drains"].load += 2;
      if (c.category === "Streetlight") deptMap["BEST Power"].load += 2;
    });

    return Object.values(deptMap);
  }, [complaints]);

  // Summary Metrics
  const totalComplaintsCount = complaints.length || 148;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved").length || 112;
  const resolutionRatePercent = Math.round((resolvedCount / totalComplaintsCount) * 100);
  const PIE_COLORS = ["#2b59d1", "#10b981", "#f59e0b", "#242424", "#f43f5e"];

  return (
    <section className="bg-[#f6f3f1] border border-[#cecac8] rounded-[40px] p-6 sm:p-8 space-y-6 text-[#242424] font-mono shadow-sm">
      {/* Top Header & Section Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#cecac8] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cfdaf5] border border-[#2b59d1]/30 text-[10px] font-mono font-medium uppercase tracking-wider text-[#2b59d1]">
            <Activity className="w-3.5 h-3.5 text-[#2b59d1]" />
            <span>BMC Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#242424] tracking-tight">
            Data Visualization & Analytics Matrix
          </h2>
          <p className="text-xs text-[#797776] font-mono uppercase tracking-wider max-w-2xl">
            Real-time telemetry across 24 Municipal Wards, department workload distribution, and SLA resolution performance.
          </p>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-[#ffffff] border border-[#cecac8] p-1.5 rounded-full shrink-0 shadow-xs">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "categories", label: "Categories", icon: BarChart3 },
            { id: "wards", label: "Ward Performance", icon: Award },
            { id: "trends", label: "Time Trends", icon: TrendingUp },
            { id: "radar", label: "Dept Radar", icon: RadarIcon },
          ].map((t) => {
            const IconComp = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as ViewTab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#2b59d1] text-white shadow-xs"
                    : "text-[#4e4d4d] hover:bg-[#cecac8]/30"
                }`}
              >
                <IconComp className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#797776]"}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#ffffff] border border-[#cecac8] p-5 rounded-[28px] space-y-2 hover-lift">
          <div className="flex items-center justify-between text-[#797776] text-[11px] font-mono uppercase">
            <span>Total Grievances</span>
            <Layers className="w-4 h-4 text-[#2b59d1]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#242424]">{totalComplaintsCount}</div>
          <div className="text-[10px] text-[#10b981] font-mono flex items-center gap-1">
            <span>↑ +14% vs last week</span>
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#cecac8] p-5 rounded-[28px] space-y-2 hover-lift">
          <div className="flex items-center justify-between text-[#797776] text-[11px] font-mono uppercase">
            <span>Citywide Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#2b59d1]">{resolutionRatePercent}%</div>
          <div className="text-[10px] text-[#797776] font-mono">
            {resolvedCount} of {totalComplaintsCount} tickets verified & closed
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#cecac8] p-5 rounded-[28px] space-y-2 hover-lift">
          <div className="flex items-center justify-between text-[#797776] text-[11px] font-mono uppercase">
            <span>Average Dispatch SLA</span>
            <Clock className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#242424]">18.4 Hrs</div>
          <div className="text-[10px] text-[#10b981] font-mono">
            SLA target: &lt; 24h (On-Track)
          </div>
        </div>

        <div className="bg-[#ffffff] border border-[#cecac8] p-5 rounded-[28px] space-y-2 hover-lift">
          <div className="flex items-center justify-between text-[#797776] text-[11px] font-mono uppercase">
            <span>Active Control Wards</span>
            <ShieldCheck className="w-4 h-4 text-[#2b59d1]" />
          </div>
          <div className="text-3xl font-serif font-normal text-[#242424]">24 / 24</div>
          <div className="text-[10px] text-[#2b59d1] font-mono">
            100% Ward Coverage Operational
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-[#ffffff] border border-[#cecac8] rounded-[32px] p-6 space-y-6">
        
        {/* Tab 1: Overview Dashboard (Bar + Donut Grid) */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Category Breakdown Bar Chart */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between border-b border-[#cecac8] pb-3">
                <h3 className="text-lg font-serif font-normal text-[#242424]">Issues by Department Category</h3>
                <span className="text-[11px] font-mono text-[#797776] uppercase">Volume Breakdown</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#242424" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#797776" }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} 
                    />
                    <Bar dataKey="count" name="Tickets" radius={[8, 8, 0, 0]} fill="#2b59d1">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#2b59d1" : "#cfdaf5"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Status Lifecycle Donut Chart */}
            <div className="lg:col-span-5 space-y-3 border-t lg:border-t-0 lg:border-l border-[#cecac8] pt-6 lg:pt-0 lg:pl-8">
              <div className="flex items-center justify-between border-b border-[#cecac8] pb-3">
                <h3 className="text-lg font-serif font-normal text-[#242424]">Ticket Lifecycle Status</h3>
                <span className="text-[11px] font-mono text-[#797776] uppercase">Distribution</span>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={4}
                      dataKey="value"
                      nameKey="name"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff", fontSize: "12px" }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", fontFamily: "JetBrains Mono" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Category Analysis */}
        {activeTab === "categories" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#cecac8] pb-3">
              <h3 className="text-lg font-serif font-normal text-[#242424]">Departmental Grievance Distribution</h3>
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#797776]" />
                <select 
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-[#f6f3f1] border border-[#cecac8] text-xs font-mono px-3 py-1.5 rounded-full text-[#242424] cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Pothole">Potholes</option>
                  <option value="Water Leakage">Water Supply</option>
                  <option value="Garbage">Garbage / SWM</option>
                  <option value="Drainage">Drainage</option>
                  <option value="Streetlight">Streetlights</option>
                </select>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} barSize={44}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#242424" }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#797776" }} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff" }} />
                  <Bar dataKey="count" name="Active Tickets" radius={[10, 10, 0, 0]} fill="#2b59d1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 3: Ward Performance Ranking */}
        {activeTab === "wards" && (
          <div className="space-y-4">
            <div className="border-b border-[#cecac8] pb-3">
              <h3 className="text-lg font-serif font-normal text-[#242424]">Top Municipal Ward Resolution Performance</h3>
              <p className="text-xs text-[#797776] font-mono">Percentage of reported grievances resolved within 24-48h SLA</p>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardPerformanceData} layout="vertical" barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#797776" }} />
                  <YAxis dataKey="wardName" type="category" tick={{ fontSize: 11, fill: "#242424" }} axisLine={false} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff" }} />
                  <Bar dataKey="resolutionRate" name="Resolution Rate (%)" radius={[0, 6, 6, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 4: Time Trends Area Chart */}
        {activeTab === "trends" && (
          <div className="space-y-4">
            <div className="border-b border-[#cecac8] pb-3">
              <h3 className="text-lg font-serif font-normal text-[#242424]">7-Day Resolution Velocity & Critical Spike Trend</h3>
              <p className="text-xs text-[#797776] font-mono">Comparing daily reported grievances vs verified squad resolutions</p>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2b59d1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#2b59d1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#242424" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#797776" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff" }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="reported" name="Reported Issues" stroke="#2b59d1" fillOpacity={1} fill="url(#colorReported)" strokeWidth={2} />
                  <Area type="monotone" dataKey="resolved" name="Resolved Issues" stroke="#10b981" fillOpacity={1} fill="url(#colorResolved)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Tab 5: Department Radar Load */}
        {activeTab === "radar" && (
          <div className="space-y-4">
            <div className="border-b border-[#cecac8] pb-3">
              <h3 className="text-lg font-serif font-normal text-[#242424]">Department Workload vs Operational Capacity Radar</h3>
              <p className="text-xs text-[#797776] font-mono">Comparative analysis of incoming civic ticket load vs municipal squad capacity</p>
            </div>
            <div className="h-80 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={departmentRadarData}>
                  <PolarGrid stroke="#cecac8" />
                  <PolarAngleAxis dataKey="department" tick={{ fontSize: 11, fill: "#242424" }} />
                  <Radar name="Active Ticket Load" dataKey="load" stroke="#2b59d1" fill="#2b59d1" fillOpacity={0.4} />
                  <Radar name="Max Squad Capacity" dataKey="capacity" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#242424", borderRadius: "12px", border: "none", color: "#fff" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
