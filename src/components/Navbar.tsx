import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  PlusCircle, Map, LayoutDashboard, ShieldAlert, Building2, Award,
  ShieldCheck, PhoneCall, LogOut, FileText, Lock, Search, Menu, X,
  Users, ChevronRight, ClipboardList, Globe,
} from "lucide-react";

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenTracker?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommandPalette, onOpenTracker }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isOfficer, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  const go = (to: string) => {
    navigate(to);
    setMobileOpen(false);
  };

  const publicNav = [
    { label: t.home, short: t.home, to: "/", icon: Building2 },
    { label: t.dashboard, short: t.dashboard, to: "/dashboard", icon: LayoutDashboard },
    { label: t.map, short: t.map, to: "/map", icon: Map },
    { label: t.officers, short: t.officers, to: "/officers", icon: Users },
    ...(user ? [{ label: t.myReports, short: t.myReports, to: "/my-reports", icon: ClipboardList }] : []),
  ];

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="utility-bar">
        <div className="shell utility-inner">
          <div className="utility-brand">
            <span className="utility-dot" /> {t.bmc} Civic Intelligence Network
            <span className="utility-divider">/</span> 24 {t.wards} online
          </div>
          <div className="utility-links flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-0.5 bg-white/10 p-0.5 rounded-full text-[10px] font-mono">
              <Globe size={11} className="text-white/60 ml-1 mr-0.5" />
              <button
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 rounded-full transition ${
                  language === "en" ? "bg-white text-slate-900 font-bold" : "text-white/80 hover:text-white"
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("mr")}
                className={`px-2 py-0.5 rounded-full transition ${
                  language === "mr" ? "bg-white text-slate-900 font-bold" : "text-white/80 hover:text-white"
                }`}
                title="मराठी"
              >
                मराठी
              </button>
              <button
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 rounded-full transition ${
                  language === "hi" ? "bg-white text-slate-900 font-bold" : "text-white/80 hover:text-white"
                }`}
                title="हिंदी"
              >
                हिंदी
              </button>
            </div>

            {onOpenTracker && (
              <button onClick={onOpenTracker} className="utility-action">
                <FileText size={13} /> {t.myReports}
              </button>
            )}
            <a href="tel:1916" className="utility-action">
              <PhoneCall size={13} /> Helpline <strong>1916</strong>
            </a>
          </div>
        </div>
      </div>

      <div className="shell main-nav">
        <Link to="/" className="wordmark" onClick={() => setMobileOpen(false)}>
          <span className="wordmark-mark"><Building2 size={19} /></span>
          <span>
            <strong>KAISER<span>AI</span></strong>
            <small>Mumbai Civic Operations</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {publicNav.map(({ label, to, icon: Icon }) => (
            <Link key={to} to={to} className={`nav-link ${isActive(to) ? "is-active" : ""}`}>
              <Icon size={15} /><span>{label}</span>
            </Link>
          ))}
          {isOfficer && (
            <Link to="/admin" className={`nav-link nav-link-officer ${isActive("/admin") ? "is-active" : ""}`}>
              <ShieldAlert size={15} /><span>{t.admin}</span>
            </Link>
          )}
        </nav>

        <div className="nav-actions">
          {onOpenCommandPalette && (
            <button onClick={onOpenCommandPalette} className="search-trigger" title="Search wards and shortcuts">
              <Search size={16} /><span>{t.search}</span><kbd>⌘K</kbd>
            </button>
          )}
          <button onClick={() => go("/report")} className="file-button">
            <PlusCircle size={16} /><span>{t.report}</span><ChevronRight size={15} />
          </button>
          {user ? (
            <div className="user-chip">
              <div className="user-avatar">
                {isOfficer ? <ShieldCheck size={15} /> : user.name?.charAt(0)?.toUpperCase()}
              </div>
              <div className="user-copy">
                <strong>{user.name}</strong>
                <small>{isOfficer ? `Officer · ${t.ward} ${user.ward}` : t.citizenSignIn}</small>
              </div>
              <button onClick={logout} className="icon-button" title={t.logout}>
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="signin-link">{t.login}</Link>
          )}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-nav-panel">
          <div className="shell mobile-nav-grid">
            {publicNav.map(({ label, short, to, icon: Icon }) => (
              <button
                key={to}
                onClick={() => go(to)}
                className={`mobile-nav-item ${isActive(to) ? "is-active" : ""}`}
              >
                <Icon size={18} />
                <span>{label}<small>{short}</small></span>
                <ChevronRight size={16} />
              </button>
            ))}
            {isOfficer && (
              <button onClick={() => go("/admin")} className="mobile-nav-item">
                <ShieldAlert size={18} />
                <span>{t.admin}<small>Officer console</small></span>
                <ChevronRight size={16} />
              </button>
            )}
            <button onClick={() => go("/report")} className="mobile-nav-item mobile-nav-primary">
              <PlusCircle size={18} />
              <span>{t.report}<small>{t.reportIncident}</small></span>
              <ChevronRight size={16} />
            </button>
            {/* Mobile language switcher */}
            <div className="mobile-nav-item" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
              <span style={{ fontSize: 11, opacity: 0.6, fontWeight: 700 }}>{t.language}</span>
              <div className="flex gap-2">
                {(["en", "mr", "hi"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                      language === lang
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-transparent text-slate-300 border-slate-600 hover:border-red-500"
                    }`}
                  >
                    {lang === "en" ? "EN" : lang === "mr" ? "मराठी" : "हिंदी"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
