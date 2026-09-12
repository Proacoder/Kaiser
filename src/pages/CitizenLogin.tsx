import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import {
  User, Mail, Lock, Phone, ArrowRight, Shield, Building2,
  CheckCircle2, Sparkles, AlertCircle, Smartphone, RefreshCw,
  Chrome, ChevronRight,
} from "lucide-react";

type AuthStep = "method" | "phone-otp" | "email-form" | "otp-entry";

const DEMO_CITIZENS = [
  { name: "Aarav Sharma", email: "aarav@example.com", ward: 9, wardName: "H-West (Bandra West)", password: "citizen123" },
  { name: "Priya Mehta", email: "priya@example.com", ward: 11, wardName: "F-North (Matunga)", password: "citizen123" },
  { name: "Rajan Nair", email: "rajan@example.com", ward: 15, wardName: "K-West (Andheri West)", password: "citizen123" },
  { name: "Sunita Patil", email: "sunita@example.com", ward: 20, wardName: "P-North (Malad)", password: "citizen123" },
];

export const CitizenLogin: React.FC = () => {
  const { t } = useLanguage();
  const { login, exploreAsGuest } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<AuthStep>("method");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("phone");

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ward, setWard] = useState<number>(9);

  // Phone OTP state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [sentOtp, setSentOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((v) => v - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // ─── Demo Quick Login ─────────────────────────────────────────────────────
  const handleDemoLogin = async (demo: typeof DEMO_CITIZENS[0]) => {
    setLoading(true);
    setError(null);
    try {
      await login(demo.email, demo.password, "Citizen", { ward: demo.ward });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Demo sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Email Login ──────────────────────────────────────────────────────────
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email.trim(), password, "Citizen", { ward });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Phone OTP Flow ───────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Generate 4-digit OTP (demo mode — in production this calls POST /api/auth/send-otp)
      const generated = Math.floor(1000 + Math.random() * 9000).toString();
      setSentOtp(generated);
      setOtp(["", "", "", ""]);
      setOtpSent(true);
      setOtpTimer(60);
      setStep("otp-entry");
      // Auto-fill OTP in dev mode for demo
      setTimeout(() => {
        setOtp(generated.split(""));
        otpRefs[0].current?.focus();
      }, 300);
      setSuccessMsg(`OTP sent to +91 ${phone} (Demo: ${generated})`);
    } catch (err: any) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setError("Please enter all 4 digits of the OTP.");
      return;
    }
    if (enteredOtp !== sentOtp) {
      setError("Incorrect OTP. Please check and try again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const phoneEmail = `${phone.replace(/\D/g, "")}@citizen.civic.com`;
      await login(phoneEmail, "otp-verified", "Citizen", { phone });
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestExplore = () => {
    exploreAsGuest();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md space-y-5 relative z-10">
        {/* BMC Pill */}
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-slate-300 bg-slate-900 border border-slate-700 py-1.5 px-4 rounded-full shadow mx-auto w-max">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Brihanmumbai Municipal Corporation — Citizen Portal
        </div>

        {/* Main card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">{t.citizenSignIn}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Report grievances · Track repairs · Hold BMC accountable
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-5">
            {/* Demo Citizen Profiles */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" /> {t.demoAccounts}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">{t.oneClickSignIn}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_CITIZENS.map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => handleDemoLogin(demo)}
                    disabled={loading}
                    className="p-2.5 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-red-500/50 rounded-xl transition-all text-left group"
                  >
                    <div className="w-6 h-6 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs font-black mb-1.5">
                      {demo.name.charAt(0)}
                    </div>
                    <div className="text-xs text-slate-200 group-hover:text-white font-bold truncate">{demo.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{demo.wardName}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-xs text-red-300 font-medium">{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-300 font-medium">{successMsg}</span>
              </div>
            )}

            {/* ── Auth Method Tabs ── */}
            {step !== "otp-entry" && (
              <>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-800 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod("phone"); setStep("method"); setError(null); }}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMethod === "phone"
                        ? "bg-slate-700 text-white shadow"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Smartphone size={13} /> {t.phoneNumber.split(" ")[0]}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod("email"); setStep("email-form"); setError(null); }}
                    className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      authMethod === "email"
                        ? "bg-slate-700 text-white shadow"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Mail size={13} /> {t.emailAddress.split(" ")[0]}
                  </button>
                </div>

                {/* Phone Input */}
                {authMethod === "phone" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.phoneNumber}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-400 font-bold">
                          🇮🇳 +91
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          placeholder="98765 43210"
                          className="flex-1 px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || phone.length < 10}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                      {t.sendOtp}
                    </button>
                  </div>
                )}

                {/* Email Form */}
                {authMethod === "email" && (
                  <form onSubmit={handleEmailLogin} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.emailAddress}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="aarav@example.com"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {t.password}
                        </label>
                        <span className="text-[11px] text-red-500 hover:text-red-400 cursor-pointer">{t.forgotPassword}</span>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        {t.ward}
                      </label>
                      <select
                        value={ward}
                        onChange={(e) => setWard(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-red-500 transition"
                      >
                        {MUMBAI_WARDS_DATA.map((w) => (
                          <option key={w.ward} value={w.ward}>{w.wardName}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw size={15} className="animate-spin" /> : <ArrowRight size={15} />}
                      {t.login}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* ── OTP Entry ── */}
            {step === "otp-entry" && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Smartphone className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium">
                    {t.enterOtp}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Sent to +91 {phone}
                  </p>
                </div>

                {/* 4-digit OTP boxes */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-14 h-14 text-center text-2xl font-black bg-slate-800 border-2 border-slate-700 text-white rounded-2xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition caret-red-500"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join("").length < 4}
                  className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                  {t.verifyOtp}
                </button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => { setStep("method"); setOtpSent(false); setSentOtp(null); setError(null); setSuccessMsg(null); }}
                    className="text-slate-500 hover:text-slate-300 transition"
                  >
                    ← Change number
                  </button>
                  {otpTimer > 0 ? (
                    <span className="text-slate-500">Resend in {otpTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-red-500 hover:text-red-400 font-bold transition flex items-center gap-1"
                    >
                      <RefreshCw size={11} /> Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] text-slate-600 font-medium">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Guest + Register */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={handleGuestExplore}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-300 font-semibold text-sm rounded-xl transition"
              >
                {t.exploreAsGuest}
              </button>
              <p className="text-center text-[11px] text-slate-600">
                Don't have an account?{" "}
                <Link to="/register?role=Citizen" className="text-red-500 hover:text-red-400 font-bold">
                  {t.signUpNow} →
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Officer sign in link */}
        <p className="text-center text-[11px] text-slate-600">
          BMC Officer?{" "}
          <Link to="/login/officer" className="text-slate-400 hover:text-white font-semibold">
            <Shield size={11} className="inline mb-0.5" /> {t.officerSignIn} →
          </Link>
        </p>
      </div>
    </div>
  );
};
