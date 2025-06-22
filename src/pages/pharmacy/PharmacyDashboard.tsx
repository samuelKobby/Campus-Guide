@@ .. @@
 import { PharmacyNotifications } from './PharmacyNotifications';
 import { PharmacySettings } from './PharmacySettings';
+import { useTheme } from '../../context/ThemeContext';
 
 interface Medicine {
@@ .. @@
   const [stats, setStats] = useState<DashboardStats>({
     totalMedicines: 0,
     inStock: 0,
@@ .. @@
   });
   const { pharmacyId } = usePharmacyAuth();
   const navigate = useNavigate();
+  const { theme } = useTheme();
 
   useEffect(() => {
     if (!pharmacyId) {
@@ .. @@
   }
 
   return (
-    <div className="space-y-6">
+    <div className="space-y-6 transition-colors duration-200">
       <PharmacyStats
         totalMedicines={stats.totalMedicines}
         inStock={stats.inStock}
@@ .. @@
   const [pharmacyName, setPharmacyName] = useState('');
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
+  const { theme } = useTheme();
 
   useEffect(() => {
     const fetchPharmacyDetails = async () => {
@@ .. @@
   }
 
   return (
-    <PharmacyLayout>
-      <div className="flex h-screen relative overflow-hidden bg-gradient-to-br from-indigo-100 via-rose-50 to-white">
+    <PharmacyLayout>
+      <div className={`flex h-screen relative overflow-hidden ${
+        theme === 'dark'
+          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
+          : 'bg-gradient-to-br from-indigo-100 via-rose-50 to-white'
+      }`}>
         {/* Main gradient orbs */}
-        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-violet-400/30 via-fuchsia-400/20 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl mix-blend-overlay pointer-events-none -z-10"></div>
-        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-teal-400/30 via-emerald-400/20 to-transparent rounded-full transform translate-x-1/4 translate-y-1/4 blur-3xl mix-blend-overlay pointer-events-none -z-10"></div>
+        <div className={`absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-radial rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl mix-blend-overlay pointer-events-none -z-10 ${
+          theme === 'dark'
+            ? 'from-violet-900/20 via-fuchsia-800/10 to-transparent'
+            : 'from-violet-400/30 via-fuchsia-400/20 to-transparent'
+        }`}></div>
+        <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial rounded-full transform translate-x-1/4 translate-y-1/4 blur-3xl mix-blend-overlay pointer-events-none -z-10 ${
+          theme === 'dark'
+            ? 'from-teal-900/20 via-emerald-800/10 to-transparent'
+            : 'from-teal-400/30 via-emerald-400/20 to-transparent'
+        }`}></div>
         
         {/* Accent gradients */}
-        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial from-sky-400/20 via-blue-400/10 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10"></div>
-        <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-radial from-amber-400/20 via-orange-400/10 to-transparent rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10"></div>
-        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-rose-400/20 via-pink-400/10 to-transparent rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10"></div>
+        <div className={`absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10 ${
+          theme === 'dark'
+            ? 'from-sky-800/10 via-blue-800/5 to-transparent'
+            : 'from-sky-400/20 via-blue-400/10 to-transparent'
+        }`}></div>
+        <div className={`absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-radial rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10 ${
+          theme === 'dark'
+            ? 'from-amber-800/10 via-orange-800/5 to-transparent'
+            : 'from-amber-400/20 via-orange-400/10 to-transparent'
+        }`}></div>
+        <div className={`absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10 ${
+          theme === 'dark'
+            ? 'from-rose-800/10 via-pink-800/5 to-transparent'
+            : 'from-rose-400/20 via-pink-400/10 to-transparent'
+        }`}></div>
       {/* Mobile sidebar backdrop */}
       <div
         className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ${