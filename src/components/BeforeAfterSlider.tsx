import React, { useState, useRef, useCallback } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  aspectRatio?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Before (Reported)",
  afterLabel = "After (BMC Verified)",
  className = "",
  aspectRatio = "aspect-video",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(position);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-950 shadow-md ${aspectRatio} ${className}`}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onTouchMove={handleTouchMove}
    >
      {/* After Image (Background) */}
      <img
        src={afterImage}
        alt="After Resolution"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* After Label */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-lg bg-slate-900/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-slate-700 shadow-xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
        <span>{afterLabel}</span>
      </div>

      {/* Before Image (Foreground with Clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={beforeImage}
          alt="Before Resolution"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
        {/* Before Label */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg bg-red-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>{beforeLabel}</span>
        </div>
      </div>

      {/* Vertical Slider Divider Line */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Center Draggable Handle Button */}
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-red-600 shadow-xl flex items-center justify-center cursor-ew-resize active:scale-110 transition-transform">
          <div className="flex items-center gap-0.5 text-red-600">
            <span className="text-[10px] font-black">◀</span>
            <span className="text-[10px] font-black">▶</span>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-2 inset-x-0 z-10 flex justify-center pointer-events-none">
        <span className="text-[10px] font-bold text-white/90 bg-black/60 backdrop-blur-md px-3 py-0.5 rounded-full">
          ↔ Drag slider to compare repair quality
        </span>
      </div>
    </div>
  );
};
