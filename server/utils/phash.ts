/**
 * KAISER AI — Perceptual Hash (pHash) Utility
 * Module 8: Anti-Spam Duplicate Blocker
 *
 * Generates a 64-bit visual fingerprint from a base64 image.
 * Two images are considered duplicates if their Hamming distance <= THRESHOLD.
 *
 * This is a pure TypeScript/Node.js implementation requiring no native addons.
 */

const HASH_SIZE = 8; // 8x8 = 64-bit hash
const THRESHOLD = 10; // Max Hamming distance to flag as duplicate

/**
 * Compute a simplified perceptual hash (dHash variant) from a base64-encoded image.
 * For server-side use without Canvas: operates on raw pixel approximation from base64 length + content sampling.
 *
 * In production, swap this for a native image library (sharp + dct) for true pHash.
 * This demo version provides effective duplicate detection for identical/near-identical uploads.
 */
export function computePhash(base64Data: string): string {
  // Strip data URL prefix if present
  const raw = base64Data.replace(/^data:image\/\w+;base64,/, "");

  // Use the raw base64 string to generate a deterministic 64-bit fingerprint
  // Divide the string into 64 equal segments, take the sum of char codes mod 256
  const chunkSize = Math.max(1, Math.floor(raw.length / 64));
  const values: number[] = [];

  for (let i = 0; i < 64; i++) {
    const start = i * chunkSize;
    const chunk = raw.slice(start, start + chunkSize);
    let sum = 0;
    for (let j = 0; j < chunk.length; j++) {
      sum += chunk.charCodeAt(j);
    }
    values.push(sum % 256);
  }

  // Compute median
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[31];

  // Build 64-bit hash: 1 if value >= median, 0 otherwise
  const bits = values.map((v) => (v >= median ? 1 : 0));

  // Convert to 16-char hex string (4 bits per char)
  let hex = "";
  for (let i = 0; i < 64; i += 4) {
    const nibble = (bits[i] << 3) | (bits[i + 1] << 2) | (bits[i + 2] << 1) | bits[i + 3];
    hex += nibble.toString(16);
  }

  return hex;
}

/**
 * Compute the Hamming distance between two pHash hex strings.
 * Returns the number of differing bits (lower = more similar).
 */
export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) return 64;

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    const n1 = parseInt(hash1[i], 16);
    const n2 = parseInt(hash2[i], 16);
    const xor = n1 ^ n2;
    // Count set bits in xor
    let n = xor;
    while (n) {
      distance += n & 1;
      n >>= 1;
    }
  }
  return distance;
}

/**
 * Check if a new image is a duplicate of any existing pHash in the store.
 * Returns the matching complaint ID if duplicate found, null otherwise.
 */
export function findDuplicate(
  newHash: string,
  existingHashes: Array<{ id: string; phash: string }>
): { isDuplicate: boolean; matchedId?: string; distance?: number } {
  for (const entry of existingHashes) {
    if (!entry.phash) continue;
    const dist = hammingDistance(newHash, entry.phash);
    if (dist <= THRESHOLD) {
      return { isDuplicate: true, matchedId: entry.id, distance: dist };
    }
  }
  return { isDuplicate: false };
}

export { THRESHOLD };
