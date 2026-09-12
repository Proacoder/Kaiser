import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Stats } from "../types";
import { Search, PlusCircle, MapPin, ShieldCheck, ArrowUpRight, Camera, Activity, Clock, CheckCircle2 } from "lucide-react";

export interface Hero12Props {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  stats: Stats | null;
  backgroundImage?: string;
  badgeText?: string;
  title?: string;
  description?: string;
}

export const Hero12: React.FC<Hero12Props> = ({
  searchQuery, setSearchQuery, handleSearchSubmit, stats,
  badgeText = "Live across 24 municipal wards",
  title = "Make Mumbai work better.",
  description = "Report what needs fixing, follow the response, and see how your neighbourhood is moving forward — all in one transparent civic desk.",
}) => {
  const navigate = useNavigate();
  const metrics = [
    { label: "Reports logged", value: stats?.total || 0, icon: Activity },
    { label: "Resolved", value: stats?.resolved || 0, icon: CheckCircle2 },
    { label: "In the field", value: stats?.inProgress || 0, icon: Clock },
  ];

  return (
    <section className="hero-command" aria-labelledby="hero-title">
      <div className="hero-command-grid">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-pulse" /> {badgeText}</div>
          <h1 id="hero-title">{title}<br /><em>One clear next step.</em></h1>
          <p>{description}</p>
          <div className="hero-actions">
            <button className="hero-primary" onClick={() => navigate("/report")}><PlusCircle size={18} /> Report an issue <ArrowUpRight size={17} /></button>
            <button className="hero-secondary" onClick={() => navigate("/map")}><MapPin size={17} /> Open ward map</button>
          </div>
          <div className="hero-trust"><ShieldCheck size={15} /> Photo + location verified <span>•</span> Target response within 24–48h</div>
        </div>

        <motion.div className="hero-status-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <div className="status-card-top"><span className="status-label">Civic pulse</span><span className="status-live"><span /> live now</span></div>
          <div className="status-card-main"><div className="status-number">{stats?.total || 0}</div><div><strong>public reports</strong><small>indexed across Greater Mumbai</small></div></div>
          <div className="mini-metrics">{metrics.map(({ label, value, icon: Icon }) => <div key={label}><Icon size={14} /><span>{value}</span><small>{label}</small></div>)}</div>
          <div className="status-card-footer"><span>System confidence</span><strong>98.4%</strong></div>
        </motion.div>
      </div>

      <div className="hero-search-panel">
        <div className="search-panel-heading"><div><span className="section-kicker">Find a response</span><h2>Search a report, ward or street</h2></div><span className="connected"><span /> 24 ward desks connected</span></div>
        <form onSubmit={handleSearchSubmit} className="hero-search-form"><Search size={18} /><input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Try “pothole in Bandra” or #BMC-2026-..." aria-label="Search civic reports" /><button type="submit">Search <ArrowUpRight size={15} /></button></form>
        <div className="search-suggestions"><span>Popular paths</span><button onClick={() => navigate("/dashboard?sortBy=upvotes")}>Top Grievances</button><button onClick={() => navigate("/officers")}>Find Ward Officer</button></div>
      </div>
    </section>
  );
};
