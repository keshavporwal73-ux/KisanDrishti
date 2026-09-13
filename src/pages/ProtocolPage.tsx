import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Scale, 
  Eye, 
  Lock, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Camera,
  CheckCircle2,
  XCircle,
  Smartphone,
  Check,
  Building2,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ProtocolPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-semibold">
          <Scale className="w-3.5 h-3.5" />
          <span>Visual Evidence Protocol v3.2</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-foreground">
          The KisanDrishti Protocol
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-serif italic">
          "Evidence Before Valuation."
        </p>
      </div>

      {/* Core Principle Card */}
      <Card className="border-2 border-emerald-600/30 bg-emerald-500/5 shadow-xs">
        <CardContent className="p-6 space-y-3">
          <h2 className="text-base font-bold font-serif text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>The Central Product Ground</span>
          </h2>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
            "Don't tell both sides what the crop is worth. Give both sides the same visual evidence to inspect."
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            In agricultural mandis across India, farmers regularly face arbitrary quality deductions based on subjective claims by buyers. Conversely, buyers face risks of concealed stones, weed seeds, and foreign contaminants.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            KisanDrishti does not act as a price predictor or official grading authority. Instead, it generates a clean, standardized, tamper-evident digital evidence package that both farmer and buyer can inspect together.
          </p>
        </CardContent>
      </Card>

      {/* What KisanDrishti IS vs What It IS NOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WHAT IT IS NOT */}
        <Card className="border-2 border-red-500/30 bg-red-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-sm">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>What KisanDrishti IS NOT</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>NOT an AI crop-price predictor</strong> (does not calculate rupee cuts).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>NOT a laboratory</strong> (does not measure chemical moisture, protein, or pesticides).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>NOT an official grading authority</strong> (does not replace APMC / Mandi inspectors).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>NOT an expensive machine</strong> (no specialized cameras or IoT sensors required).</span>
            </div>
          </CardContent>
        </Card>

        {/* WHAT IT IS */}
        <Card className="border-2 border-emerald-500/30 bg-emerald-500/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What KisanDrishti IS</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Low-cost smartphone visual evidence layer</strong> for agricultural trade.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>8-Parameter Capture Quality Gate</strong> to reject blurry/shadowed photos.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Observable visual findings</strong>: broken %, discoloration %, foreign material count.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Tamper-evident SHA-256 seal</strong> with instant WhatsApp and PDF sharing.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Epistemic 3-Tier Classification System */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-foreground">
          Strict Evidentiary Framework
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
                <li>Broken / damaged material (%)</li>
                <li>Visible foreign material (count)</li>
                <li>Visible discoloration (%)</li>
                <li>Physical surface damage / abrasions</li>
                <li>Capture quality gate score</li>
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
              <p>Optical patterns that suggest defects but require physical confirmation:</p>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                <li>Insect bore hole cavity aperture</li>
                <li>Early fungus / mold discoloration</li>
                <li>Sub-surface germination swell</li>
              </ul>
            </CardContent>
          </Card>

          {/* UNVERIFIED */}
          <Card className="border-2 border-stone-500/30 bg-stone-500/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-stone-700 text-white font-mono text-[10px]">
                  UNVERIFIED
                </Badge>
                <Lock className="w-4 h-4 text-stone-500" />
              </div>
              <CardTitle className="text-sm font-bold pt-1">Laboratory Only</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>Measurements explicitly excluded because 2D optics cannot test them:</p>
              <ul className="list-disc list-inside space-y-1 text-stone-700 dark:text-stone-300 font-mono text-[11px]">
                <li>Moisture content (%)</li>
                <li>Protein / Gluten content (%)</li>
                <li>Chemical / Pesticide residue</li>
                <li>Internal kernel larvae</li>
                <li>Rupee price deductions</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Business Model Section */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold font-serif flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Fair Business Model Architecture
          </CardTitle>
          <CardDescription className="text-xs">
            How KisanDrishti operates sustainably without charging farmers high inspection fees.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-border space-y-1.5">
              <span className="font-bold text-foreground block">For Farmers & Small Growers:</span>
              <p className="text-muted-foreground leading-relaxed">
                Free / very-low-cost basic smartphone visual evidence capture. No expensive hardware kits or mandatory subscriptions.
              </p>
            </div>
            <div className="p-3 bg-stone-50 dark:bg-stone-900 rounded-lg border border-border space-y-1.5">
              <span className="font-bold text-foreground block">For Aggregators, Warehouses & Mandis:</span>
              <p className="text-muted-foreground leading-relaxed">
                Multi-lot evidence management, bulk audit exports, ERP/trade system integration, and dispute resolution archives.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer CTA */}
      <div className="flex justify-center pt-4">
        <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm gap-2">
          <Link to="/audit/new">
            <Camera className="w-4 h-4" />
            <span>Create Visual Evidence Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

    </div>
  );
};
