import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scale, 
  Eye, 
  Lock, 
  Grid3X3, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Camera,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ProtocolPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Epistemic Humility Standard v2.4</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground">
          The KisanDrishti Visual Evidence Protocol
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
          KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.
        </p>
      </div>

      {/* Core Principle Card */}
      <Card className="border-2 border-primary/30 bg-primary/5 shadow-sm">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>Why an Evidence Protocol (and NOT a Grain Counter or Grading Authority)?</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            In agricultural mandis across India, farmers regularly face arbitrary quality deductions (often 5% to 20% off agreed price) based on subjective visual claims by traders. Conversely, buyers face risks of concealed stones and foreign contaminants.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            <strong>KisanDrishti is NOT a grain counter and NOT a crop grading authority.</strong> Raw grain counts (e.g. "412 grains detected") do not solve dispute resolution. What matters is verifiable <strong>observable visual evidence</strong>: broken kernel candidates %, foreign objects, discoloration %, surface abrasion, and sample dispersion on a physical 10cm×10cm calibration grid signed with SHA-256 cryptographic proof.
          </p>
        </CardContent>
      </Card>

      {/* Epistemic Humility 3-Tier Classification System */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-foreground">
          The Three Evidentiary Tiers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* OBSERVED */}
          <Card className="border-2 border-emerald-500/40 bg-emerald-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-emerald-700 text-white font-mono text-[10px]">
                  OBSERVED
                </Badge>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <CardTitle className="text-sm font-bold pt-1">Direct Optical Evidence</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Features directly measurable in calibrated pixel space:</p>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                <li>Broken / cleaved candidates (%)</li>
                <li>Foreign objects (stones/seeds)</li>
                <li>Discoloration candidates (%)</li>
                <li>Visible pericarp abrasions</li>
                <li>Metric grain length (mm)</li>
                <li>Grid dispersion coverage (%)</li>
              </ul>
            </CardContent>
          </Card>

          {/* POSSIBLE */}
          <Card className="border-2 border-amber-500/40 bg-amber-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-amber-600 text-white font-mono text-[10px]">
                  POSSIBLE
                </Badge>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <CardTitle className="text-sm font-bold pt-1">Visual Interpretation</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Optical patterns that suggest defects but require confirmation:</p>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                <li>Insect bore hole cavity candidates</li>
                <li>Premature heat-stress wrinkles</li>
                <li>Immature chlorophyll shading</li>
                <li>Aggressive auger scuffing</li>
              </ul>
            </CardContent>
          </Card>

          {/* UNVERIFIED */}
          <Card className="border-2 border-stone-500/40 bg-stone-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-stone-700 text-white font-mono text-[10px]">
                  UNVERIFIED
                </Badge>
                <XCircle className="w-4 h-4 text-stone-500" />
              </div>
              <CardTitle className="text-sm font-bold pt-1">Laboratory Testing Only</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Explicitly marked <strong>"Not tested"</strong> without fabrication:</p>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                <li>Moisture Content (Dielectric meter)</li>
                <li>Protein % (NIR Spectrometer)</li>
                <li>Chemical & Pesticides (GC-MS)</li>
                <li>Internal Fungus (Incubation)</li>
                <li>Gluten / Falling Number</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* The 5 Non-Negotiable Protocol Rules */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-foreground">
          The 5 Protocol Rules for Both Parties
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-4 bg-card border border-border rounded-xl space-y-1">
            <strong className="text-foreground text-sm font-bold block">
              1. Standardized 10cm × 10cm Optical Boundary
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              Every photograph must be taken on the printable KisanDrishti calibration sheet. Metric 1mm millimeter ticks provide an indisputable spatial reference that eliminates optical telephoto distortion.
            </p>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl space-y-1">
            <strong className="text-foreground text-sm font-bold block">
              2. Observable Visual Findings with Interactive Coordinates
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              Every flagged anomaly (broken kernel, gravel particle, weed seed) is assigned a numbered pin and bounding box on the original photograph. Both buyer and seller can tap and zoom in to verify the raw pixel data.
            </p>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl space-y-1">
            <strong className="text-foreground text-sm font-bold block">
              3. SHA-256 Cryptographic Tamper Evidence
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              At the moment of capture, a deterministic SHA-256 hash is computed over the canonical evidence package. If either party tries to modify the data or numbers later, the cryptographic check immediately fails.
            </p>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl space-y-1">
            <strong className="text-foreground text-sm font-bold block">
              4. Strict Prohibition of Fabricated Lab Values
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              Surface photography cannot detect internal moisture or chemical compounds. Any software claiming to measure moisture percentage accurately from a standard smartphone camera is fabricating numbers. KisanDrishti explicitly states these as UNVERIFIED.
            </p>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl space-y-1">
            <strong className="text-foreground text-sm font-bold block">
              5. Neutrality & Epistemic Humility
            </strong>
            <p className="text-muted-foreground leading-relaxed">
              "KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect." The final commercial price remains in the hands of the negotiating humans.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-border">
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link to="/calibration-sheet">
            <Grid3X3 className="w-3.5 h-3.5 mr-1.5" />
            Print Calibration Sheet
          </Link>
        </Button>

        <Button asChild size="sm" className="bg-primary text-primary-foreground text-xs">
          <Link to="/audit/new">
            <Camera className="w-3.5 h-3.5 mr-1.5" />
            Start An Evidence Audit
          </Link>
        </Button>
      </div>

    </div>
  );
};
