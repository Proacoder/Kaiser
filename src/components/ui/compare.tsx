import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

interface CompareProps {
  firstImage?: string;
  secondImage?: string;
  className?: string;
  firstImageClassName?: string;
  secondImageClassname?: string;
  initialSliderPercentage?: number;
  slideMode?: "hover" | "drag";
  showHandlebar?: boolean;
  autoplay?: boolean;
  autoplayDuration?: number;
}

export const Compare: React.FC<CompareProps> = ({
  firstImage = "https://assets.aceternity.com/code-problem.png",
  secondImage = "https://assets.aceternity.com/code-solution.png",
  className,
  firstImageClassName,
  secondImageClassname,
  initialSliderPercentage = 50,
  slideMode = "hover",
  showHandlebar = true,
  autoplay = false,
  autoplayDuration = 5000,
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialSliderPercentage);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (slideMode === "hover" || isDragging) {
        handleMove(e.clientX);
      }
    },
    [slideMode, isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoplay && !isMouseOver) {
      let startTime = Date.now();
      interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) % autoplayDuration;
        const progress = elapsedTime / autoplayDuration;
        setSliderPosition(Math.sin(progress * Math.PI * 2) * 40 + 50);
      }, 16);
    }
    return () => clearInterval(interval);
  }, [autoplay, autoplayDuration, isMouseOver]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl select-none cursor-ew-resize bg-[#f6f3f1] border border-[#cecac8]",
        className
      )}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseDown={() => slideMode === "drag" && setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => {
        setIsMouseOver(false);
        setIsDragging(false);
      }}
    >
      {/* First Image (Top Layer) */}
      <div
        className="absolute inset-0 w-full h-full z-20 pointer-events-none overflow-hidden"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={firstImage}
          alt="First comparison asset"
          className={cn("w-full h-full object-cover", firstImageClassName)}
        />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#242424]/90 text-white font-mono text-[10px] uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-md">
          Before / Problem
        </span>
      </div>

      {/* Second Image (Base Layer) */}
      <div className="absolute inset-0 w-full h-full z-10">
        <img
          src={secondImage}
          alt="Second comparison asset"
          className={cn("w-full h-full object-cover", secondImageClassname)}
        />
        <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#2b59d1]/90 text-white font-mono text-[10px] uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-md">
          After / Resolved
        </span>
      </div>

      {/* Divider Handlebar */}
      {showHandlebar && (
        <div
          className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-lg pointer-events-none transform -translate-x-1/2"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-[#242424] shadow-xl border-2 border-[#2b59d1] flex items-center justify-center font-mono text-xs font-bold">
            <span className="text-[#2b59d1]">◄►</span>
          </div>
        </div>
      )}
    </div>
  );
};
