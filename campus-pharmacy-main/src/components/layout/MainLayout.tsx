import React from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import { Footer } from '../navigation/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideFooterPaths = ['/admin/login', '/admin/signup', '/pharmacy-login', '/category', '/medicines'];
  const shouldShowFooter = !hideFooterPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};
