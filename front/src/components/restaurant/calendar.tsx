import DateCard from "@/components/date-card";
import { Meal } from "@prisma/client";

interface RestaurantCalendarProps {
  availableDates: Date[];
  meals: Meal[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function RestaurantCalendar({
  availableDates,
  meals,
  selectedDate,
  setSelectedDate,
}: RestaurantCalendarProps) {
  return (
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
  );
}
