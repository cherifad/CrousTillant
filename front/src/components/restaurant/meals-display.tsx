import { Meal } from "@prisma/client";
import MealCard from "@/components/meal-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MealsDisplayProps {
  selectedDateBreakfast: Meal[];
  selectedDateLunch: Meal[];
  selectedDateDinner: Meal[];
}

export default function MealsDisplay({
  selectedDateBreakfast,
  selectedDateLunch,
  selectedDateDinner,
}: MealsDisplayProps) {
  return (
    <>
      {selectedDateBreakfast.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🥞 Petit-déjeuner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBreakfast.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </CardContent>
        </Card>
      )}
      {selectedDateLunch.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🍽 Déjeuner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateLunch.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </CardContent>
        </Card>
      )}
      {selectedDateDinner.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>🍲 Dîner</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateDinner.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
