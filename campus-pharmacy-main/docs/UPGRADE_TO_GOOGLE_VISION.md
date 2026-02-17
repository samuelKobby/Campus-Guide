# Upgrading to Google Cloud Vision API

The prescription scanner currently uses OCR.space API (free tier) which is much faster than Tesseract.js. For even better performance and accuracy, you can upgrade to Google Cloud Vision API.

## Benefits of Google Cloud Vision API

- **Faster**: Processes images in 1-2 seconds
- **More Accurate**: Better at reading handwritten prescriptions
- **Better Error Handling**: Can handle rotated, skewed, or blurry images
- **Multi-language Support**: Supports 50+ languages
- **Higher Limits**: No monthly request limits on paid plans

## Setup Instructions

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (free tier includes 1,000 requests/month)

### 2. Enable Vision API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Cloud Vision API"
3. Click "Enable"

### 3. Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Recommended) Restrict the API key to only Vision API

### 4. Create Supabase Edge Function (Recommended)

To keep your API key secure, create a Supabase Edge Function:

```typescript
// supabase/functions/ocr-vision/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const GOOGLE_VISION_API_KEY = Deno.env.get('GOOGLE_VISION_API_KEY')

serve(async (req) => {
  try {
    const { imageBase64 } = await req.json()
    
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64.split(',')[1] },
            features: [{ type: 'TEXT_DETECTION' }]
          }]
        })
      }
    )
    
    const result = await response.json()
    const text = result.responses[0]?.fullTextAnnotation?.text || ''
    
    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### 5. Update PrescriptionUpload.tsx

Replace the OCR.space API call with Google Vision API:

```typescript
// In processImage function, replace the OCR.space API call with:

const { data, error } = await supabase.functions.invoke('ocr-vision', {
  body: { imageBase64: imageData }
})

if (error) throw error

const extractedText = data.text
```

### 6. Deploy Edge Function

```bash
cd supabase
supabase functions deploy ocr-vision --no-verify-jwt
supabase secrets set GOOGLE_VISION_API_KEY=your_api_key_here
```

## Pricing

- **Free Tier**: 1,000 requests/month
- **After Free Tier**: $1.50 per 1,000 requests
- **No upfront costs** or monthly fees

## Current vs Google Vision Performance

| Feature | OCR.space (Current) | Google Vision API |
|---------|-------------------|-------------------|
| Speed | 2-5 seconds | 1-2 seconds |
| Accuracy | Good | Excellent |
| Handwriting | Limited | Good |
| Free Tier | 25,000/month | 1,000/month |
| Cost | Free | $1.50/1000 after free tier |

## Alternative: Azure Computer Vision

If you prefer Microsoft Azure:

1. Create Azure account
2. Create Computer Vision resource
3. Similar setup to Google Vision
4. Similar pricing and performance

## Questions?

If you need help implementing this, let me know!
