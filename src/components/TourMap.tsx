import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import type { Tour } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Create custom icon to avoid default icon issues
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface TourMapProps {
  tour: Tour;
  onRouteFetched?: (distanceKm: number) => void;
}

// Component to auto-zoom map to show all markers
const MapBounds: React.FC<{ tour: Tour }> = ({ tour }) => {
  const map = useMap();
  React.useEffect(() => {
    if (tour.itinerary.length > 0) {
      const bounds = L.latLngBounds(tour.itinerary.map(item => [item.location.lat, item.location.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [tour, map]);
  return null;
};

export const TourMap: React.FC<TourMapProps> = ({ tour }) => {
  const straightPositions = tour.itinerary.map(item => [item.location.lat, item.location.lng] as [number, number]);

  return (
    <div className="h-full w-full lg:rounded-none overflow-hidden lg:shadow-none lg:border-none relative">
      <MapContainer
        center={[55.9486, -3.1999]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {tour.itinerary.map((item, index) => (
          <Marker 
            key={item.location.id} 
            position={[item.location.lat, item.location.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="font-sans">
                <div className="font-bold text-blue-600">Stop {index + 1}: {item.location.name}</div>
                <div className="text-sm text-gray-600 mt-1">{item.location.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {straightPositions.length > 1 && (
          <Polyline
            positions={straightPositions}
            pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10, 10' }}
          />
        )}
        <MapBounds tour={tour} />
      </MapContainer>
    </div>
  );
};
