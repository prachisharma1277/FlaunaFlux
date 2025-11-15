import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
const API_URL=import.meta.env.VITE_BACKEND_URL;
function DashboardMap() {
  const [reports, setReports] = useState([]);
  const defaultPosition = [20.5937, 78.9629]; 

  useEffect(() => {
    // Fetch reports when the component loads
    const fetchReports = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/alerts`);
        setReports(res.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
      }
    };

    fetchReports();
  }, []); // Empty array means this runs once on mount

  return (
    <MapContainer center={defaultPosition} zoom={5} style={{ height: '600px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Loop over the reports and create a Marker for each one */}
      {reports.map((report) => (
        <Marker
          key={report._id}
          // *** CRITICAL ***
          // Leaflet needs [lat, lng]
          // GeoJSON stores as [lng, lat]
          // So we reverse them here!
          position={[report.location.coordinates[1], report.location.coordinates[0]]}
        >
          <Popup>
            <b>{report.reportType}</b>
            <br />
            {report.species && `Species: ${report.species}`}
            <br />
            {report.notes && `Notes: ${report.notes}`}
            <br />
            Reported: {new Date(report.timestamp).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default DashboardMap;