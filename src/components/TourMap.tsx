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

// Create custom icon using SVG with theme colors
const createCustomIcon = (number: number) => {
  return new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16344 0 0 7.16344 0 16C0 28 16 42 16 42C16 42 32 28 32 16C32 7.16344 24.8366 0 16 0Z" fill="#1b365d"/>
          <circle cx="16" cy="16" r="12" fill="white"/>
        </svg>
        <span class="absolute top-[8px] left-0 right-0 text-center font-serif font-black text-xs text-[#1b365d]">${number}</span>
      </div>
    `,
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -40],
  });
};

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
    <div className="h-full w-full lg:rounded-none overflow-hidden lg:shadow-none lg:border-none relative bg-stone-100">
      <MapContainer
        center={[55.9486, -3.1999]}
        zoom={14}
        scrollWheelZoom={false}
        className="h-full w-full grayscale-[0.2] contrast-[1.1]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {tour.itinerary.map((item, index) => (
          <Marker 
            key={item.location.id} 
            position={[item.location.lat, item.location.lng]}
            icon={createCustomIcon(index + 1)}
          >
            <Popup>
              <div className="font-serif p-1">
                <div className="font-black text-royal-blue text-lg mb-1 leading-tight">
                  <span className="text-thistle-purple mr-1">{index + 1}.</span> {item.location.name}
                </div>
                <div className="text-sm text-slate-700 italic border-t border-stone-200 pt-2 mt-1">{item.location.description}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {straightPositions.length > 1 && (
          <Polyline
            positions={straightPositions}
            pathOptions={{ color: '#7d5a94', weight: 3, dashArray: '8, 8', opacity: 0.8 }}
          />
        )}
        <MapBounds tour={tour} />
      </MapContainer>
    </div>
  );
};
