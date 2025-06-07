import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import placeholderImage from '../assets/placeholder.svg';
import { VoiceSearchInput } from '../components/search/VoiceSearchInput';
import { useVoiceLanguages } from '../hooks/useVoiceLanguages';
import { useMedicineTranslations } from '../hooks/useMedicineTranslations';

interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  available: boolean;
  image: string;
}

export const Medicines: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Voice language support
  const { languages } = useVoiceLanguages();
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const { findMatchingMedicine } = useMedicineTranslations(currentLanguage);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medicines')
        .select('*');

      if (error) throw error;

      setMedicines(data);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(data.map(medicine => medicine.category)));
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching medicines:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching medicines');
    } finally {
      setLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(medicine => {
    // Try to find a matching medicine name in the current language
    const spokenMedicineName = findMatchingMedicine(searchTerm);
    
    const matchesSearch = 
      // Check if the spoken medicine name matches
      (spokenMedicineName && medicine.name.toLowerCase() === spokenMedicineName.toLowerCase()) ||
      // Fallback to regular text search
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="container mx-auto py-8 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Available Medicines</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <VoiceSearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search medicines by name or description..."
              currentLanguage={currentLanguage}
              onLanguageChange={setCurrentLanguage}
              className="w-full"
            />
          </div>
          <div className="flex gap-4">
            <select
              className="p-2 border rounded-lg"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMedicines.map((medicine) => (
          <div
            key={medicine.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/medicine/${medicine.id}`)}
          >
            <img
              className="h-48 w-full object-cover"
              src={medicine.image || placeholderImage}
              alt={medicine.name}
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{medicine.name}</h2>
              <p className="text-gray-600 mb-4">{medicine.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {medicine.category}
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  GH₵{medicine.price.toFixed(2)} per {medicine.unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
