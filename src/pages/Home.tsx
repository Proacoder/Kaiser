import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint, Stats } from "../types";
import { ComplaintCard } from "../components/ComplaintCard";
import { MumbaiMap } from "../components/MumbaiMap";
import { Hero12 } from "../components/Hero12";
import { ScrollReveal } from "../components/ScrollReveal";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { WardSlaCalculator } from "../components/WardSlaCalculator";
import { ContractorPenaltyScorecard } from "../components/ContractorPenaltyScorecard";
import { IssueStatsChart } from "../components/IssueStatsChart";
import { DataVisualizationHub } from "../components/DataVisualizationHub";
import { 
  PlusCircle, Search, MapPin, CheckCircle2, 
  ShieldCheck, ArrowRight, CloudRain,
  Construction, Droplets, Trash2, Waves, Lightbulb, Bug,
  Megaphone, Phone, Building2, ChevronRight,
  Award, ShieldAlert, FileText, AlertTriangle, Users, Sparkles
} from "lucide-react";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [criticalIssues, setCriticalIssues] = useState<Complaint[]>([]);
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [weatherAlert, setWeatherAlert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWardIndex, setSelectedWardIndex] = useState(4); // Default to Ward H-West (Bandra)

  const activeWard = MUMBAI_WARDS_DATA[selectedWardIndex] || MUMBAI_WARDS_DATA[0];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [statsRes, complaintsRes, topRes] = await Promise.all([
        complaintService.getStats(),
        complaintService.getAll({ sortBy: "newest" }),
        complaintService.getTop10(),
      ]);
      setStats(statsRes.data);
      setAllComplaints(complaintsRes.data);
      setCriticalIssues(topRes.data.slice(0, 3));

      // Live Open-Meteo weather API call for Mumbai (19.0760° N, 72.8777° E)
      fetch("https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current_weather=true")
        .then((r) => r.json())
        .then((wData) => {
          if (wData?.current_weather) {
            const cw = wData.current_weather;
            setWeatherAlert({
              weatherStatus: `${cw.temperature}°C, Wind ${cw.windspeed} km/h`,
              highTideTime: "14:30 IST",
              highTideHeightMeters: 4.2
            });
          }
        })
        .catch(() => null);
    } catch (err) {
      console.error("Failed to load home data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const civicDepartments = [
    { name: "Roads & Potholes", icon: Construction, category: "Pothole" },
    { name: "Water Supply & Leaks", icon: Droplets, category: "Water Leakage" },
    { name: "Solid Waste Management", icon: Trash2, category: "Garbage" },
    { name: "Stormwater Drainage", icon: Waves, category: "Drainage" },
    { name: "Street Lighting", icon: Lightbulb, category: "Streetlight" },
    { name: "Pest Control & Health", icon: Bug, category: "Other" },
  ];

  return (
    <div className="space-y-8 pb-16 bg-[#f6f3f1] text-[#242424] font-mono">
      {/* Official Government Public Notice Strip - Monad Ink Ground */}
      <div className="bg-[#000000] text-white text-xs py-2 px-4 border-b border-[#242424]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="bg-[#2b59d1] text-white text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              CRITICAL NOTICE
            </span>
            <span className="font-mono text-white text-[11px] uppercase tracking-wider">
              Monsoon Control Room Active: High Tide Warning 4.2m expected at 14:30. Helpline: <strong>1916</strong>
            </span>
          </div>
          <div className="text-[11px] text-[#cfdaf5] font-mono uppercase tracking-wider">
            Maharashtra Services Act SLA: 24h - 48h
          </div>
        </div>
      </div>

      {/* Weather Alert Panel if Active */}
      {weatherAlert && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#cfdaf5] border border-[#cecac8] p-5 rounded-[40px] text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2b59d1] text-white flex items-center justify-center shrink-0">
                <CloudRain className="w-4 h-4" />
              </div>
              <span className="text-[#242424]">
                <strong className="text-[#2b59d1] uppercase">Weather Advisory ({weatherAlert.weatherStatus}):</strong> High tide at <span className="font-bold">{weatherAlert.highTideTime}</span> ({weatherAlert.highTideHeightMeters}m). Emergency units deployed.
              </span>
            </div>
            <Link to="/map" className="text-[#2b59d1] hover:underline font-medium uppercase text-[11px] shrink-0 flex items-center gap-1">
              <span>View Flood Map</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Hero Component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero12
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchSubmit={handleSearchSubmit}
          stats={stats}
        />
      </div>

      {/* Main Portal Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Civic Department Directory Grid */}
        <ScrollReveal direction="up" delay={0.05}>
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#cecac8] pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#242424]">
                  Municipal Departments
                </h2>
                <p className="text-xs text-[#797776] font-mono uppercase tracking-wider">Select a department category to view active tickets</p>
              </div>
              <Link to="/dashboard" className="text-xs font-mono uppercase tracking-wider font-medium text-[#2b59d1] hover:underline flex items-center gap-1">
                <span>View All Tickets</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {civicDepartments.map((dept) => {
                const IconComp = dept.icon;
                return (
                  <button
                    key={dept.name}
                    onClick={() => navigate(`/dashboard?category=${encodeURIComponent(dept.category)}`)}
                    className="p-6 bg-[#f6f3f1] rounded-[40px] border border-[#cecac8] hover:border-[#2b59d1] transition-all text-left flex flex-col justify-between space-y-4 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-white border border-[#cecac8] flex items-center justify-center text-[#242424] shrink-0 group-hover:bg-[#2b59d1] group-hover:text-white group-hover:border-[#2b59d1] transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-mono font-medium text-[#242424] block line-clamp-1 group-hover:text-[#2b59d1] transition-colors uppercase">
                        {dept.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        {/* 24-Ward Municipal Executive Control Directory */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="bg-[#f6f3f1] rounded-[40px] p-8 sm:p-10 border border-[#cecac8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cecac8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#2b59d1] text-white text-[10px] font-mono uppercase tracking-wider">
                    24-Ward Command Directory
                  </span>
                  <span className="text-[#797776] text-xs font-mono uppercase">
                    Administrative Contact & Telemetry
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#242424] mt-2">
                  Assistant Municipal Commissioner Directory
                </h2>
                <p className="text-xs text-[#4e4d4d] font-mono mt-1 max-w-2xl">
                  Select an administrative ward to inspect designated Assistant Municipal Commissioners, local 24x7 control room lines, and verified SLA performance.
                </p>
              </div>

              <Link
                to="/officers"
                className="px-5 py-2.5 bg-[#242424] hover:bg-[#000000] text-white text-xs font-mono uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Full Officers Roster</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>

            {/* Interactive Ward Selector Tabs */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {MUMBAI_WARDS_DATA.slice(0, 10).map((ward, idx) => (
                  <button
                    key={ward.id}
                    onClick={() => setSelectedWardIndex(idx)}
                    className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                      selectedWardIndex === idx
                        ? "bg-[#2b59d1] text-white"
                        : "bg-white text-[#242424] hover:bg-[#cfdaf5] border border-[#cecac8]"
                    }`}
                  >
                    Ward {ward.code} • {ward.areas[0] || ward.name}
                  </button>
                ))}
              </div>

              {/* Dynamic Ward Dossier Card — Periwinkle Mist Surface */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-[#cfdaf5] rounded-[40px] p-8 border border-[#cecac8]">
                <div className="lg:col-span-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={activeWard.officer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                      alt={activeWard.officer.name}
                      className="w-16 h-16 rounded-full object-cover border border-[#cecac8]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#2b59d1] text-white font-mono text-[10px] rounded-full uppercase">
                          Ward {activeWard.code}
                        </span>
                        <span className="text-xs font-mono text-[#4e4d4d] uppercase">
                          {activeWard.railwayCorridor} Zone
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-normal text-[#242424] mt-1">
                        {activeWard.officer.name}
                      </h3>
                      <p className="text-xs text-[#4e4d4d] font-mono">
                        {activeWard.officer.designation}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-mono text-[#4e4d4d] line-clamp-2">
                    <strong className="text-[#242424]">Jurisdiction:</strong> {activeWard.areaDescription}
                  </p>
                </div>

                <div className="lg:col-span-5 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-[#f6f3f1] p-4 rounded-[24px] border border-[#cecac8]">
                    <span className="text-[9px] font-mono text-[#797776] uppercase block">Resolution Rate</span>
                    <span className="text-xl font-serif font-normal text-[#2b59d1] mt-1 block">
                      {activeWard.officer.resolutionRate}%
                    </span>
                  </div>
                  <div className="bg-[#f6f3f1] p-4 rounded-[24px] border border-[#cecac8]">
                    <span className="text-[9px] font-mono text-[#797776] uppercase block">Avg. Turnaround</span>
                    <span className="text-xl font-serif font-normal text-[#242424] mt-1 block">
                      {activeWard.officer.avgResolutionDays} Days
                    </span>
                  </div>
                  <div className="bg-[#f6f3f1] p-4 rounded-[24px] border border-[#cecac8]">
                    <span className="text-[9px] font-mono text-[#797776] uppercase block">City Rank</span>
                    <span className="text-xl font-serif font-normal text-[#242424] mt-1 block">
                      #{activeWard.officer.rank || 1}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#242424] bg-[#f6f3f1] p-3 rounded-full border border-[#cecac8]">
                    <Phone className="w-3.5 h-3.5 text-[#2b59d1] shrink-0" />
                    <span>Control: <strong>{activeWard.officer.contact}</strong></span>
                  </div>

                  <div className="flex gap-2 font-mono">
                    <button
                      onClick={() => navigate(`/dashboard?ward=${activeWard.id}`)}
                      className="flex-1 py-2.5 bg-white hover:bg-[#f6f3f1] text-[#242424] border border-[#cecac8] font-medium text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5 text-[#2b59d1]" />
                      <span>Tickets</span>
                    </button>
                    <button
                      onClick={() => navigate(`/report?ward=${activeWard.code}`)}
                      className="flex-1 py-2.5 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-medium text-xs uppercase tracking-wider rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-white" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Monad Feature Storytelling Band (Atmospheric Gradient Wash) */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="bg-gradient-to-br from-[#cfdaf5] via-[#e1f0ff] to-[#f6f3f1] text-[#242424] rounded-[40px] p-8 sm:p-14 lg:p-16 border border-[#cecac8] relative overflow-hidden my-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
              <div className="lg:col-span-6 space-y-6">
                <span className="px-3.5 py-1 rounded-full bg-white text-[#2b59d1] text-xs font-mono uppercase tracking-wider border border-[#cecac8]">
                  Feature Journal Story
                </span>
                <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#242424] leading-[1.1]">
                  Geotagged photographic reporting for 21 million citizens.
                </h2>
                <p className="text-[#4e4d4d] text-base font-mono leading-relaxed">
                  Every grievance submitted through CivicConnect is automatically verified with real-time GPS metadata, matched against municipal GIS ward layers, and dispatched directly to local ward command engineers.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-8 py-3.5 bg-[#242424] hover:bg-[#000000] text-white font-mono text-xs font-medium uppercase tracking-wider rounded-full transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Read Journal Release</span>
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-[40px] border border-[#cecac8] space-y-2">
                  <span className="text-3xl sm:text-4xl font-serif font-normal text-[#2b59d1] block">2 Hours</span>
                  <p className="text-xs font-mono text-[#797776] uppercase">Direct ward engineer field assignment time</p>
                </div>
                <div className="p-6 bg-white rounded-[40px] border border-[#cecac8] space-y-2">
                  <span className="text-3xl sm:text-4xl font-serif font-normal text-[#242424] block">100%</span>
                  <p className="text-xs font-mono text-[#797776] uppercase">Photographic verification proof required</p>
                </div>
                <div className="p-6 bg-white rounded-[40px] border border-[#cecac8] space-y-2">
                  <span className="text-3xl sm:text-4xl font-serif font-normal text-[#242424] block">24 Wards</span>
                  <p className="text-xs font-mono text-[#797776] uppercase">Real-time control room synchronization</p>
                </div>
                <div className="p-6 bg-white rounded-[40px] border border-[#cecac8] space-y-2">
                  <span className="text-3xl sm:text-4xl font-serif font-normal text-[#2b59d1] block">48 Hours</span>
                  <p className="text-xs font-mono text-[#797776] uppercase">Statutory SLA resolution window</p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Priority Grievance Queue */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#cecac8] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2b59d1] animate-pulse" />
                  <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#242424]">
                    Priority Grievance Triage Queue
                  </h2>
                </div>
                <p className="text-xs text-[#797776] font-mono uppercase">Critical civic hazards prioritized by AI threat analysis & citizen endorsements</p>
              </div>
              <Link to="/top10" className="text-xs font-mono uppercase text-[#2b59d1] hover:underline flex items-center gap-1">
                <span>View Full Top 10</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {criticalIssues.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} onUpdate={loadHomeData} />
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* Interactive Before & After Field Resolutions Showcase */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="bg-[#f6f3f1] rounded-[40px] p-8 sm:p-10 border border-[#cecac8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#cecac8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#cfdaf5] text-[#242424] text-[10px] font-mono uppercase border border-[#cecac8]">
                    Quality Inspection
                  </span>
                  <span className="text-[#797776] text-xs font-mono uppercase">
                    Verified Photographic Evidence
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#242424] mt-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#2b59d1]" />
                  <span>Before & After BMC Repairs</span>
                </h2>
                <p className="text-xs text-[#4e4d4d] font-mono mt-1 max-w-2xl">
                  Drag the interactive slider divider to compare reported civic hazards against completed municipal repairs.
                </p>
              </div>

              <Link
                to="/dashboard?status=Resolved"
                className="px-5 py-2.5 bg-[#2b59d1] hover:bg-[#2247ab] text-white text-xs font-mono uppercase tracking-wider rounded-full transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Browse Fixed Issues</span>
                <ChevronRight className="w-3.5 h-3.5 text-white" />
              </Link>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Item 1: Pothole Repair */}
              <div className="space-y-3 bg-white p-5 rounded-[40px] border border-[#cecac8]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#2b59d1]">Ward H/W • Bandra West</span>
                    <h3 className="text-base font-serif font-normal text-[#242424]">Linking Road Pothole Asphalt Recarpeting</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#242424] text-white text-[10px] font-mono uppercase">
                    Resolved in 24h
                  </span>
                </div>
                <BeforeAfterSlider
                  beforeImage="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"
                  afterImage="https://images.unsplash.com/photo-1578983427937-26078ee3d9d3?auto=format&fit=crop&w=800&q=80"
                  beforeLabel="Reported Crater Hazard"
                  afterLabel="Hot-Mix Asphalt Sealed"
                  aspectRatio="aspect-16/10"
                />
              </div>

              {/* Item 2: Garbage Dump Cleared */}
              <div className="space-y-3 bg-white p-5 rounded-[40px] border border-[#cecac8]">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#2b59d1]">Ward G/N • Dadar West</span>
                    <h3 className="text-base font-serif font-normal text-[#242424]">Senapati Bapat Marg Waste Dump Cleared</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#242424] text-white text-[10px] font-mono uppercase">
                    Resolved in 12h
                  </span>
                </div>
                <BeforeAfterSlider
                  beforeImage="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80"
                  afterImage="https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80"
                  beforeLabel="Overflowing Debris"
                  afterLabel="Sanitized & Cleared"
                  aspectRatio="aspect-16/10"
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Interactive Ward Resolution Turnaround & SLA Calculator */}
        <ScrollReveal direction="up" delay={0.1}>
          <section>
            <WardSlaCalculator />
          </section>
        </ScrollReveal>

        {/* Contractor Financial SLA Penalty Matrix */}
        <ScrollReveal direction="up" delay={0.1}>
          <section>
            <ContractorPenaltyScorecard />
          </section>
        </ScrollReveal>

        {/* Data Visualization & Intelligence Analytics Hub */}
        <ScrollReveal direction="up" delay={0.1}>
          <section>
            <DataVisualizationHub />
          </section>
        </ScrollReveal>

        {/* Ward Jurisdiction Map */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="space-y-4 bg-white rounded-[40px] p-8 border border-[#cecac8]">
            <div className="flex items-center justify-between border-b border-[#cecac8] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#242424] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#2b59d1]" />
                  Greater Mumbai Ward Map
                </h2>
                <p className="text-xs text-[#797776] font-mono uppercase">Geotagged active grievances across all 24 municipal wards</p>
              </div>
              <Link to="/map" className="text-xs font-mono uppercase text-[#2b59d1] hover:underline flex items-center gap-1">
                <span>Full Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <MumbaiMap complaints={allComplaints} height="400px" />
          </section>
        </ScrollReveal>

        {/* Dual Access Portals Gateway */}
        <ScrollReveal direction="up" delay={0.1}>
          <section className="bg-[#f6f3f1] rounded-[40px] p-8 sm:p-12 border border-[#cecac8] space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#cfdaf5] text-[#242424] text-[11px] font-mono uppercase border border-[#cecac8]">
                MUMBAI CIVIC ACCESS GATEWAY
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-normal text-[#242424]">
                Citizen Grievance Redressal & Control Console
              </h2>
              <p className="text-xs sm:text-sm text-[#4e4d4d] font-mono">
                Authenticated portals for Mumbai citizens and BMC municipal administrators.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-white rounded-[40px] border border-[#cecac8] flex flex-col justify-between space-y-6 hover:border-[#2b59d1] transition-all">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#2b59d1] text-white rounded-full flex items-center justify-center font-bold">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-serif font-normal text-[#242424]">Resident Citizen Portal</h3>
                  <p className="text-xs sm:text-sm text-[#4e4d4d] font-mono leading-relaxed">
                    Track submitted grievances, monitor neighborhood civic resolutions, upvote priority road repairs, and receive notifications.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/login/citizen"
                    className="px-6 py-3 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all flex items-center gap-2"
                  >
                    <span>Citizen Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                  <Link
                    to="/register?role=Citizen"
                    className="text-xs text-[#2b59d1] font-mono uppercase hover:underline"
                  >
                    Create Account
                  </Link>
                </div>
              </div>

              <div className="p-8 bg-[#242424] text-white rounded-[40px] border border-[#242424] flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#cfdaf5] text-[#242424] rounded-full flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6 text-[#242424]" />
                  </div>
                  <h3 className="text-xl font-serif font-normal text-white">Ward Officer Control Room</h3>
                  <p className="text-xs sm:text-sm text-[#cecac8] font-mono leading-relaxed">
                    Administrative console for Assistant Municipal Commissioners and ward engineers. Manage AI triage and verify resolutions.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/login/officer"
                    className="px-6 py-3 bg-[#cfdaf5] hover:bg-white text-[#242424] font-mono text-xs uppercase tracking-wider rounded-full transition-all flex items-center gap-2"
                  >
                    <span>Officer Console</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#242424]" />
                  </Link>
                  <Link
                    to="/register?role=Officer"
                    className="text-xs text-[#cecac8] font-mono uppercase hover:text-white"
                  >
                    Staff Onboarding
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Live Analytics Chart Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <IssueStatsChart />
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
};
