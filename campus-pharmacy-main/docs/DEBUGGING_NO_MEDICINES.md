# 🔍 Debugging Guide: "No Medicine Detected" Issue

## Quick Diagnostic Steps

### Step 1: Open Browser Console
1. Press `F12` to open Developer Tools
2. Go to the **Console** tab
3. Upload a prescription image and watch the console for logs

### Step 2: What to Look For

#### ✅ Success Example (should see these logs):
```
Starting Gemini analysis...
Gemini Response: {"medicines":[...], ...}
Gemini Result: {medicines: Array(3), ...}
Found 3 medicines Amoxicillin, Paracetamol, Ibuprofen
Database has 150 medicines
Final detected medicines: [...]
```

#### ❌ Problem Examples:

**Problem 1: Empty Medicines Array**
```
Starting Gemini analysis...
Gemini Result: {medicines: [], rawText: "some text..."}
No medicines detected by Gemini
```
→ **Solution**: Gemini couldn't find medicine names. Try a clearer prescription image.

**Problem 2: JSON Parse Error**
```
JSON Parse Error: SyntaxError: Unexpected token
Attempted to parse: {invalid json...}
Failed to parse Gemini response as JSON
```
→ **Solution**: Gemini response format changed. Try restarting the dev server.

**Problem 3: API Key Not Set**
```
Error: VITE_GOOGLE_GEMINI_API_KEY is not set in environment variables
```
→ **Solution**: Add API key to `.env` file and restart `npm run dev`

---

## Detailed Troubleshooting

### Issue 1: "No medicines detected" appears

**Check console for:**
```javascript
// Should show what text Gemini extracted
Gemini Response: ...
// Check the rawText field
```

**Solution:**
1. Open the "View extracted text" details section
2. Check if there's actual prescription text visible
3. If text is there but no medicines found → Try clearer image or different prescription
4. If text is empty → Image might be corrupted or too blurry

### Issue 2: API Key Error

**Steps:**
1. Check `.env` file exists in `campus-pharmacy-main/` folder
2. Verify the line: `VITE_GOOGLE_GEMINI_API_KEY=AIzaSy...`
3. Make sure there are no extra spaces or quotes
4. Restart dev server: Stop it (Ctrl+C) and run `npm run dev`

**Test API key validity:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Try to create a new API key
3. If it works there but not in your app, copy-paste the key again

### Issue 3: Response Takes Forever or Crashes

**Check:**
1. Internet connection is stable
2. Image size is under 10MB
3. Browser isn't blocking API requests (check Network tab in DevTools)

**Try:**
1. Close browser and reopen
2. Clear browser cache (Ctrl+Shift+Delete)
3. Restart dev server
4. Try with a smaller/different image

### Issue 4: Shows Extracted Text but No Medicines Listed

**This means:**
- Gemini found text but no medicine names
- Image might be a non-medical document
- Text might be in a language Gemini doesn't recognize

**Steps:**
1. Verify the image is actually a prescription
2. Try with a different prescription
3. Ensure medicine names are clearly visible and in English

---

## Advanced Debugging

### Check Gemini Model is Working

Open browser console and run:
```javascript
// Check if API key is available
console.log(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY?.substring(0, 10))
// Should show: AIzaSy...
```

### Check Supabase Connection

```javascript
// In console, check if medicines table exists
// This runs after you upload an image
// If database is working, you should see logs like:
// "Database has 150 medicines"
```

### Manual API Test

Create a test file `test-gemini.js` in your project root:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const client = new GoogleGenerativeAI('YOUR_API_KEY_HERE');
const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function test() {
  const response = await model.generateContent('Say "Hello"');
  console.log(response.response.text());
}

test();
```

Then run: `node test-gemini.js`

If you see "Hello", the API is working!

---

## Common Issues & Fixes

### Issue: "Failed to parse Gemini response as JSON"

**Cause:** Gemini returned text that isn't valid JSON

**Fix:**
1. Check console for full response text
2. The prompt might need adjustment
3. Try with different image

**To fix:**
Edit `src/services/geminiService.ts`, look for:
```typescript
const prompt = `You are an expert medical...`
```

If the issue persists, change to:
```typescript
const model = client.getGenerativeModel({ 
  model: 'gemini-1.5-pro'  // Try pro model for better accuracy
});
```

### Issue: Empty rawText (no OCR text extracted)

**Means:** Image might be unreadable

**Solutions:**
1. Try with a clearer, brighter image
2. Make sure text is horizontal
3. Avoid glare and shadows
4. Try JPEG instead of PNG format

### Issue: Confidence too low (< 0.3)

**Means:** Gemini isn't confident about medicines

**Check:**
1. Is the prescription legible to humans?
2. Are medicine names clearly visible?
3. Try rotating or adjusting the image

**To lower confidence threshold:**
Edit `src/services/geminiService.ts`:
```typescript
// Change this line:
.filter(med => med.confidence >= 0.3)  // Lower = less strict
// to:
.filter(med => med.confidence >= 0.1)  // Much lower threshold
```

---

## Step-by-Step Test Procedure

### Test 1: Verify Setup
1. ✅ `.env` file has `VITE_GOOGLE_GEMINI_API_KEY=AIzaSy...`
2. ✅ `npm install @google/generative-ai` completed
3. ✅ Dev server restarted
4. ✅ No errors in dev server console

### Test 2: Test With Printed Prescription
1. Find a clear, printed prescription (good lighting)
2. Take a photo or scan it
3. Upload to app
4. **Expected:** Should detect most medicines

### Test 3: Test With Handwritten Prescription
1. Use legible handwritten prescription
2. Upload to app
3. **Expected:** Should detect some medicines (maybe 70-80% accuracy)

### Test 4: Check Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Upload image
4. Check logs to see:
   - Gemini response structure
   - Detected medicines
   - Any error messages

---

## Console Logs Reference

### Normal Flow Logs:
```
✅ Starting Gemini analysis...
✅ Gemini Response: {medicines: [...], rawText: "..."}
✅ Gemini Result: {medicines: Array(2), prescriptionInfo: {...}, rawText: "..."}
✅ Found 2 medicines: ["Amoxicillin", "Paracetamol"]
✅ Database has 156 medicines
✅ Final detected medicines: [...]
✅ Auto-searching for: Amoxicillin
```

### Error Flow Logs:
```
❌ Starting Gemini analysis...
⚠️ Gemini Response: Error message from API
❌ Error: VITE_GOOGLE_GEMINI_API_KEY is not set
```

---

## Network Debugging

### Check API Calls in DevTools

1. Open DevTools (F12)
2. Go to **Network** tab
3. Upload prescription
4. Look for requests to `generativelanguage.googleapis.com`
5. Click on the request and check:
   - **Status:** Should be 200
   - **Response:** Should be valid JSON

---

## If Still Having Issues

### Restart Everything
```bash
# 1. Stop dev server (Ctrl+C in terminal)

# 2. Delete node_modules and reinstall
rm -r node_modules
npm install

# 3. Restart dev server
npm run dev
```

### Clear Browser Cache
1. Press Ctrl+Shift+Delete
2. Select "All time"
3. Check "Cookies and other site data"
4. Click "Clear data"
5. Refresh the page

### Test Different Image

Try uploading different prescription images:
- ✅ **Good:** Clear, printed, horizontal text, good lighting
- ❌ **Bad:** Blurry, rotated, handwritten, low lighting, small text

---

## Generate Test Prescription

### Option 1: Create a test image
1. Take a photo of a real prescription
2. Make sure it's clear and readable
3. Use that for testing

### Option 2: Use a sample image URL
Create a test prescription PNG and use it for repeated testing.

---

## Monitor Performance

### How long should it take?

| Stage | Duration | What's happening |
|-------|----------|-----------------|
| Upload preview | <100ms | Local processing |
| Progress 0-20% | ~500ms | Preparing API call |
| Progress 20-40% | 2-3s | Sending to Gemini & processing |
| Progress 40-50% | ~200ms | Parsing response |
| Progress 50-70% | ~500ms | Database query |
| Progress 70-100% | ~500ms | Matching & display |
| **Total** | **3-5s** | User sees progress bar |

If processing takes >10 seconds, check:
1. Internet connection speed
2. Browser performance (too many tabs open?)
3. API rate limits (if testing many times rapidly)

---

## Submit Feedback

If you've tried all these steps and it's still not working:

1. **Copy console logs:** Right-click console → Save as
2. **Note your steps:** What image did you use? What happened?
3. **Check your API key:** Verify it works at aistudio.google.com
4. **Try with different image:** Was it a specific prescription or all images?

---

## Useful Commands

```bash
# Check if package is installed
npm list @google/generative-ai

# Reinstall just this package
npm install @google/generative-ai

# Check Node version (should be 14+)
node --version

# Clear npm cache
npm cache clean --force
```

---

## Resources

| Issue | Link |
|-------|------|
| Check API Key Status | https://aistudio.google.com/app/apikey |
| Gemini Documentation | https://ai.google.dev/docs |
| Troubleshooting Guide | https://ai.google.dev/troubleshooting |
| Rate Limits | https://ai.google.dev/pricing#:~:text=Free%20tier%20rate%20limits |
