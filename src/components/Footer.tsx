import React from "react";
import { Link } from "react-router-dom";
import { Building2, PhoneCall, CheckCircle2, MapPin } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#242424] border-t border-[#cecac8]/30 text-white text-xs font-mono mt-16">
      {/* Top Accent Stripe - Lake Blue */}
      <div className="h-1 w-full bg-[#2b59d1]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Portal Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2b59d1] flex items-center justify-center text-white shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-white font-serif font-normal text-lg tracking-tight block">
                  CivicConnect
                </span>
                <span className="text-[10px] text-[#cfdaf5] font-mono uppercase tracking-wider block">
                  BMC Civic Journal Portal
                </span>
              </div>
            </div>
            <p className="text-[#cecac8] leading-relaxed text-[12px] font-mono">
              Brihanmumbai Municipal Corporation (BMC) official grievance redressal & 24-ward technical journal platform.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-[#cfdaf5] font-mono uppercase pt-1">
              <span className="w-2 h-2 rounded-full bg-[#2b59d1] animate-pulse" />
              <span>All 24 Ward Control Rooms Active</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-normal text-white text-[15px] border-b border-[#cecac8]/20 pb-2">
              Municipal Services
            </h4>
            <ul className="space-y-2.5 text-[#cecac8] text-[12px] font-mono uppercase tracking-wider">
              <li><Link to="/report" className="hover:text-white transition-colors">File a Grievance</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Grievance Explorer</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Greater Mumbai Map</Link></li>
              <li><Link to="/top10" className="hover:text-white transition-colors">Priority Triage Queue</Link></li>
              <li><Link to="/officers" className="hover:text-white transition-colors">Ward Officers Roster</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Control Room Console</Link></li>
            </ul>
          </div>

          {/* Col 3: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="font-serif font-normal text-white text-[15px] border-b border-[#cecac8]/20 pb-2">
              Emergency Helplines
            </h4>
            <ul className="space-y-3 text-[#cecac8] text-[12px] font-mono">
              <li className="flex items-start gap-2.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#2b59d1] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#cecac8] block text-[11px] uppercase">BMC Control Room:</span>
                  <strong className="text-white font-mono text-xs">1916</strong>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#2b59d1] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#cecac8] block text-[11px] uppercase">Disaster Management:</span>
                  <strong className="text-white font-mono text-xs">022-22694725</strong>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#2b59d1] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#cecac8] block text-[11px] uppercase">Traffic Control:</span>
                  <strong className="text-white font-mono text-xs">022-24937755</strong>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Headquarters */}
          <div className="space-y-3">
            <h4 className="font-serif font-normal text-white text-[15px] border-b border-[#cecac8]/20 pb-2">
              Headquarters
            </h4>
            <div className="text-[#cecac8] text-[12px] font-mono leading-relaxed space-y-3">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#2b59d1] shrink-0 mt-0.5" />
                <span>MCGM Head Office, Mahapalika Marg, Opp. CSMT Station, Fort, Mumbai 400001</span>
              </p>

              <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white font-mono uppercase">
                  Govt. of Maharashtra
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white font-mono uppercase">
                  Digital India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-[#cecac8]/20 text-[11px] text-[#cecac8]/60 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Brihanmumbai Municipal Corporation (BMC). All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-3 text-[#cecac8]/80 font-mono uppercase">
            <span>WCAG 2.1 AAA</span>
            <span>•</span>
            <span>Right to Service Act 2015</span>
            <span>•</span>
            <span>RTI Disclosures</span>
            <span>•</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
