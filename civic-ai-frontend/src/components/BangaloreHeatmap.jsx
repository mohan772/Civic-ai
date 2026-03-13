import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import '../styles/Heatmap.css';
import bangaloreBoundary from '../data/bangaloreBoundary.json';

// Requirement 2: Define Bengaluru bounding box
const bangaloreBounds = [
  [12.7343, 77.3792], // South-West
  [13.1737, 77.8827]  // North-East
];

// Problem Hotspot: Whitefield Coordinates
const whitefieldHotspot = {
  center: [12.9698, 77.7500],
  radius: 1200, // meters
  name: "Whitefield (Problem Hotspot)"
};

function FitBangaloreBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bangaloreBounds);
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  return null;
}

const HeatLayer = ({ complaints }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !complaints || complaints.length === 0) return;

    const filteredPoints = complaints
      .filter(c => 
        c.location && 
        c.location.coordinates &&
        c.location.coordinates[1] >= 12.7343 && 
        c.location.coordinates[1] <= 13.1737 && 
        c.location.coordinates[0] >= 77.3792 && 
        c.location.coordinates[0] <= 77.8827
      )
      .map(c => [
        c.location.coordinates[1],
        c.location.coordinates[0],
        c.report_count || 1
      ]);

    const heatLayer = L.heatLayer(filteredPoints, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      gradient: {
        0.2: "blue",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red"
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, complaints]);

  return null;
};

const BangaloreHeatmap = ({ complaints = [] }) => {
  return (
    <div className="heatmap-container">
      <div className="heatmap-header">
        <h2>Bengaluru Civic Intelligence Heatmap</h2>
      </div>

      <MapContainer 
        bounds={bangaloreBounds}
        maxBounds={bangaloreBounds}
        maxBoundsViscosity={1.0}
        minZoom={11}
        maxZoom={17}
        scrollWheelZoom={true}
        className="leaflet-container"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
          noWrap={true}
        />

        <FitBangaloreBounds />
        <HeatLayer complaints={complaints} />

        {/* Highlight Whitefield as Problem Hotspot */}
        <Circle
          center={whitefieldHotspot.center}
          radius={whitefieldHotspot.radius}
          pathOptions={{
            color: '#e74c3c',
            fillColor: '#e74c3c',
            fillOpacity: 0.2,
            weight: 3,
            dashArray: '10, 10',
            className: 'pulsing-hotspot'
          }}
        >
          <Tooltip permanent direction="top" className="hotspot-tooltip">
            <strong>Hotspot: Whitefield</strong>
          </Tooltip>
          <Popup>
            <div className="popup-content">
              <h4>Problem Hotspot: Whitefield</h4>
              <p>This area has the highest density of reports in the last 24 hours.</p>
              <p><strong>Primary Issue:</strong> Sanitation & Infrastructure</p>
            </div>
          </Popup>
        </Circle>

        <GeoJSON 
          data={bangaloreBoundary} 
          style={{
            color: "#000",
            weight: 2,
            fillOpacity: 0,
            dashArray: '5, 5'
          }}
        />

        {complaints
          .filter(c => 
            c.location && 
            c.location.coordinates &&
            c.location.coordinates[1] >= 12.7343 && 
            c.location.coordinates[1] <= 13.1737 && 
            c.location.coordinates[0] >= 77.3792 && 
            c.location.coordinates[0] <= 77.8827
          )
          .map((complaint) => (
            <Marker 
              key={complaint._id} 
              position={[complaint.location.coordinates[1], complaint.location.coordinates[0]]}
            >
              <Popup>
                <div className="popup-content">
                  <h4>{complaint.category}</h4>
                  <p><strong>Description:</strong> {complaint.description}</p>
                  <p><strong>Address:</strong> {complaint.address || "Fetching address..."}</p>
                  <span className={`popup-badge priority-${(complaint.priority || 'Medium').toLowerCase()}`}>
                    Priority: {complaint.priority || 'Medium'}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className="heatmap-legend">
        <div className="legend-item">
          <div className="legend-color color-low"></div>
          <span>Few Complaints (Blue)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color color-moderate"></div>
          <span>Moderate Issues (Green)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color color-high"></div>
          <span>High Density (Yellow)</span>
        </div>
        <div className="legend-item">
          <div className="legend-color color-hotspot"></div>
          <span>Complaint Hotspot (Red)</span>
        </div>
        <div className="legend-item">
          <div className="hotspot-indicator"></div>
          <span>Designated Hotspot (Whitefield)</span>
        </div>
      </div>

      <style>{`
        .pulsing-hotspot {
          animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
          0% { stroke-width: 2; fill-opacity: 0.1; }
          50% { stroke-width: 5; fill-opacity: 0.3; }
          100% { stroke-width: 2; fill-opacity: 0.1; }
        }
        .hotspot-tooltip {
          background: #e74c3c;
          color: white;
          border: none;
          font-weight: bold;
          border-radius: 4px;
        }
        .hotspot-indicator {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid #e74c3c;
          background: rgba(231, 76, 60, 0.3);
        }
      `}</style>
    </div>
  );
};

export default BangaloreHeatmap;
