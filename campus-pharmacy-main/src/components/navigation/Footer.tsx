import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-[#050816] text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Pharma Finder</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Find medicines and campus pharmacies near you with real-time availability information.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/medicines" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Find Medicines
                </Link>
              </li>
              <li>
                <Link to="/category/health" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Find Pharmacies
                </Link>
              </li>
              <li>
                <Link to="/pharmacy/login" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Pharmacy Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
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

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Pharma Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};