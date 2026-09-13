import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="w-full bg-stone-900 text-stone-200 border-b border-stone-800 text-[11px] sm:text-xs py-2 px-4 shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-amber-300 shrink-0 font-mono text-[10px] uppercase tracking-wider">
            Evidence Protocol:
          </span>
          <p className="truncate text-stone-300">
            KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 shrink-0 font-mono text-[10px] text-stone-400">
          <span>No Lab Fabrication</span>
          <span>•</span>
          <span>SHA-256 Tamper-Evident</span>
        </div>
      </div>
    </div>
  );
};
