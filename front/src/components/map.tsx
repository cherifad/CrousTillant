"use client";

import MapManager from "@/lib/map";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

interface MapProps {
  id: string;
  initialPosition: [number, number];
  onMapReady?: () => void;
}

export default function Map({ id, initialPosition, onMapReady }: MapProps) {
  const mapManager = MapManager.getInstance(id);

  useEffect(() => {
    // Check if the map is already initialized
    if (!mapManager.getMapInstance()) {
      mapManager.initializeMap(id, initialPosition);
      if (onMapReady) {
        onMapReady();
      }
    } else {
      // Optionally, you can invalidate size or reset markers when the map is already initialized
      mapManager.getMapInstance()?.invalidateSize();
    }
  }, [id, initialPosition, onMapReady]);

  return (
    <div id={id} className="flex-1 z-10 relative rounded-[.5rem] h-full"></div>
  );
}
