type OcrWorker = {
  recognize: (image: string) => Promise<{ data: { text: string; confidence?: number } }>;
  terminate: () => Promise<void>;
};

let ocrWorkerPromise: Promise<OcrWorker> | null = null;

type ExtractedMedicine = {
  name: string;
  confidence: number;
  dosage?: string;
  frequency?: string;
};

type DatabaseMedicine = {
  name: string;
  available: boolean;
};

type MatchedMedicine = ExtractedMedicine & {
  available: boolean;
  inStock: boolean;
  matchType: 'exact' | 'partial' | 'notfound';
  similarity?: number;
};

export type MedicineExtractionResult = {
  medicines: ExtractedMedicine[];
  rawText: string;
  prescriptionInfo: Record<string, string | number | boolean>;
};

const MEDICINE_STOPWORDS = new Set([
  'sig',
  'take',
  'tablet',
  'tablets',
  'capsule',
  'capsules',
  'cap',
  'tabs',
  'tab',
  'with',
  'food',
  'every',
  'for',
  'days',
  'day',
  'hours',
  'hour',
  'as',
  'needed',
  'prn',
  'am',
  'pm',
  'and',
  'or',
  'the',
  'a',
  'an',
  'of',
  'mg',
  'ml',
  'mcg',
  'g',
  'iu',
  'dose',
  'times',
  'x',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'rx',
  'qty',
  'quantity',
  'no',
  'date',
  'name',
  'dr',
  'patient',
  'daily',
  'weekly',
  'monthly'
]);

const DOSAGE_REGEX = /(\d+(?:\.\d+)?)\s?(mg|ml|mcg|g|iu|units?)\b/i;
const FREQUENCY_REGEX = /(every\s+\d+\s*(hours?|hrs?)|\b\d+\s*x\s*(daily|day)\b|\b(bid|tid|qid|od|once\s+daily|twice\s+daily|three\s+times\s+daily|as\s+needed)\b)/i;

async function getOcrWorker(): Promise<OcrWorker> {
  if (!ocrWorkerPromise) {
    ocrWorkerPromise = (async () => {
      try {
        const tesseract = await import('tesseract.js');
        const createWorker = tesseract.createWorker ?? tesseract.default?.createWorker ?? tesseract.createWorker;

        if (typeof createWorker !== 'function') {
          throw new Error('Tesseract createWorker is not available');
        }

        // Create worker without passing a logger function (avoid sending functions to worker)
        let maybeWorker: any = createWorker();

        // Some builds might return a Promise from createWorker
        const realWorker = typeof maybeWorker?.then === 'function' ? await maybeWorker : maybeWorker;

        // If worker exposes load, perform initialization; otherwise assume it's ready
        if (typeof realWorker.load === 'function') {
          await realWorker.load();
          await realWorker.loadLanguage?.('eng');
          await realWorker.initialize?.('eng');

          // Configure OCR for prescription images
          try {
            await realWorker.setParameters?.({
              tessedit_pageseg_mode: '6',
              preserve_interword_spaces: '1',
              tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-./%(), ',
            });
          } catch (e) {
            // Non-fatal if setParameters not available
          }
        }

        const wrapper: OcrWorker = {
          recognize: (image: string) => realWorker.recognize(image),
          terminate: () => (typeof realWorker.terminate === 'function' ? realWorker.terminate() : Promise.resolve()),
        };

        return wrapper;
      } catch (error) {
        ocrWorkerPromise = null;
        throw error;
      }
    })();
  }

  return ocrWorkerPromise;
}

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, value));
}

async function loadImageElement(imageSource: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load the prescription image'));
    image.src = imageSource;
  });
}

async function optimizePrescriptionImage(imageBase64: string): Promise<string> {
  const imageSource = imageBase64.startsWith('data:') ? imageBase64 : `data:image/png;base64,${imageBase64}`;
  const image = await loadImageElement(imageSource);

  const maxDimension = 2200;
  // Upscale small images to improve OCR; for large images, downscale to maxDimension
  const naturalMax = Math.max(image.naturalWidth, image.naturalHeight) || 1;
  let scale = 1;
  if (naturalMax < 1200) {
    // upscale small images to ~1500px for better OCR
    scale = Math.min(2, Math.max(1, Math.ceil(1500 / naturalMax)));
  } else {
    scale = Math.min(1, maxDimension / naturalMax);
  }

  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Unable to prepare image for OCR');
  }

  // Use canvas filters to increase contrast and grayscale before manual thresholding
  // Some browsers support context.filter; set as a best-effort enhancement
  try {
    // stronger contrast and grayscale often helps handwriting/low-contrast text
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    context.filter = 'grayscale(100%) contrast(160%)';
  } catch (e) {
    // ignore if not supported
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(image, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  // compute brightness histogram to pick a good threshold (simple Otsu-ish)
  const hist = new Uint32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    hist[gray]++;
  }

  // find threshold via simple bimodal detection
  let total = 0;
  for (let i = 0; i < 256; i++) total += hist[i];
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = t;
    }
  }

  // Apply threshold with a light margin to preserve faint strokes
  const margin = 8;
  const tVal = Math.max(100, Math.min(220, threshold + margin));

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    const value = gray > tVal ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }

  context.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

/**
 * Apply an unsharp mask (simple convolution) to a canvas to emphasize strokes.
 */
function applyUnsharpMaskToCanvas(canvas: HTMLCanvasElement, amount = 0.7, radius = 1) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);

  // simple 3x3 sharpening kernel
  const kernel = [
    0, -1 * radius, 0,
    -1 * radius, 1 + 4 * radius, -1 * radius,
    0, -1 * radius, 0
  ];

  const data = src.data;
  const out = dst.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0, g = 0, b = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const ix = Math.min(w - 1, Math.max(0, x + kx));
          const iy = Math.min(h - 1, Math.max(0, y + ky));
          const i = (iy * w + ix) * 4;
          const kval = kernel[(ky + 1) * 3 + (kx + 1)];
          r += data[i] * kval;
          g += data[i + 1] * kval;
          b += data[i + 2] * kval;
        }
      }
      const idx = (y * w + x) * 4;
      out[idx] = clampChannel((1 - amount) * data[idx] + amount * r);
      out[idx + 1] = clampChannel((1 - amount) * data[idx + 1] + amount * g);
      out[idx + 2] = clampChannel((1 - amount) * data[idx + 2] + amount * b);
      out[idx + 3] = data[idx + 3];
    }
  }

  ctx.putImageData(dst, 0, 0);
}

/**
 * Run multiple OCR passes with different PSM modes and preprocessing variations, returning the best text.
 */
async function runMultiPassOcr(imageDataUrl: string): Promise<string> {
  const psmCandidates = [6, 11, 3, 7];
  const preprocessVariants = ['default', 'sharpen', 'highcontrast'];

  const attempts: { text: string; score: number }[] = [];
  const worker = await getOcrWorker();

  for (const variant of preprocessVariants) {
    // prepare a canvas variant
    const img = await loadImageElement(imageDataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (variant === 'sharpen') {
      applyUnsharpMaskToCanvas(canvas, 0.9, 1);
    } else if (variant === 'highcontrast') {
      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ctx.filter = 'contrast(180%) grayscale(100%)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } catch (e) {
        // ignore
      }
    }

    const variantDataUrl = canvas.toDataURL('image/png');

    for (const psm of psmCandidates) {
      try {
        // set PSM for this pass
        try {
          await (worker as any).setParameters?.({ tessedit_pageseg_mode: String(psm) });
        } catch (e) {
          // ignore if setParameters unsupported
        }

        const r = await worker.recognize(variantDataUrl);
        const text = (r?.data?.text || '').trim();
        const score = scoreOcrText(text);
        attempts.push({ text, score });
      } catch (err) {
        // continue on per-pass errors
        console.debug('OCR pass error (psm', psm, 'variant', variant, '):', err);
      }
    }
  }

  if (attempts.length === 0) return '';

  attempts.sort((a, b) => b.score - a.score);
  return attempts[0].text;
}

/**
 * Heuristic scoring: prefer longer text with more alpha tokens and fewer symbols.
 */
function scoreOcrText(text: string): number {
  if (!text) return 0;
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let score = 0;
  for (const line of lines) {
    const tokens = line.split(/\s+/).filter(Boolean);
    for (const t of tokens) {
      const clean = t.replace(/[^a-zA-Z]/g, '');
      if (clean.length >= 3) score += 2;
      else if (clean.length === 2) score += 1;
    }
    // lines with digits (dosage) are helpful
    if (/\d/.test(line)) score += 1;
  }
  // small penalty for many non-alphanumeric chars
  const nonAlpha = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
  score -= Math.min(5, Math.floor(nonAlpha / 3));
  return score;
}

/**
 * Extract text from prescription image using local Tesseract OCR.
 */
export async function extractTextWithTesseract(imageBase64: string): Promise<string> {
  try {
    const optimizedImage = await optimizePrescriptionImage(imageBase64);
    const worker = await getOcrWorker();

    // First try multiple passes with different PSM and preprocessing to improve handwriting OCR
    let text = await runMultiPassOcr(optimizedImage);

    // Fallback: single pass recognize if multi-pass returned nothing
    if (!text) {
      try {
        const result = await worker.recognize(optimizedImage);
        text = (result?.data?.text || '').trim();
      } catch (e) {
        // ignore and let outer catch handle
        text = '';
      }
    }

    if (!text) {
      console.warn('No text detected in image');
      return '';
    }

    console.log('✓ Text extracted from image:', text.substring(0, 100) + '...');
    return text;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Tesseract OCR error:', message);
    throw new Error(`Failed to extract text from image: ${message}`);
  }
}
function cleanToken(token: string): string {
  return token.replace(/[^a-z0-9+\-]/gi, '').trim();
}

function extractFrequency(text: string): string | undefined {
  const match = text.match(FREQUENCY_REGEX);
  return match ? match[0].trim() : undefined;
}

function extractDosage(text: string): string | undefined {
  const match = text.match(DOSAGE_REGEX);
  return match ? `${match[1]}${match[2].toLowerCase()}` : undefined;
}

function extractMedicineNameFromLine(line: string): string | undefined {
  const cleanedLine = line.replace(/[(),]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleanedLine) {
    return undefined;
  }

  const dosageMatch = cleanedLine.match(DOSAGE_REGEX);
  const stopAt = dosageMatch ? cleanedLine.indexOf(dosageMatch[0]) : cleanedLine.length;
  const beforeDosage = cleanedLine.slice(0, stopAt).trim();
  const candidateWords = (beforeDosage || cleanedLine).split(' ');

  const filtered = candidateWords
    .map(cleanToken)
    .filter((word) => {
      if (!word) return false;
      const lower = word.toLowerCase();
      // Skip known stop words
      if (MEDICINE_STOPWORDS.has(lower)) return false;
      // Skip pure numeric tokens (e.g. "8", "7", "421")
      if (/^\d+$/.test(lower)) return false;
      // Skip special characters
      if (/^[+\-]+$/.test(lower)) return false;
      return true;
    });

  if (filtered.length === 0) {
    return undefined;
  }

  const resultName = filtered.slice(0, 3).join(' ').trim();
  
  // Rule: Final generated name must be longer than 2 characters
  if (resultName.length <= 2) {
    return undefined;
  }

  return resultName;
}

function extractMedicinesFromTextFallback(text: string): MedicineExtractionResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => Boolean(line));

  const medicinesMap = new Map<string, { name: string; dosage?: string; frequency?: string; confidence: number }>();

  for (const line of lines) {
    const name = extractMedicineNameFromLine(line);
    if (!name) {
      continue;
    }

    const dosage = extractDosage(line);
    const frequency = extractFrequency(line);
    const confidence = dosage ? 0.7 : 0.5;
    const key = name.toLowerCase();

    if (!medicinesMap.has(key)) {
      medicinesMap.set(key, { name, dosage, frequency, confidence });
    }
  }

  return {
    medicines: Array.from(medicinesMap.values()),
    rawText: text,
    prescriptionInfo: {},
  };
}

/**
 * Extract medicine names from a prescription image using local Tesseract OCR + rule-based parsing
 * @param imageBase64 - Base64 encoded image data (with data URL prefix)
 * @returns Extracted medicines and prescription information
 */
export async function extractMedicinesFromPrescription(
  imageBase64: string
): Promise<MedicineExtractionResult> {
  try {
    console.log('Starting prescription analysis (local OCR + rule-based parsing)...');

    console.log('Step 1: Extracting text from prescription using local Tesseract OCR...');
    const prescriptionText = await extractTextWithTesseract(imageBase64);

    if (!prescriptionText) {
      return {
        medicines: [],
        rawText: 'Unable to extract text from image. Please try with a clearer prescription photo.',
        prescriptionInfo: {}
      };
    }

    console.log('Step 2: Extracting medicines with rule-based parser...');
    const result = extractMedicinesFromTextFallback(prescriptionText);

    const filteredMedicines = result.medicines.filter(med => {
      return med && med.name && med.confidence >= 0.3;
    });

    filteredMedicines.sort((a, b) => b.confidence - a.confidence);

    console.log(`✓ Found ${filteredMedicines.length} medicines`);

    return {
      ...result,
      medicines: filteredMedicines
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract medicines from prescription: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Batch search for medicines in the database
 * @param medicineNames - Array of medicine names to search for
 * @param allMedicines - Array of all available medicines from database
 * @returns Matched medicines with availability info
 */
export function matchMedicinesWithDatabase(
  medicineNames: ExtractedMedicine[],
  allMedicines: DatabaseMedicine[]
): MatchedMedicine[] {
  const matched = medicineNames.map<MatchedMedicine>((detected) => {
    const detectedLower = detected.name.toLowerCase();
    
    // Try exact match first
    let bestMatch = allMedicines.find(
      med => med.name.toLowerCase() === detectedLower
    );

    if (bestMatch) {
      return {
        ...detected,
        available: true,
        inStock: bestMatch.available,
        matchType: 'exact' as const,
      };
    }

    // Try partial match and substring match
    let bestSimilarity = 0;
    let bestPartialMatch: DatabaseMedicine | null = null;
    let bestPartialInStock = false;

    allMedicines.forEach((med) => {
      const dbName = med.name.toLowerCase();
      
      // Check for Substring match (e.g., detected "Amoxicillin Clavulanic" contains DB "Amoxicillin")
      // We require the name to be at least 4 characters to avoid tiny words matching everything
      if (dbName.length > 3 && (detectedLower.includes(dbName) || dbName.includes(detectedLower))) {
        const similarity = 0.9; // Assign high score for substring match
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestPartialMatch = med;
          bestPartialInStock = med.available;
        }
      } else {
        // Fallback to strict spelling similarity
        const similarity = calculateSimilarity(detectedLower, dbName);
        if (similarity > bestSimilarity && similarity >= 0.7) {
          bestSimilarity = similarity;
          bestPartialMatch = med;
          bestPartialInStock = med.available;
        }
      }
    });

    if (bestPartialMatch) {
      return {
        ...detected,
        available: true,
        inStock: bestPartialInStock,
        matchType: 'partial' as const,
        similarity: bestSimilarity,
      };
    }

    // Not found in database
    return {
      ...detected,
      available: false,
      inStock: false,
      matchType: 'notfound' as const,
    };
  });

  // Strict Rule Option 2: If a medicine is NOT in the database, ONLY allow it if a dosage was detected alongside it.
  return matched.filter((med) => {
    if (med.matchType === 'notfound') {
      return !!med.dosage;
    }
    return true;
  });
}

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function getEditDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Fuzzy n-gram matching: scan OCR'd raw text for 1-4 token n-grams and compare
 * against the medicine database to recover possible medicine names from noisy OCR.
 */
export function fuzzyExtractFromText(rawText: string, allMedicines: DatabaseMedicine[]): ExtractedMedicine[] {
  if (!rawText || !allMedicines || allMedicines.length === 0) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const found = new Map<string, ExtractedMedicine>();

  for (const line of lines) {
    const tokens = line
      .split(/\s+/)
      .map((t) => cleanToken(t))
      .filter(Boolean);

    if (tokens.length === 0) continue;

    for (let start = 0; start < tokens.length; start++) {
      for (let size = 1; size <= 4 && start + size <= tokens.length; size++) {
        const slice = tokens.slice(start, start + size);
        const candidate = slice.join(' ').trim();
        if (!candidate || candidate.length < 3) continue;

        const candidateLower = candidate.toLowerCase();

        let bestMatch: DatabaseMedicine | null = null;
        let bestScore = 0;

        for (const med of allMedicines) {
          const dbName = med.name.toLowerCase();
          if (dbName === candidateLower) {
            bestMatch = med;
            bestScore = 1.0;
            break;
          }

          const sim = calculateSimilarity(candidateLower, dbName);
          if (sim > bestScore) {
            bestScore = sim;
            bestMatch = med;
          }
        }

        if (bestMatch && bestScore >= 0.65) {
          const key = bestMatch.name.toLowerCase();
          const dosage = extractDosage(line);
          const frequency = extractFrequency(line);
          const confidence = Math.min(0.95, Math.max(0.4, bestScore));

          const existing = found.get(key);
          if (!existing || existing.confidence < confidence) {
            found.set(key, { name: bestMatch.name, confidence, dosage, frequency });
          }
        }
      }
    }
  }

  return Array.from(found.values());
}
