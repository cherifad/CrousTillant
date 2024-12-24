import RestaurantCard from "@/components/restaurant-card";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Restaurant } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { Favorite } from "@/store/userPreferencesStore";

interface RestaurantsGridProps {
  restaurants: Restaurant[];
  favorites: Favorite[];
  loading: boolean;
  restaurantToDisplay: Restaurant[];
  hideFavorites: boolean;
  setHideFavorites: (hide: boolean) => void;
}

export default function RestaurantsGrid({
  restaurants,
  favorites,
  loading,
  restaurantToDisplay,
  hideFavorites,
  setHideFavorites,
}: RestaurantsGridProps) {
  return (
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
                (r: Restaurant) => r.code.toString() == favorite.id
              );
              if (!restaurant) return null;
              return (
                <RestaurantCard
                  key={restaurant.code}
                  id={restaurant.code}
                  name={restaurant.nom}
                  place={restaurant.zone}
                  schedule={restaurant.horaires?.join(", ")}
                  url={""}
                  cp={""}
                  address={restaurant.adresse}
                  city={restaurant.region.libelle}
                  phone={restaurant.telephone}
                  img={restaurant.image_url}
                  crousId={restaurant.region.code}
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
              key={restaurant.code}
              id={restaurant.code}
              name={restaurant.nom}
              place={restaurant.zone}
              schedule={restaurant.horaires?.join(", ")}
              url={""}
              cp={""}
              address={restaurant.adresse}
              city={restaurant.region.libelle}
              phone={restaurant.telephone}
              img={restaurant.image_url}
              crousId={restaurant.region.code}
            />
          ))}
        </div>
      )}
    </div>
  );
}
