import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const API_URL = import.meta.env.VITE_BACKEND_URL;

// [FIX 1] Import the background image you asked about
import ReportBgImage from '../assets/Report.png'; 

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- All helper components and logic are UNCHANGED ---
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapClickHandler = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
    },
  });
  return null;
};

// Main Component
const LogSighting = () => {
  // --- All State and Logic is UNCHANGED ---
  const [incidentType, setIncidentType] = useState('Sighting');
  const [species, setSpecies] = useState('');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().slice(0, 16));
  const [position, setPosition] = useState([20.5937, 78.9629]);
  const [number, setNumber] = useState(1);
  const [severity, setSeverity] = useState('Low');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  // --- All handler functions (handleFileChange, handleGetCurrentLocation, handleSubmit) are UNCHANGED ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleGetCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = [pos.coords.latitude, pos.coords.longitude];
        setPosition(newPos);
      },
      (err) => {
        console.error(err);
        setError('Could not get current location.');
      }
    );
  };
  const handleSubmit = async (e) => {
    if (!incidentType|| !species|| !incidentDate || !position[0] ||!position[1] ||!number) {
      setError('All fields are required for signup.');
      return;
    }
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('incidentType', incidentType);
    formData.append('species', species);
    formData.append('incidentDate', incidentDate);
    formData.append('latitude', position[0]);
    formData.append('longitude', position[1]);
    formData.append('number', number);
    formData.append('severity', severity);
    formData.append('notes', notes);
    if (image) {
      formData.append('image', image);
    }
    try {
      const response = await axios.post(`${API_URL}/api/records/log`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setSuccess('Log submitted successfully!');
      setIncidentType('Sighting');
      setSpecies('');
      setIncidentDate(new Date().toISOString().slice(0, 16));
      setPosition([20.5937, 78.9629]);
      setNumber(1);
      setSeverity('Low');
      setNotes('');
      setImage(null);
      setImagePreview('');
      if(fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit log. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  // --- [FIX 2] RETURN STATEMENT MODIFIED ---
  return (
    // 1. This is the new main wrapper.
    // - `relative` lets us position the background *inside* it.
    // - `overflow-hidden` keeps the blurred edges from spilling out.
    // - `py-16` adds padding, replacing the old `pt-24` and `min-h-screen`.
    <div className="relative overflow-hidden py-16">
      
      {/* 2. The background is now `absolute` to the container above, NOT `fixed`. */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(${ReportBgImage})`,
          filter: 'blur(8px)',
          transform: 'scale(1.1)', // Slightly larger scale to ensure no blurred edges
          zIndex: -1 // Placed behind the content
        }}
      ></div>
    
      <div className="relative z-10 max-w-7xl mx-auto p-8 text-gray-800">
        
        
        
        {/* The form itself is unchanged, it just sits inside the new content wrapper */}
        <form 
          onSubmit={handleSubmit} 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-8 rounded-xl shadow-2xl"
        >
          {/* ... ALL YOUR FORM COLUMNS AND LOGIC ... */}
          {/* (Column 1: Incident Details) */}
          <div className="lg:col-span-1 space-y-6">
            <h1 className="text-3xl font-bold mb-6 text-black">Log New Incident</h1>
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Incident Details</h2>
            <div>
              <label htmlFor="incidentType" className="block text-sm font-semibold text-gray-600 mb-2">Incident Type</label>
              <select
                id="incidentType"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full bg-white border-gray-300 border rounded-md p-2 focus:ring-green-600 focus:border-green-600"
              >
                <option>Sighting</option>
                <option>Poaching</option>
                <option>Illegal Activity</option>
                <option>Carcass Found</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="incidentDate" className="block text-sm font-semibold text-gray-600 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                id="incidentDate"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                className="w-full bg-white border-gray-300 border rounded-md p-2 focus:ring-green-600 focus:border-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Coordinates</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={position[0]}
                  onChange={(e) => setPosition([e.target.value, position[1]])}
                  className="w-1/2 bg-white border-gray-300 border rounded-md p-2 focus:ring-green-600 focus:border-green-600"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={position[1]}
                  onChange={(e) => setPosition([position[0], e.target.value])}
                  className="w-1/2 bg-white border-gray-300 border rounded-md p-2 focus:ring-green-600 focus:border-green-600"
                />
              </div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-150"
              >
                Use Current Location
              </button>
            </div>
            <div className="h-48 w-full rounded-md overflow-hidden z-0">
              <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                <ChangeView center={position} zoom={13} />
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <MapClickHandler setPosition={setPosition} />
                <Marker position={position}></Marker>
              </MapContainer>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Severity</label>
              <div className="flex items-center justify-around bg-gray-50 p-2 rounded-md">
                {['Low', 'Medium', 'High'].map(level => (
                  <label key={level} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level}
                      checked={severity === level}
                      onChange={(e) => setSeverity(e.target.value)}
                      className={`form-radio h-5 w-5 ${
                      level === 'Low' ? 'text-green-600' : level === 'Medium' ? 'text-yellow-500' : 'text-red-600'
                      } bg-white border-gray-300 focus:ring-offset-gray-50`}
                    />
                    <span className={`font-medium ${
                        level === 'Low' ? 'text-green-700' : level === 'Medium' ? 'text-yellow-600' : 'text-red-700'
                      }`}>{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* (Column 2: Observation) */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Observation</h2>
            <div>
              <label htmlFor="species" className="block text-sm font-semibold text-gray-600 mb-2">Species</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="species"
                  placeholder="e.g., Bengal Tiger"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  className="w-full bg-white border-gray-300 border rounded-md p-2 focus:ring-green-600 focus:border-green-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="number" className="block text-sm font-semibold text-gray-600 mb-2"># Animals</label>
              <select
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-white border-gray-300 border rounded-md p-2 focus:ring-green-600 focus:border-green-600"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5+</option>
                <option value={10}>10+</option>
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-600 mb-2">Notes</label>
              <textarea
                id="notes"
                rows="10"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional observations..."
                className="w-full bg-white border-gray-300 border rounded-md p-2 focus:ring-green-600 focus:border-green-600"
              ></textarea>
            </div>
          </div>

          {/* (Column 3: Upload) */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Upload Photo / Video</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Media</label>
              <div 
                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 cursor-pointer bg-green-50 hover:bg-green-100"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
                ) : (
                <span>No file selected</span>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">AI will suggest species after upload.</p>
              <p className="text-xs text-gray-500 mt-1">Clear, bright images improve AI accuracy.</p>
            </div>
          </div>
          
          {/* (Form Actions) */}
          <div className="lg:col-span-3 mt-6 border-t pt-6">
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg transition duration-150"
                onClick={() => { /* Handle cancel logic */ }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Submit Log'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogSighting;