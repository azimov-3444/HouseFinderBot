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

const MapPicker = ({ lat, lng, onChange }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const defaultLat = lat || 41.31108; // default to Tashkent center
  const defaultLng = lng || 69.24056;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // 1. Initialize Map
    const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], 13);
    mapRef.current = map;

    // 2. Add OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // 3. Create Draggable Marker
    const marker = L.marker([defaultLat, defaultLng], {
      icon: DefaultIcon,
      draggable: true,
    }).addTo(map);
    markerRef.current = marker;

    // 4. Marker Drag Event
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onChange(position.lat, position.lng);
    });

    // 5. Map Click Event to place marker
    map.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng([clickLat, clickLng]);
      onChange(clickLat, clickLng);
    });

    // Clean up map instance on unmount
    return () => {
      map.remove();
    };
  }, []);

  // Update marker position if lat/lng props change externally
  useEffect(() => {
    if (mapRef.current && markerRef.current && lat && lng) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== lat || currentPos.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.setView([lat, lng], mapRef.current.getZoom());
      }
    }
  }, [lat, lng]);

  return (
    <div className="relative w-full h-[350px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full min-h-[350px]"></div>
      <div className="absolute bottom-2 left-2 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-500 shadow-sm">
        Xaritada tanlang yoki markerni sudrang
      </div>
    </div>
  );
};

export default MapPicker;
