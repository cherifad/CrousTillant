import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Heart, HeartOff } from "lucide-react";
import { useState } from "react";
import { slugify } from "@/lib/utils";
import { Favorite, addToFavorites, removeFromFavorites } from "@/lib/utils";

type Props = {
  display: "list" | "grid";
  id: number;
  name: string;
  place: string;
  schedule: string;
  url: string;
  cp: string;
  address: string;
  city: string;
  phone: string;
  img: string;
  favorites: Favorite[];
  onFavoriteChange: (
    restaurantId: number,
    name: string,
    isFavorite: boolean
  ) => void;
};

export default function RestaurantCard({
  display,
  id,
  name,
  place,
  schedule,
  url,
  cp,
  address,
  city,
  phone,
  img,
  favorites,
  onFavoriteChange,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(
    favorites.some((f) => f.id === id.toString())
  );

  const putToFavorites = () => {
    if (isFavorite) {
      removeFromFavorites(id.toString());
      setIsFavorite(false);
      onFavoriteChange(id, name, false);
    } else {
      addToFavorites({ id: id.toString(), name });
      setIsFavorite(true);
      onFavoriteChange(id, name, true);
    }
  };
  return (
    <Card className="relative">
      <Button
        size="icon"
        className="absolute top-2 right-2"
        onClick={putToFavorites}
      >
        {isFavorite ? (
          <HeartOff className="h-4 w-4" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
      </Button>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{place}</CardDescription>
      </CardHeader>
      {display === "grid" && (
        <CardContent>
          <Image src="/img/default.jpeg" alt={name} width={400} height={400} />
          <p className="mt-4">{schedule}</p>
          <p className="mt-2">
            {address} - {cp} {city}
          </p>
          <p className="mt-2">{phone}</p>
        </CardContent>
      )}
      <CardFooter className="flex justify-between gap-3">
        <Button asChild className="flex-1">
          <Link href={`/restaurant/${slugify(name)}-${id}`}>Voir le menu</Link>
        </Button>
        <Button asChild variant="secondary" className="flex-1">
          <a href={url} target="_blank" rel="noreferrer">
            Site web
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
