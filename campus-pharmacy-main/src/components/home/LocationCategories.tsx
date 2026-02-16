import React from 'react';
import { FaGraduationCap, FaBook, FaUtensils, FaDumbbell, FaCoffee, FaBriefcaseMedical } from 'react-icons/fa';

const categories = [
  { name: 'Academic Buildings', icon: FaGraduationCap },
  { name: 'Libraries', icon: FaBook },
  { name: 'Dining Halls', icon: FaUtensils },
  { name: 'Sports Facilities', icon: FaDumbbell },
  { name: 'Student Centers', icon: FaCoffee },
  { name: 'Health Services', icon: FaBriefcaseMedical },
];

export const LocationCategories: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Categories</h2>
      <div className="space-y-4">
        {categories.map((category) => (
          <button
            key={category.name}
            className="w-full flex items-center p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
            <category.icon className="text-blue-600 dark:text-blue-400 mr-3" size={20} />
            <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
