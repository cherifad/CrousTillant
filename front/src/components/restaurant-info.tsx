import { Restaurant } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

type RestaurantInfoProps = {
  restaurant: Restaurant | undefined;
  numberOfMeals: number;
};

export default function RestaurantInfo({
  restaurant,
  numberOfMeals,
}: RestaurantInfoProps) {
  return (
    <div>
      <ul className="opacity-50 xl:flex hidden">
        <p>{numberOfMeals} menus disponibles</p>
        {/* <span className="font-bold">&nbsp;&#8226;&nbsp;</span> */}
        {restaurant?.place && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <p>{restaurant?.place}</p>
        {restaurant?.schedule && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <p>{restaurant?.schedule}</p>
        {restaurant?.address && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <a
          href={`https://www.google.com/maps/dir//${restaurant?.address} ${restaurant?.cp} ${restaurant?.city}`}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          {restaurant?.address} - {restaurant?.cp} {restaurant?.city}
        </a>
        {restaurant?.phone && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <a href={`tel:${restaurant?.phone}`} className="hover:underline">
          {restaurant?.phone}
        </a>
      </ul>
      <Accordion type="single" collapsible className="xl:hidden">
        <AccordionItem value="restaurant-info">
          <AccordionTrigger className="capitalize">
            Informations sur le lieu
          </AccordionTrigger>
          <AccordionContent>
            <ul>
              <li className="flex items-center">
                <ArrowRight className="h-4 w-4 mr-2" />
                {numberOfMeals} menus disponibles
              </li>
              {restaurant?.place && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {restaurant?.place}
                </li>
              )}
              {restaurant?.schedule && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {restaurant?.schedule}
                </li>
              )}
              {restaurant?.address && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <a
                    href={`https://www.google.com/maps/dir//${restaurant?.address} ${restaurant?.cp} ${restaurant?.city}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {restaurant?.address} - {restaurant?.cp} {restaurant?.city}
                  </a>
                </li>
              )}
              {restaurant?.phone && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <a
                    href={`tel:${restaurant?.phone}`}
                    className="hover:underline"
                  >
                    {restaurant?.phone}
                  </a>
                </li>
              )}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
