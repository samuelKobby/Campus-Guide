import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaChartBar,
  FaClinicMedical,
  FaBoxes,
  FaSignOutAlt,
  FaBell,
  FaUsers,
  FaCog,
  FaUniversity,
  FaBook,
  FaUtensils,
  FaRunning,
  FaUsers as FaUserGroup,
  FaHospital,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import { createPortal } from 'react-dom';

interface SidebarProps {
  onClose?: () => void;
}

interface NavItem {
  name: string;
  to: string;
  icon: React.ReactNode;
  subItems?: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const [showLocations, setShowLocations] = useState(false);
  const locationsButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // Update dropdown position when opened
  const updateDropdownPosition = useCallback(() => {
    if (locationsButtonRef.current) {
      const rect = locationsButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
        left: rect.right + 8, // 8px gap to the right
      });
    }
  }, []);

  // Handle outside click to close dropdown
  useEffect(() => {
    if (!showLocations) return;
    const handleClickOutside = (event: PointerEvent) => {
      if (
        locationsButtonRef.current &&
        !locationsButtonRef.current.contains(event.target as Node) &&
        !document.getElementById('locations-dropdown')?.contains(event.target as Node)
      ) {
        setShowLocations(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [showLocations]);

  // Update position when dropdown opens or window resizes
  useEffect(() => {
    if (showLocations) {
      updateDropdownPosition();
      window.addEventListener('resize', updateDropdownPosition);
      return () => window.removeEventListener('resize', updateDropdownPosition);
    }
  }, [showLocations, updateDropdownPosition]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  const mainNavItems: NavItem[] = [
    { name: 'Dashboard', to: '/admin', icon: <FaHome /> },
    { name: 'Analytics', to: '/admin/analytics', icon: <FaChartBar /> },
    { name: 'Pharmacies', to: '/admin/pharmacies', icon: <FaClinicMedical /> },
    { name: 'Inventory', to: '/admin/inventory', icon: <FaBoxes /> },
    { name: 'Notifications', to: '/admin/notifications', icon: <FaBell /> },
    { name: 'Users', to: '/admin/users', icon: <FaUsers /> },
    {
      name: 'Locations',
      to: '#',
      icon: <FaMapMarkedAlt />,
      subItems: [
        { name: 'Academic Buildings', to: '/admin/locations/academic', icon: <FaUniversity /> },
        { name: 'Libraries', to: '/admin/locations/libraries', icon: <FaBook /> },
        { name: 'Dining Halls', to: '/admin/locations/dining', icon: <FaUtensils /> },
        { name: 'Sports Facilities', to: '/admin/locations/sports', icon: <FaRunning /> },
        { name: 'Student Centers', to: '/admin/locations/student-centers', icon: <FaUserGroup /> },
        { name: 'Health Services', to: '/admin/locations/health-services', icon: <FaHospital /> },
      ]
    },
    { name: 'Settings', to: '/admin/settings', icon: <FaCog /> },
  ];

  // NavItem component for each nav item
  const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
    const isActive =
      location.pathname === item.to ||
      (item.subItems && item.subItems.some((subItem) => location.pathname === subItem.to));
    const hasSubItems = item.subItems && item.subItems.length > 0;

    const handleClick = (e: React.MouseEvent) => {
      if (hasSubItems) {
        e.preventDefault();
        setShowLocations((prev) => !prev);
      } else if (onClose) {
        onClose();
      }
    };

    return (
      <div className="relative">
        {hasSubItems ? (
          <button
            ref={locationsButtonRef}
            onClick={handleClick}
            className={`flex items-center justify-center p-3 text-sm font-medium rounded-full transition-colors duration-200 group relative w-full ${
              isActive || showLocations
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
            aria-haspopup="true"
            aria-expanded={showLocations}
            aria-controls="locations-dropdown"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="absolute left-14 bg-white px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-200 z-[9999]">
              {item.name}
            </span>
          </button>
        ) : (
          <Link
            to={item.to}
            onClick={onClose}
            className={`flex items-center justify-center p-3 text-sm font-medium rounded-full transition-colors duration-200 group relative ${
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="absolute left-14 bg-white px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-200 z-[9999]">
              {item.name}
            </span>
          </Link>
        )}
      </div>
    );
  };

  // Dropdown rendered via Portal
  const LocationsDropdown = () => {
    if (!showLocations) return null;
    const locationsItem = mainNavItems.find((item) => item.name === 'Locations');
    return createPortal(
      <div
        id="locations-dropdown"
        role="menu"
        aria-label="Locations submenu"
        className="bg-white rounded-lg shadow-lg py-2 border border-gray-100 min-w-[200px] transition-all duration-200"
        style={{
          position: 'fixed',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          zIndex: 99999,
        }}
      >
        {locationsItem?.subItems?.map((subItem) => {
          const isActive = location.pathname === subItem.to;
          return (
            <Link
              key={subItem.to}
              to={subItem.to}
              onClick={() => {
                setShowLocations(false);
                onClose?.();
              }}
              className={`flex items-center px-4 py-2 text-sm ${
                isActive ? 'text-blue-700 font-semibold' : 'text-gray-700'
              } hover:bg-gray-50/80 whitespace-nowrap`}
              role="menuitem"
            >
              <span className="text-lg mr-2">{subItem.icon}</span>
              {subItem.name}
            </Link>
          );
        })}
      </div>,
      document.body
    );
  };

  return (
    <div className="flex flex-col h-full w-20 bg-transparent py-4 pl-4">
      <div className="flex-1 flex flex-col gap-3">
        <nav className="flex-1 flex items-center justify-center">
          <div className="flex flex-col gap-1 bg-white rounded-full p-2 border border-gray-200">
            {mainNavItems.map((item) => (
              <NavItemComponent key={item.to} item={item} />
            ))}
          </div>
        </nav>

        <div className="bg-white rounded-full p-2 border border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center p-3 w-full text-sm text-gray-600 bg-white/20 backdrop-blur-md rounded-full transition-colors duration-200 hover:bg-white/30 border border-white/30 group relative"
          >
            <FaSignOutAlt className="text-2xl" />
            <span className="absolute left-14 bg-white px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-200 z-[9999]">
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
