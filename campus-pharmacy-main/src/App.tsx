import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MainLayout } from './components/layouts/MainLayout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AcademicBuildings } from './pages/categories/AcademicBuildings';
import { Libraries } from './pages/categories/Libraries';
import { DiningHalls } from './pages/categories/DiningHalls';
import { SportsFacilities } from './pages/categories/SportsFacilities';
import { StudentCenters } from './pages/categories/StudentCenters';
import { HealthServices } from './pages/categories/HealthServices';
import { Medicines } from './pages/Medicines';
import { MedicineDetails } from './pages/MedicineDetails';
import { Pharmacies } from './pages/Pharmacies';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminSignup } from './pages/admin/AdminSignup';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { PharmacyLogin } from './pages/PharmacyLogin';
import { PharmacyDashboard } from './pages/pharmacy/PharmacyDashboard';
import { Privacy } from './pages/Privacy';
import { PharmacyAuthProvider, RequirePharmacyAuth } from './contexts/PharmacyAuthContext';
import { LocationProvider } from './context/LocationContext';
import { LocationLoader } from './components/LocationLoader';
import { SplashScreen } from './components/SplashScreen';
import { PWAInstallProvider } from './context/PWAInstallContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('adminUser') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function AppShell() {
  const location = useLocation();
  const { theme } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const forceSplash = new URLSearchParams(location.search).has('splash')
    || localStorage.getItem('campusGuide.forceSplash') === '1';
  const suppressSplash = location.pathname === '/admin/login'
    || location.pathname === '/pharmacy/login';
  const showSplashActive = !suppressSplash && (forceSplash || showSplash);

  // Dynamic Theme Color effect
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      let color = '#ffffff'; // Default light theme
      const isDark = theme === 'dark';
      const path = location.pathname;

      if (isDark) {
        if (path.startsWith('/category')) {
          color = '#050816'; // Dark category view bg
        } else {
          color = '#0b0f1e'; // General dark mode bg
        }
      } else {
        if (path.startsWith('/category')) {
          color = '#F2ECFD'; // Light category top lavender gradient
        } else if (path === '/' || path === '/about' || path === '/contact') {
          color = '#ffffff'; // Pristine white
        } else {
          color = '#f8fafc'; // Default light slate bg for listings, dashboard etc.
        }
      }
      
      metaThemeColor.setAttribute('content', color);
    }
  }, [location.pathname, theme]);

  useEffect(() => {
    if (!showSplashActive) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSplashActive]);

  const handleSplashComplete = () => {
    if (forceSplash) return;
    setShowSplash(false);
  };

  return (
    <>
      {showSplashActive && (
        <SplashScreen holdOnComplete={forceSplash} onSplashComplete={handleSplashComplete} />
      )}
      <Toaster position="top-right" />
      <LocationProvider>
        <LocationLoader />
        <Routes>
          {/* Auth Routes - Outside MainLayout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/pharmacy/login" element={<PharmacyLogin />} />
          <Route path="/pharmacy/*" element={
            <PharmacyAuthProvider>
              <RequirePharmacyAuth>
                <PharmacyDashboard />
              </RequirePharmacyAuth>
            </PharmacyAuthProvider>
          } />

          {/* Main Layout Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home splashComplete={!showSplashActive} />} />
            
            {/* Category Routes */}
            <Route path="category">
              <Route path="academic" element={<AcademicBuildings />} />
              <Route path="libraries" element={<Libraries />} />
              <Route path="dining" element={<DiningHalls />} />
              <Route path="sports" element={<SportsFacilities />} />
              <Route path="student-centers" element={<StudentCenters />} />
              <Route path="health" element={<HealthServices />} />
            </Route>

            {/* Medicine Routes */}
            <Route path="medicines" element={<Medicines />} />
            <Route path="medicine/:id" element={<MedicineDetails />} />
            <Route path="pharmacies" element={<Pharmacies />} />

            {/* Other Routes */}
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="privacy" element={<Privacy />} />
          </Route>
        </Routes>
      </LocationProvider>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <PWAInstallProvider>
        <Router>
          <AppShell />
        </Router>
      </PWAInstallProvider>
    </ThemeProvider>
  );
}

export default App;
