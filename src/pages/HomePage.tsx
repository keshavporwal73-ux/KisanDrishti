import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Eye, 
  Grid3X3, 
  Sparkles, 
  FileText, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  Camera, 
  Layers,
  Scale,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { INITIAL_AUDIT_HISTORY } from '@/lib/sampleData';

export const HomePage: React.FC = () => {
  const recentAudits = INITIAL_AUDIT_HISTORY;

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-[#1B4D3E] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-emerald-900">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-mono text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Tamper-Evident Agricultural Visual Protocol</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-balance leading-tight text-stone-50">
            Observable Visual Evidence. <br />
            <span className="text-amber-300 font-normal italic">Before Arbitrary Deductions.</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-200 leading-relaxed text-pretty max-w-2xl">
            KisanDrishti does not decide what your crop is worth. It creates a standardized, cryptographic visual record of physical crop samples on a 10cm×10cm calibration grid so both farmers and buyers negotiate on identical observable ground.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold shadow-md text-sm">
              <Link to="/audit/new">
                <Camera className="w-4 h-4 mr-2" />
                Start New Visual Audit
              </Link>
            </Button>

            <Button asChild variant="ghost" size="lg" className="border border-white/40 text-white hover:bg-white/10 text-sm">
              <Link to="/demo">
                <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                Explore Demo Mode
              </Link>
            </Button>

            <Button asChild variant="ghost" size="lg" className="text-stone-300 hover:text-white hover:bg-white/5 text-sm">
              <Link to="/calibration-sheet">
                <Grid3X3 className="w-4 h-4 mr-2" />
                Get Calibration Sheet
              </Link>
            </Button>
          </div>

          {/* Quick Pillars */}
          <div className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>10cm × 10cm Grid</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Observable Candidates %</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>SHA-256 Signed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>No Lab Fabrication</span>
            </div>
          </div>
        </div>

        {/* Decorative Grid Pattern Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden lg:block calibration-grid" />
      </section>

      {/* Epistemic Humility Banner */}
      <section className="bg-amber-500/10 border-2 border-amber-500/20 rounded-xl p-5 text-xs text-amber-950 dark:text-amber-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-200">
            <Scale className="w-4 h-4" />
            <span>The Epistemic Humility Framework</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            We strictly categorize all audit metrics: <strong>OBSERVED</strong> (direct optical surface evidence), <strong>POSSIBLE</strong> (visual interpretations requiring physical confirmation), and <strong>UNVERIFIED</strong> (laboratory tests like moisture % and protein, which non-destructive photography cannot fabricate).
          </p>
        </div>

        <Button asChild variant="outline" size="sm" className="shrink-0 border-amber-600/30 text-amber-900 dark:text-amber-200 hover:bg-amber-500/20">
          <Link to="/protocol">Read Protocol Rules</Link>
        </Button>
      </section>

      {/* 4 Core Pillars of the Visual Evidence Protocol */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            How KisanDrishti Establishes Observable Ground
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            A non-invasive, objective capture protocol designed for high-stakes mandi negotiations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Grid3X3 className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">10cm × 10cm Calibration</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Standardized optical sheet with millimeter boundary ticks and fiducials prevents perspective exaggeration or distorted lens scales.
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Eye className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">Observable Anomaly Candidates</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Prioritizes broken/damaged candidates, foreign object particles, and discoloration rates with interactive bounding box coordinate inspection.
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">SHA-256 Tamper Evident</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Calculates a deterministic cryptographic digest over canonical evidence data. Any post-capture alteration is instantly flagged.
            </CardContent>
          </Card>

          <Card className="border border-border bg-card shadow-sm hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Share2 className="w-5 h-5" />
              </div>
              <CardTitle className="text-base font-bold">Zero-Install Evidence Card</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground leading-relaxed">
              Shareable web links and formatted WhatsApp evidence summaries allow commission agents and buyers to inspect raw visual data instantly.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Evidence Audits Repository */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-foreground">
              Recent Verifiable Visual Records
            </h2>
            <p className="text-xs text-muted-foreground">
              Audits signed with standardized calibration and cryptographic integrity seals.
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link to="/records">
              View All Audits
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentAudits.map((audit) => (
            <Card key={audit.id} className="border border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
                <img 
                  src={audit.imageUrl} 
                  alt={audit.metadata.crop}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur text-white px-2 py-0.5 rounded text-[10px] font-mono">
                  {audit.metadata.crop}
                </div>
                {audit.isDemo && (
                  <div className="absolute top-2 right-2 bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded text-[9px] font-mono">
                    DEMO RECORD
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur text-emerald-400 px-2 py-0.5 rounded text-[9px] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>SHA-256 SEALED</span>
                </div>
              </div>

              <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-primary">{audit.id}</span>
                    <span className="text-muted-foreground text-[10px]">Lot {audit.metadata.lotId}</span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground">
                    {audit.metadata.variety || audit.metadata.crop}
                  </h3>
                  <p className="text-muted-foreground text-[11px] truncate">
                    {audit.metadata.location}
                  </p>
                </div>

                {/* Observable Visual Evidence Summary (Broken %, Foreign Objects, Discoloration %) */}
                <div className="grid grid-cols-3 gap-1.5 py-2 border-y border-border text-center font-mono text-[10px]">
                  <div className="p-1 bg-muted/40 rounded">
                    <span className="text-muted-foreground block text-[9px]">Broken:</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400">{audit.stats.brokenPercent}%</span>
                  </div>
                  <div className="p-1 bg-muted/40 rounded">
                    <span className="text-muted-foreground block text-[9px]">Foreign:</span>
                    <span className="font-bold text-red-700 dark:text-red-400">{audit.stats.foreignObjectCount} units</span>
                  </div>
                  <div className="p-1 bg-muted/40 rounded">
                    <span className="text-muted-foreground block text-[9px]">Discolor:</span>
                    <span className="font-bold text-orange-700 dark:text-orange-400">{audit.stats.discoloredPercent}%</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    Grid Coverage: {audit.stats.sampleCoveragePercent}%
                  </span>
                  <Button asChild size="sm" variant="outline" className="text-xs h-7">
                    <Link to={`/records/${audit.id}`}>
                      Inspect Visual Findings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Central Product Disclaimer Footer Card */}
      <section className="bg-stone-900 text-stone-200 rounded-2xl p-6 sm:p-8 border border-stone-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base">
          <ShieldCheck className="w-5 h-5" />
          <span>The KisanDrishti Guarantee of Neutrality</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          "KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect." We protect farmers against unilateral grading claims while providing buyers with verified optical provenance.
        </p>
      </section>

    </div>
  );
};
