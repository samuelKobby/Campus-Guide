// @ts-ignore: Deno types
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore: Supabase ESM types
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Add Deno types
declare const Deno: {
  env: {
    get(key: string): string | undefined
  }
}

interface Location {
  id: string
  name: string
  category: string
  coordinates: { lat: number; lng: number }
  description?: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get all locations
    const { data: locations, error } = await supabaseClient
      .from('locations')
      .select('*')

    if (error) throw error

    // Simple natural language matching function
    function matchScore(location: Location, searchQuery: string): number {
      const searchTerms = searchQuery.toLowerCase().split(' ')
      let score = 0

      // Check name match
      const name = location.name.toLowerCase()
      searchTerms.forEach(term => {
        if (name.includes(term)) score += 3
      })

      // Check category match
      const category = location.category.toLowerCase()
      searchTerms.forEach(term => {
        if (category.includes(term)) score += 2
      })

      // Check description match if available
      if (location.description) {
        const description = location.description.toLowerCase()
        searchTerms.forEach(term => {
          if (description.includes(term)) score += 1
        })
      }

      return score
    }

    // Score and sort locations
    const scoredLocations = locations
      .map((location: Location) => ({
        ...location,
        score: matchScore(location, query)
      }))
      .sort((a, b) => b.score - a.score)
      .filter(location => location.score > 0)

    // Return best matches or fallback message
    const response = {
      success: true,
      data: scoredLocations.length > 0 
        ? scoredLocations.slice(0, 5)  // Return top 5 matches
        : [],
      message: scoredLocations.length > 0
        ? 'Locations found'
        : 'No matching locations found. Try different search terms or browse categories.'
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
