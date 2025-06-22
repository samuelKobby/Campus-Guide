@@ .. @@
 import React from 'react';
 import { IconType } from 'react-icons';
 import { motion } from 'framer-motion';
+import { useTheme } from '../../context/ThemeContext';
 
 interface CategoryHeroProps {
   title: string;
@@ .. @@
   backgroundImage,
   stats,
 }) => {
+  const { theme } = useTheme();
+  
   return (
     <div className="relative h-[400px] overflow-hidden">
       {/* Background Image with Gradient Overlay */}
@@ .. @@
       </div>
 
       {/* Decorative Elements */}
-      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-gray-50 to-transparent" />
-      <div className="absolute -bottom-px left-0 w-full h-1 bg-gray-50" />
+      <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t ${
+        theme === 'dark' 
+          ? 'from-gray-900 to-transparent' 
+          : 'from-gray-50 to-transparent'
+      }`} />
+      <div className={`absolute -bottom-px left-0 w-full h-1 ${
+        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
+      }`} />
     </div>
   );
 };