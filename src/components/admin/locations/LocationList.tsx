@@ .. @@
 import React from 'react';
 import { FaEdit, FaTrash } from 'react-icons/fa';
+import { useTheme } from '../../../context/ThemeContext';
 
 interface Location {
@@ .. @@
 }) => {
+  const { theme } = useTheme();
+  
   if (loading) {
     return (
       <div className="flex justify-center items-center h-64">
-        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
+        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
+          theme === 'dark' ? 'border-blue-400' : 'border-blue-500'
+        }`}></div>
       </div>
     );
   }
 
   if (locations.length === 0) {
     return (
-      <div className="text-center py-12">
-        <p className="text-gray-500">No locations found</p>
+      <div className="text-center py-12">
+        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
+          No locations found
+        </p>
       </div>
     );
   }
 
   return (
-    <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-sm p-6 border border-white/30">
-      <table className="min-w-full divide-y divide-gray-200">
-        <thead className="bg-gray-50">
+    <div className={`backdrop-blur-md rounded-lg shadow-sm p-6 border transition-colors duration-200 ${
+      theme === 'dark'
+        ? 'bg-gray-800/20 border-gray-700/30'
+        : 'bg-white/20 border-white/30'
+    }`}>
+      <table className="min-w-full divide-y divide-gray-200">
+        <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
           <tr>
-            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
+              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
+            }`}>
               Name
             </th>
-            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
+              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
+            }`}>
               Address
             </th>
-            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
+            <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
+              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
+            }`}>
               Contact
             </th>
-            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
+            <th className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
+              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
+            }`}>
               Actions
             </th>
           </tr>
         </thead>
-        <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
+        <tbody className={`backdrop-blur-sm divide-y ${
+          theme === 'dark'
+            ? 'bg-gray-800/50 divide-gray-700'
+            : 'bg-white/50 divide-gray-200'
+        }`}>
           {locations.map((location) => (
-            <tr key={location.id} className="hover:bg-white/30 transition-colors">
+            <tr key={location.id} className={`transition-colors ${
+              theme === 'dark'
+                ? 'hover:bg-gray-700/30'
+                : 'hover:bg-white/30'
+            }`}>
               <td className="px-6 py-4 whitespace-nowrap">
-                <div className="text-sm font-medium text-gray-900">{location.name}</div>
+                <div className={`text-sm font-medium ${
+                  theme === 'dark' ? 'text-white' : 'text-gray-900'
+                }`}>{location.name}</div>
               </td>
               <td className="px-6 py-4">
-                <div className="text-sm text-gray-500">{location.address}</div>
+                <div className={`text-sm ${
+                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
+                }`}>{location.address}</div>
               </td>
               <td className="px-6 py-4">
-                <div className="text-sm text-gray-500">
+                <div className={`text-sm ${
+                  theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
+                }`}>
                   {location.contact_number && (
                     <div>{location.contact_number}</div>
                   )}
                   {location.email && (
-                    <div className="text-blue-600">{location.email}</div>
+                    <div className={`${
+                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
+                    }`}>{location.email}</div>
                   )}
                 </div>
               </td>
               <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                 <button
                   onClick={() => onEdit(location)}
-                  className="text-blue-600 hover:text-blue-800 mr-4 transition-colors"
+                  className={`mr-4 transition-colors ${
+                    theme === 'dark'
+                      ? 'text-blue-400 hover:text-blue-300'
+                      : 'text-blue-600 hover:text-blue-800'
+                  }`}
                 >
                   <FaEdit className="inline-block" />
                 </button>
                 <button
                   onClick={() => onDelete(location.id)}
-                  className="text-red-600 hover:text-red-800 transition-colors"
+                  className={`transition-colors ${
+                    theme === 'dark'
+                      ? 'text-red-400 hover:text-red-300'
+                      : 'text-red-600 hover:text-red-800'
+                  }`}
                 >
                   <FaTrash className="inline-block" />
                 </button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
 };