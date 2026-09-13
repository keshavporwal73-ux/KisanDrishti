import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAuditById } from '@/lib/storage';
import { SpatialEvidenceViewer } from '@/components/evidence/SpatialEvidenceViewer';
import { EvidenceMatrixTable } from '@/components/evidence/EvidenceMatrixTable';
import { GeminiExplanationPanel } from '@/components/evidence/GeminiExplanationPanel';
import { TamperEvidentCard } from '@/components/evidence/TamperEvidentCard';
import { ShareModal } from '@/components/evidence/ShareModal';
import { EvidenceReportCard } from '@/components/evidence/EvidenceReportCard';
import { StatusBadge } from '@/components/evidence/StatusBadge';
import { 
  ShieldCheck, 
  Layers, 
  Sparkles, 
  Lock, 
  Printer, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Grid3X3,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

export const AuditDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<string>('spatial');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<number | undefined>(1);
  const [simulateLowConfidence, setSimulateLowConfidence] = useState(false);

  const record = id ? getAuditById(id) : null;

  if (!record) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold font-serif">Audit Record Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested evidence record <code className="font-mono font-bold text-foreground">{id}</code> does not exist or has expired from local storage.
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/records">Back to Audit Records</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs -ml-2 text-muted-foreground">
              <Link to="/records">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                All Records
              </Link>
            </Button>
            <span className="text-muted-foreground">•</span>
            <span className="font-mono text-xs font-bold text-primary">{record.id}</span>
            {record.isDemo && (
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-800 dark:text-amber-300 font-mono text-[10px]">
                DEMO RECORD
              </Badge>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground flex items-center gap-2">
            <span>{record.metadata.crop} Sample Evidence Audit</span>
            <span className="text-sm font-normal text-muted-foreground font-mono">
              (Lot: {record.metadata.lotId})
            </span>
          </h1>

          <p className="text-xs text-muted-foreground">
            Captured on {format(new Date(record.metadata.captureTimestamp), 'dd MMMM yyyy, HH:mm')} at {record.metadata.location}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <ShareModal record={record} />
        </div>
      </div>

      {/* Low Confidence Optical Warning (When vision system cannot confidently analyze) */}
      {(simulateLowConfidence || record.isConfidenceSufficient === false) && (
        <div className="p-4 bg-amber-500/15 border-2 border-amber-500/30 rounded-xl text-amber-950 dark:text-amber-100 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <strong className="font-bold text-sm block text-amber-900 dark:text-amber-200">
              Reliable visual evidence could not be established.
            </strong>
            <p>
              The optical calibration confidence score fell below acceptable threshold. KisanDrishti does not invent or fabricate measurements when sample segmentation is uncertain. Please recapture the sample under better lighting and perpendicular alignment.
            </p>
          </div>
        </div>
      )}

      {/* Observable Visual Evidence Top KPI Cards (NOT Grain Counts) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Broken / Damaged
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-amber-700 dark:text-amber-400">
            {record.stats.brokenPercent}%
          </div>
          <div className="text-[10px] text-muted-foreground">
            {record.stats.brokenCount} observed fragments
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Discoloration
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-orange-700 dark:text-orange-400">
            {record.stats.discoloredPercent}%
          </div>
          <div className="text-[10px] text-muted-foreground">
            {record.stats.discoloredCount} shriveled / dark
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Foreign Objects
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-red-700 dark:text-red-400">
            {record.stats.foreignObjectCount} units
          </div>
          <div className="text-[10px] text-muted-foreground">
            Silica / weed seeds
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Grid Dispersion
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400">
            {record.stats.sampleCoveragePercent}%
          </div>
          <div className="text-[10px] text-muted-foreground">
            100 cm² calibrated target
          </div>
        </div>

        <div className="p-3 bg-card border border-border rounded-xl shadow-xs space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">
            Optical Quality
          </div>
          <div className="text-lg sm:text-xl font-mono font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{record.stats.captureQualityScore}%</span>
          </div>
          <div className="text-[10px] text-muted-foreground">
            Fiducials locked • 540 Lux
          </div>
        </div>
      </div>

      {/* Main Evidentiary Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-lg w-full sm:w-auto grid grid-cols-4 sm:flex">
          <TabsTrigger value="spatial" className="text-xs font-medium gap-1.5">
            <Layers className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Spatial Viewer</span>
          </TabsTrigger>
          <TabsTrigger value="matrix" className="text-xs font-medium gap-1.5">
            <FileText className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Evidence Matrix</span>
          </TabsTrigger>
          <TabsTrigger value="reasoning" className="text-xs font-medium gap-1.5">
            <Sparkles className="w-3.5 h-3.5 hidden sm:inline" />
            <span>Gemini Reasoning</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs font-medium gap-1.5">
            <Lock className="w-3.5 h-3.5 hidden sm:inline" />
            <span>SHA-256 Seal</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Interactive Spatial Evidence Viewer */}
        <TabsContent value="spatial" className="space-y-4 m-0 focus-visible:outline-hidden">
          <SpatialEvidenceViewer
            imageUrl={record.imageUrl}
            stats={record.stats}
            detections={record.detections}
            cropName={record.metadata.crop}
            lotId={record.metadata.lotId}
            initialSelectedId={selectedAnomalyId}
            onSelectMarker={(m) => setSelectedAnomalyId(m?.id)}
          />
        </TabsContent>

        {/* Tab 2: Standardized Evidence Matrix Table */}
        <TabsContent value="matrix" className="space-y-4 m-0 focus-visible:outline-hidden">
          <EvidenceMatrixTable rows={record.matrixRows} auditId={record.id} />
        </TabsContent>

        {/* Tab 3: Gemini Multimodal Reasoning Panel */}
        <TabsContent value="reasoning" className="space-y-4 m-0 focus-visible:outline-hidden">
          <GeminiExplanationPanel
            explanations={record.explanations}
            onSelectAnomaly={(id) => {
              setSelectedAnomalyId(id);
              setActiveTab('spatial');
            }}
          />
        </TabsContent>

        {/* Tab 4: Tamper-Evident Cryptographic Seal */}
        <TabsContent value="security" className="space-y-4 m-0 focus-visible:outline-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <TamperEvidentCard record={record} />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <EvidenceReportCard record={record} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Central Product Statement Banner */}
      <div className="p-4 rounded-xl border border-border bg-stone-900 text-stone-200 text-xs flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 block font-serif">KisanDrishti Protocol Ground:</span>
          <p className="text-stone-300">
            "KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."
          </p>
        </div>
        <div className="hidden sm:block shrink-0 font-mono text-[11px] text-emerald-400">
          SHA-256 Verified
        </div>
      </div>

    </div>
  );
};
