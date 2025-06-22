@@ .. @@
 interface MenuButtonProps {
   isOpen: boolean;
   onClick: () => void;
+  className?: string;
 }
 
-export const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, onClick }) => (
+export const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, onClick, className = '' }) => (
   <button
     onClick={onClick}
-    className="md:hidden p-2 text-white hover:bg-blue-600 rounded"
+    className={`md:hidden p-2 text-white hover:bg-blue-600 rounded ${className}`}
     aria-label="Toggle menu"
   >
     <MenuIcon isOpen={isOpen} />