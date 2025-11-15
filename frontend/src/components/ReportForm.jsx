import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// [UI Change] Added react-icons for a better UI, matching the screenshot's feel
import { FaUpload, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import ReportBgImage from '../assets/Report.png'; // <-- ADD THIS LINE
 const API_URL = import.meta.env.VITE_BACKEND_URL;
// --- LocationPicker Component (UNCHANGED) ---
function LocationPicker({ position, setPosition }) {
  const [markerPos, setMarkerPos] = useState(position);

  const map = useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      setMarkerPos(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      setMarkerPos(position);
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return markerPos ? <Marker position={markerPos}></Marker> : null;
}

// --- Main Report Form Component ---
function ReportForm() {
  // --- All your state and logic functions are UNCHANGED ---
  const [reportType, setReportType] = useState('Animal Sighting');
  const [species, setSpecies] = useState('');
  const [notes, setNotes] = useState('');
  const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      handleAiAnalysis(file);
    }
  };
  const handleAiAnalysis = async (file) => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    setAiResult(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to analyze an image.');
      setIsAnalyzing(false);
      return;
    }
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(
        `${API_URL}/api/reports/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('AI Result:', res.data);
      setAiResult(res.data);
      if (res.data.species) {
        setSpecies(res.data.species);
      }
    } catch (err) {
      console.error('Error analyzing image:', err);
      if (err.response && err.response.status === 401) {
        setError('Your session expired. Please log in again.');
      } else {
        setError('AI analysis failed. Please enter species manually.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please upload a photo.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit a report.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    const reportData = new FormData();
    reportData.append('image', selectedFile);
    reportData.append('reportType', reportType);
    reportData.append('species', species);
    reportData.append('notes', notes);
    reportData.append('latitude', position.lat);
    reportData.append('longitude', position.lng);
    if (aiResult && aiResult.species) {
      reportData.append('aiSuggestion', aiResult.species);
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/reports`,
        reportData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Report submitted:', res.data);
      alert('Report submitted successfully!');
      setSpecies('');
      setNotes('');
      setSelectedFile(null);
      setAiResult(null);
    } catch (err) {
      console.error('Error submitting report:', err);
      if (err.response && err.response.status === 401) {
        setError('Your session expired. Please log in again.');
      } else {
        setError('Error submitting report. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(newPos);
        },
        (err) => {
          console.warn(`ERROR(${err.code}): ${err.message}`);
          alert('Unable to get your location. Please drop a pin manually.');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // --- RETURN STATEMENT (Updated UI) ---
  return (
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
      <form
        onSubmit={handleSubmit}
        // [UI Change] Main form card, using grid for the 2-column layout
        className="max-w-6xl mx-auto bg-white p-8 md:p-10 rounded-2xl shadow-lg grid grid-cols-1 lg:grid-cols-5 gap-10"
      >
        {/* --- Column 1: Report Details --- */}
        {/* [UI Change] Set column span and gap */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-3xl font-bold text-gray-800">
            New Sighting Report
          </h3>

          {/* --- Photo Upload Section --- */}
          <div>
            <label
              htmlFor="photo-upload"
              // [UI Change] Styled to match the dark green "Upload Photo" button
              className={`w-full flex items-center justify-center gap-2 p-4 rounded-lg font-semibold text-white transition-all cursor-pointer ${
                selectedFile
                  ? 'bg-gray-500 hover:bg-gray-600'
                  : 'bg-green-700 hover:bg-green-800'
              }`}
            >
              <FaUpload />
              {selectedFile ? 'Change Photo' : 'Upload Photo'}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" // [UI Change] Tailwind class for `display: 'none'`
            />
          </div>

          {/* --- AI Analysis UI --- */}
          {isAnalyzing && (
            // [UI Change] Styled analyzing state
            <div className="text-center p-3 text-gray-600 flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" />
              AI is analyzing your photo...
            </div>
          )}
          {aiResult && aiResult.species && (
            // [UI Change] Styled AI result success
            <div className="text-center p-4 border border-green-200 bg-green-50 rounded-lg">
              <p>
                Looks like a <strong>{aiResult.species}</strong>!
              </p>
              <p className="text-sm text-gray-600">
                Is this correct? (You can still edit below)
              </p>
            </div>
          )}
          {error && (
            // [UI Change] Styled error message
            <div className="text-center p-3 text-red-600 bg-red-50 rounded-lg">
              <p>{error}</p>
            </div>
          )}

          {/* --- Form Fields --- */}
          {/* [UI Change] Added a wrapper for consistent spacing */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              // [UI Change] Styled to match light gray fields from screenshot
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Animal Sighting">Animal Sighting</option>
              <option value="Poaching Activity">Poaching Activity</option>
              <option value="Damaged Fence">Damaged Fence</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {reportType === 'Animal Sighting' && (
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">
                Species <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Indian Hornbill"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                // [UI Change] Styled to match light gray fields
                className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add more observation details..."
              // [UI Change] Styled to match light gray fields
              className="w-full p-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[80px]"
            />
          </div>
        </div>

        {/* --- Column 2: Location & Map --- */}
        {/* [UI Change] Set column span and gap */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <label className="font-semibold text-gray-700 text-lg">
            Location <span className="text-red-500">*</span>
          </label>

          <button
            type="button"
            onClick={handleGetLocation}
            // [UI Change] Styled to match the light green "Use My Location" button
            className="w-full flex items-center justify-center gap-2 p-4 rounded-lg font-semibold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 transition-all cursor-pointer"
          >
            <FaMapMarkerAlt /> Use My Current Location
          </button>

          <p className="text-center text-gray-500">
            — OR add manually —
          </p>
          
          <p className="text-center text-gray-600 font-medium">
            Tap to Drop Pin on Map
          </p>

          {/* [UI Change] Styled map container */}
          <div className="h-[440px] w-full rounded-lg overflow-hidden border border-gray-300 z-10">
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={5}
              style={{ height: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
            <input type="number" value={position.lat} readOnly hidden />
            <input type="number" value={position.lng} readOnly hidden />
          </div>
        </div>

        {/* --- Submit Button (Full Width) --- */}
        {/* [UI Change] Made button span full grid width */}
        <div className="lg:col-span-5 w-full pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || isAnalyzing}
            // [UI Change] Styled to match the primary green button theme
            className="w-full lg:w-1/3 lg:mx-auto flex items-center justify-center gap-2 p-4 rounded-lg font-bold text-lg text-white bg-green-700 hover:bg-green-800 transition-all disabled:opacity-50"
          >
            {(isSubmitting || isAnalyzing) && (
              <FaSpinner className="animate-spin" />
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default ReportForm;