# Quick Reference: Gemini Prescription Scanner Implementation

## File Structure

```
campus-pharmacy-main/
├── src/
│   ├── services/
│   │   └── geminiService.ts          ← Main Gemini integration
│   ├── components/
│   │   └── medicines/
│   │       └── PrescriptionUpload.tsx ← Updated UI component
│   └── pages/
│       └── Medicines.tsx              ← Uses PrescriptionUpload
├── .env                               ← Add API key here
└── package.json                       ← @google/generative-ai added
```

---

## Code Overview

### 1. Service Layer (`geminiService.ts`)

```typescript
// Main function that does the heavy lifting
async function extractMedicinesFromPrescription(imageBase64: string)
  ├─ Initialize Gemini client with API key
  ├─ Send image to Gemini 1.5 Flash model
  ├─ Parse response JSON (medicines list)
  └─ Return { medicines: [], prescriptionInfo: {}, rawText: "" }

// Helper function to match with database
function matchMedicinesWithDatabase(detectedMedicines, dbMedicines)
  ├─ Try exact matches first
  ├─ Try fuzzy/partial matches (similarity > 0.7)
  └─ Return with availability status
```

**Key Features:**
- Handles base64 image data conversion
- JSON parsing with error handling
- Confidence scoring (0-1 scale)
- Filters low-confidence results
- Similarity calculation using Levenshtein distance

---

### 2. Component Layer (`PrescriptionUpload.tsx`)

```typescript
const PrescriptionUpload = ({ onMedicineDetected, theme }) => {
  // State Management
  ├─ selectedImage: Base64 image data
  ├─ isProcessing: Loading state
  ├─ detectedMedicines: Extracted results
  ├─ processingProgress: 0-100% indicator
  └─ prescriptionInfo: Patient/doctor details

  // Main Flow
  const processImage = async (imageData) => {
    1. Call geminiService.extractMedicinesFromPrescription()
    2. Get medicines list + prescription info
    3. Fetch all medicines from Supabase
    4. Match detected with database
    5. Display results sorted by confidence
  }

  // Render
  └─ Upload button + Modal dialog
     ├─ Drag-drop upload area
     ├─ Image preview
     ├─ Processing progress bar
     └─ Results list with details
```

**UI Features:**
- Drag-and-drop upload
- Real-time progress tracking
- Shows dosage & frequency
- Color-coded availability status
- Click to search functionality

---

## Data Flow

```
User uploads image
        ↓
[PrescriptionUpload.tsx]
        ↓
Convert to Base64
        ↓
[geminiService.ts]
        ↓
Send to Google Gemini API
        ↓
Get JSON response with medicines
        ↓
Match with Supabase database
        ↓
Filter by confidence (≥ 0.5)
        ↓
Sort by confidence score
        ↓
Display in modal with status
```

---

## API Response Example

**Gemini Returns:**
```json
{
  "medicines": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times daily",
      "confidence": 0.95
    },
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "twice daily",
      "confidence": 0.88
    }
  ],
  "prescriptionInfo": {
    "patientName": "John Doe",
    "doctorName": "Dr. Sarah Smith",
    "date": "2024-05-18",
    "instructions": "Take with food"
  },
  "rawText": "[Full OCR text of prescription]"
}
```

---

## Matching Algorithm

```
For each detected medicine:
├─ Exact Match (confidence = 1.0)
│  └─ If database name === detected name
├─ Partial Match (confidence = similarity score)
│  ├─ Calculate Levenshtein distance
│  ├─ If similarity ≥ 0.7, include it
│  └─ Use database name (not detected)
└─ No Match (confidence stored, but available = false)
   └─ Show as "Not in Stock" (user can still see it)
```

---

## Confidence Scoring

Gemini returns confidence 0-1:

| Score | Meaning | Action |
|-------|---------|--------|
| 0.9-1.0 | Very confident | Auto-search this medicine |
| 0.7-0.9 | Confident | Show to user, selectable |
| 0.5-0.7 | Somewhat sure | Show but mark as uncertain |
| <0.5 | Not confident | Filter out (optional) |

---

## Environment Setup

**`.env` file:**
```bash
VITE_GOOGLE_GEMINI_API_KEY=AIzaSy...your_key_here
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Access in code:**
```typescript
const GEMINI_API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
```

---

## Dependencies Added

```json
{
  "dependencies": {
    "@google/generative-ai": "^0.x.x"  // NEW!
  }
}
```

**Why this package?**
- Official Google SDK
- Type-safe with TypeScript
- Handles authentication
- Built-in error handling
- Works in browser & Node.js

---

## Error Scenarios & Handling

```typescript
❌ Invalid API Key
├─ Error: "VITE_GOOGLE_GEMINI_API_KEY is not set"
└─ Solution: Add key to .env, restart server

❌ Network Error
├─ Error: "Failed to connect to Gemini API"
└─ Solution: Check internet, retry after 10s

❌ Invalid Image Format
├─ Error: "Failed to parse response as JSON"
└─ Solution: Try with JPEG/PNG under 10MB

❌ No Medicines Detected
├─ Result: Empty medicines array
└─ Solution: Use clearer prescription image

❌ Low Confidence Match
├─ Confidence: < 0.5
└─ Solution: User can still search manually
```

---

## Performance Metrics

| Operation | Time | Notes |
|-----------|------|-------|
| Upload & Preview | <100ms | Local processing |
| Send to Gemini | <1s | Network latency |
| Gemini Processing | 2-4s | AI analysis |
| Database Match | <500ms | Supabase query |
| Total | ~3-5s | User sees progress bar |

---

## Testing Checklist

- [ ] API key is in `.env`
- [ ] Dev server restarted after env change
- [ ] npm package installed (`@google/generative-ai`)
- [ ] Upload button visible in Medicines page
- [ ] Can select & preview prescription image
- [ ] Processing starts automatically
- [ ] Progress bar shows 0-100%
- [ ] Results display with medicine names
- [ ] Confidence scores show for each
- [ ] Clicking medicine triggers search
- [ ] Modal closes after selection

---

## Customization Examples

### Use Different Model
```typescript
// In geminiService.ts
const model = client.getGenerativeModel({ 
  model: 'gemini-1.5-pro'  // More advanced
});
```

### Adjust Minimum Confidence
```typescript
// In geminiService.ts  
const MIN_CONFIDENCE = 0.6;  // Default 0.5
result.medicines = result.medicines.filter(
  med => med.confidence >= MIN_CONFIDENCE
);
```

### Custom Extraction Prompt
```typescript
// In geminiService.ts, modify prompt variable
const prompt = `Your custom instructions here...`;
```

### Change UI Colors
```typescript
// In PrescriptionUpload.tsx
className="bg-gradient-to-r from-blue-600 to-green-600"
```

---

## Useful Resources

| Resource | Link |
|----------|------|
| Gemini Docs | https://ai.google.dev/docs |
| API Reference | https://ai.google.dev/api |
| Get API Key | https://aistudio.google.com/app/apikey |
| Pricing | https://ai.google.dev/pricing |
| Examples | https://ai.google.dev/gemini-api/docs/vision |

---

## Troubleshooting Flowchart

```
Problem?
├─ API key not working?
│  └─ Verify at aistudio.google.com
├─ No medicines detected?
│  └─ Try clearer prescription image
├─ Slow processing?
│  └─ Check internet speed
├─ Component not showing?
│  └─ Restart dev server
└─ Errors in console?
   └─ Check .env file exists
```

---

## Next Development Steps

1. **Enhance detection:**
   - Support multiple images
   - PDF prescription support
   - Multi-language prescriptions

2. **User features:**
   - Save prescription history
   - Set medication reminders
   - Share with pharmacist
   - Track medication status

3. **Optimization:**
   - Cache results (same prescription)
   - Batch process multiple prescriptions
   - Add analytics dashboard
   - Performance monitoring

4. **Backend integration:**
   - Store prescriptions in Supabase
   - Integration with pharmacy orders
   - Pharmacist dashboard
   - Audit logs

---

## Support

For issues, check:
1. `.env` file has correct API key
2. `package.json` has `@google/generative-ai`
3. Console logs for specific errors
4. Google AI Studio status page
5. Network tab in DevTools
