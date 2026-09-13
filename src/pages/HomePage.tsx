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
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getAllAuditsSync, getDashboardMetrics, getTimelineEvents, initializeAudits } from '@/lib/storage';
import type { AuditRecord, TimelineEvent } from '@/types/evidence';
import { useLanguage } from '@/context/LanguageContext';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [metrics, setMetrics] = useState({
    totalEvidenceRecords: 3,
    captureQualityPassRate: 98.4,
    recordsWithVisualFindings: 3,
    unverifiedFindingsCount: 18,
    evidenceSharedCount: 7,
  });

  useEffect(() => {
    initializeAudits().then((records) => {
      setAudits(records);
      setMetrics(getDashboardMetrics());
      setTimeline(getTimelineEvents());
    });
  }, []);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section: Serious Agricultural Infrastructure */}
      <section className="relative overflow-hidden rounded-2xl bg-[#134E4A] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-emerald-900">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-mono text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Smartphone Visual Evidence Protocol</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-balance leading-tight text-stone-50">
            Evidence Before Valuation. <br />
            <span className="text-amber-300 font-normal italic">Standardized Visual Evidence for Farm Transactions.</span>
          </h1>

          <p className="text-xs sm:text-base text-stone-200 leading-relaxed text-pretty max-w-2xl">
            KisanDrishti does not decide what your crop is worth. It creates a standardized, cryptographic visual record of physical crop samples using ordinary smartphone cameras so both farmers and buyers negotiate on identical observable ground.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold shadow-md text-xs sm:text-sm">
              <Link to="/audit/new">
                <Camera className="w-4 h-4 mr-2" />
                Create Evidence
              </Link>
            </Button>

            <Button asChild variant="ghost" size="lg" className="border border-white/40 text-white hover:bg-white/10 text-xs sm:text-sm">
              <Link to="/audits">
                <FileText className="w-4 h-4 mr-2" />
                My Evidence Records
              </Link>
            </Button>

            <Button asChild variant="ghost" size="lg" className="text-stone-300 hover:text-white hover:bg-white/5 text-xs sm:text-sm">
              <Link to="/demo">
                <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                Demo Mode
              </Link>
            </Button>
          </div>

          {/* Quick Pillars */}
          <div className="pt-4 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-stone-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Ordinary Phone</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Observable Metrics</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Tamper-Evident SHA-256</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
              <span>No Lab Fabrication</span>
            </div>
          </div>
        </div>

        {/* Decorative Grid Pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="w-full h-full grid grid-cols-6 grid-rows-6 border-l border-white/40">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border border-white/30" />
            ))}
          </div>
        </div>
      </section>

      {/* Primary Dashboard Metrics: Serious Infrastructure Indicators */}
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
                  {metrics.totalEvidenceRecords}
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
                  {metrics.captureQualityPassRate}%
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
                  {metrics.recordsWithVisualFindings}
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
                Unverified Findings
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-stone-600 dark:text-stone-300">
                  {metrics.unverifiedFindingsCount}
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
                  {metrics.evidenceSharedCount}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">WhatsApp/QR</span>
              </div>
              <p className="text-[10px] text-muted-foreground">Shared with buyers/traders</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mandatory Institutional Disclaimer Banner */}
      <section className="p-4 rounded-xl border border-emerald-800/30 bg-emerald-950/10 text-stone-800 dark:text-stone-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300 font-serif">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Institutional Integrity Ground & Legal Disclaimer:</span>
        </div>
        <p className="text-[11px] leading-relaxed text-stone-600 dark:text-stone-300">
          "KisanDrishti provides visual evidence only. It does not provide official mandi grading, laboratory testing, moisture measurement, chemical analysis, or financial/legal adjudication. It does not decide what the crop is worth—it creates standardized visual evidence that both sides can inspect."
        </p>
        <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
          <strong>Sample Limitation:</strong> This record describes visual observations from the captured sample. It does not prove that the captured sample represents the entire lot.
        </p>
      </section>

      {/* Main Grid: Recent Evidence Records & Evidence Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Evidence Records */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="font-serif font-bold text-base text-foreground">
                Recent Visual Evidence Records
              </h3>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/audits">
                View All Records
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="space-y-3">
            {audits.slice(0, 3).map((record) => (
              <Card key={record.id} className="border border-border hover:border-primary/50 transition-all bg-card shadow-xs">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={record.imageUrl}
                        alt={record.metadata.crop}
                        className="w-14 h-14 rounded-lg object-cover border border-border shrink-0"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-foreground">
                            {record.metadata.crop}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            ({record.metadata.lotId})
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                          {record.metadata.location}
                        </p>
                        <span className="text-[10px] font-mono text-stone-500 block">
                          {format(new Date(record.metadata.captureTimestamp), 'dd MMM yyyy, HH:mm')}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <Badge variant="outline" className="text-[10px] font-mono border-stone-300">
                        {record.id}
                      </Badge>
                      {record.isDemo && (
                        <span className="block text-[9px] font-mono text-amber-600 font-bold mt-1">
                          DEMO
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Observable Metric Summary Strip */}
                  <div className="grid grid-cols-3 gap-2 p-2 bg-stone-50 dark:bg-stone-900 rounded border border-border text-center font-mono text-[11px]">
                    <div>
                      <span className="text-[9px] text-muted-foreground block">BROKEN</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {record.stats.brokenPercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground block">DISCOLOR</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {record.stats.discoloredPercent}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-muted-foreground block">FOREIGN OBJ</span>
                      <span className="font-bold text-red-600 dark:text-red-400">
                        {record.stats.foreignObjectCount} {record.stats.foreignObjectCount === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-border">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      SHA-256 Sealed
                    </span>

                    <Button asChild size="sm" variant="ghost" className="h-7 text-xs text-primary font-medium">
                      <Link to={`/audits/${record.id}`}>
                        Inspect Visual Evidence
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Evidence Activity Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="font-serif font-bold text-base text-foreground">
                Evidence Protocol Timeline
              </h3>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-stone-300">
              Audit Stream
            </Badge>
          </div>

          <Card className="border border-border bg-card shadow-xs">
            <CardContent className="p-4 space-y-3.5">
              {timeline.length > 0 ? (
                timeline.slice(0, 5).map((evt, idx) => (
                  <div key={evt.id || idx} className="flex items-start gap-3 text-xs pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-foreground truncate">
                          {evt.crop} (Lot {evt.lotId})
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground shrink-0">
                          {format(new Date(evt.timestamp), 'HH:mm')}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {evt.details}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No timeline events recorded yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Business Model Summary Card */}
          <Card className="border border-border bg-stone-50 dark:bg-stone-900/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                Fair Business Architecture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-[11px]">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Farmers:</strong> Free basic smartphone visual capture. No paid hardware or per-audit fees.</span>
              </div>
              <div className="flex items-start gap-2 text-[11px]">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Procurement & Warehouses:</strong> Bulk evidence management, multi-mandi integration, and audit APIs.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
};
