// deno-lint-ignore-file
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// OCR.space API - Free tier, no credit card required
// 25,000 requests/month free
const OCR_API_KEY = 'K87899142388957'; // Free demo key
const OCR_API_URL = 'https://api.ocr.space/parse/image';

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageBase64 } = await req.json()
    
    if (!imageBase64) {
      throw new Error('No image provided')
    }

    // Prepare form data for OCR.space API
    const formData = new FormData();
    formData.append('base64Image', imageBase64);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Use OCR Engine 2 for better accuracy

    // Call OCR.space API
    const response = await fetch(OCR_API_URL, {
      method: 'POST',
      headers: {
        'apikey': OCR_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`OCR API error: ${response.statusText}`)
    }

    const result = await response.json()
    
    // Check for processing errors
    if (result.IsErroredOnProcessing) {
      throw new Error(result.ErrorMessage?.[0] || 'OCR processing failed')
    }
    
    // Extract text from the response
    const text = result.ParsedResults?.[0]?.ParsedText || ''
    
    // Return the extracted text
    return new Response(
      JSON.stringify({ 
        success: true,
        text,
        error: null 
      }),
      {
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      }
    )

  } catch (error: unknown) {
    console.error('Error in ocr-vision function:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return new Response(
      JSON.stringify({ 
        success: false,
        text: '',
        error: errorMessage
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        },
      }
    )
  }
})
