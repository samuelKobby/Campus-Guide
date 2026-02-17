import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Footer } from '../components/navigation/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideFooterPaths = ['/admin', '/admin/login', '/category', '/medicines'];
  const shouldShowFooter = !hideFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {children}
        </div>
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};