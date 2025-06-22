@@ .. @@
 import React, { useState } from 'react';
 import { supabase } from '../../../lib/supabase';
 import toast from 'react-hot-toast';
+import { useTheme } from '../../../context/ThemeContext';
 
 interface LocationFormProps {
@@ .. @@
   additionalFields 
 }) => {
   const [loading, setLoading] = useState(false);
+  const { theme } = useTheme();
   const [formData, setFormData] = useState<{
     name: string;
     description: string;
@@ .. @@
   };
 
   return (
-    <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-sm p-6 border border-white/30">
+    <div className={`backdrop-blur-md rounded-lg shadow-sm p-6 border transition-colors duration-200 ${
+      theme === 'dark'
+        ? 'bg-gray-800/20 border-gray-700/30'
+        : 'bg-white/20 border-white/30'
+    }`}>
       <form onSubmit={handleSubmit} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Name <span className="text-red-500">*</span>
             </label>
             <input
@@ .. @@
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
               required
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
               placeholder="Enter location name"
             />
           </div>
 
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Address <span className="text-red-500">*</span>
             </label>
             <input
@@ .. @@
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
               required
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
               placeholder="Enter address"
             />
           </div>
 
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Latitude
             </label>
             <input
@@ .. @@
               step="any"
               value={formData.latitude}
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
             />
           </div>
 
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Longitude
             </label>
             <input
@@ .. @@
               step="any"
               value={formData.longitude}
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
             />
           </div>
 
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Contact Number
             </label>
             <input
@@ .. @@
               type="tel"
               value={formData.contact_number}
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
               placeholder="Enter phone number"
             />
           </div>
 
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Email
             </label>
             <input
@@ .. @@
               type="email"
               value={formData.email}
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
               placeholder="Enter email address"
             />
           </div>
 
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Website URL
             </label>
             <input
@@ .. @@
               type="url"
               value={formData.website_url}
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
               placeholder="Enter website URL"
             />
           </div>
 
           <div>
-            <label className="block text-sm font-medium text-gray-700 mb-1">
+            <label className={`block text-sm font-medium mb-1 ${
+              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+            }`}>
               Image URL
             </label>
             <input
@@ .. @@
               type="url"
               value={formData.image_url}
               onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
-              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+                theme === 'dark'
+                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                  : 'bg-white/50 border-gray-300 text-gray-900'
+              }`}
               placeholder="Enter image URL"
             />
           </div>
         </div>
 
         <div className="col-span-2">
-          <label className="block text-sm font-medium text-gray-700 mb-1">
+          <label className={`block text-sm font-medium mb-1 ${
+            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
+          }`}>
             Description
           </label>
           <textarea
@@ .. @@
             value={formData.description}
             onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
             rows={3}
-            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 backdrop-blur-sm"
+            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
+              theme === 'dark'
+                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
+                : 'bg-white/50 border-gray-300 text-gray-900'
+            }`}
             placeholder="Enter description"
           />
         </div>
@@ .. @@
           <button
             type="submit"
             disabled={loading}
-            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
+            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${
+              theme === 'dark'
+                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'
+                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
+            }`}
           >
             {loading ? 'Saving...' : 'Save Location'}
           </button>
         </div>
       </form>
     </div>
   );
 };