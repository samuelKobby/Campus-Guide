const VISION_API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;

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

/**
 * Extract text from prescription image using Google Cloud Vision API
 */
export async function extractTextWithVisionAPI(imageBase64: string): Promise<string> {
  try {
    if (!VISION_API_KEY) {
      throw new Error('Vision API key not configured');
    }

    // Remove data URL prefix if present
    const base64Data = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64;

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Data,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Vision API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(`Vision API returned error: ${result.error.message}`);
    }

    const textAnnotations = result.responses?.[0]?.textAnnotations || [];

    if (textAnnotations.length === 0) {
      console.warn('No text detected in image');
      return '';
    }

    // First annotation contains all text
    const fullText = textAnnotations[0].description || '';
    console.log('✓ Text extracted from image:', fullText.substring(0, 100) + '...');

    return fullText;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Vision API error:', message);
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
 * Extract medicine names from a prescription image using Cloud Vision API + rule-based parsing
 * @param imageBase64 - Base64 encoded image data (with data URL prefix)
 * @returns Extracted medicines and prescription information
 */
export async function extractMedicinesFromPrescription(
  imageBase64: string
): Promise<MedicineExtractionResult> {
  try {
    console.log('Starting prescription analysis (Vision OCR + rule-based parsing)...');

    if (!VISION_API_KEY) {
      throw new Error('Google Vision API key is not configured. Add VITE_GOOGLE_VISION_API_KEY to your .env file');
    }

    console.log('Step 1: Extracting text from prescription using Cloud Vision API...');
    const prescriptionText = await extractTextWithVisionAPI(imageBase64);

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
