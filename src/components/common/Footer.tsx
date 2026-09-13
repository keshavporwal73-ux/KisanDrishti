import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-card/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif font-bold text-foreground">KisanDrishti</span>
            </div>
            <p className="text-xs text-muted-foreground max-w-md">
              A Tamper-Evident Visual Evidence Protocol for agricultural produce transactions. Standardizing observable visual records of physical crop samples so farmers and buyers negotiate on identical observable ground.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-primary font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA-256 Cryptographic Verification Standard</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-foreground tracking-wider uppercase text-[11px]">Protocol Tools</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li><Link to="/audit/new" className="hover:text-primary transition-colors">Start Physical Audit</Link></li>
              <li><Link to="/calibration-sheet" className="hover:text-primary transition-colors">Print Calibration Sheet (10cm×10cm)</Link></li>
              <li><Link to="/demo" className="hover:text-primary transition-colors">Interactive Demo Mode</Link></li>
              <li><Link to="/records" className="hover:text-primary transition-colors">Evidence Repository</Link></li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-foreground tracking-wider uppercase text-[11px]">Core Principles</h4>
            <ul className="space-y-1.5 text-muted-foreground">
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> Evidence Before Valuation</li>
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> No Fabricated Lab Claims</li>
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> Visible Epistemic Uncertainty</li>
              <li className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-primary shrink-0" /> Tamper-Evident SHA-256 Hashes</li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© 2026 KisanDrishti Protocol. All rights reserved.</p>
          <p className="text-[11px] text-center sm:text-right">
            Independent agricultural visual evidence standard. Not affiliated with APMC or mandi commercial grading boards.
          </p>
        </div>
      </div>
    </footer>
  );
};
