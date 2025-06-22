import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';

interface ActivityLog {
}

export const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
  });

  return (
    <div className={`shadow-sm rounded-lg overflow-hidden transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-6">
        <h2 className={`text-lg font-medium mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Recent Activity</h2>
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {getActionIcon(activity.action_type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {formatActivityMessage(activity)}
                </p>
                <p className={`text-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}
                </p>
                {activity.details && (
                  <div className="mt-2">
                    <pre className={`text-xs whitespace-pre-wrap font-sans ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {JSON.stringify(activity.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {activities.length > 5 && (
          <div className="text-center py-4">
            <button onClick={toggleShowAll} className={`hover:underline ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-500'
            }`}>
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
      {activities.length === 0 && (
        <div className={`text-center py-6 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          No recent activity to display
        </div>
      )}
    </div>
  );
};