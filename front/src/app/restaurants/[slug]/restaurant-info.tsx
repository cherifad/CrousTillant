import { Restaurant } from "@/services/types";
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
        {restaurant?.region.libelle && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <p>{restaurant?.region.libelle}</p>
        {restaurant?.horaires && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <p>{restaurant?.horaires?.join(", ")}</p>
        {restaurant?.adresse && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <a
          href={`https://www.google.com/maps/dir//${restaurant?.adresse}`}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          {restaurant?.adresse}
        </a>
        {restaurant?.telephone && (
          <span className="font-bold">&nbsp;&#8226;&nbsp;</span>
        )}
        <a href={`tel:${restaurant?.telephone}`} className="hover:underline">
          {restaurant?.telephone}
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
              {restaurant?.adresse && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {restaurant?.adresse}
                </li>
              )}
              {restaurant?.horaires && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {restaurant?.horaires?.join(", ")}
                </li>
              )}
              {restaurant?.adresse && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <a
                    href={`https://www.google.com/maps/dir//${restaurant?.adresse}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {restaurant?.adresse}
                  </a>
                </li>
              )}
              {restaurant?.telephone && (
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  <a
                    href={`tel:${restaurant?.telephone}`}
                    className="hover:underline"
                  >
                    {restaurant?.telephone}
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
