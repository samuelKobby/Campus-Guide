import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../context/ThemeContext';

interface PharmacyRequest {
  id: number;
  pharmacy_name: string;
  owner_name: string;
  email: string;
  phone: string;
  location: string;
  license_number: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const PharmacyRequests: React.FC = () => {
  const [requests, setRequests] = useState<PharmacyRequest[]>([]);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PharmacyRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`shadow-sm rounded-lg p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`h-4 rounded w-1/4 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="space-y-3 mt-4">
              <div className={`h-4 rounded w-3/4 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
              <div className={`h-4 rounded w-1/2 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const RequestModal: React.FC<{ request: PharmacyRequest }> = ({ request }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className={`backdrop-blur-md rounded-lg shadow-sm p-6 border ${
        theme === 'dark'
          ? 'bg-gray-800/20 border-gray-700/30'
          : 'bg-white/20 border-white/30'
      }`}>
        <h3 className={`text-lg font-medium mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Review Pharmacy Request</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Pharmacy Name</label>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{request.pharmacy_name}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Owner Name</label>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{request.owner_name}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Contact Information</label>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{request.email}</p>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{request.phone}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Location</label>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{request.location}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>License Number</label>
            <p className={`mt-1 text-sm ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>{request.license_number}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Admin Notes</label>
            <textarea
              className={`mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this request..."
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setSelectedRequest(null)}
            className={`px-4 py-2 border rounded-md ${
              theme === 'dark'
                ? 'text-gray-300 border-gray-600 hover:bg-gray-700'
                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={() => handleStatusUpdate(request.id, 'rejected')}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => handleStatusUpdate(request.id, 'approved')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className={`backdrop-blur-md rounded-lg shadow-sm p-6 border transition-colors duration-200 ${
          theme === 'dark'
            ? 'bg-gray-800/20 border-gray-700/30'
            : 'bg-white/20 border-white/30'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className={`text-lg font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {request.pharmacy_name}
                </h3>
                <p className={`mt-1 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Submitted by {request.owner_name}
                </p>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      request.status === 'pending'
                        ? theme === 'dark' ? 'bg-yellow-800/70 text-yellow-200' : 'bg-yellow-100/70 text-yellow-800'
                        : request.status === 'approved'
                        ? theme === 'dark' ? 'bg-green-800/70 text-green-200' : 'bg-green-100/70 text-green-800'
                        : theme === 'dark' ? 'bg-red-800/70 text-red-200' : 'bg-red-100/70 text-red-800'
                    }`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Email</p>
                <p className={`mt-1 text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{request.email}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Phone</p>
                <p className={`mt-1 text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{request.phone}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Location</p>
                <p className={`mt-1 text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{request.location}</p>
              </div>
              <div>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>License Number</p>
                <p className={`mt-1 text-sm ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{request.license_number}</p>
              </div>
            </div>
            {request.status === 'pending' && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setAdminNotes('');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Review Request
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {requests.length === 0 && (
        <div className={`text-center py-6 backdrop-blur-md rounded-lg shadow-sm p-6 border ${
          theme === 'dark'
            ? 'bg-gray-800/20 border-gray-700/30 text-gray-400'
            : 'bg-white/20 border-white/30 text-gray-500'
        }`}>
          <p>No pharmacy requests to display</p>
        </div>
      )}

      {selectedRequest && <RequestModal request={selectedRequest} />}
    </div>
  );
};