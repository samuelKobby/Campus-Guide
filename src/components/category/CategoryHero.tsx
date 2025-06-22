import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface CategoryHeroProps {
  title: string;
  description: string;
  icon: IconType;
  backgroundImage: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export const CategoryHero: React.FC<CategoryHeroProps> = ({
  title,
  description,
  icon: Icon,
  backgroundImage,
  stats,
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="relative h-[400px] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <Icon className="text-5xl mb-4" />
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-lg text-center max-w-2xl mb-8">{description}</p>

        {/* Stats */}
        <div className="flex gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className={`absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t ${
        theme === 'dark' 
          ? 'from-gray-900 to-transparent' 
          : 'from-gray-50 to-transparent'
      }`} />
      <div className={`absolute -bottom-px left-0 w-full h-1 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`} />
    </div>
  );
};