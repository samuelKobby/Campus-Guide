import React, { useState, useEffect } from 'react';

const images = [
  './images/campus-illustration.jpg',
  './images/3d1.avif',
  './images/3d4.avif',
  './images/3d5.png',

];

export const HeroSlideshow: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [prevImageIndex, setPrevImageIndex] = useState(images.length - 1);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrevImageIndex(currentImageIndex);
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [currentImageIndex]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-transform duration-1000 ease-in-out`}
          style={{
            transform: index === currentImageIndex
              ? 'translateX(0)'
              : index === prevImageIndex
              ? 'translateX(-100%)'
              : 'translateX(100%)',
            zIndex: index === currentImageIndex ? 1 : 0
          }}
        >
          {/* Blurred background */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(8px)',
              transform: 'scale(1.1)',
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
          
          {/* Main image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("${image}")`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
        </div>
      ))}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40" />
    </div>
  );
};
