import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from './CategoryIcon';
import { Icons } from '../../constants/icons';

interface CategoryCardProps {
  id: string;
  title: string;
  icon: keyof typeof Icons;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ id, title, icon }) => {
  return (
    <Link
      to={`/category/${id}`}
      className="flex flex-col items-center p-6 bg-white dark:bg-[#151030] rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-white/10"
    >
      <div className="w-12 h-12 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
        <CategoryIcon icon={icon} />
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{title}</span>
    </Link>
  );
};