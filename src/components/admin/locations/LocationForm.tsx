import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { useTheme } from '../../../context/ThemeContext';

interface LocationFormProps {
  onSuccess?: () => void;
  additionalFields?: Record<string, any>;
}

export const LocationForm: React.FC<LocationFormProps> = ({
  onSuccess,
  additionalFields 
}) => {
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    address: string;
    latitude: string;
    longitude: string;
    contact_number: string;
    email: string;
    website_url: string;
    image_url: string;
  }>({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    contact_number: '',
    email: '',
    website_url: '',
    image_url: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('locations')
        .insert([{ ...formData, ...additionalFields }]);

      if (error) throw error;

      toast.success('Location saved successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to save location');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`backdrop-blur-md rounded-lg shadow-sm p-6 border transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-gray-800/20 border-gray-700/30'
        : 'bg-white/20 border-white/30'
    }`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter location name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter address"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Latitude
            </label>
            <input
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Longitude
            </label>
            <input
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Contact Number
            </label>
            <input
              name="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Website URL
            </label>
            <input
              name="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter website URL"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Image URL
            </label>
            <input
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
              className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white/50 border-gray-300 text-gray-900'
              }`}
              placeholder="Enter image URL"
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className={`block text-sm font-medium mb-1 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            rows={3}
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 backdrop-blur-sm ${
              theme === 'dark'
                ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white/50 border-gray-300 text-gray-900'
            }`}
            placeholder="Enter description"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${
              theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {loading ? 'Saving...' : 'Save Location'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;