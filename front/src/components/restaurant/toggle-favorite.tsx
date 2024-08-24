/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Restaurant } from "@prisma/client";
import { Heart, HeartOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  removeFromFavorites,
  addToFavorites,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ToggleFavoriteProps {
  isFavorite: boolean;
  restaurantId: number;
  restaurant: Restaurant | undefined;
  setIsFavorite: (isFavorite: boolean) => void;
}

export default function ToggleFavorite({
  isFavorite,
  restaurantId,
  restaurant,
  setIsFavorite,
}: ToggleFavoriteProps) {
  const { toast } = useToast();

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(restaurantId.toString(), restaurant?.crousId!);
      setIsFavorite(false);
      toast({
        description: "Lieu retiré des favoris 💔",
      });
    } else {
      addToFavorites({
        name: restaurant?.name!,
        id: restaurantId.toString(),
        crousId: restaurant?.crousId!,
      });
      setIsFavorite(true);
      toast({
        description: "Lieu ajouté aux favoris ❤️",
      });
    }
  };

  return (
    <Badge className="sm:ml-2 group cursor-pointer" onClick={toggleFavorite}>
      <Heart
        className={`h-3 w-3 mr-2 ${
          isFavorite ? "group-hover:hidden block" : "hidden group-hover:block"
        }`}
      />
      <HeartOff
        className={`h-3 w-3 mr-2 ${
          isFavorite ? "hidden group-hover:block" : "group-hover:hidden block"
        }`}
      />
      <span className="group-hover:hidden">
        {isFavorite ? "Favoris" : "Non favoris"}
      </span>
      <span className="hidden group-hover:block">
        {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      </span>
    </Badge>
  );
}
