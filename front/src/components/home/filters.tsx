"use client";

import { Button } from "@/components/ui/button";
import { Locate, RotateCcw } from "lucide-react";
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Restaurant } from "@prisma/client";
import {
  getGeoLocation,
  findRestaurantsAroundPosition,
  Position,
  slugify,
} from "@/lib/utils";
import MapManager from "@/lib/map";

interface FiltersProps {
  loading: boolean;
  setSearch: (search: string) => void;
  setRestaurantToDisplay: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
  setLoading: (loading: boolean) => void;
  setPosition: (position: Position | null) => void;
  display: "list" | "map";
  // putRestaurantsOnMap: (restaurants: Restaurant[]) => void;
  mapId: string;
  displayedRestaurants: Restaurant[];
}

export default function Filters({
  loading,
  setSearch,
  setRestaurantToDisplay,
  restaurants,
  setLoading,
  setPosition,
  display,
  mapId,
  displayedRestaurants,
}: FiltersProps) {

  const handleSearch = (search: string) => {
    setSearch(search);
    if (search === "") {
      setRestaurantToDisplay(restaurants);
    } else {
      setRestaurantToDisplay(
        restaurants.filter((restaurant: Restaurant) =>
          restaurant.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  };

  const handleLocationRequest = async () => {
    setLoading(true);

    const position = await getGeoLocation();

    if (position) {
      setPosition(position);
      const nearbyRestaurant = findRestaurantsAroundPosition(
        restaurants,
        position,
        10
      );

      if (nearbyRestaurant.length > 0) {
        setRestaurantToDisplay(nearbyRestaurant);
        if (display === "map") {
          putRestaurantsOnMap(nearbyRestaurant);
        }
      }
    }

    setLoading(false);
  };

  const resetSearch = () => {
    setSearch("");
    setRestaurantToDisplay(restaurants);
  };

  const putRestaurantsOnMap = (restaurants: Restaurant[]) => {
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
  };

  useEffect(() => {
    console.log("display", display);
    if (display === "map") {
      putRestaurantsOnMap(displayedRestaurants);
    }
  }, [display]);

  useEffect(() => {
    if (display === "map") {
      putRestaurantsOnMap(displayedRestaurants);
    }
  }, [displayedRestaurants]);

  return (
    <div className="flex gap-2 mt-4 md:mt-8 items-center flex-wrap md:flex-nowrap">
      <Input
        placeholder="Rechercher un restaurant"
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleSearch(e.target.value)
        }
      />
      <Button
        variant="outline"
        disabled={loading}
        onClick={handleLocationRequest}
      >
        <Locate className="mr-2 h-4 w-4" />
        {loading ? "Recherche en cours" : "Me localiser"}
      </Button>
      <Button variant="outline" onClick={resetSearch}>
        <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
      </Button>
    </div>
  );
}
