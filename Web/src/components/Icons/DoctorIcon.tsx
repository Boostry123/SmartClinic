/* --- Core React & Types --- */
import React from "react";

interface DoctorIconProps {
  size?: number;
  className?: string;
  isAnimated?: boolean;
}

const DoctorIcon: React.FC<DoctorIconProps> = ({
  size = 24,
  className = "",
  isAnimated = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${isAnimated ? "hover:scale-105 transition-all duration-300 ease-out" : ""}`}
      aria-hidden="true"
    >
      <defs>
        {/* Vibrant Medical Teal for Scrubs */}
        <linearGradient id="scrubGradient" x1="26" y1="42" x2="38" y2="54">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0D9488" />
        </linearGradient>

        {/* Ultra-Clean Lab Coat with Subtle Depth */}
        <linearGradient id="coatDepth" x1="32" y1="42" x2="32" y2="64">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>

        {/* AI "Intelligence" Glow Gradient */}
        <linearGradient id="aiGradient" x1="44" y1="12" x2="59" y2="32">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        {/* Warm, Natural Skin Tone with Dimension */}
        <radialGradient
          id="skinRadial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(32 24) rotate(90) scale(15)"
        >
          <stop offset="0%" stopColor="#FFE4C4" />
          <stop offset="100%" stopColor="#F5D0A9" />
        </radialGradient>

        {/* Metallic Stethoscope Gradient */}
        <linearGradient id="steelGradient" x1="22" y1="42" x2="42" y2="52">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>

      {/* --- Character Structure --- */}

      {/* Lab Coat */}
      <path
        d="M12 60C12 50 20 42 30 42H34C44 42 52 50 52 60V64H12V60Z"
        fill="url(#coatDepth)"
      />

      {/* V-Neck Scrubs */}
      <path d="M26 42L32 54L38 42H26Z" fill="url(#scrubGradient)" />

      {/* Face */}
      <circle cx="32" cy="24" r="15" fill="url(#skinRadial)" />

      {/* Hair / Surgical Cap - Deep Midnight Blue */}
      <path
        d="M17 24C17 15.7 23.7 9 32 9C40.3 9 47 15.7 47 24V26H17V24Z"
        fill="#0F172A"
      />

      {/* Subtle Highlight on Cap */}
      <path
        d="M22 13C25 11 35 11 42 13"
        stroke="white"
        strokeOpacity="0.1"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Stethoscope - Metallic with highlights */}
      <path
        d="M22 42C22 47.5 26.5 52 32 52C37.5 52 42 47.5 42 42"
        stroke="url(#steelGradient)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* AI Bot Sparkles - Enhanced Glow */}
      <g filter="drop-shadow(0px 0px 4px rgba(129, 140, 248, 0.6))">
        <path
          d="M52 10L53.5 14.5L58 16L53.5 17.5L52 22L50.5 17.5L46 16L50.5 14.5L52 10Z"
          fill="url(#aiGradient)"
        />
        <path
          d="M58 24L58.5 25.5L60 26L58.5 26.5L58 28L57.5 26.5L56 26L57.5 25.5L58 24Z"
          fill="#A855F7"
        />
      </g>

      {/* Subtle Lapel & Depth Detail */}
      <path
        d="M26 42L30 50M38 42L34 50"
        stroke="#E2E8F0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Tiny Shine on the forehead for dimension */}
      <circle cx="28" cy="18" r="1.5" fill="white" fillOpacity="0.3" />
    </svg>
  );
};

export default DoctorIcon;
