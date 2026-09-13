import type { AuditRecord, TimelineEvent } from '../types/evidence';
import { INITIAL_AUDIT_HISTORY } from './sampleData';
import { generateRecordHash } from './crypto';

const STORAGE_KEY = 'kisandrishti_audits_v2';
const TIMELINE_KEY = 'kisandrishti_timeline_v2';

let memoryRecords: AuditRecord[] = [];
let memoryTimeline: TimelineEvent[] = [];

/**
 * Initializes audit storage and ensures accurate SHA-256 hashes on preloaded demo records.
 */
export async function initializeAudits(): Promise<AuditRecord[]> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      const parsed = JSON.parse(raw) as AuditRecord[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryRecords = parsed;
        return memoryRecords;
      }
    }
  } catch (e) {
    console.warn('Error reading from localStorage, using memory storage', e);
  }

  // Pre-generate accurate SHA-256 hashes for seed audits
  const initializedSeeds: AuditRecord[] = [];
  for (const seed of INITIAL_AUDIT_HISTORY) {
    const correctHash = await generateRecordHash(seed);
    initializedSeeds.push({
      ...seed,
      cryptographicHash: correctHash,
      shareCount: seed.shareCount || 3,
    });
  }

  memoryRecords = initializedSeeds;
  saveToStorage(memoryRecords);

  // Initialize timeline events
  initializeTimelineEvents(initializedSeeds);

  return memoryRecords;
}

function initializeTimelineEvents(seeds: AuditRecord[]) {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(TIMELINE_KEY) : null;
    if (raw) {
      memoryTimeline = JSON.parse(raw);
      return;
    }
  } catch {
    // ignore
  }

  memoryTimeline = seeds.map((s, idx) => ({
    id: `tl-${idx + 1}`,
    auditId: s.id,
    lotId: s.metadata.lotId,
    crop: s.metadata.crop,
    timestamp: s.metadata.captureTimestamp,
    action: 'EVIDENCE_CREATED' as const,
    details: `Evidence package created for Lot ${s.metadata.lotId} with ${s.detections.length} observable visual findings.`,
  }));

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(memoryTimeline));
    }
  } catch {
    // ignore
  }
}

export function getAllAuditsSync(): AuditRecord[] {
  if (memoryRecords.length > 0) return memoryRecords;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      memoryRecords = JSON.parse(raw);
      return memoryRecords;
    }
  } catch {
    // fallback
  }
  return INITIAL_AUDIT_HISTORY;
}

export const getAuditHistory = getAllAuditsSync;

export function getAuditById(id: string): AuditRecord | undefined {
  const all = getAllAuditsSync();
  return all.find(a => a.id.toLowerCase() === id.toLowerCase() || a.metadata.lotId.toLowerCase() === id.toLowerCase());
}

export async function saveAuditRecord(record: AuditRecord): Promise<AuditRecord> {
  const hash = await generateRecordHash(record);
  const updatedRecord: AuditRecord = {
    ...record,
    cryptographicHash: hash,
    shareCount: record.shareCount || 0,
  };

  const all = getAllAuditsSync();
  const existingIdx = all.findIndex(a => a.id === record.id);
  
  if (existingIdx >= 0) {
    all[existingIdx] = updatedRecord;
  } else {
    all.unshift(updatedRecord);
  }

  memoryRecords = all;
  saveToStorage(all);

  // Log timeline event
  logTimelineEvent({
    id: `tl-${Date.now()}`,
    auditId: updatedRecord.id,
    lotId: updatedRecord.metadata.lotId,
    crop: updatedRecord.metadata.crop,
    timestamp: new Date().toISOString(),
    action: 'EVIDENCE_CREATED',
    details: `Standardized visual evidence package recorded. SHA-256: ${hash.slice(0, 12)}...`,
  });

  return updatedRecord;
}

export function logTimelineEvent(event: TimelineEvent) {
  memoryTimeline.unshift(event);
  if (memoryTimeline.length > 50) memoryTimeline.pop();
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TIMELINE_KEY, JSON.stringify(memoryTimeline));
    }
  } catch {
    // ignore
  }
}

export function getTimelineEvents(): TimelineEvent[] {
  if (memoryTimeline.length > 0) return memoryTimeline;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(TIMELINE_KEY) : null;
    if (raw) {
      memoryTimeline = JSON.parse(raw);
      return memoryTimeline;
    }
  } catch {
    // ignore
  }
  return [];
}

export function incrementAuditShareCount(id: string): void {
  const all = getAllAuditsSync();
  const target = all.find(a => a.id === id);
  if (target) {
    target.shareCount = (target.shareCount || 0) + 1;
    saveToStorage(all);
    
    logTimelineEvent({
      id: `tl-share-${Date.now()}`,
      auditId: target.id,
      lotId: target.metadata.lotId,
      crop: target.metadata.crop,
      timestamp: new Date().toISOString(),
      action: 'SHARED_WHATSAPP',
      details: `Evidence summary and tamper-evident link shared via WhatsApp / direct link.`,
    });
  }
}

export function getDashboardMetrics() {
  const audits = getAllAuditsSync();
  const total = audits.length;
  const passedQuality = audits.filter(a => (a.stats.captureQualityScore || 90) >= 80).length;
  const passRate = total > 0 ? Number(((passedQuality / total) * 100).toFixed(1)) : 98.4;
  const withFindings = audits.filter(a => a.detections.length > 0).length;
  
  // Total unverified items explicitly accounted for across all records
  let unverifiedCount = 0;
  let sharedCount = 0;
  for (const a of audits) {
    unverifiedCount += a.matrixRows.filter(r => r.status === 'UNVERIFIED').length;
    sharedCount += (a.shareCount || 1);
  }

  return {
    totalEvidenceRecords: total,
    captureQualityPassRate: passRate,
    recordsWithVisualFindings: withFindings,
    unverifiedFindingsCount: unverifiedCount,
    evidenceSharedCount: sharedCount,
  };
}

function saveToStorage(records: AuditRecord[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}
