import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CampusMarkerProps {
  name: string;
  icon: LucideIcon;
  path: string;
  angle: number;
  distance: number;
  color: string;
  delay: number;
  mouseX: number;
  mouseY: number;
}

export const CampusMarker: React.FC<CampusMarkerProps> = ({
  name,
  icon: Icon,
  path,
  angle,
  distance,
  color,
  delay,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const rad = (angle - 90) * (Math.PI / 180);
  const x = Math.cos(rad) * distance;
  const y = Math.sin(rad) * distance;

  return (
    <div
      className="absolute"
      style={{
        top: `calc(50% + ${y}px)`,
        left: `calc(50% + ${x}px)`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 30 : 20,
      }}
    >
    <motion.div
      initial={{ opacity: 0, scale: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: 0.4 + delay * 0.1, duration: 0.7, type: 'spring', stiffness: 100, damping: 14 }}
    >
      <Link
        to={path}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative flex flex-col items-center marker-float" style={{ animationDelay: `${delay * 0.4}s` }}>
          {/* Outer pulse ring */}
          <div
            className={`absolute inset-0 w-14 h-14 -m-1 rounded-2xl bg-gradient-to-r ${color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            style={{ filter: 'blur(10px)' }}
          />

          {/* Ping ripple */}
          <div
            className={`absolute w-14 h-14 -m-1 rounded-2xl bg-gradient-to-r ${color}`}
            style={{
              opacity: 0.12,
              animation: `markerPing 3.5s cubic-bezier(0,0,0.2,1) infinite`,
              animationDelay: `${delay * 350}ms`,
            }}
          />

          {/* Marker icon */}
          <motion.div
            whileHover={{ scale: 1.18, y: -3 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center cursor-pointer marker-icon-box`}
          >
            {/* Glass highlight */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
            </div>
            <Icon className="w-5 h-5 text-white relative z-10 drop-shadow-sm" strokeWidth={2.2} />
          </motion.div>

          {/* Label pill */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + delay * 0.1, duration: 0.4 }}
            className="mt-2 marker-label"
          >
            <span className="text-[10px] font-semibold text-white/80 group-hover:text-white whitespace-nowrap tracking-wide transition-colors duration-300">
              {name}
            </span>
          </motion.div>
        </div>
      </Link>
    </motion.div>
    </div>
  );
};
