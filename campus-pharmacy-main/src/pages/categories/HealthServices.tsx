import React, { useEffect, useState } from 'react';
import { FaFirstAid, FaSearch } from 'react-icons/fa';
import { CategoryHero } from '../../components/category/CategoryHero';
import { heroBackgrounds, locationImages } from '../../utils/imageUrls';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useLocations } from '../../context/LocationContext';

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  hours: string;
  phone: string;
  latitude: number;
  longitude: number;
  available: boolean;
  image: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  building: string;
  floor: string;
  openingHours: string;
  image: string;
  tags: string[];
  type: string;
  getDirections?: () => void;
}

const healthLocations: Location[] = [];

const stats = [
  {
    label: 'Health Providers',
    value: '30+'
  },
  {
    label: 'Services Offered',
    value: '50+'
  },
  {
    label: 'Annual Visits',
    value: '20K+'
  }
];

const filterOptions = ['Pharmacies', 'Clinics', 'Hospitals', 'Medicines'];

export const HealthServices = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [hospitalsAndClinics, setHospitalsAndClinics] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setHealthLocations } = useLocations();

  useEffect(() => {
    fetchPharmacies();
    fetchHospitalsAndClinics();
    setLoading(false); // Ensure loading state is reset after both fetches
  }, []);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .order('name');

      if (error) throw error;

      setPharmacies(data || []);

      // Store all health locations in context
      const allLocations = [
        ...healthLocations,
        ...(data || []).map(pharmacy => ({
          id: pharmacy.id,
          name: pharmacy.name,
          description: `Campus pharmacy located at ${pharmacy.location}. Contact: ${pharmacy.phone}`,
          building: pharmacy.location,
          floor: 'Ground Floor',
          openingHours: pharmacy.hours,
          image: pharmacy.image, // Use the image column from the database for health services
          tags: ['Pharmacies'],
          type: 'pharmacy',
          getDirections: () => {
            const coordinates = `${pharmacy.latitude},${pharmacy.longitude}`;
            const query = encodeURIComponent(`${pharmacy.name} ${pharmacy.location}`);
            window.open(`https://www.google.com/maps/search/${query}/@${coordinates},17z`, '_blank');
          }
        }))
      ];
      setHealthLocations(allLocations);
    } catch (err) {
      console.error('Error fetching pharmacies:', err);
    } finally {
      setLoading(false); // Ensure loading state is reset after fetching pharmacies
    }
  };

  const fetchHospitalsAndClinics = async () => {
    try {
      setLoading(true);
      // Fetch hospitals and clinics
      const { data: facilitiesData, error } = await supabase
        .from('locations')
        .select('*')
        .in('building_type', ['hospital', 'clinic'])
        .order('name');

      // console.log('Fetched facilities data:', facilitiesData);
      // console.log('Error fetching facilities:', error);

      if (error) throw error;

      if (facilitiesData) {
        const formattedFacilities: Location[] = (facilitiesData as any[]).map(facility => ({
          id: facility.id,
          name: facility.name,
          description: facility.description || '',
          building: facility.name,
          floor: facility.floor || 'Unknown Floor',
          openingHours: facility.opening_hours || 'Unknown Hours',
          image: facility.image, // Use the image column from the database for health services
          tags: [facility.building_type === 'hospital' ? 'Hospitals' : 'Clinics'],
          type: 'hospital',
          getDirections: () => {
            const coordinates = `${facility.latitude},${facility.longitude}`;
            const query = encodeURIComponent(`${facility.name} ${facility.location}`);
            window.open(`https://www.google.com/maps/search/${query}/@${coordinates},17z`, '_blank');
          }
        }));

        setHospitalsAndClinics(formattedFacilities);
        setHealthLocations([...healthLocations, ...formattedFacilities]);
      } else {
        console.log('No facilities data returned from the query.');
      }
    } catch (err) {
      console.error('Error fetching hospitals and clinics:', err);
    } finally {
      setLoading(false); // Ensure loading state is reset after fetching hospitals and clinics
    }
  };

  const getDirectionsUrl = (pharmacy: Pharmacy) => {
    const coordinates = `${pharmacy.latitude},${pharmacy.longitude}`;
    const query = encodeURIComponent(`${pharmacy.name} ${pharmacy.location}`);
    return `https://www.google.com/maps/search/${query}/@${coordinates},17z`;
  };

  const allLocations = [
    ...pharmacies.map(pharmacy => ({
      id: pharmacy.id,
      name: pharmacy.name,
      description: `Campus pharmacy located at ${pharmacy.location}. Contact: ${pharmacy.phone}`,
      building: pharmacy.location,
      floor: 'Ground Floor',
      openingHours: pharmacy.hours,
      image: pharmacy.image,
      tags: ['Pharmacies'],
      type: 'pharmacy',
      getDirections: () => window.open(getDirectionsUrl(pharmacy), '_blank')
    })),
    ...hospitalsAndClinics,
    ...healthLocations
  ];

  const filteredLocations = allLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = selectedFilter
      ? (selectedFilter === 'Pharmacies' && location.type === 'pharmacy') ||
        (selectedFilter === 'Hospitals' && location.tags?.includes('Hospitals')) ||
        (selectedFilter === 'Clinics' && location.tags?.includes('Clinics')) ||
        (selectedFilter === 'Medicines' && location.tags?.includes('Medicines'))
      : true;

    return matchesSearch && matchesFilter;
  });

  // console.log('Filtered locations:', filteredLocations);

  useEffect(() => {
    // console.log('Component mounted or updated');
    // console.log('Current filtered locations:', filteredLocations);
  }, [filteredLocations]);

  const handleFilterClick = (filter: string) => {
    if (filter === 'Medicines') {
      navigate('/medicines');
      return;
    }
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050816]">
      <CategoryHero
        title="Health Services"
        description="Access comprehensive healthcare and wellness services on campus."
        icon={FaFirstAid}
        backgroundImage={heroBackgrounds.healthServices}
        stats={stats}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, location, or service..."
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-[#151030] dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {filterOptions.map(filter => (
              <button
                key={filter}
                onClick={() => handleFilterClick(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-[#151030] dark:text-[#a09cb9] dark:hover:bg-[#1a1540]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Location Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            // Loading skeletons
            [...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-[240px] bg-gray-200 dark:bg-[#0a0820] rounded-xl mb-3" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-[#0a0820] rounded w-5/6" />
                  <div className="h-3 bg-gray-200 dark:bg-[#0a0820] rounded w-4/6" />
                  <div className="h-3 bg-gray-200 dark:bg-[#0a0820] rounded w-3/6" />
                </div>
              </div>
            ))
          ) : (
            filteredLocations.map((location) => (
              <div
                key={location.id}
                className="cursor-pointer group relative"
              >
                {/* Image Container */}
                <div className="relative w-full h-[240px] overflow-hidden rounded-xl mb-3">
                  <img
                    className="w-full h-full object-stretch"
                    src={location.image}
                    alt={location.name}
                  />

                  {/* Circular Get Directions Button */}
                  {location.getDirections && (
                    <button
                      onClick={location.getDirections}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Content Container */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold mb-1 dark:text-white line-clamp-2 leading-tight">{location.name}</h2>

                    <div className="text-xs text-gray-600 dark:text-[#a09cb9] space-y-0.5">
                      <p className="line-clamp-1">{location.building} - Floor {location.floor}</p>
                      {location.openingHours && (
                        <p className="line-clamp-1">{location.openingHours}</p>
                      )}
                    </div>

                    {location.tags && location.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {location.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-gray-100 dark:bg-[#0a0820] text-gray-600 dark:text-[#a09cb9] text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* No Results Message */}
        {!loading && filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-[#a09cb9] text-lg">
              No health services found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
