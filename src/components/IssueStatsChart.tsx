import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { BarChart2, PieChart as PieIcon, TrendingUp, Loader2 } from "lucide-react";

const COLORS = ["#dc2626", "#1e293b", "#ef4444", "#334155", "#f87171", "#475569", "#fca5a5"];

type Tab = "category" | "status" | "trend";

export const IssueStatsChart: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("category");

  useEffect(() => {
    complaintService
      .getAll({})
      .then((r) => setComplaints(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // --- Category breakdown ---
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [complaints]);

  // --- Status breakdown ---
  const statusData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [complaints]);

  // --- Daily trend (last 7 days) ---
  const trendData = React.useMemo(() => {
    const days: Record<string, { reported: number; resolved: number }> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      days[key] = { reported: 0, resolved: 0 };
    }
    complaints.forEach((c) => {
      const created = new Date(c.createdAt);
      const key = created.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      if (days[key]) {
        days[key].reported += 1;
        if (c.status === "Resolved") days[key].resolved += 1;
      }
    });
    return Object.entries(days).map(([date, v]) => ({ date, ...v }));
  }, [complaints]);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "category", label: "By Category", icon: BarChart2 },
    { id: "status", label: "By Status", icon: PieIcon },
    { id: "trend", label: "7-Day Trend", icon: TrendingUp },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-xl shadow-xl">
          <div className="font-bold mb-1">{label}</div>
          {payload.map((p: any) => (
            <div key={p.dataKey} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span>{p.name ?? p.dataKey}: {p.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-slate-900 text-red-400 text-[10px] font-black uppercase tracking-wider">
            Live Analytics
          </span>
          <h2 className="text-lg font-black text-slate-900 mt-1.5">Issue Statistics</h2>
          <p className="text-xs text-slate-500">Real-time breakdown of all civic complaints across Mumbai's 24 wards</p>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                tab === id
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="h-56">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : tab === "category" ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" name="Complaints" radius={[6, 6, 0, 0]}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={i % 2 === 0 ? "#dc2626" : "#1e293b"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : tab === "status" ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="reported"
                name="Reported"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 3, fill: "#dc2626" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="resolved"
                name="Resolved"
                stroke="#1e293b"
                strokeWidth={2}
                dot={{ r: 3, fill: "#1e293b" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
