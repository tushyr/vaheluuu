"use client";

import React from "react";

/* ══════════════════════════════════════════════
   1. Torn Paper Edge (Deckle / Torn Paper Divider)
   ══════════════════════════════════════════════ */
export function TornPaperEdge({
  color = "#FDFBF7",
  className = "",
  flip = false,
}: {
  color?: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className}`}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="none"
        className="w-full h-5 sm:h-7 block"
        fill={color}
      >
        <path d="M0,0 L0,18 Q30,12 60,20 Q90,26 130,16 Q180,7 230,22 Q270,27 320,15 Q360,9 410,21 Q460,25 510,14 Q560,9 610,23 Q660,27 710,16 Q760,8 810,21 Q860,26 910,13 Q960,8 1010,22 Q1060,28 1110,15 Q1160,8 1200,19 L1200,0 Z" />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   2. Handcrafted Washi Tape Strip
   ══════════════════════════════════════════════ */
export function WashiTape({
  type = "gingham",
  className = "",
  style = {},
}: {
  type?: "gingham" | "rose" | "botanical" | "gold-fleck" | "lavender" | "gold" | "mint";
  className?: string;
  style?: React.CSSProperties;
}) {
  const tapeClass = {
    gingham: "tape-gingham",
    rose: "tape-rose",
    botanical: "tape-botanical",
    "gold-fleck": "tape-gold-fleck",
    lavender: "tape-lavender",
    gold: "tape-gold",
    mint: "tape-mint",
  }[type];

  return (
    <div
      className={`tape ${tapeClass} ${className}`}
      style={{
        width: "90px",
        ...style,
      }}
    />
  );
}

/* ══════════════════════════════════════════════
   3. Brass / Rose Gold Wire Paperclip
   ══════════════════════════════════════════════ */
export function BrassPaperclip({
  className = "",
  color = "#C59B56",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 28 64"
      width="24"
      height="54"
      fill="none"
      className={`filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.22)] select-none pointer-events-none ${className}`}
    >
      <path
        d="M10 8 L10 50 C10 56 18 56 18 50 L18 16 C18 10 24 10 24 16 L24 54 C24 62 4 62 4 54 L4 14 C4 4 14 4 14 14 L14 46"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Specular highlight */}
      <path
        d="M10 10 L10 48 M18 18 L18 48"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   4. Vintage Airmail Postage Stamp with Postmark
   ══════════════════════════════════════════════ */
export function VintagePostageStamp({
  date = "19.09.26",
  title = "SPECIAL DELIVERY",
  origin = "PARIS ✈ TOKYO",
  icon = "💌",
  className = "",
}: {
  date?: string;
  title?: string;
  origin?: string;
  icon?: string;
  className?: string;
}) {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Stamp container with scalloped border */}
      <div className="relative p-2 bg-[#FFFDF9] border-[1.5px] border-dashed border-[#D97D92]/50 shadow-[0_4px_16px_rgba(61,26,38,0.12)] rounded-sm min-w-[84px] text-center">
        {/* Inner frame */}
        <div className="p-2 border border-[#D97D92]/40 rounded-sm flex flex-col items-center gap-0.5 bg-[#FFF8FA]">
          <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-[#D97D92]">
            {title}
          </span>
          <span className="text-xl my-0.5">{icon}</span>
          <span className="font-hand font-bold text-xs text-[#5E3646] leading-none">
            {origin}
          </span>
          <span className="text-[8px] font-mono tracking-wider text-[#A67C8E] mt-0.5">
            {date}
          </span>
        </div>
      </div>

      {/* Circular cancellation postmark ink stamp */}
      <div className="absolute -top-3 -right-3 w-16 h-16 pointer-events-none opacity-70 rotate-[-12deg]">
        <svg viewBox="0 0 70 70" width="100%" height="100%" fill="none">
          <circle cx="35" cy="35" r="30" stroke="#7D5363" strokeWidth="1.2" strokeDasharray="4 2" />
          <circle cx="35" cy="35" r="23" stroke="#7D5363" strokeWidth="0.8" />
          <path d="M12 28 Q35 32 58 28 M12 35 Q35 39 58 35 M12 42 Q35 46 58 42" stroke="#7D5363" strokeWidth="1" />
          <text x="35" y="22" textAnchor="middle" fontSize="6.5" fill="#7D5363" fontFamily="Quicksand, sans-serif" fontWeight="bold" letterSpacing="0.1em">
            PROJECT 23
          </text>
          <text x="35" y="52" textAnchor="middle" fontSize="6" fill="#7D5363" fontFamily="Quicksand, sans-serif">
            POSTAGE PAID
          </text>
        </svg>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   5. Pressed Dried Botanicals & Wild Flowers (SVG)
   ══════════════════════════════════════════════ */
export function PressedBotanical({
  type = "eucalyptus",
  className = "",
}: {
  type?: "eucalyptus" | "lavender" | "daisy";
  className?: string;
}) {
  if (type === "eucalyptus") {
    return (
      <svg viewBox="0 0 60 120" width="50" height="100" fill="none" className={className}>
        <path d="M30 115 Q28 65 32 10" stroke="#72887A" strokeWidth="1.5" strokeLinecap="round" />
        {/* Rounded eucalyptus leaves */}
        <ellipse cx="20" cy="95" rx="14" ry="9" fill="#8DA394" opacity="0.8" transform="rotate(-25 20 95)" />
        <ellipse cx="40" cy="80" rx="15" ry="9" fill="#9FB5A6" opacity="0.85" transform="rotate(20 40 80)" />
        <ellipse cx="18" cy="60" rx="13" ry="8" fill="#8DA394" opacity="0.8" transform="rotate(-20 18 60)" />
        <ellipse cx="42" cy="45" rx="14" ry="8" fill="#9FB5A6" opacity="0.85" transform="rotate(25 42 45)" />
        <ellipse cx="24" cy="28" rx="11" ry="7" fill="#8DA394" opacity="0.8" transform="rotate(-15 24 28)" />
        <ellipse cx="36" cy="16" rx="9" ry="6" fill="#A8BEAF" opacity="0.9" transform="rotate(15 36 16)" />
      </svg>
    );
  }

  if (type === "lavender") {
    return (
      <svg viewBox="0 0 40 100" width="35" height="85" fill="none" className={className}>
        <path d="M20 95 Q21 55 19 15" stroke="#72887A" strokeWidth="1.2" strokeLinecap="round" />
        {[75, 65, 55, 45, 35, 25, 18].map((y, i) => (
          <g key={i}>
            <ellipse cx="14" cy={y} rx="5" ry="3" fill="#B399C8" opacity="0.85" transform={`rotate(-35 14 ${y})`} />
            <ellipse cx="26" cy={y - 2} rx="5" ry="3" fill="#C5B0D8" opacity="0.85" transform={`rotate(35 26 ${y - 2})`} />
            <circle cx="20" cy={y - 4} r="2.5" fill="#D6C5E6" opacity="0.9" />
          </g>
        ))}
      </svg>
    );
  }

  // Daisy / Wild flower
  return (
    <svg viewBox="0 0 50 50" width="44" height="44" fill="none" className={className}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="25"
          cy="12"
          rx="5"
          ry="9"
          fill="#FFFDF9"
          stroke="#E8D7C3"
          strokeWidth="0.8"
          opacity="0.95"
          transform={`rotate(${deg} 25 25)`}
        />
      ))}
      <circle cx="25" cy="25" r="7" fill="#E5B242" />
      <circle cx="25" cy="25" r="5" fill="#C9972A" opacity="0.8" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   6. Realistic 3D Wax Seal with Molten Drippy Edge
   ══════════════════════════════════════════════ */
export function WaxSeal({
  number = "23",
  variant = "gold",
  size = 72,
  className = "",
  onClick,
}: {
  number?: string;
  variant?: "gold" | "crimson";
  size?: number;
  className?: string;
  onClick?: () => void;
}) {
  const isGold = variant === "gold";

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      className={`relative inline-block cursor-pointer select-none transition-transform duration-300 hover:scale-105 active:scale-95 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gold molten wax gradient */}
          <radialGradient id="goldWax" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFF2B8" />
            <stop offset="25%" stopColor="#E5BA4E" />
            <stop offset="70%" stopColor="#AD7F1F" />
            <stop offset="100%" stopColor="#6E4D0C" />
          </radialGradient>

          {/* Crimson molten wax gradient */}
          <radialGradient id="crimsonWax" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#F97E98" />
            <stop offset="30%" stopColor="#C93252" />
            <stop offset="75%" stopColor="#87162E" />
            <stop offset="100%" stopColor="#540819" />
          </radialGradient>

          <filter id="waxDropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="rgba(50,20,30,0.35)" />
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(50,20,30,0.2)" />
          </filter>
        </defs>

        {/* Outer drippy molten rim with organic wobbles */}
        <path
          d="M 50,5 
             C 65,4 78,12 87,22 
             C 96,33 97,48 94,62 
             C 91,76 82,88 68,94 
             C 54,99 38,97 26,90 
             C 14,83 6,71 5,56 
             C 4,41 12,28 23,17 
             C 34,7 40,6 50,5 Z"
          fill={isGold ? "url(#goldWax)" : "url(#crimsonWax)"}
          filter="url(#waxDropShadow)"
        />

        {/* Inner recessed stamp circle */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill={isGold ? "#9E7319" : "#7A1227"}
          opacity="0.85"
        />
        <circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeDasharray="2 1.5"
        />

        {/* Metallic stamp emblem */}
        <text
          x="50"
          y="48"
          textAnchor="middle"
          fontFamily="DM Serif Display, Georgia, serif"
          fontSize="24"
          fontWeight="bold"
          fill="rgba(255,255,255,0.95)"
          style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
        >
          {number}
        </text>
        <text
          x="50"
          y="63"
          textAnchor="middle"
          fontFamily="Caveat, cursive"
          fontSize="11"
          fontWeight="bold"
          fill="rgba(255,255,255,0.85)"
        >
          for her
        </text>

        {/* Specular gloss highlight crescent */}
        <path
          d="M 28,25 C 36,18 48,16 60,18"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
