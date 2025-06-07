// Follow Deno and Supabase Edge Function conventions
import { createClient } from "npm:@supabase/supabase-js@2.48.1";

// Initialize Supabase client using environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define location types for better type safety
type LocationType = 
  | "academic" 
  | "library" 
  | "dining" 
  | "sports" 
  | "student_center" 
  | "health";

interface LocationResult {
  id: string;
  name: string;
  description: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  building_type: LocationType;
  image_url: string | null;
}

// Simple natural language processing function
function processQuery(query: string): { keywords: string[], type: LocationType | null } {
  query = query.toLowerCase();
  
  // Define keywords for each location type
  const typeKeywords: Record<LocationType, string[]> = {
    academic: ["academic", "class", "classroom", "lecture", "department", "faculty", "school", "college", "study"],
    library: ["library", "book", "study", "research", "quiet", "reading"],
    dining: ["dining", "food", "eat", "restaurant", "cafe", "cafeteria", "meal", "lunch", "dinner", "breakfast"],
    sports: ["sport", "gym", "fitness", "exercise", "workout", "swimming", "basketball", "football", "tennis"],
    student_center: ["student center", "student union", "lounge", "recreation", "activity", "club", "organization"],
    health: ["health", "medical", "clinic", "hospital", "doctor", "nurse", "pharmacy", "medicine", "emergency"]
  };
  
  // Extract keywords from query
  const words = query.split(/\s+/);
  
  // Determine the most likely location type
  let bestType: LocationType | null = null;
  let bestScore = 0;
  
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (query.includes(keyword)) {
        score += 1;
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestType = type as LocationType;
    }
  }
  
  return {
    keywords: words,
    type: bestScore > 0 ? bestType : null
  };
}

// Main handler function
Deno.serve(async (req: Request) => {
  try {
    // Set up CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };

    // Handle OPTIONS request for CORS
    if (req.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          ...corsHeaders,
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
      });
    }

    // Parse the request body
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ 
          error: "Invalid query parameter" 
        }),
        { 
          headers: { 
            ...corsHeaders,
            "Content-Type": "application/json" 
          },
          status: 400 
        }
      );
    }

    // Process the query to extract keywords and determine location type
    const { keywords, type } = processQuery(query);
    
    // Build the database query
    let dbQuery = supabase
      .from('locations')
      .select('id, name, description, address, latitude, longitude, building_type, image_url');
    
    // Filter by type if determined
    if (type) {
      dbQuery = dbQuery.eq('building_type', type);
    }
    
    // Add full-text search conditions for keywords
    for (const keyword of keywords) {
      if (keyword.length > 2) { // Only use keywords with more than 2 characters
        dbQuery = dbQuery.or(`name.ilike.%${keyword}%, description.ilike.%${keyword}%, address.ilike.%${keyword}%`);
      }
    }
    
    // Execute the query
    const { data, error } = await dbQuery.limit(5);
    
    if (error) {
      throw error;
    }
    
    // Format the response
    const results = data as LocationResult[];
    
    // Return the results
    return new Response(
      JSON.stringify({
        results: results.map(location => ({
          id: location.id,
          name: location.name,
          description: location.description,
          address: location.address,
          coordinates: {
            latitude: location.latitude,
            longitude: location.longitude
          },
          category: location.building_type,
          imageUrl: location.image_url
        })),
        query,
        message: results.length > 0 
          ? `Found ${results.length} location(s) matching your query` 
          : "No locations found matching your query. Try a different search term."
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request",
        details: error.message 
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
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
