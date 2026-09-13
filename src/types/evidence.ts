export type CropType = 
  | 'Wheat' 
  | 'Paddy (Rice)' 
  | 'Mustard' 
  | 'Soybean' 
  | 'Maize' 
  | 'Chana (Chickpea)' 
  | 'Cotton' 
  | 'Other';

export type VerificationStatus = 'OBSERVED' | 'POSSIBLE' | 'UNVERIFIED';

export type DefectCategory = 
  | 'foreign_object' 
  | 'broken_grain' 
  | 'discolored_shriveled' 
  | 'visible_physical_damage'
  | 'abnormal_appearance' 
  | 'immature' 
  | 'sound_sample';

export interface DetectionMarker {
  id: number;
  category: DefectCategory;
  categoryLabel: string;
  status: VerificationStatus;
  confidence: number; // 0 to 1
  xPercent: number; // 0 to 100 on image
  yPercent: number; // 0 to 100 on image
  widthPercent: number;
  heightPercent: number;
  findingTitle: string;
  visualEvidence: string;
  visualReasoning: string;
  estimatedSizeMm: number;
  isHighPriorityAnomaly: boolean;
  colorHex?: string;
  photoSource?: 'main' | 'closeUp' | 'context';
}

export interface EvidenceMatrixRow {
  id: string;
  parameter: string;
  categoryGroup: string;
  result: string;
  status: VerificationStatus;
  method: string;
  confidence: 'High' | 'Medium' | 'Low' | 'N/A';
  note: string;
}

export interface GeminiExplanation {
  finding: string;
  visualEvidence: string;
  visualReasoning: string;
  status: string;
  limitation: string;
  markerId?: number;
}

export interface CaptureQualityCheck {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
  tip: string;
}

export interface CaptureQualityGateResult {
  passed: boolean;
  score: number; // 0 to 100
  checks: {
    blur: CaptureQualityCheck;
    shadows: CaptureQualityCheck;
    lighting: CaptureQualityCheck;
    glare: CaptureQualityCheck;
    framing: CaptureQualityCheck;
    sampleVisibility: CaptureQualityCheck;
    overlap: CaptureQualityCheck;
    resolution: CaptureQualityCheck;
  };
  failureReasons: string[];
  correctiveGuidance: string[];
}

export interface CapturedPhotos {
  main: string;
  closeUp: string;
  context?: string;
}

export interface AuditSessionMetadata {
  auditId: string;
  lotId: string;
  crop: CropType;
  variety?: string;
  location: string;
  buyerRef?: string;
  sampleDescription?: string;
  captureTimestamp: string;
  deviceInfo?: string;
  sessionToken: string;
  analysisVersion: string;
  hasOptionalSheetUsed?: boolean;
}

export interface AuditSummaryStats {
  // Observable Visual Evidence (Primary User-Facing Metrics)
  brokenPercent: number;            // e.g. 6.4%
  brokenCount: number;
  discoloredPercent: number;        // e.g. 1.8%
  discoloredCount: number;
  foreignObjectCount: number;       // e.g. 2
  foreignObjectPercent: number;     // e.g. 0.5%
  visibleDamagePercent: number;     // e.g. 1.2%
  visibleDamageCount: number;
  abnormalAppearanceCount: number;  // e.g. 1
  sampleCoveragePercent: number;    // e.g. 94%
  captureQualityScore: number;      // e.g. 96%
  approximateAverageLengthMm: number;// e.g. 6.8 mm
  opticalColorDistribution: string; // e.g. "Amber Golden (580nm) - 91% Uniform"
  
  // Internal CV normalization metadata (NOT primary headline)
  totalObjects: number;
  totalFlaggedObservations: number;
  soundGrainRatePercent: number;
}

export interface AuditRecord {
  id: string;
  metadata: AuditSessionMetadata;
  imageUrl: string; // primary main photo for backward compat
  photos?: CapturedPhotos; // multi-photo set (main, close-up, optional context)
  stats: AuditSummaryStats;
  detections: DetectionMarker[];
  matrixRows: EvidenceMatrixRow[];
  explanations: GeminiExplanation[];
  cryptographicHash: string;
  qualityGate?: CaptureQualityGateResult;
  isDemo?: boolean;
  isConfidenceSufficient?: boolean;
  fallbackWarningMessage?: string;
  shareCount?: number;
  verifiedAt?: string;
}

export interface TimelineEvent {
  id: string;
  auditId: string;
  timestamp: string;
  lotId: string;
  crop: CropType;
  action: 'EVIDENCE_CREATED' | 'HASH_VERIFIED' | 'SHARED_WHATSAPP' | 'PDF_EXPORTED' | 'QR_ACCESSED';
  details: string;
}
