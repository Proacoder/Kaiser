import React, { useState, useEffect } from "react";

export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (scrollProgress <= 0.5) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] pointer-events-none bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-evergreen-400 via-evergreen-600 to-evergreen-800 transition-all duration-75 ease-out shadow-[0_0_8px_rgba(81,123,96,0.6)]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
