import { FaUniversity, FaBook, FaUtensils, FaRunning } from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

interface StatsCardProps {
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, previousValue, icon: Icon, color, isLoading }) => {
  const { theme } = useTheme();
  const percentageChange = previousValue 
    ? ((value - previousValue) / previousValue * 100).toFixed(1)
    : '0';
  const isIncrease = Number(percentageChange) > 0;

  return (
    <div className={`backdrop-blur-md rounded-2xl shadow-lg p-6 border transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-gray-800/20 border-gray-700/30'
        : 'bg-white/20 border-white/30'
    }`}>
      <div className="flex items-center justify-between">
        <div className={`rounded-full p-3 ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <h3 className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>{title}</h3>
          {isLoading ? (
            <div className={`animate-pulse h-8 w-16 rounded ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          ) : (
            <>
              <p className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>{value}</p>
              <p className={`text-sm ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
                {isIncrease ? '+' : ''}{percentageChange}% Previous Week
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const { theme } = useTheme();
  const [stats, setStats] = useState<DashboardCounts>({
    academicBuildings: 0,
    libraries: 0,
    diningHalls: 0,
    recreationCenters: 0,
    studyRooms: 0
  });
}