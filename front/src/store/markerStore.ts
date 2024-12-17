// store/markerStore.ts
import { create } from 'zustand';
import { LatLngExpression } from 'leaflet';

interface Marker {
    position: LatLngExpression;
    popUpTitle?: string;
    popUpContent?: string;
}

interface MarkerStore {
    markers: Marker[];
    addMarker: (position: LatLngExpression, popUpTitle?: string, popUpContent?: string) => void;
    clearMarkers: () => void;
}

const useMarkerStore = create<MarkerStore>((set) => ({
    markers: [],
    addMarker: (position, popUpTitle, popUpContent) => set((state) => ({ markers: [...state.markers, { position, popUpTitle, popUpContent }] })),
    clearMarkers: () => set({ markers: [] }),
}));

export default useMarkerStore;
