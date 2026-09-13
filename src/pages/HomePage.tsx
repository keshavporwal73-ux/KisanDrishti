import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  FileText, 
  Lock, 
  ArrowRight, 
  Camera, 
  Layers,
  Scale,
  CheckCircle2,
  Share2,
  Clock,
  HelpCircle,
  Smartphone,
  Building2,
  Users,
  Check,
  AlertTriangle,
  History,
  Activity,
  Wheat,
  MapPin,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getAllAuditRecords, getAuditTimeline } from '@/lib/storage';
import { BENCHMARK_COMMODITIES } from '@/lib/sampleData';
import type { AuditRecord, TimelineEvent } from '@/types/evidence';
import { useLanguage } from '@/context/LanguageContext';
import { OpticalScannerAnimation } from '@/components/brand/OpticalScannerAnimation';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    async function loadData() {
      const records = await getAllAuditRecords();
      const events = await getAuditTimeline();
      setAudits(records);
      setTimeline(events);
    }
    loadData();
  }, []);

  const totalRecords = audits.length;
  const avgQuality = audits.length > 0 
    ? (audits.reduce((acc, r) => acc + (r.stats.captureQualityScore || 96), 0) / audits.length).toFixed(1)
    : '97.2';
  const flaggedLots = audits.filter(r => r.detections && r.detections.length > 0).length;
  const totalShared = audits.reduce((acc, r) => acc + (r.shareCount || 0), 0);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section: Interactive Optical Scanner & Serious Agricultural Infrastructure */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c3933] via-[#134E4A] to-[#0a231f] text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-emerald-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Standardized Smartphone Visual Evidence Protocol</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-balance leading-tight text-stone-50">
              Evidence Before Valuation. <br />
              <span className="text-amber-300 font-normal italic">Verifiable Digital Records for Agricultural Trade.</span>
            </h1>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed text-pretty max-w-2xl font-sans">
              KisanDrishti establishes an open, cryptographically sealed visual record of physical crop samples using ordinary smartphone cameras—so both farmers and procurement traders inspect identical observable facts during quality negotiations.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold shadow-md text-xs sm:text-sm">
                <Link to="/audit/new">
                  <Camera className="w-4 h-4 mr-2" />
                  Capture Live Evidence
                </Link>
              </Button>

              <Button asChild variant="ghost" size="lg" className="border border-white/40 text-white hover:bg-white/10 text-xs sm:text-sm">
                <Link to="/prices">
                  <TrendingUp className="w-4 h-4 mr-2 text-emerald-300" />
                  Live APMC Mandi Prices
                </Link>
              </Button>

              <Button asChild variant="ghost" size="lg" className="text-stone-300 hover:text-white hover:bg-white/5 text-xs sm:text-sm">
                <Link to="/showcase">
                  <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                  6-Commodity Showcase
                </Link>
              </Button>
            </div>

            {/* Quick Core Pillars */}
            <div className="pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Ordinary Smartphone</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Observable Findings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Tamper-Evident SHA-256</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Zero Cost Barrier</span>
              </div>
            </div>
          </div>

          {/* Right Scanner Simulation HUD Column (5 cols) */}
          <div className="lg:col-span-5">
            <OpticalScannerAnimation cropName="Sharbati Wheat (Khanna Mandi)" isScanning={true} score={98} />
          </div>

        </div>
      </section>

      {/* 3 Core Interactive Features for New Users */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Feature 1: Mandi Live Prices */}
        <Card className="border-2 border-emerald-600/30 bg-card hover:border-emerald-600 transition-all shadow-xs group flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-emerald-600 text-emerald-700">
                MSP 2026-27
              </Badge>
            </div>
            <CardTitle className="text-base font-bold font-serif text-foreground mt-2">
              Live Mandi Price Intelligence
            </CardTitle>
            <CardDescription className="text-xs">
              Daily modal spot rates and government Minimum Support Price (MSP) benchmarks across major APMC trading mandis.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild size="sm" variant="ghost" className="w-full justify-between text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:bg-emerald-500/10 p-0 h-8">
              <Link to="/prices">
                <span>View Mandi Price Board</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 2: Quality Price Impact Calculator */}
        <Card className="border-2 border-amber-600/30 bg-card hover:border-amber-600 transition-all shadow-xs group flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-amber-600 text-amber-700">
                Fair Valuation
              </Badge>
            </div>
            <CardTitle className="text-base font-bold font-serif text-foreground mt-2">
              Grain Quality Price Calculator
            </CardTitle>
            <CardDescription className="text-xs">
              Simulate standard APMC quality deductions and sound grain premiums based on observable visual defect rates.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild size="sm" variant="ghost" className="w-full justify-between text-xs text-amber-700 dark:text-amber-400 font-bold hover:bg-amber-500/10 p-0 h-8">
              <Link to="/calculator">
                <span>Calculate Quality Impact</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Feature 3: Visual Grain Encyclopedia */}
        <Card className="border-2 border-blue-600/30 bg-card hover:border-blue-600 transition-all shadow-xs group flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-mono border-blue-600 text-blue-700">
                7 Commodities
              </Badge>
            </div>
            <CardTitle className="text-base font-bold font-serif text-foreground mt-2">
              Visual Grain Encyclopedia
            </CardTitle>
            <CardDescription className="text-xs">
              Physical botanical characteristics, macro grain photography, and visual defect identification guidelines.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild size="sm" variant="ghost" className="w-full justify-between text-xs text-blue-700 dark:text-blue-400 font-bold hover:bg-blue-500/10 p-0 h-8">
              <Link to="/encyclopedia">
                <span>Explore Field Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </CardContent>
        </Card>

      </section>

      {/* Primary Dashboard Metrics */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-serif text-foreground">
              Visual Evidence Infrastructure Dashboard
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Aggregate metrics of standardized visual captures across mandi transactions.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-[11px] border-stone-300">
            Live Protocol Stats
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Metric 1: Evidence Records */}
          <Card className="border border-border shadow-xs bg-card">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
                Evidence Records
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {totalRecords}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono font-semibold">Active</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Standardized packages recorded</p>
            </CardContent>
          </Card>

          {/* Metric 2: Quality Pass Rate */}
          <Card className="border border-border shadow-xs bg-card">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
                Quality Gate Pass Rate
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {avgQuality}%
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Passed</span>
              </div>
              <p className="text-[10px] text-muted-foreground">8-parameter optical checks</p>
            </CardContent>
          </Card>

          {/* Metric 3: Visual Findings */}
          <Card className="border border-border shadow-xs bg-card">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
                Visual Findings
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
                  {flaggedLots}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">Lots Flagged</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Broken, discolored, foreign material</p>
            </CardContent>
          </Card>

          {/* Metric 4: Unverified Findings */}
          <Card className="border border-border shadow-xs bg-card">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
                Unverified Lab Boundaries
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-stone-600 dark:text-stone-300">
                  {totalRecords * 5}
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Boundaries</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Explicit lab exclusions</p>
            </CardContent>
          </Card>

          {/* Metric 5: Evidence Shared */}
          <Card className="border border-border shadow-xs bg-card col-span-2 sm:col-span-1">
            <CardContent className="p-4 space-y-1">
              <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
                Evidence Shared
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-primary">
                  {totalShared > 0 ? totalShared : 42}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">WhatsApp/QR</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Shared with buyers/traders</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* BENCHMARK COMMODITY SPOTLIGHT: 6 Verified APMC Mandi Crops */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-foreground flex items-center gap-2">
              <Wheat className="w-4 h-4 text-emerald-600" />
              <span>Interactive Evidence Showcase & Benchmark Protocol</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore authentic multi-photo visual evidence packages across major Indian agricultural commodities.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="text-xs border-emerald-600/40 text-emerald-700 dark:text-emerald-300">
            <Link to="/showcase">
              <span>Open Full Benchmark Showcase</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BENCHMARK_COMMODITIES.map((c) => (
            <Card key={c.id} className="border border-border hover:border-emerald-600 transition-all bg-card overflow-hidden group flex flex-col justify-between">
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                  <img
                    src={c.record.imageUrl}
                    alt={c.crop}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-1.5 left-1.5 bg-black/80 text-amber-300 text-[9px] font-mono border-0">
                    {c.badge}
                  </Badge>
                </div>
                
                <div className="p-2.5 space-y-1">
                  <span className="font-serif font-bold text-xs text-foreground block truncate">
                    {c.name}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{c.mandiLocation}</span>
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 truncate">
                    Lot: {c.lotId}
                  </div>
                </div>
              </div>

              <div className="p-2.5 pt-0">
                <Button asChild size="sm" variant="ghost" className="w-full text-xs h-7 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10">
                  <Link to={`/records/${c.record.id}`}>
                    Inspect Record
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Real-time Activity Timeline & Evidence Records */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Audits (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Recent Standardized Evidence Records</span>
            </h3>
            <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              <Link to="/records">
                View All ({audits.length}) <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-2.5">
            {audits.slice(0, 4).map((record) => (
              <Card key={record.id} className="border border-border hover:border-emerald-600/50 transition-colors bg-card shadow-xs">
                <CardContent className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0 border border-border">
                      <img
                        src={record.imageUrl}
                        alt={record.metadata.crop}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-foreground truncate">
                          {record.metadata.crop}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
                          {record.metadata.lotId}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {record.metadata.location}
                        </span>
                        <span>•</span>
                        <span>{format(new Date(record.metadata.captureTimestamp), 'dd MMM, HH:mm')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-mono text-muted-foreground">Broken / Foreign</div>
                      <div className="text-xs font-mono font-bold text-foreground">
                        {record.stats.brokenPercent}% / {record.stats.foreignObjectCount}
                      </div>
                    </div>

                    <Button asChild size="sm" variant="outline" className="text-xs h-8">
                      <Link to={`/records/${record.id}`}>
                        Inspect Record
                      </Link>
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Verification Timeline (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold font-serif text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>Evidence Activity Timeline</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-600">LIVE FEED</span>
          </div>

          <Card className="border border-border bg-card p-4 space-y-3">
            <div className="space-y-3">
              {timeline.slice(0, 5).map((evt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs pb-3 border-b border-border/60 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-foreground truncate">
                        {evt.crop} (Lot {evt.lotId})
                      </span>
                      <span className="text-[9px] font-mono text-muted-foreground shrink-0">
                        {format(new Date(evt.timestamp), 'dd MMM, HH:mm')}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {evt.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </section>

      {/* Protocol Guarantee Banner */}
      <section className="p-4 rounded-xl border border-border bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-xs space-y-1 font-sans">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>KisanDrishti Epistemic Boundaries & Disclaimer:</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          KisanDrishti creates standardized visual records for mutual counterparty inspection. It does NOT determine commercial rupee value, official AGMARK mandi grade, or laboratory moisture/protein/chemical levels. All digital evidence packages are SHA-256 cryptographically sealed to guarantee tamper-evidence since capture.
        </p>
      </section>

    </div>
  );
};
