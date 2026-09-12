import React, { useState, useEffect } from 'react';
import { ActionTakenReport, Complaint } from '../types';
import { FileText, CheckCircle2, ShieldCheck, Printer, Calendar, Building, User, Tag, MapPin, Award, ExternalLink, Copy, Lock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Real SHA-256 via Web Crypto API
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buf = encoder.encode(data);
  const hashBuf = await window.crypto.subtle.digest('SHA-256', buf);
  const hashArr = Array.from(new Uint8Array(hashBuf));
  return hashArr.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface ActionTakenReportModalProps {
  complaint: Complaint;
  atr?: ActionTakenReport;
  onClose: () => void;
}

export const ActionTakenReportModal: React.FC<ActionTakenReportModalProps> = ({ complaint, atr, onClose }) => {
  const { t } = useLanguage();
  const [verificationHash, setVerificationHash] = useState<string>('Computing...');
  const [hashCopied, setHashCopied] = useState(false);

  useEffect(() => {
    const payload = JSON.stringify({
      complaintId: complaint.id,
      ward: complaint.wardName,
      category: complaint.category,
      resolvedAt: complaint.resolvedAt || new Date().toISOString(),
      officer: complaint.resolutionOfficerName || 'Sub-Engineer K. Patil',
    });
    sha256(payload).then(setVerificationHash);
  }, [complaint.id]);

  const copyHash = () => {
    navigator.clipboard.writeText(verificationHash);
    setHashCopied(true);
    setTimeout(() => setHashCopied(false), 2000);
  };
  const report: ActionTakenReport = atr || complaint.atr || {
    id: `ATR-${complaint.id}`,
    complaintId: complaint.id,
    issueTitle: complaint.title,
    category: complaint.category,
    wardName: complaint.wardName,
    officerName: complaint.resolutionOfficerName || "Sub-Engineer K. Patil",
    officerDesignation: "Assistant Engineer (Ward Operations)",
    department: complaint.assignedDepartment || "Roads & Traffic Department (MCGM)",
    workOrderNumber: `BMC-WO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    completionDate: complaint.resolvedAt || new Date().toISOString(),
    materialsUsed: ["High-durability Asphalt Cold Mix", "Reflective Marker Coating", "Hydraulic Sub-base Sealant"],
    contractorName: "M/s Mumbai Infra Works Pvt. Ltd.",
    beforeImageUrl: complaint.imageUrl,
    afterImageUrl: complaint.afterImageUrl || complaint.imageUrl,
    summary: complaint.resolutionNotes || "Defect successfully repaired, sanitized, and inspected as per BMC standard guidelines.",
    qualitySignOff: true,
    qrVerificationHash: verificationHash
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center text-sm transition"
        >
          ✕
        </button>

        {/* Official Header Badge */}
        <div className="border-b border-slate-800 pb-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xs font-mono text-cyan-400 tracking-wide uppercase">BRIHANMUMBAI MUNICIPAL CORPORATION (BMC)</div>
                <h1 className="text-2xl font-black text-slate-100 flex items-center gap-2">
                  {t.actionTakenReport}
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED SIGN-OFF
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Official Municipal Compliance & Resolution Record • {report.id}</p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4 text-cyan-400" /> {t.printCertificate}
            </button>
          </div>
        </div>

        {/* ATR Body Content */}
        <div className="space-y-6 text-xs text-slate-300">

          {/* Reference Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 border border-slate-800 rounded-xl">
            <div>
              <div className="text-slate-500 font-medium">Grievance ID</div>
              <div className="text-slate-200 font-mono font-bold mt-0.5">{report.complaintId}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Work Order #</div>
              <div className="text-cyan-400 font-mono font-bold mt-0.5">{report.workOrderNumber}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Completion Date</div>
              <div className="text-slate-200 font-medium mt-0.5">{new Date(report.completionDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">Municipal Ward</div>
              <div className="text-slate-200 font-semibold mt-0.5">{report.wardName}</div>
            </div>
          </div>

          {/* Issue Summary */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Tag className="w-4 h-4" /> {report.category} — {report.issueTitle}
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{report.summary}</p>
          </div>

          {/* Before & After Visual Verification */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Visual Verification Evidence (Before vs After)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-[11px] font-bold text-rose-400 mb-2 flex items-center justify-center gap-1">
                  🔴 Initial Reported State (Before)
                </div>
                {report.beforeImageUrl ? (
                  <img
                    src={report.beforeImageUrl}
                    alt="Before Repair"
                    className="w-full h-44 object-cover rounded-lg border border-slate-800"
                  />
                ) : (
                  <div className="w-full h-44 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                    No initial photo
                  </div>
                )}
              </div>

              {/* After */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-[11px] font-bold text-emerald-400 mb-2 flex items-center justify-center gap-1">
                  🟢 Resolved & Inspected State (After)
                </div>
                {report.afterImageUrl ? (
                  <img
                    src={report.afterImageUrl}
                    alt="After Repair"
                    className="w-full h-44 object-cover rounded-lg border border-slate-800"
                  />
                ) : (
                  <div className="w-full h-44 bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
                    No completion photo
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Materials & Contractor Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-cyan-400" /> Executing Squad & Contractor
              </div>
              <div className="text-sm font-semibold text-slate-100">{report.contractorName}</div>
              <div className="text-xs text-slate-400 mt-1">{report.department}</div>
            </div>

            <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-xl">
              <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" /> Key Materials & Specifications Used
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                {report.materialsUsed.map((mat, idx) => (
                  <li key={idx}>{mat}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Official Sign-Off Footer */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center font-bold text-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-slate-200">{report.officerName}</div>
                <div className="text-slate-400 text-[11px]">{report.officerDesignation}</div>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono">
              <div className="text-slate-500 mb-1 flex items-center gap-1 justify-end">
                <Lock size={10} className="text-cyan-400" />
                {t.digitalHash}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <span className="text-cyan-400 text-[10px] truncate max-w-[200px]">{report.qrVerificationHash}</span>
                <button
                  onClick={copyHash}
                  title="Copy hash"
                  className="text-slate-500 hover:text-cyan-400 transition"
                >
                  <Copy size={12} />
                </button>
              </div>
              {hashCopied && <div className="text-emerald-400 text-[10px] mt-0.5">Copied!</div>}
              <div className="text-emerald-400 font-bold mt-1">✓ {t.bmcCompliance}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
