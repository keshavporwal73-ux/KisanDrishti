import React from 'react';

interface KisanDrishtiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const KisanDrishtiLogo: React.FC<KisanDrishtiLogoProps> = ({
  size = 'md',
  showText = true,
  animated = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-sm', subtext: 'text-[9px]' },
    md: { icon: 38, text: 'text-base', subtext: 'text-[10px]' },
    lg: { icon: 48, text: 'text-xl', subtext: 'text-xs' },
    xl: { icon: 64, text: 'text-2xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Brand Mark */}
      <div 
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full drop-shadow-md transition-transform duration-500 hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Rotating/Pulsing Geometric Hex Shield Ring */}
          <polygon
            points="50,4 90,27 90,73 50,96 10,73 10,27"
            className={`stroke-emerald-500/50 fill-emerald-950/40 ${animated ? 'animate-[spin_20s_linear_infinite]' : ''}`}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            style={{ transformOrigin: '50% 50%' }}
          />

          {/* Inner Shield Solid */}
          <polygon
            points="50,10 84,30 84,70 50,90 16,70 16,30"
            className="fill-emerald-900 stroke-emerald-400"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Camera / Optical Aperture Focus Rings */}
          <circle
            cx="50"
            cy="50"
            r="28"
            className="stroke-amber-400/40"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          <circle
            cx="50"
            cy="50"
            r="22"
            className="fill-stone-950 stroke-amber-400"
            strokeWidth="2"
          />

          {/* Golden Grain Ear (Wheat Sheaf) in Center */}
          {/* Stem */}
          <path
            d="M50 68V34"
            className="stroke-amber-300"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Top Grain */}
          <ellipse
            cx="50"
            cy="32"
            rx="3"
            ry="4.5"
            className="fill-amber-300 stroke-amber-500"
            strokeWidth="1"
          />
          {/* Left Grains */}
          <ellipse
            cx="44"
            cy="40"
            rx="3"
            ry="4.5"
            transform="rotate(-30 44 40)"
            className="fill-amber-400 stroke-amber-500"
            strokeWidth="1"
          />
          <ellipse
            cx="44"
            cy="50"
            rx="3"
            ry="4.5"
            transform="rotate(-30 44 50)"
            className="fill-amber-400 stroke-amber-500"
            strokeWidth="1"
          />
          <ellipse
            cx="45"
            cy="60"
            rx="2.5"
            ry="4"
            transform="rotate(-30 45 60)"
            className="fill-amber-400 stroke-amber-500"
            strokeWidth="1"
          />
          {/* Right Grains */}
          <ellipse
            cx="56"
            cy="40"
            rx="3"
            ry="4.5"
            transform="rotate(30 56 40)"
            className="fill-amber-400 stroke-amber-500"
            strokeWidth="1"
          />
          <ellipse
            cx="56"
            cy="50"
            rx="3"
            ry="4.5"
            transform="rotate(30 56 50)"
            className="fill-amber-400 stroke-amber-500"
            strokeWidth="1"
          />
          <ellipse
            cx="55"
            cy="60"
            rx="2.5"
            ry="4"
            transform="rotate(30 55 60)"
            className="fill-amber-400 stroke-amber-500"
            strokeWidth="1"
          />

          {/* Optical Laser Crosshairs Target Reticle */}
          <path d="M50 16V22" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />
          <path d="M50 78V84" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />
          <path d="M16 50H22" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />
          <path d="M78 50H84" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" />

          {/* Central Cryptographic Verified Sparkle */}
          <circle cx="50" cy="50" r="3" className="fill-emerald-300 animate-ping" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-serif font-black tracking-tight text-foreground ${currentSize.text}`}>
              Kisan<span className="text-emerald-700 dark:text-emerald-400">Drishti</span>
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[9px] font-bold border border-emerald-500/20">
              PRO
            </span>
          </div>
          <span className={`font-mono text-muted-foreground uppercase tracking-wider ${currentSize.subtext}`}>
            Visual Evidence Protocol
          </span>
        </div>
      )}
    </div>
  );
};
