// Follow Deno and Supabase Edge Function conventions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
serve(async (req: Request) => {
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