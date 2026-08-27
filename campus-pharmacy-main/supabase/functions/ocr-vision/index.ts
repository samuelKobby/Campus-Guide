// deno-lint-ignore-file
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

// Server-side OCR function retired. OCR is handled locally in the client using Tesseract.js.
// Original implementation used OCR.space. A backup copy was saved at
// supabase/functions/ocr-vision.bak.ts in the repository root.

serve((req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  return new Response(JSON.stringify({ success: false, text: '', error: 'Server-side OCR disabled. Use client-side Tesseract OCR.' }), { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
})
