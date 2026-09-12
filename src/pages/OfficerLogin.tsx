import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import {
  Building2, ShieldCheck, Lock, Mail, BadgeCheck,
  ArrowRight, ShieldAlert, Key, AlertTriangle, UserPlus,
  Search, ChevronRight,
} from "lucide-react";

export const OfficerLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [password, setPassword] = useState("");
  const [ward, setWard] = useState<number>(9);
  const [activeZone, setActiveZone] = useState<"ALL" | "ISLAND" | "WESTERN" | "EASTERN">("ALL");
  const [wardSearch, setWardSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(
        email.trim(),
        password,
        "Officer",
        { serviceId: serviceId.trim() || `BMC-OFF-${ward < 10 ? "0" + ward : ward}01`, ward }
      );
      navigate("/admin");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Official authentication failed. Please verify your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickOfficerDemo = async (
    officerEmail: string,
    officerWard: number,
    badgeId: string,
    officerPass = "officer123"
  ) => {
    setLoading(true);
    setError(null);
    try {
      await login(officerEmail, officerPass, "Officer", { serviceId: badgeId, ward: officerWard });
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Officer demo authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectWardToForm = (w: typeof MUMBAI_WARDS_DATA[0]) => {
    setWard(w.id);
    setEmail(w.officer.email || `amc.${w.code.replace("/", "").toLowerCase()}ward@mcgm.gov.in`);
    setServiceId(`BMC-OFF-${w.id < 10 ? "0" + w.id : w.id}01`);
    setPassword("officer123");
  };

  const filteredWards = MUMBAI_WARDS_DATA.filter((w) => {
    if (activeZone === "ISLAND" && w.id > 9) return false;
    if (activeZone === "WESTERN" && (w.id < 10 || w.id > 18)) return false;
    if (activeZone === "EASTERN" && w.id < 19) return false;
    if (wardSearch.trim()) {
      const q = wardSearch.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.code.toLowerCase().includes(q) ||
        w.officer.name.toLowerCase().includes(q) ||
        w.areaDescription.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const zones: { id: typeof activeZone; label: string }[] = [
    { id: "ALL", label: "All 24" },
    { id: "ISLAND", label: "Island (1-9)" },
    { id: "WESTERN", label: "Western (10-18)" },
    { id: "EASTERN", label: "Eastern (19-24)" },
  ];

  return (
    <div className="min-h-[90vh] bg-slate-50 px-4 py-10">
      {/* Top accent stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-white to-slate-900 fixed top-0 left-0 z-10" />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-200 text-red-700 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>Official Government Dispatch Console • 24 Municipal Wards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Brihanmumbai Ward Officers &amp; AMC Control Room
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Authorized portal for all 24 Mumbai Municipal Wards. Each Ward Executive Officer has a separate,
            authenticated login with custom credentials and direct jurisdiction over their assigned ward.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT: Ward Directory */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-red-600" />
                  24 Ward Officers Directory (1-Click Login)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your Ward from South Mumbai, Western, or Eastern suburbs.
                </p>
              </div>

              {/* Zone tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                {zones.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setActiveZone(z.id)}
                    className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
                      activeZone === z.id
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={wardSearch}
                onChange={(e) => setWardSearch(e.target.value)}
                placeholder="Search by Ward (e.g. Andheri, Colaba, Dadar, Bandra, Mulund, Borivali)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Ward list */}
            <div className="max-h-[520px] overflow-y-auto space-y-2 pr-1">
              {filteredWards.map((w) => {
                const defaultEmail = w.officer.email || `amc.${w.code.replace("/", "").toLowerCase()}ward@mcgm.gov.in`;
                const badge = `BMC-OFF-${w.id < 10 ? "0" + w.id : w.id}01`;
                const isSelected = ward === w.id;

                return (
                  <div
                    key={w.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-red-50 border-red-300 ring-1 ring-red-200"
                        : "bg-slate-50 hover:bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Ward badge */}
                      <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                        isSelected ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"
                      }`}>
                        <span className="text-[11px] font-black font-mono">{w.code}</span>
                        <span className="text-[8px] font-bold uppercase opacity-75">W-{w.id}</span>
                      </div>

                      <div>
                        <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                          <span>{w.officer.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded font-mono">
                            {badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">{w.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {defaultEmail} • {w.officer.contact}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => handleSelectWardToForm(w)}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                      >
                        Select
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickOfficerDemo(defaultEmail, w.id, badge)}
                        disabled={loading}
                        className="flex-1 sm:flex-none px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-lg transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
                      >
                        <span>Sign In</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredWards.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No municipal wards found matching &quot;{wardSearch}&quot;.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Login Form */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 relative overflow-hidden">
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/5 rounded-bl-full pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 uppercase tracking-wider mb-2">
                <Lock className="w-4 h-4" />
                <span>Custom Officer Credentials Login</span>
              </div>
              <h2 className="text-xl font-black text-slate-900">Enter Ward Authentication</h2>
              <p className="text-xs text-slate-500 mt-1">
                Sign in using your chosen official email, badge ID, and custom password.
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
                <div className="pt-1 border-t border-red-100 flex items-center justify-between text-[11px]">
                  <span>Need custom onboarding?</span>
                  <Link to="/register?role=Officer" className="font-bold underline text-red-600 hover:text-red-700">
                    Register Officer Account →
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Ward select */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  1. Assigned Municipal Ward (1 to 24)
                </label>
                <select
                  value={ward}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setWard(id);
                    const selected = MUMBAI_WARDS_DATA.find((w) => w.id === id);
                    if (selected && !email) {
                      setEmail(selected.officer.email || `amc.${selected.code.replace("/", "").toLowerCase()}ward@mcgm.gov.in`);
                      setServiceId(`BMC-OFF-${id < 10 ? "0" + id : id}01`);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {MUMBAI_WARDS_DATA.map((w) => (
                    <option key={w.id} value={w.id}>
                      Ward {w.id}: {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  2. Official BMC Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="amc.award@mcgm.gov.in or custom email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Badge ID */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  3. BMC Service Badge ID
                </label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    placeholder="BMC-OFF-0101"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                    4. Security Passcode / Password
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">Default: officer123</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter custom officer password"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-sm shadow-red-200 transition-all flex items-center justify-center gap-2 tracking-wide uppercase"
              >
                <span>{loading ? "Verifying Official Credentials..." : "Unlock Ward Officer Control Room"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Onboarding promo */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <UserPlus className="w-4 h-4 text-red-600" />
                <span>Want to set your own custom Email &amp; Password?</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Officers can create their own personalized account for any of the 24 wards with custom email, password, and phone number.
              </p>
              <Link
                to="/register?role=Officer"
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-bold underline pt-1"
              >
                <span>Go to Officer Onboarding Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Security notice */}
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[10px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <p className="leading-tight">
                <strong className="text-slate-200">Notice:</strong> This console is designated for official Municipal Corporation administration only.
                Unauthorized access attempts are monitored and recorded.
              </p>
            </div>
          </div>
        </div>

        {/* Citizen switch link */}
        <div className="text-center pt-2">
          <Link
            to="/login/citizen"
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1.5"
          >
            <span>Are you a resident citizen filing a grievance?</span>
            <span className="text-red-600 font-bold underline">Go to Citizen Portal</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
