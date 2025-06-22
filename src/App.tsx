@@ .. @@
 import React from 'react';
 import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
 import { Toaster } from 'react-hot-toast';
+import { ThemeProvider } from './context/ThemeContext';
 import { MainLayout } from './components/layouts/MainLayout';
 import { Home } from './pages/Home';
 import { About } from './pages/About';
@@ .. @@
 
 function App() {
   return (
-    <Router>
-      <Toaster position="top-right" />
-      <LocationProvider>
-        <LocationLoader />
-        <Routes>
-          {/* Auth Routes - Outside MainLayout */}
-          <Route path="/admin/login" element={<AdminLogin />} />
-          <Route path="/admin/signup" element={<AdminSignup />} />
-          <Route path="/admin/*" element={
-            <ProtectedRoute>
-              <AdminDashboard />
-            </ProtectedRoute>
-          } />
-          <Route path="/pharmacy/login" element={<PharmacyLogin />} />
-          <Route path="/pharmacy/*" element={
-            <PharmacyAuthProvider>
-              <RequirePharmacyAuth>
-                <PharmacyDashboard />
-              </RequirePharmacyAuth>
-            </PharmacyAuthProvider>
-          } />
+    <ThemeProvider>
+      <Router>
+        <Toaster position="top-right" />
+        <LocationProvider>
+          <LocationLoader />
+          <Routes>
+            {/* Auth Routes - Outside MainLayout */}
+            <Route path="/admin/login" element={<AdminLogin />} />
+            <Route path="/admin/signup" element={<AdminSignup />} />
+            <Route path="/admin/*" element={
+              <ProtectedRoute>
+                <AdminDashboard />
+              </ProtectedRoute>
+            } />
+            <Route path="/pharmacy/login" element={<PharmacyLogin />} />
+            <Route path="/pharmacy/*" element={
+              <PharmacyAuthProvider>
+                <RequirePharmacyAuth>
+                  <PharmacyDashboard />
+                </RequirePharmacyAuth>
+              </PharmacyAuthProvider>
+            } />
 
-          {/* Main Layout Routes */}
-          <Route path="/" element={<MainLayout />}>
-            <Route index element={<Home />} />
-            
-            {/* Category Routes */}
-            <Route path="category">
-              <Route path="academic" element={<AcademicBuildings />} />
-              <Route path="libraries" element={<Libraries />} />
-              <Route path="dining" element={<DiningHalls />} />
-              <Route path="sports" element={<SportsFacilities />} />
-              <Route path="student-centers" element={<StudentCenters />} />
-              <Route path="health" element={<HealthServices />} />
-            </Route>
+            {/* Main Layout Routes */}
+            <Route path="/" element={<MainLayout />}>
+              <Route index element={<Home />} />
+              
+              {/* Category Routes */}
+              <Route path="category">
+                <Route path="academic" element={<AcademicBuildings />} />
+                <Route path="libraries" element={<Libraries />} />
+                <Route path="dining" element={<DiningHalls />} />
+                <Route path="sports" element={<SportsFacilities />} />
+                <Route path="student-centers" element={<StudentCenters />} />
+                <Route path="health" element={<HealthServices />} />
+              </Route>
 
-            {/* Medicine Routes */}
-            <Route path="medicines" element={<Medicines />} />
-            <Route path="medicine/:id" element={<MedicineDetails />} />
-            <Route path="pharmacies" element={<Pharmacies />} />
+              {/* Medicine Routes */}
+              <Route path="medicines" element={<Medicines />} />
+              <Route path="medicine/:id" element={<MedicineDetails />} />
+              <Route path="pharmacies" element={<Pharmacies />} />
 
-            {/* Other Routes */}
-            <Route path="about" element={<About />} />
-            <Route path="contact" element={<Contact />} />
-            <Route path="privacy" element={<Privacy />} />
-          </Route>
-        </Routes>
-      </LocationProvider>
-    </Router>
+              {/* Other Routes */}
+              <Route path="about" element={<About />} />
+              <Route path="contact" element={<Contact />} />
+              <Route path="privacy" element={<Privacy />} />
+            </Route>
+          </Routes>
+        </LocationProvider>
+      </Router>
+    </ThemeProvider>
   );
 }
 
 export default App;