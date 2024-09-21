"use client";

import { Button } from "@/components/ui/button";
import { AlignLeft, Map } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Restaurant } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  getFavorites,
  Favorite,
  getStarredFav,
  getFavAsHomePage,
  slugify,
  toggleDisplayGrid,
  getDisplayGrid,
} from "@/lib/utils";
import { useSearchParams, redirect } from "next/navigation";
import { getSelectedCrous, Crous, Position } from "@/lib/utils";
import Link from "next/link";
import dynamic from "next/dynamic";
import RestaurantsGrid from "@/components/home/restaurants-grid";

const MapComponent = dynamic(() => import("@/components/map"), {
  ssr: false,
});

const Filters = dynamic(() => import("@/components/home/filters"), {
  ssr: false,
});

export default function Home() {
  const [display, setDisplay] = useState<"list" | "map">("list");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantToDisplay, setRestaurantToDisplay] = useState<Restaurant[]>(
    []
  );
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [hideFavorites, setHideFavorites] = useState<boolean>(false);
  const [selectedCrous, setSelectedCrous] = useState<Crous | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapKey, setMapKey] = useState(0); // key to force remount of the map

  const mapId = "restaurantMap"; // or any other ID you use

  const handleMapReady = () => {
    setMapReady(true);
  };

  // useEffect(() => {
  //   if (mapReady) {
  //     putRestaurantsOnMap(restaurantToDisplay);
  //   }
  // }, [mapReady, restaurantToDisplay]);

  useEffect(() => {
    setLoading(true);
    // This is achieved by using the fetch method with the cache: 'no-store' option
    const crous = getSelectedCrous();
    setSelectedCrous(crous);

    if (!crous) {
      redirect("/crous");
    }

    fetch("/api/restaurant?crousId=" + crous.id)
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setRestaurantToDisplay(data);
        const currentDisplay = getDisplayGrid();
        setDisplay(currentDisplay);
      });

    setFavorites(getFavorites(crous.id));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (display === "map" && mapReady) {
  //     putRestaurantsOnMap(restaurantToDisplay);
  //   }
  // }, [restaurantToDisplay, display]);

  useEffect(() => {
    if (display === "map" && mapReady) {
      console.log("remounting map", mapKey);
      setMapKey((prevKey) => prevKey + 1); // change key to force remount
    }
  }, [display]);

  // const putRestaurantsOnMap = (restaurants: Restaurant[]) => {
  //   const map = MapManager.getInstance(mapId);
  //   if (map) {
  //     map.getMapInstance()?.invalidateSize();
  //     map.removeAllMarkers();
  //     const restaurantsPositions: [number, number][] = [];
  //     restaurants.forEach((restaurant: Restaurant) => {
  //       if (restaurant.lat && restaurant.lng) {
  //         map.setMarker(
  //           [restaurant.lat, restaurant.lng],
  //           restaurant.id.toString(),
  //           false,
  //           restaurant.name,
  //           `<a href="/restaurant/${slugify(restaurant.name)}-${
  //             restaurant.id
  //           }">Voir la fiche</a>`
  //         );
  //         restaurantsPositions.push([restaurant.lat, restaurant.lng]);
  //       }
  //     });
  //     if (restaurantsPositions.length > 0) {
  //       map.setZoomOnPosition(restaurantsPositions);
  //     }
  //   }
  // };

  const onFavoriteChange = (
    restaurantId: number,
    name: string,
    isFavorite: boolean
  ) => {
    if (isFavorite) {
      setFavorites([
        ...favorites,
        {
          id: restaurantId.toString(),
          name: name,
          crousId: selectedCrous?.id!,
        },
      ]);
    } else {
      setFavorites(
        favorites.filter(
          (favorite: Favorite) => favorite.id !== restaurantId.toString()
        )
      );
    }
  };

  return (
    <>
      <Suspense fallback={<Skeleton className="h-4 w-[250px]" />}>
        <CheckForRedirect />
      </Suspense>
      <div className="w-full justify-between md:flex">
        <div>
          <span className="flex items-center flex-wrap gap-2">
            <h1 className="font-bold text-3xl">
              Restaurants du {selectedCrous?.name}
            </h1>
            <Link href="/crous">
              <Badge>Choisir un autre Crous</Badge>
            </Link>
          </span>
          <p className="opacity-50">
            {restaurantToDisplay.length} restaurants trouvés
          </p>
          <Filters
            loading={loading}
            setSearch={setSearch}
            setRestaurantToDisplay={setRestaurantToDisplay}
            restaurants={restaurants}
            setLoading={setLoading}
            setPosition={setPosition}
            display={display}
            // putRestaurantsOnMap={putRestaurantsOnMap}
            mapId={mapId}
            displayedRestaurants={restaurantToDisplay}
          />
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <p>Choisir l'affichage</p>
          <div>
            <Button
              size="icon"
              className="rounded-r-none"
              onClick={() => toggleDisplayGrid(display, setDisplay)}
              variant={display === "list" ? "default" : "outline"}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="rounded-l-none"
              onClick={() => toggleDisplayGrid(display, setDisplay)}
              variant={display === "map" ? "default" : "outline"}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {display === "map" ? (
        <div className="mt-4 flex-1 h-screen">
          <MapComponent
            key={mapKey} // this forces remount of the map
            id={mapId}
            initialPosition={[46.603354, 1.888334]}
            onMapReady={handleMapReady}
          />
        </div>
      ) : (
        <RestaurantsGrid
          restaurants={restaurants}
          favorites={favorites}
          onFavoriteChange={onFavoriteChange}
          loading={loading}
          restaurantToDisplay={restaurantToDisplay}
          hideFavorites={hideFavorites}
          setHideFavorites={setHideFavorites}
        />
      )}
    </>
  );
}

function CheckForRedirect() {
  const params = useSearchParams();
  useEffect(() => {
    if (!getSelectedCrous()) {
      redirect("/crous");
    }

    if (getFavAsHomePage()) {
      if (params && params.get("referer") != "me") {
        const fav = getStarredFav(getSelectedCrous()?.id!);
        if (fav) {
          redirect(`/restaurant/${slugify(fav.name)}-${fav.id}`);
        }
      }
    }
  }, []);
  return null;
}
