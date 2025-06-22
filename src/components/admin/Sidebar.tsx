import { Link, useLocation } from 'react-router-dom';
import {
  FaSignOutAlt
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { createPortal } from 'react-dom';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const [showLocations, setShowLocations] = useState(false);
  const { theme } = useTheme();
  const locationsButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  return (
    <div className="flex flex-col h-full w-20 bg-transparent py-4 pl-4 transition-colors duration-200">
      <div className="flex-1 flex flex-col gap-3">
        <nav className="flex-1 flex items-center justify-center">
          <div className={`flex flex-col gap-1 rounded-full p-2 border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } transition-colors duration-200`}>
            {mainNavItems.map((item) => (
              <NavItemComponent key={item.to} item={item} />
            ))}
          </div>
        </nav>

        <div className={`rounded-full p-2 border ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } transition-colors duration-200`}>
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center p-3 w-full text-sm rounded-full transition-colors duration-200 group relative ${
              theme === 'dark'
                ? 'text-gray-300 bg-gray-700/50 hover:bg-gray-700 border border-gray-600/30'
                : 'text-gray-600 bg-white/20 hover:bg-white/30 border border-white/30'
            }`}
          >
            <FaSignOutAlt className="text-2xl" />
            <span className={`absolute left-14 px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border z-[9999] ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-gray-200'
                : 'bg-white border-gray-200 text-gray-700'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </div>
      {/* Render dropdown portal */}
      <LocationsDropdown />
    </div>
  );
};