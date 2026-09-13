import React, { useState, useRef, useEffect } from 'react';
import type { DetectionMarker, DefectCategory, AuditSummaryStats } from '@/types/evidence';
import { StatusBadge } from './StatusBadge';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  ShieldAlert,
  Ruler,
  SlidersHorizontal,
  Flame,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';

interface SpatialEvidenceViewerProps {
  imageUrl: string;
  stats: AuditSummaryStats;
  detections: DetectionMarker[];
  cropName: string;
  lotId: string;
  initialSelectedId?: number;
  onSelectMarker?: (marker: DetectionMarker | null) => void;
}

type ExtendedFilter = 'all' | 'foreign_object' | 'broken_grain' | 'discolored_shriveled' | 'visible_physical_damage' | 'critical' | 'minor';

export const SpatialEvidenceViewer: React.FC<SpatialEvidenceViewerProps> = ({
  imageUrl,
  stats,
  detections,
  cropName,
  lotId,
  initialSelectedId,
  onSelectMarker,
}) => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<ExtendedFilter>('all');
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(initialSelectedId || 1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);

  // Millimeter Ruler Tool State
  const [isRulerActive, setIsRulerActive] = useState<boolean>(false);
  const [rulerPoints, setRulerPoints] = useState<Array<{ xPercent: number; yPercent: number }>>([]);
  const [measuredDistanceMm, setMeasuredDistanceMm] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeMarker = detections.find(d => d.id === activeMarkerId) || null;

  // Critical defects: Foreign objects or broken grains > 3.5mm
  // Minor defects: slight discoloration or small scuffs
  const criticalDetections = detections.filter(d => d.category === 'foreign_object' || (d.category === 'broken_grain' && d.estimatedSizeMm >= 3.5));
  const minorDetections = detections.filter(d => !criticalDetections.some(c => c.id === d.id));

  // Filter markers based on selected category
  const visibleDetections = detections.filter(d => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'critical') return criticalDetections.some(c => c.id === d.id);
    if (selectedCategory === 'minor') return minorDetections.some(m => m.id === d.id);
    if (selectedCategory === 'foreign_object') return d.category === 'foreign_object';
    if (selectedCategory === 'broken_grain') return d.category === 'broken_grain';
    if (selectedCategory === 'discolored_shriveled') return d.category === 'discolored_shriveled' || d.category === 'immature';
    if (selectedCategory === 'visible_physical_damage') return d.category === 'visible_physical_damage' || d.category === 'weevil_hole_candidate';
    return d.category === selectedCategory;
  });

  // Smooth zoom into active marker coordinates
  const zoomToMarker = (marker: DetectionMarker) => {
    setActiveMarkerId(marker.id);
    onSelectMarker?.(marker);

    // Calculate center offset for zoom target
    const targetX = (50 - marker.xPercent) * 2.2;
    const targetY = (50 - marker.yPercent) * 2.2;

    setZoomLevel(2.5);
    setPanPosition({ x: targetX, y: targetY });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleSelectCategory = (cat: ExtendedFilter) => {
    setSelectedCategory(cat);
    const matching = detections.filter(d => {
      if (cat === 'all') return true;
      if (cat === 'critical') return criticalDetections.some(c => c.id === d.id);
      if (cat === 'minor') return minorDetections.some(m => m.id === d.id);
      if (cat === 'foreign_object') return d.category === 'foreign_object';
      if (cat === 'broken_grain') return d.category === 'broken_grain';
      if (cat === 'discolored_shriveled') return d.category === 'discolored_shriveled' || d.category === 'immature';
      if (cat === 'visible_physical_damage') return d.category === 'visible_physical_damage' || d.category === 'weevil_hole_candidate';
      return d.category === cat;
    });

    if (matching.length > 0) {
      zoomToMarker(matching[0]);
    } else {
      handleResetZoom();
    }
  };

  // Handle click on the canvas for the Millimeter Ruler Tool
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRulerActive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const xPercent = (clickX / rect.width) * 100;
    const yPercent = (clickY / rect.height) * 100;

    if (rulerPoints.length === 0 || rulerPoints.length >= 2) {
      setRulerPoints([{ xPercent, yPercent }]);
      setMeasuredDistanceMm(null);
    } else if (rulerPoints.length === 1) {
      const p1 = rulerPoints[0];
      const p2 = { xPercent, yPercent };
      setRulerPoints([p1, p2]);

      // Calculate distance: 100% canvas corresponds to ~110mm field of view (100mm inside grid)
      const dx = (p2.xPercent - p1.xPercent) * 1.1;
      const dy = (p2.yPercent - p1.yPercent) * 1.1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      setMeasuredDistanceMm(Number(dist.toFixed(1)));
    }
  };

  useEffect(() => {
    const firstAnomaly = detections.find(d => d.isHighPriorityAnomaly) || detections[0];
    if (firstAnomaly && !initialSelectedId) {
      setActiveMarkerId(firstAnomaly.id);
    }
  }, [detections, initialSelectedId]);

  return (
    <div className="w-full space-y-4">
      {/* Observable Visual Evidence Category & Severity Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
        <button
          type="button"
          onClick={() => handleSelectCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
          }`}
        >
          <span>All Flagged Observations</span>
          <span className="px-1.5 py-0.2 bg-black/20 rounded-full text-[10px] font-mono">
            {detections.length}
          </span>
        </button>

        {/* Critical Visual Defects */}
        <button
          type="button"
          onClick={() => handleSelectCategory('critical')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'critical'
              ? 'bg-red-800 text-white shadow-xs'
              : 'bg-red-600/10 text-red-800 dark:text-red-300 hover:bg-red-600/20'
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-red-500" />
          <span>Critical Defects</span>
          <span className="px-1.5 py-0.2 bg-red-900/30 rounded-full text-[10px] font-mono font-bold">
            {criticalDetections.length}
          </span>
        </button>

        {/* Minor Visual Defects */}
        <button
          type="button"
          onClick={() => handleSelectCategory('minor')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'minor'
              ? 'bg-stone-800 text-white shadow-xs'
              : 'bg-stone-500/10 text-stone-800 dark:text-stone-300 hover:bg-stone-500/20'
          }`}
        >
          <span>Minor Defects</span>
          <span className="px-1.5 py-0.2 bg-stone-900/20 rounded-full text-[10px] font-mono">
            {minorDetections.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('foreign_object')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'foreign_object'
              ? 'bg-red-700 text-white shadow-xs'
              : 'bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>{t.foreignObjects || 'Foreign Objects'}</span>
          <span className="px-1.5 py-0.2 bg-red-800/30 rounded-full text-[10px] font-mono">
            {stats.foreignObjectCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('broken_grain')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'broken_grain'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          <span>{t.brokenDamaged || 'Broken / Damaged'}</span>
          <span className="px-1.5 py-0.2 bg-amber-800/30 rounded-full text-[10px] font-mono">
            {stats.brokenPercent}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectCategory('discolored_shriveled')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            selectedCategory === 'discolored_shriveled'
              ? 'bg-orange-700 text-white shadow-xs'
              : 'bg-orange-500/10 text-orange-800 dark:text-orange-300 hover:bg-orange-500/20'
          }`}
        >
          <span>{t.discoloration || 'Discoloration'}</span>
          <span className="px-1.5 py-0.2 bg-orange-800/30 rounded-full text-[10px] font-mono">
            {stats.discoloredPercent}%
          </span>
        </button>
      </div>

      {/* Main Interactive Spatial Viewport & Inspection Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left / Center Viewport (8 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-2">
          
          <div className="relative w-full aspect-square bg-stone-950 rounded-xl overflow-hidden border-2 border-stone-800 shadow-lg select-none">
            
            {/* Viewport Toolbar Controls */}
            <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-stone-900/90 backdrop-blur text-white px-2 py-1 rounded-lg border border-stone-700 text-xs shadow-md">
              <span className="font-mono text-[11px] font-semibold text-emerald-400 mr-1 flex items-center gap-1">
                <Crosshair className="w-3.5 h-3.5" />
                10x10cm Grid
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 4))}
                className="p-1 hover:bg-stone-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                className="p-1 hover:bg-stone-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 hover:bg-stone-800 rounded transition-colors text-[11px] font-mono px-1.5"
                title="Reset View"
              >
                1.0x
              </button>
              <button
                type="button"
                onClick={() => setShowGridOverlay(!showGridOverlay)}
                className={`p-1 rounded transition-colors ${showGridOverlay ? 'text-emerald-400' : 'text-stone-500'}`}
                title="Toggle Optical Grid"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
              
              {/* Millimeter Ruler Tool Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsRulerActive(!isRulerActive);
                  setRulerPoints([]);
                  setMeasuredDistanceMm(null);
                }}
                className={`p-1 rounded transition-colors flex items-center gap-1 text-[11px] font-mono px-1.5 ${
                  isRulerActive ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
                }`}
                title="Toggle Millimeter Measurement Ruler"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Ruler</span>
              </button>
            </div>

            {/* Hint / Ruler Status overlay */}
            <div className="absolute top-3 right-3 z-30 bg-stone-900/80 backdrop-blur text-stone-300 px-2 py-1 rounded text-[10px] font-mono border border-stone-700 pointer-events-none">
              {isRulerActive ? (
                measuredDistanceMm !== null ? (
                  <span className="text-amber-400 font-bold">Measured: {measuredDistanceMm} mm</span>
                ) : rulerPoints.length === 1 ? (
                  <span className="text-amber-300">Click 2nd point to measure</span>
                ) : (
                  <span className="text-amber-300">Click 2 points on grid</span>
                )
              ) : (
                'Tap any pin to zoom & inspect'
              )}
            </div>

            {/* Pan & Zoom Canvas Area */}
            <div 
              ref={containerRef}
              onClick={handleCanvasClick}
              className={`w-full h-full relative transition-transform duration-500 ease-out flex items-center justify-center ${
                isRulerActive ? 'cursor-crosshair' : 'cursor-pointer'
              }`}
              style={{
                transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                transformOrigin: 'center center',
              }}
            >
              {/* High-Resolution Sample Image */}
              <img 
                src={imageUrl} 
                alt={`${cropName} sample grain lot ${lotId}`}
                className="w-full h-full object-cover"
                loading="eager"
              />

              {/* Optical Calibration Reference Grid Overlay */}
              {showGridOverlay && (
                <div className="absolute inset-0 calibration-grid pointer-events-none opacity-40" />
              )}

              {/* 10cm x 10cm Standardized Sample Boundary Box */}
              <div className="absolute inset-[6%] border-2 border-emerald-500/70 pointer-events-none rounded-sm shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <div className="absolute top-1 left-1 text-[8px] font-mono bg-emerald-950/80 text-emerald-300 px-1 rounded">
                  100 cm² Calibrated Area
                </div>
              </div>

              {/* Ruler Drawn Line & Points */}
              {isRulerActive && rulerPoints.length > 0 && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-30">
                  {rulerPoints.map((pt, i) => (
                    <circle
                      key={i}
                      cx={`${pt.xPercent}%`}
                      cy={`${pt.yPercent}%`}
                      r="4"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  ))}
                  {rulerPoints.length === 2 && (
                    <>
                      <line
                        x1={`${rulerPoints[0].xPercent}%`}
                        y1={`${rulerPoints[0].yPercent}%`}
                        x2={`${rulerPoints[1].xPercent}%`}
                        y2={`${rulerPoints[1].yPercent}%`}
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />
                      <text
                        x={`${(rulerPoints[0].xPercent + rulerPoints[1].xPercent) / 2}%`}
                        y={`${(rulerPoints[0].yPercent + rulerPoints[1].yPercent) / 2 - 2}%`}
                        fill="#fef08a"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                        className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      >
                        {measuredDistanceMm} mm
                      </text>
                    </>
                  )}
                </svg>
              )}

              {/* Interactive Numbered Detection Bounding Boxes & Pins */}
              {!isRulerActive && visibleDetections.map((marker) => {
                const isActive = marker.id === activeMarkerId;
                const isForeign = marker.category === 'foreign_object';
                const isBroken = marker.category === 'broken_grain';
                const isDiscolored = marker.category === 'discolored_shriveled' || marker.category === 'immature';

                let pinColor = 'bg-stone-700 border-white text-white';
                let boxBorder = 'border-stone-400/80';
                if (isForeign) {
                  pinColor = 'bg-red-600 border-white text-white animate-pulse shadow-red-500/50';
                  boxBorder = 'border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]';
                } else if (isBroken) {
                  pinColor = 'bg-amber-600 border-white text-white';
                  boxBorder = 'border-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]';
                } else if (isDiscolored) {
                  pinColor = 'bg-orange-600 border-white text-white';
                  boxBorder = 'border-orange-400 shadow-[0_0_6px_rgba(234,88,12,0.6)]';
                }

                return (
                  <div
                    key={marker.id}
                    className="absolute z-20 transition-transform duration-200"
                    style={{
                      left: `${marker.xPercent}%`,
                      top: `${marker.yPercent}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Spatial Bounding Box */}
                    <div 
                      className={`absolute -translate-x-1/2 -translate-y-1/2 border-2 ${boxBorder} rounded transition-all pointer-events-none ${
                        isActive ? 'scale-125 border-4 ring-2 ring-white/80' : 'opacity-85'
                      }`}
                      style={{
                        width: `${Math.max(24, marker.widthPercent * 4.5)}px`,
                        height: `${Math.max(24, marker.heightPercent * 4.5)}px`,
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
            </div>

            {/* Bottom Scale Indicator */}
            <div className="absolute bottom-3 left-3 z-30 bg-stone-900/90 text-stone-300 px-2.5 py-1 rounded text-[10px] font-mono border border-stone-700 flex items-center gap-2">
              <div className="w-10 h-1 bg-white" />
              <span>10 mm Metric Calibrated</span>
            </div>

            <div className="absolute bottom-3 right-3 z-30 bg-stone-900/90 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-mono border border-stone-700">
              Viewing: {activeMarker ? `#${activeMarker.id} ${activeMarker.categoryLabel}` : 'Full Calibrated Grid'}
            </div>
          </div>

          {/* Quick Anomaly Selection Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-[11px] font-mono font-semibold text-muted-foreground shrink-0 mr-1">
              Jump to Observation:
            </span>
            {detections.filter(d => d.isHighPriorityAnomaly).map((anomaly) => (
              <button
                key={anomaly.id}
                type="button"
                onClick={() => zoomToMarker(anomaly)}
                className={`px-2 py-1 rounded text-xs font-mono font-medium shrink-0 transition-colors flex items-center gap-1 border ${
                  activeMarkerId === anomaly.id
                    ? 'bg-primary text-primary-foreground border-primary font-bold shadow-xs'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  anomaly.category === 'foreign_object' ? 'bg-red-500' : 'bg-amber-500'
                }`} />
                <span>#{anomaly.id} {anomaly.category === 'foreign_object' ? 'Foreign' : 'Defect'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Inspection Detail Card (4-5 cols) */}
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
                    <span className="text-muted-foreground block text-[9px]">CALIBRATED GRID:</span>
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

                {/* Visual Reasoning */}
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
                    Observation is derived strictly from surface 2D pixel geometry and calibration grid contrast. It does not measure chemical moisture or protein.
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
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-border p-6 text-center text-muted-foreground text-xs">
              <Crosshair className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>Select any numbered pin or defect chip on the optical grid to inspect its observable visual geometry.</span>
            </Card>
          )}

          {/* Central Message Reminder */}
          <div className="p-3 rounded-lg border border-border bg-card/60 text-[11px] text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              <span>Standardized Visual Protocol</span>
            </div>
            <p>
              KisanDrishti does not decide what the crop is worth. It creates standardized visual evidence that both sides can inspect.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
