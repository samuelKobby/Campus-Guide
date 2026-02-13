import React, { useState } from 'react';
import { ContactModal } from '../ui/ContactModal';
import { FaMapMarkerAlt } from 'react-icons/fa';

interface Medicine {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  hours: string;
  phone: string;
  image: string;
}

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  medicines: Medicine[];
}

export const PharmacyCard: React.FC<PharmacyCardProps> = ({ pharmacy, medicines }) => {
  const [showContact, setShowContact] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleGetDirections = () => {
    // Open in Google Maps
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy.location)}`);
  };

  return (
    <>
      <div 
        className="bg-white dark:bg-[#151030] rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg border border-gray-200 dark:border-white/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img 
          src={pharmacy.image} 
          alt={pharmacy.name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{pharmacy.name}</h3>
          <div className="space-y-2 text-gray-600 dark:text-[#a09cb9] mb-4">
            <p> {pharmacy.location}</p>
            <p> {pharmacy.hours}</p>
            <p> {pharmacy.phone}</p>
          </div>

          {/* Medicines List */}
          <div className="border-t border-gray-200 dark:border-white/10 pt-4 mb-4">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-[#a09cb9]">Available Medicines:</h4>
            <div className="space-y-2">
              {medicines.map(medicine => (
                <div 
                  key={medicine.id}
                  className={`p-2 rounded transition-colors duration-300 ${
                    isHovered ? 'bg-gray-50 dark:bg-white/5' : ''
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 dark:text-[#a09cb9]">{medicine.name}</span>
                    <span className="font-semibold text-blue-600 dark:text-[#a09cb9]">
                      {medicine.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className={`${
                      medicine.available ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {medicine.available ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleGetDirections}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
            >
              <FaMapMarkerAlt className="mr-2" /> Get Directions
            </button>
            <button
              onClick={() => setShowContact(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
        pharmacy={pharmacy}
      />
    </>
  );
};