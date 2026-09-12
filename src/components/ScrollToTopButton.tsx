import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "./SmoothScroll";

export const ScrollToTopButton: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    scrollTo(0, { duration: 1 });
  };

  if (!visible) return null;

  // SVG circular calculation (radius = 18, circumference = 2 * PI * 18 ~ 113.1)
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={handleClick}
        aria-label="Scroll back to top"
        title="Scroll to top"
        className="relative w-12 h-12 rounded-full bg-[#f6f3f1] backdrop-blur-md shadow-lg border border-[#cecac8] text-[#242424] hover:text-white hover:bg-[#2b59d1] flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 group cursor-pointer"
      >
        {/* Circular Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5">
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-[#cecac8]"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="22"
            cy="22"
            r={radius}
            className="text-[#2b59d1] transition-all duration-100 ease-out"
            strokeWidth="2.5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>

        <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 relative z-10" />
      </button>
    </div>
  );
};
