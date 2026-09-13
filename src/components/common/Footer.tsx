import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, ExternalLink, Wheat, Sparkles, TrendingUp, SlidersHorizontal, BookOpen } from 'lucide-react';
import { KisanDrishtiLogo } from '@/components/brand/KisanDrishtiLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-stone-900 text-stone-300 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="space-y-3">
            <KisanDrishtiLogo size="sm" showText={true} />
            <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
              A low-cost smartphone visual evidence protocol establishing standardized digital records before crop valuation in agricultural trading.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>SHA-256 Tamper-Evident Certified</span>
            </div>
          </div>

          {/* Protocol & Verification */}
          <div className="space-y-2 font-mono">
            <span className="text-[11px] font-bold text-stone-200 uppercase tracking-wider block font-sans">
              Visual Evidence Tools
            </span>
            <ul className="space-y-1.5 text-[11px] text-stone-400">
              <li>
                <Link to="/audit/new" className="hover:text-amber-300 transition-colors">
                  Smartphone Photo Capture
                </Link>
              </li>
              <li>
                <Link to="/records" className="hover:text-amber-300 transition-colors">
                  Evidence Repository
                </Link>
              </li>
              <li>
                <Link to="/showcase" className="hover:text-amber-300 transition-colors flex items-center gap-1 text-emerald-400 font-bold">
                  <Sparkles className="w-3 h-3" /> 6-Commodity Showcase
                </Link>
              </li>
              <li>
                <Link to="/protocol" className="hover:text-amber-300 transition-colors">
                  Epistemic Framework
                </Link>
              </li>
            </ul>
          </div>

          {/* Market Intelligence */}
          <div className="space-y-2 font-mono">
            <span className="text-[11px] font-bold text-stone-200 uppercase tracking-wider block font-sans">
              Market Intelligence
            </span>
            <ul className="space-y-1.5 text-[11px] text-stone-400">
              <li>
                <Link to="/prices" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Live APMC Mandi Prices
                </Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> Quality Price Calculator
                </Link>
              </li>
              <li>
                <Link to="/encyclopedia" className="hover:text-amber-300 transition-colors flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Visual Grain Encyclopedia
                </Link>
              </li>
            </ul>
          </div>

          {/* Mandi Hubs */}
          <div className="space-y-2 font-mono">
            <span className="text-[11px] font-bold text-stone-200 uppercase tracking-wider block font-sans">
              APMC Mandi Hubs
            </span>
            <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
              Khanna (Punjab), Karnal (Haryana), Alwar (Rajasthan), Indore (MP), Davangere (Karnataka), Gulbarga (Karnataka), Rajkot (Gujarat).
            </p>
          </div>

        </div>

        {/* Institutional Disclaimer */}
        <div className="pt-6 border-t border-stone-800 text-[10px] text-stone-400 leading-relaxed space-y-2 font-sans">
          <p>
            <strong>Mandatory Protocol Disclaimer:</strong> KisanDrishti provides visual evidence only. It is NOT an official mandi grading authority, NOT a certified moisture/protein laboratory, and NOT a financial/legal arbiter. The protocol creates standardized visual documentation so buyers and sellers reference the exact same observable facts during negotiations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[10px] text-stone-500 font-mono">
            <span>© 2026 KisanDrishti Protocol. Open Visual Standards.</span>
            <span>Version 5.2 (Production Build)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
