"use client";

import { Button } from "@/components/ui/button";
import { AlignLeft, Grid2X2 } from "lucide-react";
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
import { getSelectedCrous, Crous } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  const [display, setDisplay] = useState<"list" | "grid">("list");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [hideFavorites, setHideFavorites] = useState<boolean>(false);
  const [selectedCrous, setSelectedCrous] = useState<Crous | null>(null);

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
      .then((data) => setRestaurants(data));

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

  return (
    <>
      <Suspense fallback={<Skeleton className="h-4 w-[250px]" />}>
        <CheckForRedirect />
      </Suspense>
      <div className="w-full justify-between md:flex">
        <div>
          <h1 className="font-bold text-3xl flex items-center">
            <span>Restaurants du {selectedCrous?.name}</span>
            <Link className="ml-2 h-fit" href="/crous">
              <Badge>Choisir un autre Crous</Badge>
            </Link>
          </h1>
          <p className="opacity-50">{restaurants.length} restaurants trouvés</p>
          {/* <Filters /> */}
          <Input
            className="mt-4 md:mt-8"
            placeholder="Rechercher un restaurant"
            onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
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
              variant={display === "grid" ? "default" : "outline"}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </div>
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
            {search === ""
              ? restaurants.map((restaurant: Restaurant) => (
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
                ))
              : restaurants
                  .filter((restaurant: Restaurant) =>
                    restaurant.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((restaurant: Restaurant) => (
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
