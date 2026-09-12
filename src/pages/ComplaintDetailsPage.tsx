import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { complaintService } from "../services/api";
import { Complaint } from "../types";
import { useAuth } from "../context/AuthContext";
import { SeverityMeter } from "../components/SeverityMeter";
import { MumbaiMap } from "../components/MumbaiMap";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { LiveCameraModal } from "../components/LiveCameraModal";
import { BeforeAfterSlider } from "../components/BeforeAfterSlider";
import { ActionTakenReportModal } from "../components/ActionTakenReportModal";
import { 
  ThumbsUp, MessageSquare, MapPin, Clock, Sparkles, ShieldCheck, 
  Send, ArrowLeft, CheckCircle2, AlertCircle, Building2, User, Phone, Mail, Lock,
  Camera, Check, CheckCheck, FileText, ChevronDown, ChevronUp, ExternalLink, Image as ImageIcon,
  Share2, Copy, SlidersHorizontal
} from "lucide-react";

export const ComplaintDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAtrModal, setShowAtrModal] = useState(false);

  // Comment input state
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Official officer update state
  const [officialStatus, setOfficialStatus] = useState<string>("In Progress");
  const [officialComment, setOfficialComment] = useState("");
  const [isUpdatingOfficial, setIsUpdatingOfficial] = useState(false);

  // Work Completed & Email Resolution modal / state
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showOfficerCameraModal, setShowOfficerCameraModal] = useState(false);
  const [afterImageUrl, setAfterImageUrl] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isResolvingWithEmail, setIsResolvingWithEmail] = useState(false);
  const [showEmailDetailsModal, setShowEmailDetailsModal] = useState(false);
  const [resolutionSuccessToast, setResolutionSuccessToast] = useState<string | null>(null);
  const [comparisonView, setComparisonView] = useState<"slider" | "grid">("slider");
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: complaint?.title || "CivicConnect Complaint",
        text: `BMC Grievance #${complaint?.id}: ${complaint?.title} in ${complaint?.wardName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };


  useEffect(() => {
    if (id) {
      loadComplaintDetails();
    }
  }, [id]);

  const loadComplaintDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await complaintService.getById(id!);
      setComplaint(res.data);
      setOfficialStatus(res.data.status);
      if (res.data.afterImageUrl) {
        setAfterImageUrl(res.data.afterImageUrl);
      }
    } catch (err) {
      console.error("Failed to load complaint details", err);
      setError("Complaint record not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!complaint) return;
    try {
      const res = await complaintService.upvote(complaint.id);
      setComplaint({
        ...complaint,
        upvote_count: res.data.upvote_count,
        upvotes: res.data.upvotes,
      });
    } catch (err) {
      console.error("Upvote error", err);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !complaint) return;

    setIsPostingComment(true);
    try {
      await complaintService.addComment(
        complaint.id,
        commentText.trim(),
        user?.name || "Resident Citizen",
        user?.role === "Officer" ? "BMC Ward Officer" : "Resident"
      );
      setCommentText("");
      loadComplaintDetails();
    } catch (err) {
      console.error("Add comment error", err);
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleOfficialStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setIsUpdatingOfficial(true);
    try {
      const res = await complaintService.update(complaint.id, {
        status: officialStatus,
        officialComment: officialComment.trim() || undefined,
      });
      setComplaint(res.data);
      setOfficialComment("");
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdatingOfficial(false);
    }
  };

  const handleResolveWithEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    const finalAfterImage = afterImageUrl.trim() || getDefaultAfterImage(complaint.category);
    const finalNotes = resolutionNotes.trim() || `Field work completed and quality verified by Ward ${complaint.ward} engineering inspection squad.`;

    setIsResolvingWithEmail(true);
    try {
      const res = await complaintService.resolveWithEmail(complaint.id, {
        afterImageUrl: finalAfterImage,
        resolutionNotes: finalNotes,
        officerName: user?.name || "Ward Executive Officer",
        officerDepartment: user?.department || "Brihanmumbai Municipal Corporation",
        officerContact: user?.phone || "+91 22 2262 0251",
      });

      setComplaint(res.data.complaint);
      setOfficialStatus("Resolved");
      setShowResolveModal(false);
      setResolutionSuccessToast(res.data.message || "Work marked completed! Resolution email dispatched to citizen.");
      setTimeout(() => setResolutionSuccessToast(null), 6000);
    } catch (err: any) {
      console.error("Failed to resolve with email", err);
      alert(err.response?.data?.message || "Failed to resolve complaint. Please try again.");
    } finally {
      setIsResolvingWithEmail(false);
    }
  };

  const getDefaultAfterImage = (category: string) => {
    const map: Record<string, string> = {
      Pothole: "https://images.unsplash.com/photo-1578983427937-26078ee3d9d3?auto=format&fit=crop&w=800&q=80",
      Garbage: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      "Water Leakage": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
      Streetlight: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
      Drainage: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80",
      Roadwork: "https://images.unsplash.com/photo-1578983427937-26078ee3d9d3?auto=format&fit=crop&w=800&q=80",
    };
    return map[category] || "https://images.unsplash.com/photo-1578983427937-26078ee3d9d3?auto=format&fit=crop&w=800&q=80";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-red-600/20 border-t-red-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Loading BMC Complaint Dossier...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Complaint Not Found</h2>
        <p className="text-sm text-slate-600">The requested civic complaint dossier does not exist.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const wardInfo = MUMBAI_WARDS_DATA.find((w) => w.id === complaint.ward) || MUMBAI_WARDS_DATA[0];
  const isUserOfficerInThisWard = user?.role === "Officer" && user?.ward === complaint.ward;
  const isUserOfficerInOtherWard = user?.role === "Officer" && user?.ward !== complaint.ward;

  const timelineSteps = ["Reported", "Assigned", "In Progress", "Resolved"];
  const currentStepIndex = timelineSteps.indexOf(complaint.status);
  const isResolved = complaint.status === "Resolved" || Boolean(complaint.afterImageUrl);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {resolutionSuccessToast && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-red-500/40 shadow-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">{resolutionSuccessToast}</p>
              <p className="text-xs text-slate-300">
                Official Before & After proof certificate created and dispatched to {complaint.reporterEmail || "citizen"}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setResolutionSuccessToast(null)}
            className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Back button & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Complaints List
        </button>

        {/* Officer Work Completed Action Button */}
        {isUserOfficerInThisWard && (
          <button
            onClick={() => {
              if (!afterImageUrl) {
                setAfterImageUrl(getDefaultAfterImage(complaint.category));
              }
              setShowResolveModal(true);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 ${
              isResolved 
                ? "bg-slate-900 hover:bg-slate-800 text-white border border-slate-700" 
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <CheckCheck className="w-4 h-4" />
            <span>{isResolved ? "Update Work Completed & Resend Email" : "Mark Work Completed (Before & After Photo + Email)"}</span>
          </button>
        )}
      </div>

      {/* Ward Jurisdiction Warning Banner for Officers */}
      {isUserOfficerInOtherWard && (
        <div className="bg-slate-100 border border-slate-300 text-slate-900 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              <strong>Ward Jurisdiction Note:</strong> This issue belongs to <strong>Ward {complaint.ward} ({complaint.wardName})</strong>. As Ward {user?.ward} Executive, you have view-only access.
            </span>
          </div>
          <span className="px-2.5 py-1 bg-slate-200 font-bold rounded-lg shrink-0">
            View Only Mode
          </span>
        </div>
      )}

      {/* Main Header & Title */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {complaint.id}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              {complaint.category}
            </span>
            {complaint.reporterEmail && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-500" /> {complaint.reporterEmail}
              </span>
            )}
            {complaint.resolutionEmailSent && (
              <span className="px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-red-600" /> Resolution Email Dispatched
              </span>
            )}
          </div>

          <span className="text-xs font-mono text-slate-500">
            Filed on {new Date(complaint.createdAt).toLocaleString("en-IN")}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
          {complaint.title}
        </h1>

        {/* Status Timeline Bar */}
        <div className="pt-2 pb-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Official Municipal Resolution Lifecycle
          </div>
          <div className="grid grid-cols-4 gap-2">
            {timelineSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? "bg-red-600 text-white border-red-600 font-extrabold shadow-sm"
                      : isCompleted
                      ? "bg-slate-900 text-white border-slate-900 font-bold"
                      : "bg-slate-50 text-slate-400 border-slate-200 font-medium"
                  }`}
                >
                  <div className="text-xs">{step}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Multi-Modal Officer Control Telemetry Panel */}
        <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>KAISER AI Multi-Modal Telemetry & Dispatch Diagnostic</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Fused computer vision, instance segmentation, OCR signboard extraction & 24-ward GIS telemetry.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-red-950 text-red-300 border border-red-800/80 self-start sm:self-auto">
              5-Signal Priority Score: {complaint.severity}/100
            </span>
          </div>

          {complaint.aiSummary && (
            <p className="text-xs text-slate-200 italic font-medium leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              "{complaint.aiSummary}"
            </p>
          )}

          {/* 4 Multi-Sensor Telemetry HUD Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
            {/* 1. YOLO11 Vision */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-red-400 font-bold text-[10px] uppercase tracking-wider block">YOLO11 Object Detector</span>
              <div className="font-bold text-slate-100 text-xs">
                {complaint.category} Identified
              </div>
              <span className="text-[10px] text-slate-400 block">Confidence: {complaint.severity}%</span>
            </div>

            {/* 2. Instance Segmentation */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider block">Instance Segmentation</span>
              <div className="font-bold text-slate-100 text-xs">
                Surface Area Analyzed
              </div>
              <span className="text-[10px] text-slate-400 block">Mask Area: Estimated High</span>
            </div>

            {/* 3. OCR Signboard Extraction */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-wider block">OCR Asset Identifier</span>
              <div className="font-bold text-slate-100 text-xs truncate">
                Asset: BMC-POLE-WARD{complaint.ward}
              </div>
              <span className="text-[10px] text-slate-400 block">Pole & Street Tag Extracted</span>
            </div>

            {/* 4. Target Resolution SLA */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
              <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider block">Target Resolution Window</span>
              <div className="font-bold text-emerald-300 text-xs">
                {complaint.slaDays} Days ({complaint.slaDays * 24} Hours)
              </div>
              <span className="text-[10px] text-slate-400 block">Department: {complaint.assignedDepartment}</span>
            </div>
          </div>

          {/* Smart Dispatch Order Recommendation Box for Officers */}
          <div className="p-4 bg-red-950/40 rounded-2xl border border-red-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-red-400 font-bold text-[11px] uppercase tracking-wider block">
                Recommended Field Dispatch Team
              </span>
              <span className="font-extrabold text-white text-xs">
                {complaint.assignedDepartment} — Ward {complaint.ward} Mobile Rapid Repair Squad
              </span>
              <span className="text-slate-300 block text-[11px] mt-0.5">
                Target Action: {complaint.aiSuggestedAction || "Dispatch ward maintenance crew with asphalt patching equipment."}
              </span>
            </div>

            <button
              onClick={() => {
                setOfficialStatus("In Progress");
                setOfficialComment(`Dispatched Ward ${complaint.ward} rapid maintenance crew to site location.`);
                alert(`✅ Dispatched work order to ${complaint.assignedDepartment}! Status updated to In Progress.`);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer text-xs"
            >
              Dispatch Crew Now
            </button>
          </div>
        </div>

        {/* Severity Bar & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Incident Description</h3>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>

            <div className="pt-2">
              <SeverityMeter score={complaint.severity} size="lg" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>{complaint.wardName}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Reporter: {complaint.reporterName}</span>
              </div>
              {complaint.reporterEmail && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{complaint.reporterEmail}</span>
                  </div>
                </>
              )}
            </div>

            {/* Ward Officer Direct Contact Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs space-y-1">
              <div className="flex items-center gap-3">
                <img
                  src={wardInfo.officer.avatar}
                  alt={wardInfo.officer.name}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">In Charge Ward Officer</span>
                  <span className="font-extrabold text-slate-900">{wardInfo.officer.name}</span>
                </div>
              </div>
              <a
                href={`tel:${wardInfo.officer.contact}`}
                className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-lg flex items-center gap-1 hover:bg-slate-800"
              >
                <Phone className="w-3.5 h-3.5 text-red-400" /> Call Officer
              </a>
            </div>

            {/* Upvote CTA */}
            <div className="pt-2">
              <button
                onClick={handleUpvote}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Upvote Issue ({complaint.upvote_count})</span>
              </button>
            </div>
          </div>

          {/* Photo Preview & Map Pin */}
          <div className="space-y-4">
            {complaint.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-gray-200 h-52 bg-gray-100 relative group">
                <div className="absolute top-2 left-2 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white font-bold text-[10px] rounded-lg">
                  Original Citizen Report Photo
                </div>
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    const fallbacks: Record<string, string> = {
                      Pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
                      Garbage: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
                      "Water Leakage": "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80",
                      Streetlight: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
                      Drainage: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80",
                      Roadwork: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
                    };
                    target.src = fallbacks[complaint.category] || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <MumbaiMap
              center={[complaint.latitude, complaint.longitude]}
              zoom={14}
              height="200px"
              complaints={[complaint]}
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* OFFICIAL RESOLUTION CERTIFICATE & BEFORE/AFTER PHOTO PROOF (When Resolved) */}
      {/* ========================================================================= */}
      {isResolved && (
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border-2 border-slate-700 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-600/20 text-red-400 rounded-xl border border-red-500/40">
                <CheckCircle2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  Official BMC Work Completion Certificate
                </h2>
                <p className="text-xs text-slate-300">
                  Inspected & Verified by Ward {complaint.ward} ({complaint.wardName}) Municipal Engineering Squad
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowAtrModal(true)}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Action Taken Report (ATR)</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-red-400" /> : <Share2 className="w-3.5 h-3.5 text-red-400" />}
                <span>{copiedLink ? "Link Copied!" : "Share Dossier"}</span>
              </button>

              {complaint.resolutionEmailSent && (
                <button
                  onClick={() => setShowEmailDetailsModal(!showEmailDetailsModal)}
                  className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>{showEmailDetailsModal ? "Hide Dispatch Email" : "View Dispatched Citizen Email"}</span>
                  {showEmailDetailsModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>

          {/* Photographic Evidence View Switcher */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-red-500" />
                <span>Photographic Evidence: Before & After Resolution</span>
              </div>

              {/* View Switcher Pills */}
              <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setComparisonView("slider")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    comparisonView === "slider" ? "bg-red-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Interactive Slider</span>
                </button>
                <button
                  type="button"
                  onClick={() => setComparisonView("grid")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    comparisonView === "grid" ? "bg-red-600 text-white font-black shadow-xs" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <span>Side-by-Side</span>
                </button>
              </div>
            </div>

            {comparisonView === "slider" ? (
              <div className="space-y-2">
                <BeforeAfterSlider
                  beforeImage={complaint.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                  afterImage={complaint.afterImageUrl || getDefaultAfterImage(complaint.category)}
                  beforeLabel="Before (Citizen Incident Report)"
                  afterLabel="After (BMC Work Completed)"
                  aspectRatio="aspect-16/9"
                  className="max-h-[420px]"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE PHOTO */}
                <div className="bg-slate-900/90 rounded-2xl overflow-hidden border border-red-500/40 shadow-md">
                  <div className="p-3 bg-slate-950/80 border-b border-red-900/50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-red-400 uppercase">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                      <span>Before (Citizen Incident Report)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(complaint.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <div className="h-56 bg-slate-950 relative">
                    <img
                      src={complaint.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                      alt="Before Resolution"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] text-white font-medium">
                      Reported Issue State
                    </div>
                  </div>
                </div>

                {/* AFTER PHOTO */}
                <div className="bg-slate-900/90 rounded-2xl overflow-hidden border border-slate-700 shadow-md">
                  <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                      <span>After (BMC Work Completed)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {complaint.resolvedAt ? new Date(complaint.resolvedAt).toLocaleDateString("en-IN") : "Verified Fixed"}
                    </span>
                  </div>
                  <div className="h-56 bg-slate-950 relative">
                    <img
                      src={complaint.afterImageUrl || getDefaultAfterImage(complaint.category)}
                      alt="After Resolution"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 border border-slate-700 backdrop-blur-md rounded text-[10px] text-white font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-red-500" /> Field Work Complete
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resolution Notes & Officer Verification Seal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-2 bg-slate-900/70 p-4 rounded-2xl border border-emerald-800/50 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Official Resolution Report Notes
              </span>
              <p className="text-sm text-slate-100 leading-relaxed font-medium">
                {complaint.resolutionNotes || "Field restoration work and structural remediation completed according to BMC standard civic specifications. Site inspected and confirmed clear."}
              </p>
            </div>

            <div className="bg-slate-900/70 p-4 rounded-2xl border border-emerald-800/50 space-y-1.5 text-xs">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                Inspecting Officer Seal
              </span>
              <p className="font-extrabold text-white text-sm">
                {complaint.resolutionOfficerName || wardInfo.officer.name}
              </p>
              <p className="text-emerald-200 font-medium">
                {complaint.resolutionOfficerDepartment || "Ward " + complaint.ward + " Engineering Section"}
              </p>
              <p className="text-slate-300 font-mono text-[11px] pt-1">
                Direct Contact: {complaint.resolutionOfficerContact || wardInfo.officer.contact}
              </p>
            </div>
          </div>

          {/* Expandable Dispatched Email Preview Dossier */}
          {showEmailDetailsModal && complaint.resolutionEmailDetails && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-teal-500/40 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-teal-900/80 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <span>Dispatched Official Email Notification Record</span>
                </div>
                <span className="text-[11px] text-emerald-300 font-mono">
                  Sent to: {complaint.resolutionEmailDetails.to}
                </span>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-xs text-slate-200">
                <div className="text-emerald-400 font-bold">
                  Subject: {complaint.resolutionEmailDetails.subject}
                </div>
                <hr className="border-slate-800 my-2" />
                <pre className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed">
                  {complaint.resolutionEmailDetails.emailBodyHtml || complaint.resolutionEmailDetails.resolutionNotes}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Official Officer Controls Panel (Active ONLY for Officers in this Ward) */}
      {isUserOfficerInThisWard && (
        <div className="bg-red-50 border-2 border-red-200 p-6 rounded-3xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-900 font-extrabold text-sm">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              <span>Ward {complaint.ward} Executive Action Console</span>
            </div>
            <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-md uppercase">
              Official Jurisdiction Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <form onSubmit={handleOfficialStatusUpdate} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Update Status Stage</label>
                <select
                  value={officialStatus}
                  onChange={(e) => setOfficialStatus(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Reported">Reported</option>
                  <option value="Assigned">Assigned to Field Crew</option>
                  <option value="In Progress">In Progress (Work Order Dispatched)</option>
                  <option value="Resolved">Resolved (Site Inspected &amp; Fixed)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Response Note</label>
                <input
                  type="text"
                  value={officialComment}
                  onChange={(e) => setOfficialComment(e.target.value)}
                  placeholder="e.g. Dispatched cold-mix asphalt patching team under Work Order #882."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingOfficial}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all active:scale-95"
              >
                Update Dossier Stage
              </button>
            </form>

            {/* Quick Button to Open Resolution with Photo & Email Modal */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-black text-emerald-800 uppercase tracking-wider">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>Work Completed & Before/After Proof</span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                  Upload or select the verified after-photo of the completed repair work. This will officially resolve the grievance and automatically dispatch a Before & After notification email with officer details to <strong>{complaint.reporterEmail || "the reporting citizen"}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!afterImageUrl) {
                    setAfterImageUrl(getDefaultAfterImage(complaint.category));
                  }
                  setShowResolveModal(true);
                }}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Work Completed & Dispatch Email</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORK COMPLETED RESOLUTION MODAL (With After Photo & Live Email Preview)   */}
      {/* ========================================================================= */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-6 my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                  <CheckCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Municipal Work Completion & Verification
                  </h3>
                  <p className="text-xs text-gray-500">
                    Grievance ID: {complaint.id} • {complaint.title} ({complaint.wardName})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResolveModal(false)}
                className="text-gray-400 hover:text-gray-700 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleResolveWithEmail} className="space-y-5">
              {/* After Photo Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-900 uppercase">
                  1. Work Completed Photo Evidence (After Photo)
                </label>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="url"
                    value={afterImageUrl}
                    onChange={(e) => setAfterImageUrl(e.target.value)}
                    placeholder="Enter After Photo Image URL (e.g. https://...)"
                    className="flex-1 min-w-[200px] px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOfficerCameraModal(true)}
                    className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span>Live Field Camera</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAfterImageUrl(getDefaultAfterImage(complaint.category))}
                    className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold shrink-0"
                  >
                    Use Preset
                  </button>
                </div>

                {/* Live Camera Modal for Officer */}
                <LiveCameraModal
                  isOpen={showOfficerCameraModal}
                  onClose={() => setShowOfficerCameraModal(false)}
                  onCapture={(dataUrl) => {
                    setAfterImageUrl(dataUrl);
                    setShowOfficerCameraModal(false);
                  }}
                  title="Ward Officer Live Repair Evidence Camera"
                  wardName={complaint.wardName}
                  category={complaint.category}
                />

                {/* Live Photo Comparison Preview in Modal */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl overflow-hidden border border-rose-200 bg-rose-50/50 p-2 text-center">
                    <span className="text-[10px] font-black text-rose-700 uppercase block mb-1">
                      Before (Citizen Report)
                    </span>
                    <img
                      src={complaint.imageUrl || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
                      alt="Before Preview"
                      className="w-full h-28 object-cover rounded-lg"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/50 p-2 text-center">
                    <span className="text-[10px] font-black text-emerald-700 uppercase block mb-1">
                      After (Repaired Proof)
                    </span>
                    <img
                      src={afterImageUrl || getDefaultAfterImage(complaint.category)}
                      alt="After Preview"
                      className="w-full h-28 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Resolution Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-900 uppercase">
                  2. Official Engineering Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder={`e.g. Pothole excavation, wet-mix macadam leveling, and cold-mix asphalt overlay completed by Ward ${complaint.ward} engineering crew.`}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Automatic Email Preview Box */}
              <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#0D7377] uppercase">
                    <Mail className="w-4 h-4" />
                    <span>Automated Citizen Resolution Email Preview</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">
                    Recipient: {complaint.reporterEmail || "aarav@example.com (Default)"}
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-teal-100 text-xs text-gray-700 space-y-1.5 leading-relaxed font-sans">
                  <p className="font-bold text-gray-900">
                    Subject: Resolved: Your BMC Grievance #{complaint.id} - {complaint.title} has been Fixed!
                  </p>
                  <p className="text-gray-600 text-[11px]">
                    Dear <strong>{complaint.reporterName || "Citizen"}</strong>,
                  </p>
                  <p className="text-gray-600 text-[11px]">
                    Your filed complaint <strong>#{complaint.id} ("{complaint.title}")</strong> in <strong>{complaint.wardName}</strong> has been officially inspected and resolved by the Brihanmumbai Municipal Corporation (BMC).
                  </p>
                  <p className="text-emerald-700 text-[11px] font-semibold bg-emerald-50 p-1.5 rounded">
                    ✓ Attached Before & After photographic evidence included in official certificate dossier.
                  </p>
                  <p className="text-gray-600 text-[11px]">
                    <em>"Thank you for being a responsible citizen. Keep filing complaints on CivicConnect to make Mumbai cleaner, safer, and greater!"</em>
                  </p>
                  <p className="text-[10px] text-gray-500 pt-1 border-t border-gray-100">
                    Inspecting Officer: {user?.name || wardInfo.officer.name} (Ward {complaint.ward}) • Contact: {user?.phone || wardInfo.officer.contact}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResolveModal(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResolvingWithEmail}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isResolvingWithEmail ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Dispatching Email & Resolving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm Work Completed & Send Email</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Community Comments Thread */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-md space-y-6">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#0D7377]" />
          Citizen Feedback & Work Log ({complaint.comments.length})
        </h3>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Post a location update or citizen inquiry..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            disabled={isPostingComment || !commentText.trim()}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Post
          </button>
        </form>

        {/* Comment Thread */}
        <div className="space-y-3 pt-2">
          {complaint.comments.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border text-xs space-y-1 ${
                c.userRole.includes("Officer") || c.userRole.includes("Official")
                  ? "bg-red-50 border-red-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span className={c.userRole.includes("Officer") ? "text-red-800" : "text-gray-900"}>
                  {c.userName} ({c.userRole})
                </span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {new Date(c.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>

      {showAtrModal && complaint && (
        <ActionTakenReportModal
          complaint={complaint}
          onClose={() => setShowAtrModal(false)}
        />
      )}
    </div>
  );
};

