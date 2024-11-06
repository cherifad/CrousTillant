import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Restaurant } from "@prisma/client";

interface NoMealMessageProps {
  restaurant: Restaurant | undefined;
}

export default function NoMealMessage({ restaurant }: NoMealMessageProps) {
  return (
    <div className="flex flex-col justify-center gap-4 items-center h-full mt-8 text-center">
      <p>Aucun menu disponible pour ce restaurant 🥲</p>
      <p>
        Ceci est peut-être dû à une erreur de notre part ou que le restaurant
        n'a pas encore publié de menus.
      </p>
      <Button asChild>
        <a
          href={restaurant?.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2"
        >
          Voir sur le site officiel
          <Link className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
