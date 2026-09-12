import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint, Stats } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { DataVisualizationHub } from "../components/DataVisualizationHub";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Activity, CheckCircle2, Clock3, AlertTriangle, Search, RotateCcw, ShieldCheck, UserRound, ArrowUpRight, SlidersHorizontal } from "lucide-react";

export const Dashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const defaultWard = user?.role === "Officer" ? String(user.ward || 9) : searchParams.get("ward") || "all";
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [wardFilter, setWardFilter] = useState(defaultWard);
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  useEffect(() => { loadDashboardData(); }, [statusFilter, wardFilter, categoryFilter, sortBy]);
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, statsRes] = await Promise.all([
        complaintService.getAll({ status: statusFilter, ward: wardFilter, category: categoryFilter, sortBy, q: searchQuery }),
        complaintService.getStats(),
      ]);
      setComplaints(complaintsRes.data); setStats(statsRes.data);
    } catch (err) { console.error("Error loading dashboard data", err); } finally { setLoading(false); }
  };
  const resetFilters = () => { setStatusFilter("all"); setWardFilter("all"); setCategoryFilter("all"); setSortBy("newest"); setSearchQuery(""); setSearchParams({}); };
  const statusPieData = [
    { name: "Resolved", value: stats?.resolved || 0, color: "#3857e8" },
    { name: "In progress", value: stats?.inProgress || 0, color: "#62d39a" },
    { name: "Assigned", value: stats?.assigned || 0, color: "#ffb86b" },
    { name: "Reported", value: stats?.reported || 0, color: "#ff725e" },
  ];
  const summary = [
    { label: "Total reports", value: stats?.total || 0, detail: "Citywide intake", icon: Activity, tone: "blue" },
    { label: "Resolved", value: stats?.resolved || 0, detail: "Verified closures", icon: CheckCircle2, tone: "green" },
    { label: "In the field", value: stats?.inProgress || 0, detail: "Crews deployed", icon: Clock3, tone: "orange" },
    { label: "Hazard index", value: `${stats?.avgSeverity || 67}/100`, detail: "AI risk density", icon: AlertTriangle, tone: "coral" },
  ];

  return <div className="cockpit-page">
    <div className="cockpit-head shell">
      <div><div className="section-kicker">Operations / {user?.role === "Officer" ? `Ward ${user.ward}` : "Citywide"}</div><h1>Civic response, at a glance.</h1><p>Track what residents are reporting, what crews are fixing, and where attention is needed next.</p></div>
      <div className="cockpit-head-actions"><button onClick={() => navigate("/map")} className="ghost-action"><ArrowUpRight size={15} /> Open live map</button><button onClick={() => navigate("/report")} className="solid-action">+ File new issue</button></div>
    </div>

    <div className="shell cockpit-grid">
      <aside className="cockpit-rail"><div className="rail-label">View</div><button className="rail-item is-selected"><Activity size={16} />Overview<span>⌘ 1</span></button><button className="rail-item" onClick={() => navigate("/top10")}><AlertTriangle size={16} />Priority queue<span>⌘ 2</span></button><button className="rail-item" onClick={() => navigate("/hotspots")}><Search size={16} />Hotspots<span>⌘ 3</span></button><div className="rail-rule" /><div className="rail-label">Scope</div><div className="rail-scope"><span className="scope-dot" />24 wards online<small>Last sync just now</small></div></aside>
      <main className="cockpit-main">
        <div className="summary-grid">{summary.map(({ label, value, detail, icon: Icon, tone }) => <div className={`summary-tile tone-${tone}`} key={label}><div className="tile-top"><span>{label}</span><Icon size={16} /></div><strong>{value}</strong><small>{detail}</small></div>)}</div>
        <div className="cockpit-chart-grid"><section className="cockpit-panel chart-panel"><div className="panel-heading"><div><span className="section-kicker">Workload</span><h2>Issues by department</h2></div><span className="panel-meta">Live feed</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats?.categoryData || []}><XAxis dataKey="name" stroke="#8b919e" fontSize={10} tickLine={false} axisLine={false} /><YAxis stroke="#8b919e" fontSize={10} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ backgroundColor: "#15171d", border: "0", borderRadius: "10px", color: "#fff", fontSize: "12px" }} /><Bar dataKey="count" fill="#3857e8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section><section className="cockpit-panel ratio-panel"><div className="panel-heading"><div><span className="section-kicker">Lifecycle</span><h2>Resolution mix</h2></div></div><div className="ratio-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusPieData} innerRadius={48} outerRadius={70} paddingAngle={3} dataKey="value">{statusPieData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip contentStyle={{ backgroundColor: "#15171d", border: "0", borderRadius: "10px", color: "#fff", fontSize: "12px" }} /></PieChart></ResponsiveContainer><div className="ratio-total"><strong>{stats?.total || 0}</strong><small>total</small></div></div><div className="ratio-legend">{statusPieData.map((entry) => <span key={entry.name}><i style={{ background: entry.color }} />{entry.name}<b>{entry.value}</b></span>)}</div></section></div>
        <DataVisualizationHub />
        <section className="filter-console"><div className="filter-title"><div><span className="section-kicker">Incident explorer</span><h2>Find the signal in the noise.</h2></div><button onClick={resetFilters} className="reset-action"><RotateCcw size={14} /> Reset</button></div><form className="cockpit-search" onSubmit={(e) => { e.preventDefault(); loadDashboardData(); }}><Search size={17} /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search street, landmark, reference number..." /><button type="submit">Search</button></form><div className="filter-row"><label>Status<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All statuses</option><option value="Reported">Reported</option><option value="Assigned">Assigned</option><option value="In Progress">In progress</option><option value="Resolved">Resolved</option></select></label><label>Ward<select value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}><option value="all">All Mumbai wards</option>{MUMBAI_WARDS_DATA.map((w) => <option key={w.id} value={w.id}>Ward {w.code} — {w.name}</option>)}</select></label><label>Department<select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="all">All departments</option><option value="Pothole">Potholes</option><option value="Garbage">Garbage</option><option value="Water Leakage">Water leakage</option><option value="Drainage">Drainage</option><option value="Streetlight">Streetlights</option><option value="Roadwork">Roadwork</option></select></label><label>Sort<select value={sortBy} onChange={(e) => setSortBy(e.target.value)}><option value="newest">Newest</option><option value="severity">Highest hazard</option><option value="upvotes">Most endorsed</option></select></label></div></section>
        <div className="incident-header"><span>{loading ? "Refreshing incident stream..." : `${complaints.length} matched incidents`}</span><span><span className="scope-dot" /> Synced with BMC database</span></div>{complaints.length === 0 ? <div className="empty-state"><SlidersHorizontal size={25} /><h3>No matching reports</h3><p>Try clearing a filter or searching a broader area.</p></div> : <div className="incident-grid">{complaints.map((item) => <ComplaintCard key={item.id} complaint={item} onUpdate={loadDashboardData} />)}</div>}
      </main>
    </div>
  </div>;
};
