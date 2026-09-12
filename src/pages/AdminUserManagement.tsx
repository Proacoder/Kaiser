import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  Users, UserCheck, ShieldCheck, Database, Search, 
  RefreshCw, Building2, Phone, Mail, BadgeCheck, Filter, ArrowLeft
} from "lucide-react";

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  role: "Citizen" | "Officer" | "Admin";
  ward: number;
  department: string;
  phone: string;
  serviceId: string;
  createdAt: string;
}

export const AdminUserManagement: React.FC = () => {
  const [members, setMembers] = useState<MemberRecord[]>([]);
  const [stats, setStats] = useState<{ total: number; citizenCount: number; officerCount: number; supabaseConnected: boolean }>({
    total: 0,
    citizenCount: 0,
    officerCount: 0,
    supabaseConnected: false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "Citizen" | "Officer">("all");
  const [wardFilter, setWardFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get<{
        users: MemberRecord[];
        total: number;
        citizenCount: number;
        officerCount: number;
        supabaseConnected: boolean;
      }>("/admin/users");
      setMembers(res.data.users || []);
      setStats({
        total: res.data.total,
        citizenCount: res.data.citizenCount,
        officerCount: res.data.officerCount,
        supabaseConnected: res.data.supabaseConnected,
      });
    } catch (e) {
      console.error("Failed to load members directory", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.phone.toLowerCase().includes(q) ||
      (m.serviceId && m.serviceId.toLowerCase().includes(q));

    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesWard = wardFilter === "all" || m.ward === Number(wardFilter);

    return matchesSearch && matchesRole && matchesWard;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/admin"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dispatch Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-red-600" />
            <span>Administrator Member Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centrally manage and inspect all registered citizens, verified ward officers, and database records.
          </p>
        </div>

        {/* Database Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 shadow-2xs ${
            stats.supabaseConnected
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-slate-100 border-slate-300 text-slate-700"
          }`}>
            <Database className="w-4 h-4 text-emerald-600" />
            <span>{stats.supabaseConnected ? "Supabase Cloud Database Active" : "Local Persistent Database Active"}</span>
          </div>

          <button
            onClick={loadMembers}
            disabled={loading}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 transition-colors shadow-2xs"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registered Members</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total}</div>
            <div className="text-[10px] text-slate-500">Saved in database</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider">Registered Citizens</div>
            <div className="text-2xl font-black text-red-600 mt-1">{stats.citizenCount}</div>
            <div className="text-[10px] text-slate-500">Mumbai residents</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Ward Officers & AMCs</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.officerCount}</div>
            <div className="text-[10px] text-slate-500">Authorized officials</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-red-400 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone, badge..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setRoleFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                roleFilter === "all" ? "bg-white text-slate-900 shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All Roles
            </button>
            <button
              onClick={() => setRoleFilter("Citizen")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                roleFilter === "Citizen" ? "bg-red-600 text-white shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Citizens ({stats.citizenCount})
            </button>
            <button
              onClick={() => setRoleFilter("Officer")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                roleFilter === "Officer" ? "bg-slate-900 text-white shadow-2xs font-extrabold" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Officers ({stats.officerCount})
            </button>
          </div>

          <select
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Wards</option>
            {MUMBAI_WARDS_DATA.map((w) => (
              <option key={w.id} value={w.id}>
                Ward {w.code} - {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Ward Jurisdiction</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Badge / Department</th>
                <th className="py-3.5 px-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No members match the search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const wardObj = MUMBAI_WARDS_DATA.find((w) => w.id === m.ward);
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                            m.role === "Officer" 
                              ? "bg-slate-900 text-red-400 border border-slate-800" 
                              : "bg-red-50 text-red-700"
                          }`}>
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{m.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{m.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        {m.role === "Officer" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white border border-slate-800 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-red-400" /> Ward Officer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold">
                            <UserCheck className="w-3 h-3 text-red-600" /> Resident Citizen
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">
                          Ward {wardObj?.code || m.ward}
                        </div>
                        <div className="text-[10px] text-slate-500">{wardObj?.name || `Ward ${m.ward}`}</div>
                      </td>

                      <td className="py-3 px-4 space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{m.email}</span>
                        </div>
                        {m.phone && (
                          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{m.phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {m.serviceId ? (
                          <span className="font-mono text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            {m.serviceId}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                        {m.department && (
                          <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[160px]">
                            {m.department}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {new Date(m.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
