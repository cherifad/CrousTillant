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
import { slugify } from "@/lib/utils";
import { useUserPreferences } from "@/store/userPreferencesStore";

type Props = {
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
  crousId: number;
};

export default function RestaurantCard({
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
  crousId,
}: Props) {
  const { isFavorite, addOrRemoveFromFavorites } = useUserPreferences();

  return (
    <Card className="relative">
      <Button
        size="icon"
        className="absolute top-2 right-2"
        onClick={() => addOrRemoveFromFavorites({ id: id.toString(), name: name, crousId: crousId })}
      >
        {isFavorite(id.toString()) ? (
          <HeartOff className="h-4 w-4" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
      </Button>
      <CardHeader>
        <CardTitle className="pr-6">
          <Link href={`/restaurant/${slugify(name)}-${id}`}>{name}</Link>
        </CardTitle>
        <CardDescription>
          {place.length > 0 ? place : <span>&nbsp;</span>}
        </CardDescription>
      </CardHeader>
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
