// components/Map.tsx
'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, LatLngBounds, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useMarkerStore from '@/store/markerStore';

// Fix for the missing marker icon
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = new Icon({
  iconUrl: markerIconUrl.src,
  shadowUrl: markerShadowUrl.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  center?: LatLngExpression;
  zoom?: number;
}

// Component to fit bounds of all markers
const FitBoundsToMarkers = () => {
  const { markers } = useMarkerStore();
  const map = useMap();

  // Component to fit bounds of all markers
  useEffect(() => {

    if (markers.length === 0) return;

    // Convert markers to LatLng tuples if needed
    const bounds = new LatLngBounds(
      markers.map((marker) => {
        if (Array.isArray(marker.position)) {
          return marker.position as [number, number]; // Ensure the type is [number, number]
        }
        return [marker.position.lat, marker.position.lng] as [number, number];
      })
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [markers, map]);

  return null;
};

const DEFAULT_CENTER: LatLngExpression = [46.603354, 1.888334]; // France
const DEFAULT_ZOOM = 6; // to view the whole France

const Map = ({ center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM }: MapProps) => {
  const { markers } = useMarkerStore();

  return (
    <MapContainer center={center} zoom={zoom} className="flex-1 w-full h-full rounded-lg">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBoundsToMarkers />
      {markers.map((marker, idx) => (
        <Marker key={idx} position={marker.position} icon={defaultIcon}>
          {marker.popUpTitle &&
            <Popup>
              <span className="text-lg font-bold">
                {marker.popUpTitle}
              </span>
              <br />
              <div dangerouslySetInnerHTML={{ __html: marker.popUpContent || '' }} />
            </Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
