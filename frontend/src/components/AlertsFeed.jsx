import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
const API_URL=import.meta.env.VITE_BACKEND_URL;
const socket = io(`${API_URL}`);

// Helper function to get the right color for the alert level
// UPDATED to accept reportType and provide more colors
const getAlertColor = (reportType) => {
  // Use a simple hash to pick a color if the type is unknown
  // This makes it "random" but consistent for the same type
  const colors = [
    '#B91C1C', // Red
    '#D97706', // Amber
    '#059669', // Green
    '#4338CA', // Indigo
    '#DB2777', // Pink
  ];
  
  // Use specific types if we know them
  switch (String(reportType).toUpperCase()) {
    case 'POACHING':
    case 'HIGH': // Keep old high-level logic
      return colors[0];
    case 'SIGHTING':
    case 'MEDIUM':
      return colors[1];
    case 'MOVEMENT':
    case 'LOW':
      return colors[2];
    default:
      // Simple hash function for "random" but consistent color
      let hash = 0;
      for (let i = 0; i < String(reportType).length; i++) {
        hash = reportType.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
  }
};

function AlertsFeed() {
  const [alerts, setAlerts] = useState([]);

  // 1. Fetch historical alerts (No logic change)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/alerts`);
        setAlerts(res.data);
      } catch (err) {
        console.error('Error fetching historical alerts:', err);
      }
    };
    fetchAlerts();
  }, []);

  // 2. Set up Socket.io listener (No logic change)
  useEffect(() => {
    socket.on('new-alert', (newAlert) => {
      console.log('Received new-alert:', newAlert);
      setAlerts((prevAlerts) => {
        const updatedAlerts = [newAlert, ...prevAlerts];
        return updatedAlerts.slice(0, 10);
      });
    });

    return () => {
      socket.off('new-alert');
    };
  }, []);

  // Inline styles (Updated to Light Theme)
  const styles = {
    // This is the final, corrected style
feedContainer: {
  width: '100%',
  backgroundColor: 'transparent',
  color: '#223322',
  padding: '0',
  fontFamily: 'sans-serif',
},
    alertCard: {
      padding: '12px',
      marginBottom: '12px',
      borderRadius: '8px',
      borderLeft: '5px solid',
    },
    title: {
      fontWeight: 'bold',
      fontSize: '1rem',
      marginBottom: '4px',
      color: '#223322', // Dark text
    },
    details: {
      fontSize: '0.9rem',
      color: '#556655', // Medium grey-green text
    },
    timestamp: {
      fontSize: '0.8rem',
      color: '#778877', // Lighter grey-green text
      marginTop: '8px',
    },
    header: {
      color: '#223322', // Dark text
      fontWeight: '600',
      marginBottom: '16px',
    },
  };

  return (
    <div style={styles.feedContainer}>
      <h3 style={styles.header}>REAL-TIME ALERTS FEED</h3>
      {alerts.length === 0 && <p>No alerts at this time.</p>}

      {alerts.map((alert) => {
        // UPDATED: Pass the alert's reportType to get a varied color
        const cardColor = getAlertColor(alert.reportType);
        
        return (
          <div
            key={alert._id}
            style={{
              ...styles.alertCard,
              backgroundColor: cardColor + '20', // Lighter 12% opacity
              borderLeftColor: cardColor,
            }}
          >
            <div style={styles.title}>
              [{alert.reportType}] {alert.species}
            </div>
            <div style={styles.details}>{alert.notes}</div>

            <div style={styles.timestamp}>
              {new Date(alert.timestamp).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AlertsFeed;