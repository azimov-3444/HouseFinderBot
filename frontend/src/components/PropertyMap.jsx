import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker asset packaging bug in Vite
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const PropertyMap = ({ lat, lng, title, address }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !lat || !lng) return;

    // 1. Initialize Map
    const map = L.map(mapContainerRef.current).setView([lat, lng], 14);

    // 2. Add OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // 3. Create Static Marker with Popup
    const marker = L.marker([lat, lng], {
      icon: DefaultIcon,
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family: sans-serif; text-align: left; max-width: 200px;">
        <h4 style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px; color: #1e293b;">${title}</h4>
        <p style="margin: 0; font-size: 12px; color: #64748b;">${address}</p>
      </div>
    `).openPopup();

    // Clean up map instance on unmount
    return () => {
      map.remove();
    };
  }, [lat, lng, title, address]);

  return (
    <div className="w-full h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]"></div>
    </div>
  );
};

export default PropertyMap;
