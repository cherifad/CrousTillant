"use client";

import { Button } from "@/components/ui/button";
import { AlignLeft, Grid2X2, Locate, RotateCcw } from "lucide-react";
import RestaurantCard from "@/components/restaurant-card";
import React, { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Restaurant } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
  getFavorites,
  Favorite,
  getStarredFav,
  getFavAsHomePage,
  slugify,
  toggleDisplayGrid,
} from "@/lib/utils";
import { useSearchParams, redirect } from "next/navigation";
import {
  getSelectedCrous,
  Crous,
  getGeoLocation,
  Position,
  findRestaurantsAroundPosition,
} from "@/lib/utils";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const [display, setDisplay] = useState<"list" | "grid">("list");
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

  const t = useTranslations("Index");

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
      });

    setFavorites(getFavorites(crous.id));
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const resetSearch = () => {
    setSearch("");
    setRestaurantToDisplay(restaurants);
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
          {/* <Filters /> */}
          <div className="flex gap-2 mt-4 md:mt-8 items-center flex-wrap md:flex-nowrap">
            <Input
              placeholder="Rechercher un restaurant"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleSearch(e.target.value)
              }
            />
            <Button variant="outline" onClick={handleLocationRequest}>
              <Locate className="mr-2 h-4 w-4" /> Me localiser
            </Button>
            <Button variant="outline" onClick={resetSearch}>
              <RotateCcw className="mr-2 h-4 w-4" /> Réinitialiser
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          {/* <p>Choisir l'affichage</p>
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
              variant={display === "grid" ? "default" : "outline"}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </div> */}
        </div>
      </div>
      <div>
        {favorites.length > 0 && (
          <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 relative pt-7">
            <legend className="-ml-1 px-1 text-sm font-medium">
              {favorites.length} restaurants en favoris
            </legend>
            <div
              className={`grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 ${
                hideFavorites ? "hidden" : ""
              }`}
            >
              {favorites.map((favorite: Favorite) => {
                const restaurant = restaurants.find(
                  (r: Restaurant) => r.id.toString() == favorite.id
                );
                if (!restaurant) return null;
                return (
                  <RestaurantCard
                    key={restaurant.id}
                    display={display}
                    id={restaurant.id}
                    name={restaurant.name}
                    place={restaurant.place}
                    schedule={restaurant.schedule}
                    url={restaurant.url}
                    cp={restaurant.cp}
                    address={restaurant.address}
                    city={restaurant.city}
                    phone={restaurant.phone}
                    img={restaurant.img}
                    crousId={restaurant.crousId}
                    favorites={favorites || []}
                    onFavoriteChange={onFavoriteChange}
                  />
                );
              })}
            </div>
            <Badge
              className="absolute top-0 right-1 cursor-pointer select-none"
              onClick={() => setHideFavorites(!hideFavorites)}
            >
              {hideFavorites ? "Afficher" : "Masquer"} les favoris
            </Badge>
          </fieldset>
        )}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[400px]" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-[100px]" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {restaurantToDisplay.map((restaurant: Restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                display={display}
                id={restaurant.id}
                name={restaurant.name}
                place={restaurant.place}
                schedule={restaurant.schedule}
                url={restaurant.url}
                cp={restaurant.cp}
                address={restaurant.address}
                city={restaurant.city}
                phone={restaurant.phone}
                img={restaurant.img}
                crousId={restaurant.crousId}
                favorites={favorites || []}
                onFavoriteChange={onFavoriteChange}
              />
            ))}
          </div>
        )}
      </div>
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
