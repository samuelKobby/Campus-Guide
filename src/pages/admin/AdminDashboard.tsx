@@ .. @@
 import { Settings } from './Settings';
 import { AcademicBuildingsManagement } from './locations/AcademicBuildings';
 import { LibrariesManagement } from './locations/Libraries';
@@ .. @@
 import { HealthServicesManagement } from './locations/HealthServices';
 import { supabase } from '../../lib/supabase';
 import { ModalProvider, useModal } from '../../contexts/ModalContext';
+import { useTheme } from '../../context/ThemeContext';
 
 interface AdminUser {
@@ .. @@
 const DashboardContent: React.FC = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const { adminUser, loading } = useAdminAuth();
+  const { theme } = useTheme();
   const { isModalOpen } = useModal();
 
   if (loading) {
@@ .. @@
   }
 
   return (
-    <div className="flex h-screen relative overflow-hidden bg-gradient-to-br from-blue-100 via-indigo-50 to-violet-50">
+    <div className={`flex h-screen relative overflow-hidden ${
+      theme === 'dark'
+        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
+        : 'bg-gradient-to-br from-blue-100 via-indigo-50 to-violet-50'
+    }`}>
       {/* Main gradient orbs */}
-      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-radial from-blue-500/30 via-indigo-400/20 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl mix-blend-overlay pointer-events-none -z-10"></div>
-      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-violet-500/30 via-purple-400/20 to-transparent rounded-full transform translate-x-1/3 translate-y-1/3 blur-3xl mix-blend-overlay pointer-events-none -z-10"></div>
+      <div className={`absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-radial rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-3xl mix-blend-overlay pointer-events-none -z-10 ${
+        theme === 'dark'
+          ? 'from-blue-900/20 via-indigo-800/10 to-transparent'
+          : 'from-blue-500/30 via-indigo-400/20 to-transparent'
+      }`}></div>
+      <div className={`absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-radial rounded-full transform translate-x-1/3 translate-y-1/3 blur-3xl mix-blend-overlay pointer-events-none -z-10 ${
+        theme === 'dark'
+          ? 'from-violet-900/20 via-purple-800/10 to-transparent'
+          : 'from-violet-500/30 via-purple-400/20 to-transparent'
+      }`}></div>
       
       {/* Accent gradients */}
-      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial from-sky-400/20 via-blue-400/10 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10"></div>
-      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-radial from-amber-400/20 via-orange-400/10 to-transparent rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10"></div>
-      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial from-rose-400/20 via-pink-400/10 to-transparent rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10"></div>
+      <div className={`absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-radial rounded-full transform -translate-x-1/2 -translate-y-1/2 blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10 ${
+        theme === 'dark'
+          ? 'from-sky-800/10 via-blue-800/5 to-transparent'
+          : 'from-sky-400/20 via-blue-400/10 to-transparent'
+      }`}></div>
+      <div className={`absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-radial rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10 ${
+        theme === 'dark'
+          ? 'from-amber-800/10 via-orange-800/5 to-transparent'
+          : 'from-amber-400/20 via-orange-400/10 to-transparent'
+      }`}></div>
+      <div className={`absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-radial rounded-full blur-2xl mix-blend-overlay animate-pulse pointer-events-none -z-10 ${
+        theme === 'dark'
+          ? 'from-rose-800/10 via-pink-800/5 to-transparent'
+          : 'from-rose-400/20 via-pink-400/10 to-transparent'
+      }`}></div>
 
       {/* Mobile sidebar backdrop */}
       <div
@@ .. @@
       </div>
 
       {/* Main content */}
-      <div className="flex-1 flex flex-col overflow-hidden">
+      <div className="flex-1 flex flex-col overflow-hidden transition-colors duration-200">
         <Header 
           adminName={adminUser.full_name}
           onMenuClick={() => setIsSidebarOpen(true)}
@@ .. @@
         />
         
         <main className="flex-1 overflow-x-hidden overflow-y-auto z-0">
-          <div className="container mx-auto px-6 py-8 relative ">
+          <div className="container mx-auto px-6 py-8 relative">
             <Routes>
               <Route path="/" element={<DashboardHome />} />
               <Route path="/analytics" element={<Analytics />} />