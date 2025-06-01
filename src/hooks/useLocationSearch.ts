@@ .. @@
 import { useState, useEffect } from 'react';
 import { supabase } from '../lib/supabase';
-import { toast } from 'react-hot-toast';
+import toast from 'react-hot-toast';
 import { useLocations, Location as ContextLocation } from '../context/LocationContext';
 
 export interface SearchResult extends ContextLocation {
@@ .. @@
   } = useLocations();
 
   const searchLocations = (query: string): SearchResult[] => {
+    // Log the search query for debugging
+    console.log("Searching for:", query);
+    
     const searchTerm = query.toLowerCase().trim();
     if (!searchTerm) return [];
 
@@ .. @@
     );
 
     return allLocations.filter(location => 
-      location.name.toLowerCase().includes(searchTerm)
+      location.name.toLowerCase().includes(searchTerm) ||
+      location.description.toLowerCase().includes(searchTerm) ||
+      location.building.toLowerCase().includes(searchTerm)
     );
   };
 
   return {
     searchLocations,
-    loading: false
+    loading: false,
   };
 };