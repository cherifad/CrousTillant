import { useEffect } from "react";
import MapManager from "@/lib/map";
import { Restaurant } from "@prisma/client";
import { slugify } from "@/lib/utils";

interface MapHandlerProps {
  restaurants: Restaurant[];
  mapId: string;
}

const MapHandler: React.FC<MapHandlerProps> = ({ restaurants, mapId }) => {
  useEffect(() => {
    const map = MapManager.getInstance(mapId);
    if (map) {
      map.getMapInstance()?.invalidateSize();
      map.removeAllMarkers();
      const restaurantsPositions: [number, number][] = [];
      restaurants.forEach((restaurant: Restaurant) => {
        if (restaurant.lat && restaurant.lng) {
          map.setMarker(
            [restaurant.lat, restaurant.lng],
            restaurant.id.toString(),
            false,
            restaurant.name,
            `<a href="/restaurant/${slugify(restaurant.name)}-${
              restaurant.id
            }">Voir la fiche</a>`
          );
          restaurantsPositions.push([restaurant.lat, restaurant.lng]);
        }
      });
      if (restaurantsPositions.length > 0) {
        map.setZoomOnPosition(restaurantsPositions);
      }
    }
  }, [restaurants, mapId]);

  return null; // No UI needed, just runs the effect
};

export default MapHandler;
