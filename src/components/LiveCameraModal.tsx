import React, { useState, useRef, useEffect } from "react";
import { 
  Camera, X, RefreshCw, Sparkles, MapPin, Clock, ShieldCheck, 
  FlipHorizontal, Zap, ZapOff, Check, AlertCircle, Eye, Sliders
} from "lucide-react";

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  title?: string;
  category?: string;
  wardName?: string;
}

export const LiveCameraModal: React.FC<LiveCameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = "Live Municipal Evidence Camera",
  category = "Civic Hazard",
  wardName,
}) => {
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleString("en-IN"));
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Live Clock Interval
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString("en-IN"));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // GPS Geolocation on mount
  useEffect(() => {
    if (!isOpen) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
        },
        (err) => console.warn("GPS unavailable in camera mode", err),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isOpen]);

  // Start / Stop Camera Stream
  useEffect(() => {
    if (isOpen) {
      setCapturedImage(null);
      startStream(facingMode);
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, facingMode]);

  const startStream = async (mode: "environment" | "user") => {
    setIsInitializing(true);
    setCameraError(null);
    stopStream();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err: any) {
      console.error("Camera access failed", err);
      // Try fallback with minimal constraints
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        streamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          await videoRef.current.play();
        }
        setIsInitializing(false);
      } catch (fallbackErr: any) {
        console.error("Fallback camera failed", fallbackErr);
        setCameraError(
          "Camera device not found or permission was denied. Please ensure your camera is enabled in browser settings."
        );
        setIsInitializing(false);
      }
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;

    // Trigger visual flash animation
    setIsFlashActive(true);
    setTimeout(() => setIsFlashActive(false), 200);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Watermark overlay banner (Official Municipal Telemetry)
    const padding = 20;
    const bannerHeight = 80;
    
    ctx.fillStyle = "rgba(11, 28, 36, 0.75)";
    ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("KAISER CIVICCONNECT • LIVE VERIFIED EVIDENCE", padding, canvas.height - 48);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16px monospace";
    const locText = gpsLocation ? `GPS: ${gpsLocation.lat}, ${gpsLocation.lng}` : (wardName ? `WARD: ${wardName}` : "MUMBAI JURISDICTION");
    ctx.fillText(`${currentTime} | ${locText} | ${category.toUpperCase()}`, padding, canvas.height - 20);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedImage(dataUrl);
    stopStream();
  };

  const handleConfirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startStream(facingMode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-950 w-full max-w-2xl rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/40">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white">{title}</h3>
              <p className="text-[10px] text-slate-400">
                {wardName ? `Ward: ${wardName}` : "BMC Real-Time Photogrammetry & AI Triage"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!capturedImage && (
              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                title="Flip Camera Front/Back"
              >
                <FlipHorizontal className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline text-[11px]">
                  {facingMode === "environment" ? "Back Cam" : "Front Cam"}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Viewport Area */}
        <div className="relative bg-black flex-1 min-h-[360px] sm:min-h-[440px] flex items-center justify-center overflow-hidden">
          {/* Visual Shutter Flash Effect */}
          {isFlashActive && (
            <div className="absolute inset-0 z-30 bg-white opacity-90 transition-opacity duration-200 pointer-events-none" />
          )}

          {/* Camera Error Display */}
          {cameraError && (
            <div className="p-6 text-center space-y-4 max-w-sm text-white">
              <div className="w-12 h-12 rounded-2xl bg-rose-950 border border-rose-600 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-rose-300">Camera Access Blocked</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{cameraError}</p>
              </div>
              <button
                type="button"
                onClick={() => startStream(facingMode)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {isInitializing && !cameraError && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-2 text-amber-400">
              <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-400 rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-300">Initializing High-Definition Camera Feed...</span>
            </div>
          )}

          {/* Live Video Element */}
          {!capturedImage && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover max-h-[500px] ${
                facingMode === "user" ? "scale-x-[-1]" : ""
              }`}
            />
          )}

          {/* Captured Snapshot Preview */}
          {capturedImage && (
            <div className="w-full h-full flex items-center justify-center relative bg-black">
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                className="w-full h-full object-contain max-h-[500px]"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold rounded-lg backdrop-blur-md flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Snapshot Captured with Timestamp</span>
              </div>
            </div>
          )}

          {/* Viewfinder Grid & HUD (Only when live) */}
          {!capturedImage && !cameraError && !isInitializing && (
            <>
              {/* Center Targeting Box */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 sm:w-72 sm:h-72 border-2 border-amber-400/60 rounded-3xl relative">
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

                  {/* Center Crosshair */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4">
                    <div className="absolute top-1.5 left-0 w-4 h-0.5 bg-amber-400/80" />
                    <div className="absolute top-0 left-1.5 w-0.5 h-4 bg-amber-400/80" />
                  </div>
                </div>
              </div>

              {/* Live Telemetry Overlay */}
              <div className="absolute top-3 left-3 z-20 space-y-1 pointer-events-none">
                <div className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] font-mono text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold">LIVE CAM FEED</span>
                </div>
                {gpsLocation && (
                  <div className="px-2.5 py-0.5 bg-black/70 backdrop-blur-md rounded text-[10px] font-mono text-slate-300 border border-slate-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{gpsLocation.lat}, {gpsLocation.lng}</span>
                  </div>
                )}
              </div>

              <div className="absolute top-3 right-3 z-20 pointer-events-none">
                <div className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-lg text-[10px] font-mono text-slate-300 border border-slate-700 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{currentTime}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Shutter & Controls Bar */}
        <div className="bg-slate-900 border-t border-slate-800 p-4 sm:p-5 flex items-center justify-between gap-4 text-white shrink-0">
          {!capturedImage ? (
            <>
              <div className="text-[11px] text-slate-400 hidden sm:block">
                Align the civic damage inside the frame and press snapshot.
              </div>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                disabled={isInitializing || !!cameraError}
                className="mx-auto w-16 h-16 rounded-full border-4 border-white/80 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all flex items-center justify-center shadow-2xl disabled:opacity-50 cursor-pointer group"
                title="Click photo"
              >
                <div className="w-12 h-12 rounded-full bg-white group-hover:scale-90 transition-transform flex items-center justify-center">
                  <Camera className="w-6 h-6 text-slate-950" />
                </div>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-400 hover:text-white px-3 py-2"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Photo</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmImage}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-black rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use This Photo Evidence</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
