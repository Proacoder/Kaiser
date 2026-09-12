import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { complaintService } from "../services/api";
import { MumbaiMap } from "../components/MumbaiMap";
import { SeverityMeter } from "../components/SeverityMeter";
import { ImageUploader } from "../components/ImageUploader";
import { VoiceGrievanceDictation } from "../components/VoiceGrievanceDictation";
import { MUMBAI_WARDS_DATA } from "../data/mumbaiWardsData";
import { AIAnalysisResult, AIVerifyImageResult, UnifiedAIAnalysisResponse } from "../types";
import { 
  MapPin, Sparkles, Loader2, CheckCircle2, ArrowLeft, Cpu, ShieldAlert, Mail, Eye, AlertTriangle, ThumbsUp, Building, Hash, Navigation, Tag
} from "lucide-react";

export const ReportPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const queryWard = searchParams.get("ward");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reporterEmail, setReporterEmail] = useState(user?.email || "citizen@civic.com");
  const [category, setCategory] = useState<string>("Pothole");
  const [ward, setWard] = useState<number>(queryWard ? Number(queryWard) : user?.ward || 11);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Image verification state
  const [imageVerification, setImageVerification] = useState<AIVerifyImageResult | null>(null);

  // GPS coordinates state
  const selectedWardObj = MUMBAI_WARDS_DATA.find((w) => w.id === ward) || MUMBAI_WARDS_DATA[0];
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: selectedWardObj.lat,
    lng: selectedWardObj.lng,
  });

  useEffect(() => {
    const foundWard = MUMBAI_WARDS_DATA.find((w) => w.id === ward);
    if (foundWard) {
      setLocation({ lat: foundWard.lat, lng: foundWard.lng });
    }
  }, [ward]);

  // AI Triage & Unified Analysis state
  const [unifiedAiResult, setUnifiedAiResult] = useState<UnifiedAIAnalysisResponse | null>(null);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Trigger Unified Multi-Modal AI Engine (YOLO11 + Seg + OCR + 24-Ward GIS + Gemini + Triage + Duplicates)
  const handleAiAnalyze = async () => {
    if (!title.trim() && !description.trim() && !imageUrl) {
      setStatusMessage("Please attach a photo or enter issue title & description to run AI analysis.");
      return;
    }

    setIsAnalyzing(true);
    setStatusMessage(null);

    try {
      // Fetch existing complaints for duplicate detection engine
      let existingComplaintsData: any[] = [];
      try {
        const complaintsResp = await complaintService.getAll();
        existingComplaintsData = complaintsResp.data || [];
      } catch (e) {
        console.warn("Could not fetch existing complaints for duplicate check", e);
      }

      const res = await complaintService.analyzeUnified({
        image: imageUrl || undefined,
        latitude: location.lat,
        longitude: location.lng,
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        category: category,
      });

      const unifiedData = res.data;
      setUnifiedAiResult(unifiedData);

      // Populate Legacy AI result fields for submit payload compatibility
      if (unifiedData.triage || unifiedData.gemini) {
        const severityVal = unifiedData.triage?.severity_score ?? unifiedData.gemini?.severity_score ?? 65;
        const slaDaysVal = unifiedData.triage?.slaTargetDays ?? unifiedData.triage?.recommended_sla_days ?? 2;
        const deptVal = unifiedData.triage?.assignedDepartment ?? unifiedData.gemini?.recommended_department ?? "Roads & Traffic Department";

        setAiResult({
          severity: severityVal,
          urgency: (unifiedData.triage?.priorityLevel || "Medium") as any,
          assignedDepartment: deptVal,
          slaDays: slaDaysVal,
          aiSummary: unifiedData.gemini?.reason || "Civic report triaged by CivicConnect Multi-Modal AI.",
          aiSuggestedAction: `Dispatch ${deptVal} team to Ward ${ward} location.`,
          category: (unifiedData.gemini?.category || category) as any,
        });

        if (unifiedData.gemini?.category) {
          setCategory(unifiedData.gemini.category);
        }
      }

      // Auto-update Ward from GIS resolution engine
      if (unifiedData.gis?.ward_id) {
        setWard(unifiedData.gis.ward_id);
      }

      setStatusMessage("✨ Multi-Modal AI Analysis Complete: Object Vision, Segmentation, OCR, GIS & Priority calculated!");
    } catch (err) {
      console.error("Unified AI Analysis failed", err);
      // Fallback to legacy endpoint if unified fails
      try {
        const fallbackRes = await complaintService.analyzeWithAI({
          title,
          description,
          category,
          location: `Ward ${ward}, Mumbai`,
        });
        setAiResult(fallbackRes.data);
        setStatusMessage("AI Analysis complete via Gemini fallback.");
      } catch (legacyErr) {
        setStatusMessage("Could not connect to AI Engine. Using local fallback triage.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Upvote existing duplicate ticket directly
  const handleUpvoteDuplicate = async (duplicateId: string) => {
    try {
      await complaintService.upvote(duplicateId, user?.id || "anonymous-citizen");
      setStatusMessage(`✅ Upvoted existing ticket #${duplicateId}! Thank you for preventing duplicate tickets.`);
      setTimeout(() => {
        navigate(`/complaint/${duplicateId}`);
      }, 1200);
    } catch (err) {
      console.error("Failed to upvote duplicate", err);
      setStatusMessage("Could not upvote duplicate ticket. Please try again.");
    }
  };

  // Get GPS current position
  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      setStatusMessage("Geolocation is not supported by your browser.");
      return;
    }

    setStatusMessage("Acquiring GPS coordinates...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(6));
        const newLng = Number(pos.coords.longitude.toFixed(6));
        setLocation({ lat: newLat, lng: newLng });
        setStatusMessage("✓ Location captured via device GPS!");
        // Re-trigger GIS resolution if AI results active
        if (unifiedAiResult) {
          handleAiAnalyze();
        }
      },
      (err) => {
        console.warn("GPS error:", err);
        setStatusMessage("Could not retrieve GPS automatically. Click your location on the map below.");
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStatusMessage("Title and description are required.");
      return;
    }

    if (!imageUrl) {
      setStatusMessage("Please attach a camera photo of the civic issue before submitting.");
      return;
    }

    // AI Image Fraud Guard
    if (imageVerification && !imageVerification.isValidCivicIssue) {
      setStatusMessage(
        `🚨 SUBMISSION REJECTED BY AI FRAUD SHIELD: ${
          imageVerification.isAIGenerated
            ? "Synthetic / AI-Generated image detected! Only authentic camera photographs clicked on-site are allowed."
            : imageVerification.rejectionReason || `Attached photo was flagged as "${imageVerification.detectedObject}". Please attach a genuine camera photo of the civic issue.`
        }`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const newComplaint = await complaintService.create({
        title: title.trim(),
        description: description.trim(),
        category: category as any,
        ward,
        latitude: location.lat,
        longitude: location.lng,
        imageUrl,
        isImageRejected: imageVerification?.isValidCivicIssue === false,
        rejectionReason: imageVerification?.rejectionReason,
        severity: aiResult?.severity || unifiedAiResult?.triage?.severity_score || 65,
        urgency: aiResult?.urgency || (unifiedAiResult?.triage?.priorityLevel as any) || "Medium",
        assignedDepartment: aiResult?.assignedDepartment || unifiedAiResult?.triage?.assignedDepartment || "Roads & Traffic Department",
        slaDays: aiResult?.slaDays || unifiedAiResult?.triage?.slaTargetDays || 2,
        aiSummary: aiResult?.aiSummary || unifiedAiResult?.gemini?.reason || "Citizen issue logged and triaged by CivicConnect AI.",
        aiSuggestedAction: aiResult?.aiSuggestedAction || "Dispatch ward maintenance crew for inspection.",
        reporterName: user?.name || "Local Resident",
        reporterEmail: reporterEmail.trim(),
      });

      navigate(`/complaint/${newComplaint.data.id}`);
    } catch (err: any) {
      console.error("Failed to submit report", err);
      const errMsg = err?.response?.data?.message || "Failed to submit report. Please check photo evidence & try again.";
      setStatusMessage(`🚨 ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasDuplicateCandidates = unifiedAiResult?.duplicates && unifiedAiResult.duplicates.length > 0;

  return (
    <div className="report-page max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-[#f6f3f1] font-mono text-[#242424]">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#797776] hover:text-[#242424] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 text-[#2b59d1]" /> Back to Dashboard
      </button>

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#cfdaf5] text-[#242424] text-[10px] font-mono uppercase tracking-wider border border-[#cecac8] mb-2">
          Municipal Grievance Filing
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#242424]">
          File Civic Grievance & Dispatch Request
        </h1>
        <p className="text-xs sm:text-sm text-[#4e4d4d] mt-1 font-mono">
          Submit camera photo evidence with GPS coordinates for automated YOLO11 + Segmentation + OCR AI triage and direct ward engineer dispatch.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-full bg-[#cfdaf5] border border-[#cecac8] text-[#242424] text-xs font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2b59d1] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Duplicate Alert Banner */}
      {hasDuplicateCandidates && (
        <div className="p-6 rounded-[40px] bg-[#f6f3f1] border-2 border-[#2b59d1] text-[#242424] space-y-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#2b59d1] shrink-0" />
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#2b59d1]">
              Potential Duplicate Issue Detected nearby ({unifiedAiResult!.duplicates.length} match)
            </h3>
          </div>

          <p className="text-xs font-mono text-[#4e4d4d] leading-relaxed">
            Our AI Duplicate Engine detected an existing reported issue in close proximity to your location. Consider upvoting the existing issue to raise its priority score!
          </p>

          <div className="space-y-3 pt-1">
            {unifiedAiResult!.duplicates.map((dup) => (
              <div key={dup.complaintId} className="p-4 bg-white rounded-[24px] border border-[#cecac8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <div className="font-serif font-normal text-[#242424] text-base flex items-center gap-2">
                    <span>{dup.title || `Incident #${dup.complaintId}`}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#f6f3f1] text-[#242424] uppercase border border-[#cecac8]">
                      {dup.status}
                    </span>
                  </div>
                  <div className="text-[#797776] text-[11px] mt-1 flex items-center gap-3">
                    <span>Distance: {dup.distanceMeters}m away</span>
                    <span>Confidence: {Math.round((dup.compositeSimilarity || 0.7) * 100)}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(`/complaint/${dup.complaintId}`)}
                    className="px-4 py-2 bg-[#f6f3f1] hover:bg-[#cfdaf5] text-[#242424] font-mono uppercase tracking-wider rounded-full transition-all text-xs flex items-center gap-1 cursor-pointer border border-[#cecac8]"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#2b59d1]" /> View Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpvoteDuplicate(dup.complaintId)}
                    className="px-4 py-2 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono uppercase tracking-wider rounded-full transition-all text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-white" /> Upvote (+1)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Container — Monad 40px Card Surface */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-[#f6f3f1] p-8 sm:p-10 rounded-[40px] border border-[#cecac8] space-y-6">
          {/* Photo Attachment */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#242424] uppercase tracking-wider mb-2">
              1. Attach Camera Photo Evidence *
            </label>
            <ImageUploader 
              value={imageUrl} 
              category={category}
              onChange={(newUrl) => {
                setImageUrl(newUrl);
                if (statusMessage?.includes("SUBMISSION REJECTED")) {
                  setStatusMessage(null);
                }
              }} 
              onImageVerified={(res) => {
                setImageVerification(res);
                if (res.suggestedCategory && res.suggestedCategory !== category) {
                  setCategory(res.suggestedCategory);
                }
                if (!res.isValidCivicIssue) {
                  setStatusMessage(
                    `🚨 AI FRAUD ALERT: Uploaded photo identified as "${res.detectedObject}", not a municipal ${category} hazard.`
                  );
                } else {
                  const catName = res.suggestedCategory || category;
                  setStatusMessage(`✅ AI Vision Verified: ${res.detectedObject} (${catName})`);
                  if (!title.trim() || title === "Pothole" || title.includes("Civic Issue")) {
                    setTitle(`${res.detectedObject}`);
                  }
                  // Auto-trigger unified AI analysis when image verified
                  handleAiAnalyze();
                }
              }}
              onLocationDetected={(info) => {
                setWard(info.ward.id);
                setLocation({ lat: info.lat, lng: info.lng });
                setStatusMessage(
                  `📸 Location Mapped: Ward ${info.ward.code} (${info.ward.name}) - Officer: ${info.ward.officer.name}`
                );
              }}
            />
          </div>

          {/* Issue Title */}
          <div>
            <label className="block text-xs font-mono font-medium text-[#242424] uppercase tracking-wider mb-2">
              2. Incident Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Hazardous Deep Pothole on SV Road near Bandra Station"
              required
              className="w-full px-4 py-3 bg-white border border-[#cecac8] rounded-full text-xs font-mono text-[#242424] focus:outline-none focus:border-[#2b59d1]"
            />
          </div>

          {/* Issue Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono font-medium text-[#242424] uppercase tracking-wider">
                3. Problem Description *
              </label>
              <span className="text-[10px] font-mono text-[#797776] uppercase">Type or speak details</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide exact details about the hazard, size, traffic blockage, or public impact..."
              required
              className="w-full px-4 py-3 bg-white border border-[#cecac8] rounded-[24px] text-xs font-mono text-[#242424] focus:outline-none focus:border-[#2b59d1]"
            />

            {/* AI Voice & Audio Dictation Widget */}
            <div className="pt-2">
              <VoiceGrievanceDictation
                onTranscriptComplete={(voiceText) => {
                  setDescription((prev) => (prev ? `${prev} ${voiceText}` : voiceText));
                  if (!title) {
                    setTitle(voiceText.slice(0, 60));
                  }
                }}
              />
            </div>
          </div>

          {/* Citizen Email */}
          <div className="p-6 bg-[#cfdaf5] border border-[#cecac8] rounded-[40px] space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#2b59d1]" />
              <label className="text-xs font-mono font-medium text-[#242424] uppercase tracking-wider">
                4. Email for Before & After Photo Proof Notifications *
              </label>
            </div>
            <input
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              placeholder="citizen@example.com"
              required
              className="w-full px-4 py-3 bg-white border border-[#cecac8] rounded-full text-xs font-mono text-[#242424] focus:outline-none focus:border-[#2b59d1]"
            />
            <p className="text-[11px] font-mono text-[#4e4d4d] leading-relaxed">
              🔔 You will receive an official notification with <strong>Before & After photo proof</strong> as soon as the Ward Officer completes and closes this ticket.
            </p>
          </div>

          {/* AI Multi-Modal Telemetry HUD Card — Monad Periwinkle Mist Surface */}
          <div className="bg-[#cfdaf5] text-[#242424] p-6 sm:p-8 rounded-[40px] border border-[#cecac8] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-medium text-[#2b59d1] uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Multi-Modal AI Intelligence HUD (YOLO11 + Seg + OCR + GIS)</span>
                </div>
                <p className="text-xs font-mono text-[#4e4d4d] mt-1">
                  Real-time multi-sensor telemetry analyzing computer vision objects, surface area, signboards & 24-ward GIS.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAiAnalyze}
                disabled={isAnalyzing}
                className="px-5 py-2.5 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono text-xs uppercase tracking-wider rounded-full transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Executing AI Pipeline...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Multi-Modal AI Diagnostics</span>
                  </>
                )}
              </button>
            </div>

            {/* AI HUD Output Details */}
            {unifiedAiResult && (
              <div className="pt-4 border-t border-[#cecac8] space-y-4 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 1. YOLO11 Vision Card */}
                  <div className="p-4 bg-white rounded-[24px] border border-[#cecac8] space-y-2">
                    <div className="flex items-center gap-1.5 text-[#2b59d1] font-mono text-[10px] uppercase tracking-wider">
                      <Eye className="w-3.5 h-3.5" />
                      <span>YOLO11 Objects</span>
                    </div>
                    <div className="text-[#242424] font-serif font-normal text-lg">
                      {unifiedAiResult.yolo?.object_count || 0} Detections
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {unifiedAiResult.yolo?.detections?.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f6f3f1] border border-[#cecac8] text-[#242424]">
                          {d.class_name} ({Math.round(d.confidence * 100)}%)
                        </span>
                      )) || <span className="text-[#797776] italic">No objects detected</span>}
                    </div>
                  </div>

                  {/* 2. Segmentation Mask Card */}
                  <div className="p-4 bg-white rounded-[24px] border border-[#cecac8] space-y-2">
                    <div className="flex items-center gap-1.5 text-[#2b59d1] font-mono text-[10px] uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Instance Seg Area</span>
                    </div>
                    <div className="text-[#242424] font-serif font-normal text-lg">
                      {unifiedAiResult.segmentation?.total_mask_area_px ? `${unifiedAiResult.segmentation.total_mask_area_px} px²` : "0 px²"}
                    </div>
                    <div className="text-[10px] text-[#797776] uppercase">
                      {unifiedAiResult.segmentation?.masks?.length || 0} Polygon Masks
                    </div>
                  </div>

                  {/* 3. OCR Text & Asset ID Card */}
                  <div className="p-4 bg-white rounded-[24px] border border-[#cecac8] space-y-2">
                    <div className="flex items-center gap-1.5 text-[#2b59d1] font-mono text-[10px] uppercase tracking-wider">
                      <Hash className="w-3.5 h-3.5" />
                      <span>OCR Signboard Text</span>
                    </div>
                    <div className="text-[#242424] font-mono text-xs truncate">
                      {unifiedAiResult.ocr?.raw_text || "No signboard text"}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {unifiedAiResult.ocr?.asset_ids?.map((id, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#f6f3f1] border border-[#cecac8] text-[#242424]">
                          Asset: {id}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* GIS & Triage Summary Banner */}
                <div className="p-4 bg-white rounded-[24px] border border-[#cecac8] grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[#797776] text-[10px] font-mono uppercase tracking-wider block">Auto-Resolved GIS Ward</span>
                    <div className="font-mono text-[#242424] text-xs flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#2b59d1]" />
                      <span>{unifiedAiResult.gis?.ward_name || `Ward ${ward}`}</span>
                    </div>
                    <div className="text-[11px] text-[#4e4d4d] font-mono">
                      Officer: <strong>{unifiedAiResult.gis?.officer_name}</strong> ({unifiedAiResult.gis?.contact})
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[#797776] text-[10px] font-mono uppercase tracking-wider block">AI Priority Score & Target SLA</span>
                    <div className="flex items-center gap-3">
                      <SeverityMeter score={unifiedAiResult.triage?.priorityScore || unifiedAiResult.gemini?.severity_score || 65} size="md" />
                      <div className="text-xs text-[#242424] font-mono">
                        Target SLA: <strong>{unifiedAiResult.triage?.slaTargetDays || 2} Days</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Category & Ward */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-[#242424] uppercase tracking-wider mb-2">
                5. Problem Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#cecac8] rounded-full text-xs font-mono text-[#242424] focus:outline-none focus:border-[#2b59d1]"
              >
                <option value="Pothole">Potholes & Asphalt Failure</option>
                <option value="Garbage">Garbage & Waste Accumulation</option>
                <option value="Water Leakage">Potable Water Pipe Leakage</option>
                <option value="Drainage">Drainage & Storm Water Overflow</option>
                <option value="Streetlight">Streetlight & Cable Failure</option>
                <option value="Roadwork">Unfinished Digging / Roadwork</option>
                <option value="Other">Other Municipal Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-[#242424] uppercase tracking-wider mb-2">
                6. Mumbai Ward Jurisdiction *
              </label>
              <select
                value={ward}
                onChange={(e) => setWard(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border border-[#cecac8] rounded-full text-xs font-mono text-[#242424] focus:outline-none focus:border-[#2b59d1]"
              >
                {MUMBAI_WARDS_DATA.map((w) => (
                  <option key={w.id} value={w.id}>
                    Ward {w.code} - {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ward Officer Direct Assignment Preview */}
          <div className="bg-white p-5 rounded-[40px] border border-[#cecac8] flex items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-3">
              <img
                src={selectedWardObj.officer.avatar}
                alt={selectedWardObj.officer.name}
                className="w-11 h-11 rounded-full object-cover border border-[#cecac8]"
              />
              <div>
                <span className="text-[10px] text-[#2b59d1] font-mono uppercase tracking-wider block">
                  Assigned Assistant Commissioner
                </span>
                <span className="font-mono text-[#242424] font-medium">{selectedWardObj.officer.name}</span>
                <span className="text-[#797776] block text-[10px] uppercase">{selectedWardObj.officer.designation}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#797776] uppercase block">Control Helpline</span>
              <span className="font-mono text-[#242424]">{selectedWardObj.officer.contact}</span>
            </div>
          </div>

          {/* Location GPS Picker & Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-medium text-[#242424] uppercase tracking-wider">
                7. Geotag Location Pin *
              </label>
              <button
                type="button"
                onClick={handleGetGPS}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-[#2b59d1] hover:underline cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#2b59d1]" /> Acquire Device GPS
              </button>
            </div>

            <div className="text-[11px] text-[#797776] font-mono uppercase">
              Coordinates: Lat {location.lat.toFixed(4)}, Lng {location.lng.toFixed(4)}
            </div>

            <MumbaiMap
              center={[location.lat, location.lng]}
              zoom={13}
              height="260px"
              selectedLocation={location}
              onSelectLocation={(lat, lng) => setLocation({ lat, lng })}
            />
          </div>
        </div>

        {/* Submit Button — Monad Lake Blue Pill */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#2b59d1] hover:bg-[#2247ab] text-white font-mono font-medium text-xs uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Dispatching to Ward {selectedWardObj.code} Executive...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Submit Incident Ticket to Ward Officer</span>
              <span className="text-white">▸</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
