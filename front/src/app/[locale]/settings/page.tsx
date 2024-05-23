"use client";

import SettingCard from "@/components/setting-card";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  clearUserPreferences,
  Favorite,
  getFavorites,
  getStarredFav,
  setStarredFav,
  deleteFavAsHomePage,
  getFavAsHomePage,
  setFavAsHomePage,
  getSelectedCrous,
  Crous,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import { usePathname, redirect } from "next/navigation";
import { Link } from "@/navigation";

export default function Settings() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [localStarredFav, setLocalStarredFav] = useState<Favorite | null>(null);
  const [localFavAsHomePage, setLocalFavAsHomePage] = useState<boolean>(false);
  const [selectedCrous, setSelectedCrous] = useState<Crous | null>(null);

  const { toast } = useToast();
  const { setTheme, theme, systemTheme } = useTheme();
  const pathname = usePathname();

  const handleClearFavorites = () => {
    clearUserPreferences();
    setPopoverOpen(false);
    setFavorites([]);
    setLocalStarredFav(null);
    setLocalFavAsHomePage(false);
    toast({
      title: "Données supprimées",
      description: "Vos favoris ont été supprimés avec succès.",
    });
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast({
      title: "Thème modifié",
      description: `Le thème a été changé en ${
        checked ? "sombre" : "clair"
      } avec succès.`,
    });
  };

  const handleStarredFavChange = (value: string) => {
    const favorite = favorites.find((f) => f.id === value);
    if (favorite && localStarredFav?.id === favorite.id) {
      return;
    }
    if (favorite) {
      setStarredFav(favorite);
      setLocalStarredFav(favorite);
      toast({
        title: "Favori modifié",
        description: `Le favori a été changé avec succès.`,
      });
    }
  };

  const handleFavAsHomePageChange = (checked: boolean) => {
    if (checked) {
      setFavAsHomePage(true);
      toast({
        title: "Favori comme page d'accueil",
        description: `Le favori a été défini comme page d'accueil avec succès.`,
      });
    } else {
      deleteFavAsHomePage();
      toast({
        title: "Favori comme page d'accueil",
        description: `Le favori n'est plus défini comme page d'accueil.`,
      });
    }
    setLocalFavAsHomePage(checked);
  };

  useEffect(() => {
    const crous = getSelectedCrous();
    setSelectedCrous(crous);

    if (!crous) {
      redirect("/crous?clbk=" + pathname);
    }

    try {
      setFavorites(getFavorites(crous.id));
      setLocalStarredFav(getStarredFav(crous.id));
      setLocalFavAsHomePage(getFavAsHomePage());
    } catch {
      clearUserPreferences();
    }
  }, []);

  return (
    <div>
      <h1 className="font-bold text-3xl">Paramètres</h1>
      <SettingCard title="Apparence">
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Thème sombre</p>
            <p className="text-[0.8rem] text-muted-foreground">
              Activez le thème sombre pour une meilleure expérience de nuit.
            </p>
          </div>
          <Switch
            checked={
              theme === "system" ? systemTheme === "dark" : theme === "dark"
            }
            onCheckedChange={handleThemeChange}
          />
        </div>
      </SettingCard>
      <SettingCard title="Comportement">
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Favori comme page d'accueil</p>
            <p className="text-[0.8rem] text-muted-foreground">
              La page d'accueil affichera le premier restaurant en favori ou le
              restaurant choisi si défini.
            </p>
          </div>
          <Switch
            disabled={favorites.length === 0}
            checked={localFavAsHomePage}
            onCheckedChange={handleFavAsHomePageChange}
          />
        </div>
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">
              Choisir le favoris comme page d'accueil
            </p>
            <p className="text-[0.8rem] text-muted-foreground">
              La page d'accueil affichera le premier restaurant en favori.
            </p>
          </div>
          <Select
            onValueChange={handleStarredFavChange}
            disabled={favorites.length === 0}
          >
            <SelectTrigger className="min-w-[180px] w-fit">
              <SelectValue
                placeholder={localStarredFav?.name || "Sélectionner"}
              />
            </SelectTrigger>
            <SelectContent>
              {favorites.map((favorite) => (
                <SelectItem key={favorite.id} value={favorite.id}>
                  {favorite.name.trim()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Changer de Crous</p>
            <p className="text-[0.8rem] text-muted-foreground">
              Changer de Crous pour afficher les restaurants.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-end gap-2">
              <Button asChild>
                <Link href="/crous">Changer</Link>
              </Button>
            </div>
          </div>
        </div>
      </SettingCard>
      <SettingCard title="Personnel">
        <div className="space-y-2 flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="font-medium text-base">Supprimer les données</p>
            <p className="text-[0.8rem] text-muted-foreground">
              Vous perdrez tous vos favoris et vos paramètres.
            </p>
          </div>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <Button variant="destructive">Supprimer</Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <p>
                  Êtes-vous sûr de vouloir supprimer toutes vos données
                  personnelles ?
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPopoverOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleClearFavorites}>
                    Supprimer
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SettingCard>
    </div>
  );
}
