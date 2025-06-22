@@ .. @@
 import { FaBell, FaUserCircle, FaBars, FaCog, FaSignOutAlt, FaKey } from 'react-icons/fa';
 import { Link } from 'react-router-dom';
 import { usePharmacyAuth } from '../../contexts/PharmacyAuthContext';
+import { ThemeToggle } from '../ui/ThemeToggle';
 
 interface HeaderProps {
   pharmacyName: string;
@@ .. @@
         </div>
         
         <div className="flex items-center space-x-4">
+          {/* Theme Toggle */}
+          <ThemeToggle />
+          
           {/* Notifications */}
           <div className="relative" ref={notificationsRef}>
             <button