import React, { useState, useEffect } from 'react';
import { Building, Activity, XCircle, Eye, Search, RefreshCw, Plus, MapPin, Clock, ImageIcon, Pencil, Trash2, Users, Coffee, Calendar, History, CheckCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { LocationForm } from '../../../components/admin/locations/LocationForm';
import { LocationList } from '../../../components/admin/locations/LocationList';
import toast from 'react-hot-toast';

interface HealthFacility {
  id: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  contact_number?: string;
  email?: string;
  website_url?: string;
  image?: string;
  building_type: 'clinic' | 'hospital';
  health_services: {
    facility_type: 'clinic' | 'hospital';
    services: string[];
    specialties: string[];
    emergency_services: boolean;
    accessibility_features: string[];
    operating_hours: {
      [key: string]: { open: string; close: string };
    };
    insurance_accepted: string[];
  };
  created_at: string;
}

interface NewHealthFacility {
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  contact_number: string;
  email: string;
  website_url: string;
  image: string;
  facility_type: 'clinic' | 'hospital';
  services: string[];
  specialties: string[];
  emergency_services: boolean;
  accessibility_features: string[];
  operating_hours: {
    [key: string]: { open: string; close: string };
  };
  insurance_accepted: string[];
}

export const HealthServicesManagement = () => {
  const [facilities, setFacilities] = useState<HealthFacility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<{
    id: string;
    name: string;
    description?: string;
    address: string;
    latitude: number;
    longitude: number;
    contact_number?: string;
    email?: string;
    website_url?: string;
    image?: string;
    building_type: 'clinic' | 'hospital';
    health_services: {
      facility_type: 'clinic' | 'hospital';
      services: string[];
      specialties: string[];
      emergency_services: boolean;
      accessibility_features: string[];
      operating_hours: {
        [key: string]: { open: string; close: string };
      };
      insurance_accepted: string[];
    };
    created_at: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'clinic' | 'hospital'>('clinic');
  const [newFacility, setNewFacility] = useState<NewHealthFacility>({
    name: '',
    description: '',
    address: '',
    latitude: 0,
    longitude: 0,
    contact_number: '',
    email: '',
    website_url: '',
    image: '',
    facility_type: 'clinic',
    services: [],
    specialties: [],
    emergency_services: false,
    accessibility_features: [],
    operating_hours: {},
    insurance_accepted: []
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'clinic' | 'hospital'>('all');
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    setNewFacility((prev: NewHealthFacility) => ({
      ...prev,
      facility_type: activeTab
    }));
  }, [activeTab]);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const { data: facilitiesData, error: fetchError } = await supabase
        .from('locations')
        .select(`
          *,
          health_services(*)
        `)
        .in('building_type', ['clinic', 'hospital'])
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase error details:', fetchError);
        throw fetchError;
      }

      if (facilitiesData) {
        console.log('Fetched data:', facilitiesData);
        setFacilities(facilitiesData);
      }
    } catch (err: any) {
      console.error('Full error object:', err);
      toast.error(`Error fetching health facilities: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Basic validation
      if (!newFacility.name || !newFacility.address) {
        throw new Error('Please fill in all required fields');
      }

      // Validate coordinates
      if (isNaN(newFacility.latitude) || isNaN(newFacility.longitude)) {
        throw new Error('Please enter valid coordinates');
      }

      const locationData = {
        name: newFacility.name,
        description: newFacility.description,
        address: newFacility.address,
        latitude: newFacility.latitude,
        longitude: newFacility.longitude,
        contact_number: newFacility.contact_number,
        email: newFacility.email,
        website_url: newFacility.website_url,
        image: newFacility.image || null,
        building_type: newFacility.facility_type
      };

      let facilityId;

      if (selectedFacility) {
        const { error } = await supabase
          .from('locations')
          .update(locationData)
          .eq('id', selectedFacility.id);

        if (error) throw error;
        facilityId = selectedFacility.id;
      } else {
        const { data, error } = await supabase
          .from('locations')
          .insert(locationData)
          .select('id')
          .single();

        if (error) throw error;
        facilityId = data.id;
      }

      const healthData = {
        id: facilityId,
        facility_type: activeTab,
        services: newFacility.services,
        specialties: newFacility.specialties,
        emergency_services: newFacility.emergency_services,
        accessibility_features: newFacility.accessibility_features,
        operating_hours: newFacility.operating_hours,
        insurance_accepted: newFacility.insurance_accepted
      };

      if (selectedFacility) {
        const { error } = await supabase
          .from('health_services')
          .update(healthData)
          .eq('id', facilityId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('health_services')
          .insert(healthData);
        if (error) throw error;
      }

      await fetchFacilities();
      setShowAddModal(false);
      setSelectedFacility(null);
      toast.success(`Health service ${selectedFacility ? 'updated' : 'added'} successfully`);

      // Reset form
      setNewFacility({
        name: '',
        description: '',
        address: '',
        latitude: 0,
        longitude: 0,
        contact_number: '',
        email: '',
        website_url: '',
        image: '',
        facility_type: 'clinic',
        services: [],
        specialties: [],
        emergency_services: false,
        accessibility_features: [],
        operating_hours: {},
        insurance_accepted: []
      });
      setPreviewImage(null);

    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);

      // First delete from health_services
      const { error: healthError } = await supabase
        .from('health_services')
        .delete()
        .eq('id', id);

      if (healthError) throw healthError;

      // Then delete from locations
      const { error: locationError } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (locationError) throw locationError;

      // Log the activity
      await supabase.from('activity_logs').insert({
        entity_id: id,
        entity_type: 'health_service',
        action: 'delete',
        changes: null
      });

      await fetchFacilities();
      toast.success('Health facility deleted successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `health-services/${fileName}`;

      const uploadResult = await supabase.storage
        .from('pharmacy-images')
        .upload(filePath, file);

      if (uploadResult.error) throw uploadResult.error;

      const { data } = supabase.storage
        .from('pharmacy-images')
        .getPublicUrl(filePath);

      setNewFacility(prev => ({
        ...prev,
        image: data.publicUrl
      }));

    } catch (err: any) {
      toast.error(`Error uploading image: ${err.message}`);
    }
  };

  const resetForm = () => {
    setNewFacility({
      name: '',
      description: '',
      address: '',
      latitude: 0,
      longitude: 0,
      contact_number: '',
      email: '',
      website_url: '',
      image: '',
      facility_type: 'clinic',
      services: [],
      specialties: [],
      emergency_services: false,
      accessibility_features: [],
      operating_hours: {},
      insurance_accepted: []
    });
    setPreviewImage(null);
  };

  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = 
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && facility.health_services?.facility_type === filter;
  });

  const handleEditClick = (facility: HealthFacility) => {
    setEditingFacility(facility);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    console.log('Saving edit for facility:', editingFacility);
    try {
      setLoading(true);

      const { error } = await supabase
        .from('locations')
        .update({
          name: editingFacility?.name,
          description: editingFacility?.description,
          address: editingFacility?.address,
          contact_number: editingFacility?.contact_number,
          email: editingFacility?.email,
          website_url: editingFacility?.website_url,
          image: editingFacility?.image,
        })
        .eq('id', editingFacility?.id);

      if (error) {
        console.error('Error updating location:', error);
        throw error;
      }

      const healthData = {
        id: editingFacility?.id,
        facility_type: editingFacility?.health_services?.facility_type,
        services: editingFacility?.health_services?.services,
        specialties: editingFacility?.health_services?.specialties,
        emergency_services: editingFacility?.health_services?.emergency_services,
        accessibility_features: editingFacility?.health_services?.accessibility_features,
        operating_hours: editingFacility?.health_services?.operating_hours,
        insurance_accepted: editingFacility?.health_services?.insurance_accepted
      };

      console.log('Updating health services with data:', healthData);

      const { error: healthError } = await supabase
        .from('health_services')
        .update(healthData)
        .eq('id', editingFacility?.id);

      if (healthError) {
        console.error('Error updating health services:', healthError);
        throw healthError;
      }

      // Refresh the facility list without reloading the page
      await fetchFacilities();
      setShowEditModal(false);
      toast.success('Facility updated successfully!');
    } catch (error) {
      console.error('Error in handleSaveEdit:', error);
      toast.error('Error updating facility');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
  };

  const handleAddClick = () => {
    setSelectedFacility(null);
    setShowAddModal(true);
    setNewFacility((prev: NewHealthFacility) => ({
      ...prev,
      facility_type: activeTab
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Health Services Management</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search facilities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleAddClick}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus size={20} />
            <span>Add {activeTab === 'clinic' ? 'Clinic' : 'Hospital'}</span>
          </button>
          <button
            onClick={fetchFacilities}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('clinic')}
            className={`${
              activeTab === 'clinic'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Clinics
          </button>
          <button
            onClick={() => setActiveTab('hospital')}
            className={`${
              activeTab === 'hospital'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Hospitals
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredFacilities.filter(facility => facility.building_type === activeTab).length === 0 ? (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No {activeTab === 'clinic' ? 'clinics' : 'hospitals'} found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new {activeTab === 'clinic' ? 'clinic' : 'hospital'}.</p>
          <div className="mt-6">
            <button
              onClick={handleAddClick}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Add {activeTab === 'clinic' ? 'Clinic' : 'Hospital'}
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Emergency
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFacilities
                .filter(facility => facility.building_type === activeTab)
                .map((facility) => (
                  <tr key={facility.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {facility.image && (
                          <img
                            src={facility.image}
                            alt={facility.name}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                          {facility.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">{facility.description}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{facility.contact_number || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{facility.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {facility.health_services?.emergency_services ? 'Yes' : 'No'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(facility)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFacility(facility);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(facility.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Facility Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedFacility ? 'Edit Facility' : 'Add New Facility'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditMode(false);
                  setPreviewImage(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFacility.name}
                  onChange={(e) => setNewFacility({ ...newFacility, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter facility name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newFacility.description}
                  onChange={(e) => setNewFacility({ ...newFacility, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter facility description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFacility.address}
                  onChange={(e) => setNewFacility({ ...newFacility, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinates <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex gap-2 items-center">
                  <input
                    type="text"
                    value={newFacility.latitude && newFacility.longitude ? `${newFacility.latitude}, ${newFacility.longitude}` : ''}
                    onChange={(e) => {
                      const coords = e.target.value.split(',').map(c => parseFloat(c.trim()));
                      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                        setNewFacility((prev: NewHealthFacility) => ({
                          ...prev,
                          latitude: Number(coords[0]),
                          longitude: Number(coords[1])
                        }));
                      }
                    }}
                    placeholder="Enter coordinates (e.g., 5.6505, -0.1962) or select from map"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <a 
                    href="#"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.google.com/maps/@5.6505,-0.1962,15z`, 
                        'SelectLocation',
                        'width=800,height=600,scrollbars=yes'
                      );
                    }}
                  >
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  </a>
                </div>
                <small className="text-gray-500 mt-1 block">
                  Click "Select on Map" to choose location. Copy coordinates from the URL (format: @5.6505,-0.1962) and paste here.
                </small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={newFacility.contact_number}
                  onChange={(e) => setNewFacility({ ...newFacility, contact_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newFacility.email}
                  onChange={(e) => setNewFacility({ ...newFacility, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={newFacility.website_url}
                  onChange={(e) => setNewFacility({ ...newFacility, website_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter website URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                </div>
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="mt-2 h-32 w-auto object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services
                </label>
                <input
                  type="text"
                  value={newFacility.services.join(', ')}
                  onChange={(e) => setNewFacility({ ...newFacility, services: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter services (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties
                </label>
                <input
                  type="text"
                  value={newFacility.specialties.join(', ')}
                  onChange={(e) => setNewFacility({ ...newFacility, specialties: e.target.value.split(',').map(s => s.trim()) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter specialties (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Services
                </label>
                <select
                  value={newFacility.emergency_services.toString()}
                  onChange={(e) => setNewFacility({ ...newFacility, emergency_services: e.target.value === 'true' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditMode(false);
                    setPreviewImage(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : selectedFacility ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Facility Modal */}
      {showEditModal && editingFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Facility
              </h3>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingFacility.name}
                  onChange={(e) => setEditingFacility({ ...editingFacility, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter facility name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editingFacility.description}
                  onChange={(e) => setEditingFacility({ ...editingFacility, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter facility description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingFacility.address}
                  onChange={(e) => setEditingFacility({ ...editingFacility, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coordinates <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex gap-2 items-center">
                  <input
                    type="text"
                    value={editingFacility.latitude && editingFacility.longitude ? `${editingFacility.latitude}, ${editingFacility.longitude}` : ''}
                    onChange={(e) => {
                      const coords = e.target.value.split(',').map(c => parseFloat(c.trim()));
                      if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                        if (editingFacility) {
                          setEditingFacility({
                            ...editingFacility,
                            latitude: Number(coords[0]),
                            longitude: Number(coords[1])
                          });
                        }
                      }
                    }}
                    placeholder="Enter coordinates (e.g., 5.6505, -0.1962) or select from map"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <a 
                    href="#"
                    className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://www.google.com/maps/@5.6505,-0.1962,15z`, 
                        'SelectLocation',
                        'width=800,height=600,scrollbars=yes'
                      );
                    }}
                  >
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  </a>
                </div>
                <small className="text-gray-500 mt-1 block">
                  Click "Select on Map" to choose location. Copy coordinates from the URL (format: @5.6505,-0.1962) and paste here.
                </small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  value={editingFacility.contact_number}
                  onChange={(e) => setEditingFacility({ ...editingFacility, contact_number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingFacility.email}
                  onChange={(e) => setEditingFacility({ ...editingFacility, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={editingFacility.website_url}
                  onChange={(e) => setEditingFacility({ ...editingFacility, website_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter website URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        // Create a preview
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditingFacility({ ...editingFacility, image: reader.result as string });
                        };
                        reader.readAsDataURL(file);

                        // Upload to Supabase Storage
                        const fileExt = file.name.split('.').pop();
                        const fileName = `${Math.random()}.${fileExt}`;
                        const filePath = `health-services/${fileName}`;

                        const uploadResult = await supabase.storage
                          .from('pharmacy-images')
                          .upload(filePath, file);

                        if (uploadResult.error) throw uploadResult.error;

                        const { data } = supabase.storage
                          .from('pharmacy-images')
                          .getPublicUrl(filePath);

                        setEditingFacility({ ...editingFacility, image: data.publicUrl });
                      } catch (err: any) {
                        toast.error(`Error uploading image: ${err.message}`);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                {editingFacility.image && (
                  <img
                    src={editingFacility.image}
                    alt="Preview"
                    className="mt-2 h-32 w-auto object-cover rounded-md"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services
                </label>
                <input
                  type="text"
                  value={editingFacility.health_services?.services?.join(', ') || ''}
                  onChange={(e) => setEditingFacility({
                    ...editingFacility,
                    health_services: {
                      ...editingFacility.health_services,
                      services: e.target.value.split(',').map(s => s.trim())
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter services (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties
                </label>
                <input
                  type="text"
                  value={editingFacility.health_services?.specialties?.join(', ') || ''}
                  onChange={(e) => setEditingFacility({
                    ...editingFacility,
                    health_services: {
                      ...editingFacility.health_services,
                      specialties: e.target.value.split(',').map(s => s.trim())
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter specialties (comma-separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Services
                </label>
                <select
                  value={editingFacility.health_services?.emergency_services ? 'true' : 'false'}
                  onChange={(e) => setEditingFacility({
                    ...editingFacility,
                    health_services: {
                      ...editingFacility.health_services,
                      emergency_services: e.target.value === 'true'
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-5">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedFacility.name}</h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="space-y-6">
              {selectedFacility.image && (
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700">Type</h3>
                  <p className="capitalize">{selectedFacility.health_services?.facility_type}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Emergency Services</h3>
                  <p>{selectedFacility?.health_services?.emergency_services ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Address</h3>
                  <p>{selectedFacility.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Contact</h3>
                  <p>{selectedFacility.contact_number || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                  <p>{selectedFacility.email || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">Website</h3>
                  <p>
                    {selectedFacility.website_url ? (
                      <a
                        href={selectedFacility.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Visit Website
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacility.health_services?.services?.map((service, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacility.health_services?.specialties?.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Insurance Accepted</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFacility.health_services?.insurance_accepted?.map((insurance, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {insurance}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Operating Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(selectedFacility.health_services?.operating_hours || {}).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day}:</span>
                        <span>
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
