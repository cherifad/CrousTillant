"use client";

import { Button } from "@/components/ui/button";
import { AlignLeft, Map } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Restaurant } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/utils";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import { Position } from "@/lib/utils";
import Link from "next/link";
import dynamic from "next/dynamic";
import RestaurantsGrid from "@/components/home/restaurants-grid";
import Loading from "../loading";
import UpdateBadge from "@/components/update-badge";
import useMarkerStore from "@/store/markerStore";
import { useUserPreferences } from "@/store/userPreferencesStore";

const MapComponent = dynamic(() => import("@/components/map"), { ssr: false });

const Filters = dynamic(() => import("@/components/home/filters"), {
  ssr: false,
});

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restaurantToDisplay, setRestaurantToDisplay] = useState<Restaurant[]>(
    []
  );
  // const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [hideFavorites, setHideFavorites] = useState<boolean>(false);
  const [position, setPosition] = useState<Position | null>(null);

  const router = useRouter();
  const { addMarker, clearMarkers } = useMarkerStore();
  const {
    getFavorites,
    selectedCrous,
    setSelectedCrous,
    toggleDisplayGrid,
    display,
  } = useUserPreferences();

  useEffect(() => {
    clearMarkers();
    restaurantToDisplay.forEach((restaurant) => {
      if (restaurant.lat && restaurant.lng) {
        addMarker(
          [restaurant.lat, restaurant.lng],
          restaurant.name,
          `Voir la fiche de <a href="/restaurant/${slugify(restaurant.name)}-${
            restaurant.id
          }">${restaurant.name}</a>`
        );
      }
    });
  }, [restaurantToDisplay]);

  useEffect(() => {
    setLoading(true);

    if (!selectedCrous) {
      router.push("/crous");
      return;
    }

    fetch("/api/restaurant?crousId=" + selectedCrous.id)
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setRestaurantToDisplay(data);
      })
      .then(() => {
        fetch("/api/crous/" + selectedCrous.id)
          .then((res) => res.json())
          .then((data) => {
            setSelectedCrous(data);
          });
      })
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <UpdateBadge scrapingLog={selectedCrous?.ScrapingLog?.[0]} />
          </span>
          <p className="opacity-50">
            {loading ? <Loading /> : `Il y a ${restaurants.length} restaurants`}
          </p>
          <Filters
            loading={loading}
            setSearch={setSearch}
            setRestaurantToDisplay={setRestaurantToDisplay}
            restaurants={restaurants}
            setLoading={setLoading}
            setPosition={setPosition}
          />
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <p>Choisir l'affichage</p>
          <div>
            <Button
              size="icon"
              className="rounded-r-none"
              onClick={() => toggleDisplayGrid()}
              variant={display === "list" ? "default" : "outline"}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="rounded-l-none"
              onClick={() => toggleDisplayGrid()}
              variant={display === "map" ? "default" : "outline"}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {display === "map" ? (
        <div className="mt-4 flex-1 h-screen">
          <MapComponent />
        </div>
      ) : (
        <RestaurantsGrid
          restaurants={restaurants}
          favorites={getFavorites()}
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
  const { selectedCrous, favAsHomePage, getStarredFav } = useUserPreferences();
  const params = useSearchParams();
  useEffect(() => {
    if (!selectedCrous) {
      redirect("/crous");
    }

    if (favAsHomePage) {
      if (params && params.get("referer") != "me") {
        const fav = getStarredFav();
        if (fav) {
          redirect(`/restaurant/${slugify(fav.name)}-${fav.id}`);
        }
      }
    }
  }, []);
  return null;
}
