import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { ThemeToggle } from '../ui/ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
  isVisible: boolean;
  adminName: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, isVisible, adminName }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { theme } = useTheme();
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState<boolean>(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error logging out');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={`backdrop-blur-md shadow-sm mt-4 mr-4 ml-4 rounded-full border relative z-50 transition-all duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-800/20 border-gray-700/30' 
        : 'bg-white/20 border-white/30'
    } ${!isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 lg:hidden ${
              theme === 'dark'
                ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-700 focus:ring-offset-gray-800 focus:ring-gray-400'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-offset-gray-100 focus:ring-gray-500'
            }`}
          >
            <FaBars className="w-6 h-6" />
          </button>
          <h1 className={`text-xl sm:text-2xl font-bold ml-2 sm:ml-0 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>Admin Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className={`relative ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-gray-100' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 z-[60] border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <div className={`px-4 py-2 border-b flex justify-between items-center ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
                }`}>
                  <h3 className={`text-sm font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Notifications</h3>
                  <div className="flex space-x-2">
                    {notifications.length > 0 && (
                      <>
                        {!selectMode ? (
                          <>
                            <button 
                              onClick={markAllAsRead}
                              className={`text-xs ${
                                theme === 'dark' 
                                  ? 'text-blue-400 hover:text-blue-300' 
                                  : 'text-blue-600 hover:text-blue-800'
                              }`}
                            >
                              Mark all as read
                            </button>
                            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>|</span>
                            <button 
                              onClick={toggleSelectMode}
                              className={`text-xs ${
                                theme === 'dark' 
                                  ? 'text-blue-400 hover:text-blue-300' 
                                  : 'text-blue-600 hover:text-blue-800'
                              }`}
                            >
                              Select
                            </button>
                            <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>|</span>
                            <button 
                              onClick={deleteAllNotifications}
                              className={`text-xs ${
                                theme === 'dark' 
                                  ? 'text-red-400 hover:text-red-300' 
                                  : 'text-red-600 hover:text-red-800'
                              }`}
                            >
                              Delete all
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={toggleSelectMode}
                              className={`text-xs ${
                                theme === 'dark' 
                                  ? 'text-blue-400 hover:text-blue-300' 
                                  : 'text-blue-600 hover:text-blue-800'
                              }`}
                            >
                              Cancel
                            </button>
                            {selectedNotifications.length > 0 && (
                              <>
                                <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-300'}>|</span>
                                <button 
                                  onClick={deleteSelectedNotifications}
                                  className={`text-xs ${
                                    theme === 'dark' 
                                      ? 'text-red-400 hover:text-red-300' 
                                      : 'text-red-600 hover:text-red-800'
                                  }`}
                                >
                                  Delete selected ({selectedNotifications.length})
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="px-4 py-3 text-center">
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>Loading notifications...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-3 text-center">
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      // Determine notification color based on type
                      let bgColor = theme === 'dark' ? 'bg-gray-750' : 'bg-gray-50';
                      switch (notification.type) {
                        case 'success': bgColor = 'bg-green-50'; break;
                        case 'warning': bgColor = 'bg-yellow-50'; break;
                        case 'error': bgColor = 'bg-red-50'; break;
                        default: bgColor = theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50';
                      }
                      
                      return (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 ${bgColor} border-b relative ${selectMode ? 'cursor-pointer' : ''} ${
                            theme === 'dark' 
                              ? 'hover:bg-gray-700/80 border-gray-700' 
                              : 'hover:bg-gray-50/80 border-gray-100'
                          }`}
                          onClick={() => selectMode ? toggleSelectNotification(notification.id) : markAsRead(notification.id)}
                        >
                          <div className="flex items-start">
                            {selectMode && (
                              <div className="mr-2 mt-1">
                                <input
                                  type="checkbox"
                                  checked={selectedNotifications.includes(notification.id)}
                                  onChange={() => toggleSelectNotification(notification.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className={`h-4 w-4 focus:ring-blue-500 rounded ${
                                    theme === 'dark' 
                                      ? 'text-blue-500 border-gray-600' 
                                      : 'text-blue-600 border-gray-300'
                                  }`}
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                              }`}>{notification.title}</p>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                              }`}>{notification.message}</p>
                              <p className={`text-xs mt-1 ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>{notification.time}</p>
                            </div>
                          </div>
                          {!notification.read && !selectMode && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
                <Link
                  to="/admin/notifications"
                  className={`block px-4 py-2 text-sm border-t ${
                    theme === 'dark' 
                      ? 'text-blue-400 hover:bg-gray-700/80 border-gray-700' 
                      : 'text-blue-600 hover:bg-gray-50/80 border-gray-100'
                  }`}
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button 
              className={`flex items-center space-x-2 ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:text-gray-100' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <FaUserCircle className="w-6 h-6" />
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
              }`}>{adminName}</span>
            </button>

            {/* Profile dropdown */}
            {showProfileMenu && (
              <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-[60] border ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-100'
              }`}>
                <Link
                  to="/admin/profile"
                  className={`flex items-center px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-700/80' 
                      : 'text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  <FaUserCircle className="w-4 h-4 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className={`flex items-center px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-700/80' 
                      : 'text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  <FaCog className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    theme === 'dark' 
                      ? 'text-gray-300 hover:bg-gray-700/80' 
                      : 'text-gray-700 hover:bg-gray-50/80'
                  }`}
                >
                  <FaSignOutAlt className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};