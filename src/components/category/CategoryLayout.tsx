@@ .. @@
   loading = false
 }) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedTags, setSelectedTags] = useState<string[]>([]);
+  const { theme } = useTheme();
 
   // Get all unique tags
   const allTags = Array.from(
@@ .. @@
   };
 
   return (
-    <div className="min-h-screen bg-gray-50">
+    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
       {/* Hero Section */}
       <CategoryHero
         title={title}
@@ .. @@
       />
 
       {/* Main Content */}
-      <div className="container mx-auto px-4 py-8">
+      <div className="container mx-auto px-4 py-8 transition-colors duration-200">
         {/* Search and Filter */}
         <div className="flex flex-col md:flex-row gap-4 mb-8">
           <div className="flex-1">
             <div className="relative">
               <input
                 type="text"
                 placeholder="Search locations..."
-                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
+                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
+                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
+                }`}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
-              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
+              <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
             </div>
           </div>
           <div className="flex items-center gap-2 flex-wrap">
-            <FaFilter className="text-gray-400" />
+            <FaFilter className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
             {allTags.map(tag => (
               <button
                 key={tag}
                 onClick={() => toggleTag(tag)}
                 className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                   selectedTags.includes(tag)
-                    ? 'bg-blue-500 text-white'
-                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
+                    ? 'bg-blue-600 text-white'
+                    : theme === 'dark' 
+                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
+                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                 }`}
               >
                 {tag}
@@ .. @@
         {/* Loading State */}
         {loading ? (
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
-            {[1, 2, 3].map(i => (
-              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
-                <div className="h-48 bg-gray-200" />
-                <div className="p-4 space-y-4">
-                  <div className="h-6 bg-gray-200 rounded w-3/4" />
+            {[1, 2, 3, 4].map(i => (
+              <div key={i} className={`rounded-lg shadow-md overflow-hidden animate-pulse ${
+                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
+              }`}>
+                <div className={`h-48 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
+                <div className="p-4 space-y-4">
+                  <div className={`h-6 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                   <div className="space-y-2">
-                    <div className="h-4 bg-gray-200 rounded" />
-                    <div className="h-4 bg-gray-200 rounded w-5/6" />
+                    <div className={`h-4 rounded ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
+                    <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
                   </div>
                 </div>
               </div>
@@ .. @@
             {filteredLocations.map((location) => (
               <motion.div
                 key={location.id}
-                initial={{ opacity: 0, y: 20 }}
-                animate={{ opacity: 1, y: 0 }}
-                className="bg-white rounded-lg p-5 shadow-md overflow-hidden hover:shadow-lg transition-shadow"
+                initial={{ opacity: 0, y: 10 }}
+                animate={{ opacity: 1, y: 0 }}
+                transition={{ duration: 0.3 }}
+                className={`rounded-lg p-5 shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
+                  theme === 'dark' 
+                    ? 'bg-gray-800 hover:bg-gray-750' 
+                    : 'bg-white hover:bg-gray-50'
+                }`}
               >
                 <div className='relative w-full h-[230px]'>
                   <img
@@ .. @@
                   />
                 </div>
                 <div className="p-4">
-                  <h2 className="text-xl font-bold mb-2">{location.name}</h2>
-                  <p className="text-gray-600 mb-4">{location.description}</p>
-                  <div className="space-y-2 text-gray-600">
+                  <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
+                    {location.name}
+                  </h2>
+                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
+                    {location.description}
+                  </p>
+                  <div className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                     <p className="flex items-center">
                       <FaMapMarkerAlt className="mr-2" />
                       {location.building}
@@ .. @@
                   {location.tags && (
                     <div className="mt-4 flex flex-wrap gap-2">
                       {location.tags.map((tag, index) => (
-                        <span
-                          key={index}
-                          className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
-                        >
+                        <span key={index} className={`px-2 py-1 text-sm rounded-full ${
+                          theme === 'dark' 
+                            ? 'bg-gray-700 text-gray-300' 
+                            : 'bg-gray-100 text-gray-600'
+                        }`}>
                           {tag}
                         </span>
                       ))}
@@ .. @@
                     <button
                       onClick={location.getDirections}
-                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
+                      className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                     >
                       Get Directions
                     </button>
@@ .. @@
 
             {/* No Results */}
             {filteredLocations.length === 0 && (
-              <div className="text-center py-12">
-                <p className="text-gray-600 text-lg">
+              <div className="text-center py-12 col-span-full">
+                <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                   No locations found matching your search criteria.
                 </p>
               </div>