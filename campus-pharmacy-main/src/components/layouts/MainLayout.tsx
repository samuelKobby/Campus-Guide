import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../navigation/Navbar';
import VoiceAgent from '../VoiceAgent';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const hideFooterPaths = ['/admin', '/admin/login', '/category', '/medicines', '/pharmacies'];
  const shouldShowFooter = !hideFooterPaths.some(path => location.pathname.startsWith(path));
  const isHomePage = location.pathname === '/';

  // Enable Lenis smooth scrolling on all pages except the full-screen home HUD
  useSmoothScroll(!isHomePage);

  return (
    <div className={isHomePage ? 'h-screen overflow-hidden' : 'min-h-screen flex flex-col'}>
      {!isHomePage && <Navbar />}
      <main className={isHomePage ? '' : 'flex-grow'}>
        <Outlet />
      </main>
      {!isHomePage && <VoiceAgent />}
      {shouldShowFooter && !isHomePage && (
        <footer className="bg-[#F2ECFD] dark:bg-[#050816] text-gray-900 dark:text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Campus Guide</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Find medicines and campus pharmacies near you with real-time availability information.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/medicines" className="link-reveal text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200">
                      Find Medicines
                    </a>
                  </li>
                  <li>
                    <a href="/pharmacies" className="link-reveal text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200">
                      Find Pharmacies
                    </a>
                  </li>
                  <li>
                    <a href="/pharmacy/login" className="link-reveal text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200">
                      Pharmacy Login
                    </a>
                  </li>
                  <li>
                    <a href="/admin/login" className="link-reveal text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200">
                      Admin Login
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/privacy" className="link-reveal text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors duration-200">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Us</h3>
                <ul className="space-y-2 text-gray-500 dark:text-gray-400">
                  <li>University of Ghana</li>
                  <li>Legon Campus</li>
                  <li>Email: support@pharmafinder.com</li>
                  <li>Phone: (233) 20-000-0000</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-indigo-100 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
              <p>&copy; {new Date().getFullYear()} Campus Guide. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
