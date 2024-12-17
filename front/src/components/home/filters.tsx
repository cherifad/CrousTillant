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
} from "@/lib/utils";

interface FiltersProps {
  loading: boolean;
  setSearch: (search: string) => void;
  setRestaurantToDisplay: (restaurants: Restaurant[]) => void;
  restaurants: Restaurant[];
  setLoading: (loading: boolean) => void;
  setPosition: (position: Position | null) => void;
}

export default function Filters({
  loading,
  setSearch,
  setRestaurantToDisplay,
  restaurants,
  setLoading,
  setPosition,
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
      }
    }

    setLoading(false);
  };

  const resetSearch = () => {
    setSearch("");
    setRestaurantToDisplay(restaurants);
  };

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
