import { Meal } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { useMediaQuery } from "usehooks-ts";

type MealCardProps = {
  meal: Meal;
};

interface foodItem {
  name: string;
  price: number;
}

export default function MealCard({ meal }: MealCardProps) {
  const foodItems = JSON.parse(meal.food_items);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isDesktop ? `meal-${meal.id}` : ""}
    >
      <AccordionItem value={`meal-${meal.id}`}>
        <AccordionTrigger className="capitalize">
          {meal.title.trim()}
        </AccordionTrigger>
        <AccordionContent>
          <ul>
            {foodItems.map((foodItem: foodItem, index: number) => (
              <li key={index} className="flex items-center capitalize">
                <ArrowRight className="h-4 w-4 mr-2" />
                {foodItem.name.trim()}
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
