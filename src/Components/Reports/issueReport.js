import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    wasteType: '',
    description: '',
    city: '',
    state: '',
    pincode: '',
    harmfulLevel: '',
    images: [],
    locationLink: '', // Field for Google Maps link
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false); // New state for location loading
  const [modalOpen, setModalOpen] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file upload change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      images: e.target.files,
    });
  };

  // Fetch the user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true); // Start loading animation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Generate Google Maps link with coordinates
          const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
          setFormData((prev) => ({
            ...prev,
            locationLink: googleMapsLink, // Automatically set location link
          }));

          setLocationLoading(false); // Stop loading animation
          setLocationError(null);
        },
        (error) => {
          setLocationLoading(false); // Stop loading animation
          setLocationError(error.message);
        },
        {
          enableHighAccuracy: true, // Request high accuracy
          maximumAge: 0,             // Don't use cached location
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzEwOGRlOTdmOGIzNjZjMmViMzRjZDgiLCJpYXQiOjE3MjkxMzgxNzYsImV4cCI6MTcyOTE0MTc3Nn0.iYeJxZbji2N-Dy05IPavZI4ubXAc8isajM7CxzOpJ3c"; // Replace with your actual token
    try {
      const data = new FormData();
      data.append('wasteType', formData.wasteType);
      data.append('description', formData.description);
      data.append('city', formData.city);
      data.append('state', formData.state);
      data.append('pincode', formData.pincode);
      data.append('harmfulLevel', formData.harmfulLevel);
      data.append('locationLink', formData.locationLink); // Append location link

      // Add multiple image files
      for (let i = 0; i < formData.images.length; i++) {
        data.append('images', formData.images[i]);
      }

      const response = await axios.post('http://localhost:3001/report/issue', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });

      setSuccess(true);
      setLoading(false);
      setModalOpen(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false); // Close the modal
  };

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-5xl font-bold text-center mb-6">
        <span className="bg-emerald-950 text-white px-2 py-1 rounded-md">Issue</span>
        <span className='text-5xl px-2 py-1 font-bold text-center my-12 bg-gradient-to-r from-emerald-800 to-green-600 text-transparent bg-clip-text'>an</span>
         <span className="bg-green-400 text-emerald-950 ml-1 px-2 py-1 rounded-md">Report</span>
    </h1>
      <form onSubmit={handleSubmit} className="bg-gray-200 shadow-lg rounded-lg p-6 space-y-4">
        {/* Waste Type */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Waste Type</label>
          <select
            name="wasteType"
            value={formData.wasteType}
            onChange={handleChange}
            className="block w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          >
            <option value="">Select waste type</option>
            <option value="Dry Waste">Dry Waste</option>
            <option value="Organic Waste">Organic Waste</option>
            <option value="Packaging Waste">Packaging Waste</option>
            <option value="Post-Consumer Waste">Post-Consumer Waste</option>
            <option value="Radioactive Waste">Radioactive Waste</option>
            <option value="Recyclable Waste">Recyclable Waste</option>
            <option value="Residual Waste">Residual Waste</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            placeholder="Describe the waste issue..."
            required
          ></textarea>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="block w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="block w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="block w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Harmful Level */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Harmful Level</label>
          <select
            name="harmfulLevel"
            value={formData.harmfulLevel}
            onChange={handleChange}
            className="block w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            required
          >
            <option value="">Select harmful level</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Less">Less</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Upload Images (Max 5)</label>
          <input
            type="file"
            name="images"
            multiple
            onChange={handleFileChange}
            className="block w-full border border-green-300 rounded-lg p-3 focus:ring-2 focus:ring-green-400 focus:outline-none"
            accept="image/*"
          />
        </div>

        {/* Get Current Location Button */}
        <div>
          <button
            type="button"
            onClick={getLocation}
            className={`bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition ${locationLoading ? 'cursor-not-allowed' : ''}`}
            disabled={locationLoading} // Disable button while loading
          >
            {locationLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0"
                    strokeWidth="4"
                  />
                </svg>
                Loading...
              </div>
            ) : (
              'Get Current Location'
            )}
          </button>
        </div>

        {/* Display Google Maps Link */}
        {formData.locationLink && (
          <div className="text-blue-600 font-semibold">
            Location Set: <a href={formData.locationLink} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
          </div>
        )}

        {/* Submit Button */}
       {/* Submit Button */}
       <div>
          <button
            type="submit"
            className={`bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>

        {/* Error and Success Messages */}
        {error && <div className="text-red-600">{error}</div>}

        {/* Modal Popup */}
        <Modal isOpen={modalOpen} onClose={closeModal} message="Issue reported successfully!" />
      </form>
    </div>
  );
};

export default ReportIssue;
