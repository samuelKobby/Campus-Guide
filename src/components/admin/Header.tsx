@@ .. @@
 import { Link, useNavigate } from 'react-router-dom';
 import { supabase } from '../../lib/supabase';
 import toast from 'react-hot-toast';
+import { ThemeToggle } from '../ui/ThemeToggle';
 
 interface HeaderProps {
   adminName: string;
@@ .. @@
         </div>
         
         <div className="flex items-center space-x-4">
+          {/* Theme Toggle */}
+          <ThemeToggle />
+          
           {/* Notifications */}
           <div className="relative" ref={notificationsRef}>
             <button