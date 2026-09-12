import React from "react";
import { cn } from "@/lib/utils";

export interface PopButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "red" | "slate" | "white" | "periwinkle" | "pink" | "evergreen" | "emerald" | "amber" | "dark";
  size?: "sm" | "md" | "lg";
}

export function PopButton({ 
  className, 
  children = "Learn More", 
  variant = "red",
  size = "md",
  ...props 
}: PopButtonProps) {
  const variantStyles: Record<string, string> = {
    red: cn(
      "bg-red-600 border-red-700 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
      "shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.35)]"
    ),
    periwinkle: cn(
      "bg-red-600 border-red-700 text-white shadow-sm hover:bg-red-700 active:bg-red-800",
      "shadow-[0_4px_12px_rgba(220,38,38,0.25)] hover:shadow-[0_6px_16px_rgba(220,38,38,0.35)]"
    ),
    slate: cn(
      "bg-slate-900 border-slate-950 text-white hover:bg-slate-800 active:bg-slate-950",
      "shadow-[0_4px_12px_rgba(15,23,42,0.2)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.3)]"
    ),
    dark: cn(
      "bg-slate-900 border-slate-950 text-white hover:bg-slate-800 active:bg-slate-950",
      "shadow-[0_4px_12px_rgba(15,23,42,0.2)] hover:shadow-[0_6px_16px_rgba(15,23,42,0.3)]"
    ),
    white: cn(
      "bg-white border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100",
      "shadow-xs hover:shadow-sm"
    ),
    evergreen: cn(
      "bg-red-600 border-red-700 text-white hover:bg-red-700 active:bg-red-800"
    ),
  };

  const sizeStyles: Record<string, string> = {
    sm: "px-4 py-2 text-xs rounded-xl",
    md: "px-6 py-3.5 text-sm rounded-xl",
    lg: "px-8 py-5 text-base rounded-2xl",
  };

  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center font-bold uppercase cursor-pointer select-none",
        "border-2 transition-all duration-150 ease-[cubic-bezier(0,0,0.58,1)]",
        sizeStyles[size] || sizeStyles.md,
        variantStyles[variant] || variantStyles.evergreen,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default PopButton;
