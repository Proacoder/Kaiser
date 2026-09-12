import React, { useEffect, useId, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "../../lib/utils";
import { Globe, Command, CornerDownLeft } from "lucide-react";

export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
  children,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);

  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5]
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(
    scrollYProgress,
    [0.1, 0.12, 0.3],
    [-25, -25, 0]
  );
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={ref}
      className="min-h-[200vh] flex flex-col items-center py-12 md:py-24 justify-start flex-shrink-0 [perspective:800px] transform md:scale-100 scale-75 overflow-hidden bg-[#f6f3f1] font-mono text-[#242424]"
    >
      <motion.h2
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="text-[#242424] text-[#242424] text-3xl md:text-5xl font-serif font-normal text-center mb-8 tracking-tight"
      >
        {title || (
          <span>
            CivicConnect 24-Ward Command Suite. <br /> Engineered for Greater Mumbai.
          </span>
        )}
      </motion.h2>

      {/* Badge */}
      {badge && (
        <motion.div
          style={{
            translateY: textTransform,
            opacity: textOpacity,
          }}
          className="mb-8"
        >
          {badge}
        </motion.div>
      )}

      {/* Macbook Frame */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      >
        {children}
      </Lid>

      {/* Base */}
      <Trackpad />
      <Keypad />
      <SpeakerGrid />
    </div>
  );
};

export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
  children,
}: {
  scaleX: any;
  scaleY: any;
  rotate: any;
  translate: any;
  src?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="relative [perspective:800px]">
      <div
        style={{
          transform: "perspective(800px) rotateX(-25deg)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="h-[12rem] w-[32rem] bg-[#1d1d1f] rounded-2xl p-2 relative shrink-0"
      >

        <div
          style={{
            boxShadow: "0px 2px 0px 2px #000000 inset",
          }}
          className="absolute inset-0 bg-[#010101] rounded-lg flex items-center justify-center"
        >
          <span className="text-white font-mono text-xs font-bold uppercase tracking-wider">
            KAISER MACBOOK PRO
          </span>
        </div>
      </div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,

          transformStyle: "preserve-3d",

          transformOrigin: "top",
        }}
        className="h-[22rem] w-[32rem] bg-[#010101] rounded-2xl p-2 absolute inset-0 shrink-0 border border-[#242424]"
      >
        <div className="absolute inset-0 bg-[#272729] rounded-lg overflow-hidden border border-neutral-800">
          {/* Display Notch */}
          <div className="absolute top-0 inset-x-0 h-4 bg-[#010101] w-40 mx-auto rounded-b-[#010101] flex items-center justify-center z-50">
            <div className="w-2 h-2 rounded-full bg-[#111111] border border-neutral-700" />
          </div>

          {/* Screen Content */}
          {children ? (
            <div className="w-full h-full pt-4 bg-[#f6f3f1] overflow-y-auto">
              {children}
            </div>
          ) : src ? (
            <img
              src={src}
              alt="Macbook Screen Preview"
              className="object-cover object-top w-full h-full rounded-[#010101]"
            />
          ) : (
            <div className="w-full h-full pt-6 p-4 bg-[#0a0f1d] text-white font-mono text-xs flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[#cfdaf5] font-bold">CIVICCONNECT PRO CONTROL SUITE</span>
                <span className="px-2 py-0.5 rounded bg-[#2b59d1] text-white text-[10px]">LIVE 24x7</span>
              </div>
              <div className="space-y-2 py-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                  <span>Ward Telemetry Network</span>
                  <span className="text-emerald-400 font-bold">24/24 Online</span>
                </div>
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                  <span>Active Grievances Logged</span>
                  <span className="text-amber-400 font-bold">1,000 Verified</span>
                </div>
              </div>
              <div className="text-[10px] text-white/40 uppercase text-center border-t border-white/10 pt-2">
                Scroll to explore interactive civic telemetry
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const Trackpad = () => {
  return (
    <div className="w-[12rem] h-[5rem] bg-[#272729] my-1 rounded-xl mx-auto shadow-inner border border-neutral-700/50" />
  );
};

export const Keypad = () => {
  return (
    <div className="h-[12.5rem] w-[32rem] bg-[#050505] mx-auto rounded-t-2xl p-2 relative shrink-0 border border-neutral-800">

      {/* First Row */}
      <Row>
        <Kbd className="w-8">esc</Kbd>
        <Kbd>F1</Kbd>
        <Kbd>F2</Kbd>
        <Kbd>F3</Kbd>
        <Kbd>F4</Kbd>
        <Kbd>F5</Kbd>
        <Kbd>F6</Kbd>
        <Kbd>F7</Kbd>
        <Kbd>F8</Kbd>
        <Kbd>F9</Kbd>
        <Kbd>F10</Kbd>
        <Kbd>F11</Kbd>
        <Kbd>F12</Kbd>
        <Kbd className="w-8">⏏</Kbd>
      </Row>

      {/* Second Row */}
      <Row>
        <Kbd className="w-6">~</Kbd>
        <Kbd>1</Kbd>
        <Kbd>2</Kbd>
        <Kbd>3</Kbd>
        <Kbd>4</Kbd>
        <Kbd>5</Kbd>
        <Kbd>6</Kbd>
        <Kbd>7</Kbd>
        <Kbd>8</Kbd>
        <Kbd>9</Kbd>
        <Kbd>0</Kbd>
        <Kbd>-</Kbd>
        <Kbd>+</Kbd>
        <Kbd className="w-10">delete</Kbd>
      </Row>

      {/* Third Row */}
      <Row>
        <Kbd className="w-10">tab</Kbd>
        <Kbd>Q</Kbd>
        <Kbd>W</Kbd>
        <Kbd>E</Kbd>
        <Kbd>R</Kbd>
        <Kbd>T</Kbd>
        <Kbd>Y</Kbd>
        <Kbd>U</Kbd>
        <Kbd>I</Kbd>
        <Kbd>O</Kbd>
        <Kbd>P</Kbd>
        <Kbd>[</Kbd>
        <Kbd>]</Kbd>
        <Kbd className="w-6">\</Kbd>
      </Row>

      {/* Fourth Row */}
      <Row>
        <Kbd className="w-12">caps lock</Kbd>
        <Kbd>A</Kbd>
        <Kbd>S</Kbd>
        <Kbd>D</Kbd>
        <Kbd>F</Kbd>
        <Kbd>G</Kbd>
        <Kbd>H</Kbd>
        <Kbd>J</Kbd>
        <Kbd>K</Kbd>
        <Kbd>L</Kbd>
        <Kbd>;</Kbd>
        <Kbd>'</Kbd>
        <Kbd className="w-12">return</Kbd>
      </Row>

      {/* Fifth Row */}
      <Row>
        <Kbd className="w-16">shift</Kbd>
        <Kbd>Z</Kbd>
        <Kbd>X</Kbd>
        <Kbd>C</Kbd>
        <Kbd>V</Kbd>
        <Kbd>B</Kbd>
        <Kbd>N</Kbd>
        <Kbd>M</Kbd>
        <Kbd>,</Kbd>
        <Kbd>.</Kbd>
        <Kbd>/</Kbd>
        <Kbd className="w-16">shift</Kbd>
      </Row>

      {/* Sixth Row */}
      <Row>
        <Kbd className="w-8">fn</Kbd>
        <Kbd className="w-8">control</Kbd>
        <Kbd className="w-8">option</Kbd>
        <Kbd className="w-10">command</Kbd>
        <Kbd className="w-24">space</Kbd>
        <Kbd className="w-10">command</Kbd>
        <Kbd className="w-8">option</Kbd>
        <Kbd className="w-8">◀</Kbd>
        <div className="flex flex-col gap-0.5">
          <Kbd className="w-6 h-2.5 text-[6px]">▲</Kbd>
          <Kbd className="w-6 h-2.5 text-[6px]">▼</Kbd>
        </div>
        <Kbd className="w-8">▶</Kbd>
      </Row>
    </div>
  );
};

export const Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex justify-between w-full my-0.5 gap-[2px]">
      {children}
    </div>
  );
};

export const Kbd = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "h-6 w-6 bg-[#161616] border border-neutral-700/80 rounded-[4px] flex items-center justify-center text-[8px] text-neutral-300 shadow-sm font-mono select-none",
        className
      )}
    >
      {children}
    </div>
  );
};

export const SpeakerGrid = () => {
  return (
    <div className="flex justify-between w-[32rem] mx-auto px-4 -mt-24 pointer-events-none">
      <div className="w-6 h-24 bg-[radial-[#333333]_1px,transparent_1px] [background-size:3px_3px]" />
      <div className="w-6 h-24 bg-[radial-[#333333]_1px,transparent_1px] [background-size:3px_3px]" />
    </div>
  );
};
