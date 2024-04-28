/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { Restaurant, Meal } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import DatePicker from "@/components/date-picker";
import MealCard from "@/components/meal-card";
import { Heart, HeartOff, Navigation } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDates } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RestaurantInfo from "@/components/restaurant-info";
import DateCard from "@/components/date-card";

export default function SingleRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateMeals, setSelectedDateMeals] = useState<Meal[]>([]);
  const [maxAvailableDate, setMaxAvailableDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  const { toast } = useToast();

  const params = useParams();
  const restaurantId = params?.slug.toString().split("-").pop();

  if (!restaurantId || isNaN(parseInt(restaurantId))) {
    return <h1>404 - Not Found</h1>;
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/restaurant/${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data) {
          return;
        }
        setRestaurant(data);
        setMeals(data.meals);
        sortData(data.meals);
      });

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(parseInt(restaurantId)));

    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const newFavorites = favorites.filter(
      (id: number) => id !== parseInt(restaurantId!)
    );
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(false);
    toast({
      description: "Lieu retiré des favoris 💔",
    });
  };

  const sortData = (meals: Meal[] = []) => {
    // search for max date available in meals
    const maxDate = new Date(
      Math.max.apply(
        null,
        meals.map((meal) => new Date(meal.date).getTime()) // Convert dates to numbers
      )
    );

    if (maxDate) {
      setMaxAvailableDate(maxDate);
      setAvailableDates(getDates(new Date(), new Date(maxDate)));
    } else {
      setMaxAvailableDate(new Date());
      // if no meals available, set today as available date
      setAvailableDates([new Date()]);
    }

    // filter meals for selected date
    getMealsForDate(meals);
  };

  const getMealsForDate = (meals: Meal[] = []) => {
    // filter meals for selected date
    const selectedDateMeals = meals.filter(
      (meal) =>
        new Date(meal.date).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
    );

    if (selectedDateMeals.length > 0) {
      setSelectedDateMeals(selectedDateMeals);
    } else {
      setSelectedDateMeals([]);
    }
  };

  useEffect(() => {
    getMealsForDate(meals);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <div>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ) : (
        <div>
          <div className="w-full justify-between md:flex">
            <div>
              <span className="flex items-center">
                <h1 className="font-bold text-3xl">{restaurant?.name}</h1>
                {isFavorite && (
                  <Badge
                    className="ml-2 group cursor-pointer"
                    onClick={removeFavorite}
                  >
                    <Heart className="h-3 w-3 mr-2 group-hover:hidden" />
                    <HeartOff className="h-3 w-3 mr-2 hidden group-hover:block" />
                    <span className="group-hover:hidden">Favori</span>
                    <span className="hidden group-hover:block">
                      Retirer des favoris
                    </span>
                  </Badge>
                )}
              </span>
              <RestaurantInfo
                restaurant={restaurant}
                numberOfMeals={meals.length}
              />
              <DatePicker
                onDateChange={setSelectedDate}
                maxDate={maxAvailableDate}
                current={selectedDate}
              />
            </div>
            <div className="flex items-center gap-3 mt-4 md:mt-0">
              <Button asChild>
                <a
                  href={`https://www.google.com/maps/dir//${restaurant?.address} ${restaurant?.cp} ${restaurant?.city}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Y aller
                  <Navigation className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
          <div>
            <div className="grid gap-4 md:grid-cols-3 mt-8">
              <fieldset className="grid gap-6 md:col-span-2 rounded-lg border p-4 mb-4 md:mb-8">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Menu du{" "}
                  {selectedDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </legend>
                <div>
                  {selectedDateMeals.length === 0 ? (
                    <p className="text-center">
                      Aucun menu disponible pour cette date 🥲
                    </p>
                  ) : (
                    <>
                      {selectedDateMeals.map((meal) => (
                        <MealCard key={meal.id} meal={meal} />
                      ))}
                    </>
                  )}
                </div>
              </fieldset>
              <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Menu des jours suivants
                </legend>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((date) => (
                    <DateCard
                      key={date.toISOString()}
                      mealNumber={
                        meals.filter(
                          (meal) =>
                            new Date(meal.date).toLocaleDateString() ===
                            date.toLocaleDateString()
                        ).length
                      }
                      date={date}
                      onSelectedDateChange={setSelectedDate}
                      selectedDate={selectedDate}
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
