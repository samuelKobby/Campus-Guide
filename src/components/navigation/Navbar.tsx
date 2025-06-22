@@ .. @@
 import { MobileMenu } from './MobileMenu';
 import { DesktopNav } from './DesktopNav';
 import { Logo } from './Logo';
+import { ThemeToggle } from '../ui/ThemeToggle';
 import { MenuButton } from './MenuButton';
 import { useNavbarStyle } from '../../hooks/useNavbarStyle';
 
@@ .. @@
       <nav className={navbarClass}>
         <div className="container mx-auto px-4">
           <div className="flex items-center justify-between h-16">
-            <Logo />
-            <DesktopNav />
-            <MenuButton 
-              isOpen={isMenuOpen} 
-              onClick={() => setIsMenuOpen(!isMenuOpen)} 
-            />
+            <div className="flex items-center">
+              <Logo />
+            </div>
+            <div className="flex items-center">
+              <DesktopNav />
+              <div className="ml-4">
+                <ThemeToggle />
+              </div>
+              <MenuButton 
+                isOpen={isMenuOpen} 
+                onClick={() => setIsMenuOpen(!isMenuOpen)} 
+                className="ml-4 md:hidden"
+              />
+            </div>
           </div>
         </div>