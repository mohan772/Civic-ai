import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icon in Vite/React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Helper component to update map center when coordinates change
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

const LocationPicker = ({ onLocationChange }) => {
  const [position, setPosition] = useState([12.9716, 77.5946]); // Bengaluru center default
  const [loading, setLoading] = useState(false);
  const markerRef = useRef(null);

  const fetchCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = [latitude, longitude];
        setPosition(newPos);
        onLocationChange(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        console.warn("Geolocation failed, using default:", err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
          onLocationChange(lat, lng);
        }
      },
    }),
    [onLocationChange],
  );

  return (
    <div className="location-picker-container">
      <div className="picker-header">
        <label>Confirm Complaint Location</label>
        <button 
          type="button" 
          onClick={fetchCurrentLocation} 
          disabled={loading}
          className="current-loc-btn"
        >
          {loading ? 'Locating...' : 'Use My Current Location'}
        </button>
      </div>

      <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden', margin: '10px 0' }}>
        <MapContainer 
          center={position} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={position} />
          <Marker
            draggable={true}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
            icon={DefaultIcon}
          />
        </MapContainer>
      </div>

      <div className="coordinates-display">
        <p><strong>Selected Coordinates:</strong></p>
        <span>Latitude: {position[0].toFixed(6)}</span> | <span>Longitude: {position[1].toFixed(6)}</span>
      </div>

      <style>{`
        .location-picker-container { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee; }
        .picker-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .picker-header label { font-weight: 700; color: #333; }
        .current-loc-btn { padding: 6px 12px; background: #646cff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px; }
        .current-loc-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .coordinates-display { font-size: 13px; color: #666; margin-top: 10px; }
      `}</style>
    </div>
  );
};

export default LocationPicker;
