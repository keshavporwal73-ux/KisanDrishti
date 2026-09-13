import type { AuditRecord } from '../types/evidence';
import { INITIAL_AUDIT_HISTORY, DEMO_WHEAT_AUDIT } from './sampleData';
import { generateRecordHash } from './crypto';

const STORAGE_KEY = 'kisandrishti_audits_v1';

let memoryRecords: AuditRecord[] = [];

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
    });
  }

  memoryRecords = initializedSeeds;
  saveToStorage(memoryRecords);
  return memoryRecords;
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

export function saveAuditRecord(record: AuditRecord): void {
  const existing = getAllAuditsSync();
  const filtered = existing.filter(a => a.id !== record.id);
  const updated = [record, ...filtered];
  memoryRecords = updated;
  saveToStorage(updated);
}

export function deleteAuditRecord(id: string): void {
  const existing = getAllAuditsSync();
  const updated = existing.filter(a => a.id !== id);
  memoryRecords = updated;
  saveToStorage(updated);
}

function saveToStorage(records: AuditRecord[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (e) {
    console.warn('Unable to persist to localStorage', e);
  }
}
