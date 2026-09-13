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
  | 'weevil_hole_candidate' 
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

export interface AuditSessionMetadata {
  auditId: string;
  lotId: string;
  crop: CropType;
  variety?: string;
  location: string;
  buyerRef?: string;
  sampleSizeGrams: number;
  captureTimestamp: string;
  deviceInfo?: string;
  sessionToken: string;
  analysisVersion: string;
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
  sampleCoveragePercent: number;    // e.g. 94% on 10x10cm target
  captureQualityScore: number;      // e.g. 96%
  approximateAverageLengthMm: number;// e.g. 6.8 mm
  opticalColorDistribution: string; // e.g. "Amber Golden (580nm) - 91% Uniform"
  
  // Internal CV pipeline normalization only (NOT primary headline)
  totalObjects: number;
  totalFlaggedObservations: number;
  soundGrainRatePercent: number;
}

export interface AuditRecord {
  id: string;
  metadata: AuditSessionMetadata;
  imageUrl: string;
  stats: AuditSummaryStats;
  detections: DetectionMarker[];
  matrixRows: EvidenceMatrixRow[];
  explanations: GeminiExplanation[];
  cryptographicHash: string;
  isDemo?: boolean;
  isConfidenceSufficient?: boolean;
  fallbackWarningMessage?: string;
}
