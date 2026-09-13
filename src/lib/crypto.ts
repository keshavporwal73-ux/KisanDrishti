import type { AuditRecord, EvidenceMatrixRow, DetectionMarker } from '@/types/evidence';

/**
 * Creates a deterministic, canonical JSON representation of an evidence package.
 * Sorts object keys alphabetically and normalizes whitespace so identical findings
 * always yield an identical SHA-256 digest.
 */
export function canonicalizeEvidence(data: any): string {
  if (data === null || typeof data !== 'object') {
    return JSON.stringify(data);
  }

  if (Array.isArray(data)) {
    return '[' + data.map(item => canonicalizeEvidence(item)).join(',') + ']';
  }

  const sortedKeys = Object.keys(data).sort();
  const pairs = sortedKeys.map(key => {
    return `${JSON.stringify(key)}:${canonicalizeEvidence(data[key])}`;
  });

  return '{' + pairs.join(',') + '}';
}

/**
 * Type-safe SHA-256 implementation using Web Crypto API when available,
 * with standard bitwise pure-JS fallback.
 */
function sha256Fallback(str: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const maxWord = Math.pow(2, 32);
  let result = '';

  const words: number[] = [];
  const asciiBitLength = str.length * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isPrime: Record<number, boolean> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isPrime[candidate]) {
      for (let i = 0; i < 300; i += candidate) {
        isPrime[i] = true;
      }
      if (primeCounter < 8) {
        hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0;
      }
      k[primeCounter] = (Math.pow(candidate, 1 / 3) * maxWord) | 0;
      primeCounter++;
    }
  }

  let formattedStr = str + '\x80';
  while ((formattedStr.length % 64) !== 56) {
    formattedStr += '\x00';
  }

  for (let i = 0; i < formattedStr.length; i++) {
    const code = formattedStr.charCodeAt(i);
    words[i >> 2] = (words[i >> 2] || 0) | (code << (((3 - i) % 4) * 8));
  }

  words.push((asciiBitLength / maxWord) | 0);
  words.push(asciiBitLength | 0);

  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);

    for (let i = 0; i < 64; i++) {
      let w15 = w[i - 15] || 0;
      let w2 = w[i - 2] || 0;
      let s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      let s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      
      const val = i < 16 
        ? w[i] || 0 
        : ((w[i - 16] || 0) + s0 + (w[i - 7] || 0) + s1) | 0;
      w[i] = val;

      let a = hash[0], e = hash[4];
      let s1_e = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      let ch = (e & hash[5]) ^ (~e & hash[6]);
      let temp1 = (hash[7] + s1_e + ch + k[i] + val) | 0;
      let s0_a = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      let maj = (a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]);
      let temp2 = (s0_a + maj) | 0;

      hash = [(temp1 + temp2) | 0, hash[0], hash[1], hash[2], (hash[3] + temp1) | 0, hash[4], hash[5], hash[6]];
    }

    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }

  return result;
}

/**
 * Computes standard hex-encoded SHA-256 digest of any string.
 */
export async function computeSha256Hex(content: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(content);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (e) {
      console.warn('SubtleCrypto error, falling back to pure-JS sha256', e);
    }
  }

  return sha256Fallback(content);
}

/**
 * Generates the official cryptographic signature hash for an audit record.
 */
export async function generateRecordHash(record: Partial<AuditRecord>): Promise<string> {
  const canonicalPackage = {
    metadata: {
      auditId: record.metadata?.auditId,
      lotId: record.metadata?.lotId,
      crop: record.metadata?.crop,
      variety: record.metadata?.variety,
      location: record.metadata?.location,
      sampleDescription: record.metadata?.sampleDescription,
      hasOptionalSheetUsed: record.metadata?.hasOptionalSheetUsed,
      captureTimestamp: record.metadata?.captureTimestamp,
      analysisVersion: record.metadata?.analysisVersion,
    },
    stats: record.stats,
    detectionsSummary: record.detections?.map(d => ({
      id: d.id,
      category: d.category,
      xPercent: d.xPercent,
      yPercent: d.yPercent,
      status: d.status,
    })),
    matrixSummary: record.matrixRows?.map(r => ({
      parameter: r.parameter,
      result: r.result,
      status: r.status,
    })),
  };

  const canonicalJson = canonicalizeEvidence(canonicalPackage);
  return await computeSha256Hex(canonicalJson);
}

/**
 * Verifies if an audit record has been tampered with by recomputing the hash.
 */
export async function verifyRecordIntegrity(record: AuditRecord): Promise<{
  isValid: boolean;
  computedHash: string;
  recordedHash: string;
}> {
  const computed = await generateRecordHash(record);
  const recorded = record.cryptographicHash;
  return {
    isValid: computed.toLowerCase() === recorded.toLowerCase(),
    computedHash: computed,
    recordedHash: recorded,
  };
}
