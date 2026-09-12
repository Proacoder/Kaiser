import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { 
  User, Mail, Lock, Building2, Phone, BadgeCheck, 
  ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 
} from "lucide-react";

export const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "Officer" ? "Officer" : "Citizen";
  
  const [role, setRole] = useState<"Citizen" | "Officer">(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ward, setWard] = useState<number>(9);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const qRole = searchParams.get("role");
    if (qRole === "Officer" || qRole === "Citizen") {
      setRole(qRole);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      await register({
        name,
        email,
        phone,
        serviceId: role === "Officer" ? (serviceId || `BMC-OFF-${ward < 10 ? '0' + ward : ward}99`) : undefined,
        department: role === "Officer" ? (department || `Ward ${ward} Operations`) : undefined,
        ward,
        role,
        password,
      });

      // Navigate according to registered role
      if (role === "Officer") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Registration failed. Please try again with valid information.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="w-full max-w-lg space-y-6">
        <div className="bg-white p-7 sm:p-9 rounded-3xl border border-slate-200/90 shadow-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto text-white font-bold shadow-md transition-colors ${
              role === "Officer" ? "bg-slate-900 border-2 border-red-500" : "bg-red-600"
            }`}>
              {role === "Officer" ? <Building2 className="w-7 h-7 text-red-400" /> : <User className="w-7 h-7" />}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {role === "Officer" ? "Ward Officer Official Onboarding" : "Create Citizen Account"}
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {role === "Officer" 
                ? "Register verified municipal credentials for AI dispatch and control room access." 
                : "Join your neighborhood ward network to report and track civic improvements."}
            </p>
          </div>

          {/* Role selector tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => { setRole("Citizen"); setError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                role === "Citizen" ? "bg-red-600 text-white shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Resident Citizen
            </button>
            <button
              type="button"
              onClick={() => { setRole("Officer"); setError(null); }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                role === "Officer" ? "bg-slate-900 text-red-400 shadow-2xs font-extrabold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Ward Officer
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {role === "Officer" ? "Officer Full Name & Title" : "Full Name"}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === "Officer" ? "AMC Vinayak Vispute" : "Aarav Sharma"}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {role === "Officer" ? "Official BMC Email Address" : "Email Address"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "Officer" ? "officer.hwest@civic.com" : "you@example.com"}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {role === "Officer" ? "Assigned Ward" : "Resident Ward"}
                </label>
                <select
                  value={ward}
                  onChange={(e) => setWard(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                >
                  {MUMBAI_WARDS_DATA.map((w) => (
                    <option key={w.id} value={w.id}>
                      Ward {w.code} - {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {role === "Officer" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Service Badge ID
                  </label>
                  <div className="relative">
                    <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      placeholder="BMC-OFF-0901"
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ward Executive Office"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer ${
                role === "Officer" 
                  ? "bg-slate-900 hover:bg-slate-800 text-white border border-slate-800" 
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              <span>{loading ? "Creating Account..." : (role === "Officer" ? "Complete Officer Registration" : "Complete Citizen Sign Up")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-600 border-t border-slate-100 pt-3">
            <span>Already have an account? </span>
            <Link 
              to={role === "Officer" ? "/login/officer" : "/login/citizen"} 
              className={`font-bold hover:underline ${role === "Officer" ? "text-slate-900" : "text-red-600"}`}
            >
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
