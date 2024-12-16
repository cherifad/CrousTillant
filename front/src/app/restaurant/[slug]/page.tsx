/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";
import { Restaurant, Meal } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "next/navigation";
import DatePicker from "@/components/date-picker";
import { Navigation } from "lucide-react";
import {
  getDates,
  isFavorite as isFavLocalStorage,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RestaurantInfo from "@/components/restaurant-info";
import { notFound } from "next/navigation";
import ToggleFavorite from "@/components/restaurant/toggle-favorite";
import MealsDisplay from "@/components/restaurant/meals-display";
import NoMealMessage from "@/components/restaurant/no-meal-message";
import RestaurantCalendar from "@/components/restaurant/calendar";
import UpdateBadge from "@/components/update-badge";

export default function SingleRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant>();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateMeals, setSelectedDateMeals] = useState<Meal[]>([]);
  const [selectedDateBreakfast, setSelectedDateBreakfast] = useState<Meal[]>(
    []
  );
  const [selectedDateLunch, setSelectedDateLunch] = useState<Meal[]>([]);
  const [selectedDateDinner, setSelectedDateDinner] = useState<Meal[]>([]);
  const [maxAvailableDate, setMaxAvailableDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [emptyMeals, setEmptyMeals] = useState<boolean>(true);

  const params = useParams();
  const restaurantId = params?.slug.toString().split("-").pop();

  // Redirect to 404 if restaurantId is not a number or is not provided
  if (!restaurantId || isNaN(parseInt(restaurantId))) {
    return notFound();
  }

  // Fetch restaurant data and perform additional operations when the component mounts
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
        if (data.meals.length === 0) {
          setEmptyMeals(true);
        }
        sortData(data.meals);
      })
      .finally(() => setLoading(false));

    setIsFavorite(isFavLocalStorage(restaurantId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sorts the given array of meals and performs additional operations based on the sorted data.
   * 
   * @param meals - An array of meals to be sorted.
   */
  const sortData = (meals: Meal[] = []) => {
    setLoading(true);
    // get only meals for today and further dates
    meals = meals.filter(
      (meal) => new Date(meal.date) >= new Date(new Date().setHours(0, 0, 0, 0))
    );

    setMeals(meals);

    if (meals.length === 0) {
      setEmptyMeals(true);
      setLoading(false);
      return;
    }

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
    setLoading(false);
  };

  /**
   * Retrieves meals for a specific date.
   * 
   * @param meals - An array of meals.
   */
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

  /**
   * Splits an array of meals into breakfast, lunch, and dinner arrays based on their meal type.
   * @param meals - The array of meals to be split.
   */
  const splitMeals = (meals: Meal[] = []) => {
    const breakfast = meals.filter((meal) => meal.meal_type === "BREAKFAST");
    const lunch = meals.filter((meal) => meal.meal_type === "LUNCH");
    const dinner = meals.filter((meal) => meal.meal_type === "DINNER");

    setSelectedDateBreakfast(breakfast);
    setSelectedDateLunch(lunch);
    setSelectedDateDinner(dinner);
  };

  // Fetch meals for selected date when it changes
  useEffect(() => {
    getMealsForDate(meals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Split meals into breakfast, lunch, and dinner when selectedDateMeals changes
  useEffect(() => {
    splitMeals(selectedDateMeals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateMeals]);

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
              <span className="sm:flex items-center">
                <h1 className="font-bold text-3xl">{restaurant?.name}</h1>
                <ToggleFavorite
                  isFavorite={isFavorite}
                  restaurantId={parseInt(restaurantId)}
                  restaurant={restaurant}
                  setIsFavorite={setIsFavorite}
                />
                <UpdateBadge restaurant={restaurant ?? undefined} />
              </span>
              <RestaurantInfo
                restaurant={restaurant}
                numberOfMeals={meals.length}
              />
              {!emptyMeals && (
                <DatePicker
                  onDateChange={setSelectedDate}
                  maxDate={maxAvailableDate}
                  current={selectedDate}
                />
              )}
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
            {!emptyMeals ? (
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
                  <div className="flex flex-col gap-4">
                    {selectedDateMeals.length === 0 ? (
                      <p className="text-center">
                        Aucun menu disponible pour cette date 🥲
                      </p>
                    ) : (
                      <MealsDisplay
                        selectedDateBreakfast={selectedDateBreakfast}
                        selectedDateLunch={selectedDateLunch}
                        selectedDateDinner={selectedDateDinner}
                      />
                    )}
                  </div>
                </fieldset>
                <fieldset className="grid gap-6 rounded-lg border p-4 mb-4 md:mb-8 h-fit">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Menu des jours suivants
                  </legend>
                  <RestaurantCalendar
                    availableDates={availableDates}
                    meals={meals}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                  />
                </fieldset>
              </div>
            ) : (
              <NoMealMessage restaurant={restaurant} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
