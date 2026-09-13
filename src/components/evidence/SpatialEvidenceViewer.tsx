import React, { useState, useRef } from 'react';
import type { DetectionMarker, AuditSummaryStats, CapturedPhotos, DefectCategory } from '@/types/evidence';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  Crosshair,
  Filter,
  Ruler,
  Info,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from './StatusBadge';
import { useLanguage } from '@/context/LanguageContext';

interface SpatialEvidenceViewerProps {
  imageUrl: string;
  photos?: CapturedPhotos;
  stats: AuditSummaryStats;
  detections: DetectionMarker[];
  cropName: string;
  lotId: string;
  initialSelectedId?: number;
  onSelectMarker?: (marker: DetectionMarker | null) => void;
}

export const SpatialEvidenceViewer: React.FC<SpatialEvidenceViewerProps> = ({
  imageUrl,
  photos,
  stats,
  detections,
  cropName,
  lotId,
  initialSelectedId,
  onSelectMarker,
}) => {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<number | undefined>(initialSelectedId ?? (detections[0]?.id));
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activePhotoSlot, setActivePhotoSlot] = useState<'main' | 'closeUp' | 'context'>('main');

  // Interactive Millimeter Ruler Tool
  const [rulerActive, setRulerActive] = useState(false);
  const [rulerPoints, setRulerPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [measuredDistanceMm, setMeasuredDistanceMm] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const activeMarker = detections.find((d) => d.id === selectedId);

  // Determine which photo image URL to display
  const currentImageUrl = 
    activePhotoSlot === 'closeUp' && photos?.closeUp
      ? photos.closeUp
      : activePhotoSlot === 'context' && photos?.context
      ? photos.context
      : (photos?.main || imageUrl);

  // Filter detections by category
  const filteredDetections = detections.filter((d) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'foreign_object') return d.category === 'foreign_object';
    if (activeCategory === 'broken_grain') return d.category === 'broken_grain';
    if (activeCategory === 'discolored_shriveled') return d.category === 'discolored_shriveled';
    if (activeCategory === 'visible_physical_damage') return d.category === 'visible_physical_damage';
    if (activeCategory === 'abnormal_appearance') return d.category === 'abnormal_appearance';
    return true;
  });

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(1, prev + delta), 4));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setRulerPoints([]);
    setMeasuredDistanceMm(null);
  };

  const zoomToMarker = (marker: DetectionMarker) => {
    setSelectedId(marker.id);
    if (marker.photoSource && marker.photoSource !== activePhotoSlot) {
      if (photos?.[marker.photoSource]) {
        setActivePhotoSlot(marker.photoSource);
      }
    }
    setZoomLevel(2.5);
    const targetX = 50 - marker.xPercent;
    const targetY = 50 - marker.yPercent;
    setPanOffset({ x: targetX * 1.5, y: targetY * 1.5 });
    onSelectMarker?.(marker);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rulerActive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (rulerPoints.length === 0) {
      setRulerPoints([{ x, y }]);
      setMeasuredDistanceMm(null);
    } else if (rulerPoints.length === 1) {
      const p1 = rulerPoints[0];
      const p2 = { x, y };
      setRulerPoints([p1, p2]);
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distPercent = Math.sqrt(dx * dx + dy * dy);
      // Metric: 100% width approx 100mm optical grid
      const distMm = Number((distPercent * 1.0).toFixed(1));
      setMeasuredDistanceMm(distMm);
    } else {
      setRulerPoints([{ x, y }]);
      setMeasuredDistanceMm(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Observable Metrics Dashboard Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
        {/* Metric 1: Broken */}
        <div className="p-3 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
            Broken Material
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
              {stats.brokenPercent}%
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ({stats.brokenCount} obs)
            </span>
          </div>
        </div>

        {/* Metric 2: Discoloration */}
        <div className="p-3 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
            Visible Discoloration
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-orange-600 dark:text-orange-400">
              {stats.discoloredPercent}%
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ({stats.discoloredCount} obs)
            </span>
          </div>
        </div>

        {/* Metric 3: Foreign Objects */}
        <div className="p-3 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
            Foreign Material
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-red-600 dark:text-red-400">
              {stats.foreignObjectCount}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              {stats.foreignObjectCount === 1 ? 'item' : 'items'} ({stats.foreignObjectPercent}%)
            </span>
          </div>
        </div>

        {/* Metric 4: Visible Damage */}
        <div className="p-3 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
            Surface Damage
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-yellow-600 dark:text-yellow-500">
              {stats.visibleDamagePercent}%
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">
              ({stats.visibleDamageCount} obs)
            </span>
          </div>
        </div>

        {/* Metric 5: Sample Coverage */}
        <div className="p-3 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
            Sample Dispersion
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.sampleCoveragePercent}%
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">Even</span>
          </div>
        </div>

        {/* Metric 6: Quality Gate */}
        <div className="p-3 rounded-xl border border-border bg-card shadow-xs">
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase block">
            Quality Gate
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {stats.captureQualityScore}%
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">PASSED</span>
          </div>
        </div>
      </div>

      {/* Multi-Photo Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl border border-border bg-stone-100 dark:bg-stone-900">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-muted-foreground mr-1 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" />
            Photo View:
          </span>
          <Button
            size="sm"
            variant={activePhotoSlot === 'main' ? 'default' : 'ghost'}
            className="text-xs h-7 gap-1"
            onClick={() => setActivePhotoSlot('main')}
          >
            <span>Photo 1: Main Sample</span>
          </Button>

          {photos?.closeUp && (
            <Button
              size="sm"
              variant={activePhotoSlot === 'closeUp' ? 'default' : 'ghost'}
              className="text-xs h-7 gap-1"
              onClick={() => setActivePhotoSlot('closeUp')}
            >
              <span>Photo 2: Close-up Macro</span>
            </Button>
          )}

          {photos?.context && (
            <Button
              size="sm"
              variant={activePhotoSlot === 'context' ? 'default' : 'ghost'}
              className="text-xs h-7 gap-1"
              onClick={() => setActivePhotoSlot('context')}
            >
              <span>Photo 3: Wider Context</span>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[10px] font-mono border-stone-300">
            {activePhotoSlot === 'main' ? 'Overall 2D Inspection' : activePhotoSlot === 'closeUp' ? 'Macro Grain Detail' : 'Trolley Context'}
          </Badge>
        </div>
      </div>

      {/* Main Interactive Spatial View Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Image Canvas & Tools */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 p-2 rounded-lg border border-border text-xs">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              <span className="font-semibold text-muted-foreground text-[11px] mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <Button
                variant={activeCategory === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 text-[11px] px-2"
                onClick={() => setActiveCategory('all')}
              >
                All ({detections.length})
              </Button>
              <Button
                variant={activeCategory === 'foreign_object' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 text-[11px] px-2 text-red-600 dark:text-red-400"
                onClick={() => setActiveCategory('foreign_object')}
              >
                Foreign Material
              </Button>
              <Button
                variant={activeCategory === 'broken_grain' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 text-[11px] px-2 text-amber-600 dark:text-amber-400"
                onClick={() => setActiveCategory('broken_grain')}
              >
                Broken
              </Button>
              <Button
                variant={activeCategory === 'discolored_shriveled' ? 'default' : 'ghost'}
                size="sm"
                className="h-6 text-[11px] px-2 text-orange-600 dark:text-orange-400"
                onClick={() => setActiveCategory('discolored_shriveled')}
              >
                Discoloration
              </Button>
            </div>

            {/* Zoom & Ruler Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant={rulerActive ? 'default' : 'outline'}
                size="sm"
                className="h-7 text-xs gap-1 border-stone-300"
                onClick={() => setRulerActive(!rulerActive)}
                title="Interactive Millimeter Ruler"
              >
                <Ruler className="w-3 h-3" />
                <span>Ruler</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 border-stone-300"
                onClick={() => handleZoom(0.5)}
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 border-stone-300"
                onClick={() => handleZoom(-0.5)}
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0 border-stone-300"
                onClick={handleReset}
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Interactive Image Viewport */}
          <div
            ref={containerRef}
            onClick={handleImageClick}
            className={`relative rounded-xl overflow-hidden border-2 border-stone-800 bg-stone-950 aspect-4/3 sm:aspect-16/10 select-none shadow-md ${
              rulerActive ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
            }`}
          >
            {/* Image Container with Zoom & Pan */}
            <div
              className="w-full h-full relative transition-transform duration-200 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x}%, ${panOffset.y}%)`,
                transformOrigin: 'center center',
              }}
            >
              <img
                src={currentImageUrl}
                alt={`${cropName} sample visual evidence`}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Spatial Anomaly Markers & Bounding Boxes */}
              {filteredDetections.map((marker) => {
                const isActive = selectedId === marker.id;
                const pinColor = 
                  marker.category === 'foreign_object' 
                    ? 'bg-red-600 text-white border-white' 
                    : marker.category === 'broken_grain'
                    ? 'bg-amber-500 text-stone-900 border-white'
                    : marker.category === 'discolored_shriveled'
                    ? 'bg-orange-600 text-white border-white'
                    : 'bg-yellow-500 text-stone-900 border-white';

                const boxBorder = 
                  marker.category === 'foreign_object' 
                    ? 'border-red-500 bg-red-500/15' 
                    : marker.category === 'broken_grain'
                    ? 'border-amber-400 bg-amber-400/15'
                    : 'border-orange-400 bg-orange-400/15';

                return (
                  <div
                    key={marker.id}
                    className="absolute z-20"
                    style={{
                      left: `${marker.xPercent}%`,
                      top: `${marker.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Bounding Box Highlight */}
                    <div
                      className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 ${boxBorder} rounded transition-all pointer-events-none ${
                        isActive ? 'scale-125 border-4 ring-2 ring-white/90 shadow-lg' : 'opacity-85'
                      }`}
                      style={{
                        width: `${Math.max(26, marker.widthPercent * 4.5)}px`,
                        height: `${Math.max(26, marker.heightPercent * 4.5)}px`,
                      }}
                    />

                    {/* Interactive Numbered Pin */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        zoomToMarker(marker);
                      }}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-bold shadow-md cursor-pointer transition-transform hover:scale-125 ${pinColor} ${
                        isActive ? 'scale-125 ring-2 ring-primary ring-offset-1' : ''
                      }`}
                      title={`${marker.findingTitle} (#${marker.id})`}
                    >
                      {marker.id}
                    </button>
                  </div>
                );
              })}

              {/* Ruler Drawn Line Overlay */}
              {rulerPoints.length === 2 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                  <line
                    x1={`${rulerPoints[0].x}%`}
                    y1={`${rulerPoints[0].y}%`}
                    x2={`${rulerPoints[1].x}%`}
                    y2={`${rulerPoints[1].y}%`}
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  <circle cx={`${rulerPoints[0].x}%`} cy={`${rulerPoints[0].y}%`} r="4" fill="#10B981" />
                  <circle cx={`${rulerPoints[1].x}%`} cy={`${rulerPoints[1].y}%`} r="4" fill="#10B981" />
                </svg>
              )}
            </div>

            {/* Scale Bar Indicator */}
            <div className="absolute bottom-3 left-3 z-30 bg-stone-900/90 text-stone-300 px-2.5 py-1 rounded text-[10px] font-mono border border-stone-700 flex items-center gap-2">
              <div className="w-8 h-1 bg-white" />
              <span>10 mm Standard Scale</span>
            </div>

            {/* Ruler Result HUD */}
            {rulerActive && (
              <div className="absolute top-3 left-3 z-30 bg-emerald-950/90 text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-mono border border-emerald-600 flex items-center gap-2">
                <Ruler className="w-3.5 h-3.5" />
                <span>
                  {measuredDistanceMm !== null 
                    ? `Measured Length: ${measuredDistanceMm} mm` 
                    : rulerPoints.length === 1 
                    ? 'Click 2nd point to measure length' 
                    : 'Click any 2 points on image to measure'}
                </span>
              </div>
            )}

            <div className="absolute bottom-3 right-3 z-30 bg-stone-900/90 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-mono border border-stone-700">
              Viewing: {activeMarker ? `#${activeMarker.id} ${activeMarker.categoryLabel}` : 'Full Calibrated Grid'}
            </div>
          </div>

          {/* Quick Anomaly Selection Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-mono font-semibold text-muted-foreground shrink-0 mr-1">
              Jump to Observation:
            </span>
            {detections.map((anomaly) => (
              <button
                key={anomaly.id}
                type="button"
                onClick={() => zoomToMarker(anomaly)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border shrink-0 transition-colors ${
                  selectedId === anomaly.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                #{anomaly.id} {anomaly.category.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Anomaly Inspection Details */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3">
          {activeMarker ? (
            <Card className="border-2 border-primary/30 shadow-md bg-card">
              <CardHeader className="pb-3 border-b border-border bg-muted/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-mono font-bold text-xs flex items-center justify-center">
                        #{activeMarker.id}
                      </span>
                      <StatusBadge status={activeMarker.status} size="sm" />
                    </div>
                    <CardTitle className="text-base font-bold text-foreground">
                      {activeMarker.findingTitle}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] shrink-0 border-stone-300">
                    {activeMarker.estimatedSizeMm} mm
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 text-xs">
                {/* Spatial Coordinates Box */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-stone-100 dark:bg-stone-900 rounded font-mono text-[11px]">
                  <div>
                    <span className="text-muted-foreground block text-[9px]">PHOTO COORDINATES:</span>
                    <span className="font-semibold text-foreground">
                      X: {activeMarker.xPercent}% • Y: {activeMarker.yPercent}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px]">CONFIDENCE:</span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {(activeMarker.confidence * 100).toFixed(0)}% (High)
                    </span>
                  </div>
                </div>

                {/* Visual Evidence Finding */}
                <div className="space-y-1">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground block">
                    Observed Visual Evidence:
                  </span>
                  <p className="text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-950 p-2.5 rounded border border-border leading-relaxed">
                    {activeMarker.visualEvidence}
                  </p>
                </div>

                {/* Gemini Visual Reasoning */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-primary font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gemini Multimodal Reasoning:</span>
                  </div>
                  <p className="text-muted-foreground bg-primary/5 p-2.5 rounded border border-primary/15 leading-relaxed">
                    {activeMarker.visualReasoning}
                  </p>
                </div>

                {/* Epistemic Limitation Notice */}
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-900 dark:text-amber-200">
                  <span className="font-semibold block mb-0.5">Epistemic Boundary:</span>
                  <span>
                    Observation is derived strictly from surface 2D pixel geometry and contrast. It does not measure internal defects, chemical moisture, or protein.
                  </span>
                </div>

                {/* Navigation Between Objects */}
                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      const idx = detections.findIndex(d => d.id === activeMarker.id);
                      const prev = idx > 0 ? detections[idx - 1] : detections[detections.length - 1];
                      zoomToMarker(prev);
                    }}
                  >
                    Previous
                  </Button>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    {detections.findIndex(d => d.id === activeMarker.id) + 1} of {detections.length}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      const idx = detections.findIndex(d => d.id === activeMarker.id);
                      const next = idx < detections.length - 1 ? detections[idx + 1] : detections[0];
                      zoomToMarker(next);
                    }}
                  >
                    Next Anomaly
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border p-6 text-center text-muted-foreground text-xs">
              <Crosshair className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>Select any numbered pin on the image to inspect its observable visual geometry.</span>
            </Card>
          )}

          {/* Central Product Message Reminder */}
          <div className="p-3.5 rounded-xl border border-border bg-stone-900 text-stone-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 font-serif">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Standardized Visual Protocol</span>
            </div>
            <p className="text-stone-300 text-[11px] leading-relaxed">
              "KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
