import { type ClassValue, clsx } from "clsx";
import { get } from "http";
import { twMerge } from "tailwind-merge";

export type Favorite = {
  id: string;
  name: string;
  crousId: number;
};

export type AnnouncementLocalStorage = {
  show: boolean;
  date?: Date;
};

export type Crous = {
  id: number;
  name: string;
  url: string;
  created_at: string;
  updated_at: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const slugify = (...args: string[]): string => {
  const value = args.join(" ");

  return value
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-"); // separator
};

export const getDates = (startDate: Date, stopDate: Date): Date[] => {
  const dateArray = [];
  let currentDate = startDate;

  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate));
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  // remove sunday and saturday
  return dateArray.filter((date) => date.getDay() !== 0 && date.getDay() !== 6);
};

export function addToFavorites(favorite: Favorite) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  if (favorites.some((f: { id: string }) => f.id === favorite.id)) {
    return;
  }

  favorites.push({
    id: favorite.id,
    name: favorite.name,
    crousId: favorite.crousId,
  });

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

export function removeFromFavorites(id: string, crousId: number) {
  var favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  const starredFav = getStarredFav(crousId);

  localStorage.setItem(
    "favorites",
    JSON.stringify(
      favorites.filter((favorite: { id: string }) => favorite.id !== id)
    )
  );

  if (starredFav && starredFav.id === id && favorites.length > 1) {
    favorites = favorites.filter(
      (favorite: { id: string }) => favorite.id !== id
    );
    setStarredFav(favorites[0]);
  } else if (starredFav && starredFav.id === id && favorites.length === 1) {
    localStorage.removeItem("starredFav");
  }
}

export function isFavorite(id: string) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  return favorites.some((favorite: { id: string }) => favorite.id === id);
}

export const getFavorites = (crousId: Number): Favorite[] => {
  const fav = JSON.parse(localStorage.getItem("favorites") || "[]");
  console.log(fav);

  return fav.filter((f: Favorite) => f.crousId === crousId);
};

export const clearUserPreferences = () => {
  localStorage.removeItem("favorites");
  localStorage.removeItem("starredFav");
  localStorage.removeItem("favAsHomePage");
  localStorage.removeItem("display");
  localStorage.removeItem("announcement");
  localStorage.removeItem("selectedCrous");
};

export const setStarredFav = (favorite: Favorite) => {
  var starredFavs = JSON.parse(localStorage.getItem("starredFav") || "[]");

  if (starredFavs.some((f: Favorite) => f.crousId === favorite.crousId)) {
    starredFavs = starredFavs.map((f: Favorite) =>
      f.crousId === favorite.crousId ? favorite : f
    );
  } else {
    starredFavs.push(favorite);
  }

  localStorage.setItem("starredFav", JSON.stringify(starredFavs));
};

export const getStarredFav = (crousId: Number): Favorite | null => {
  const fav = JSON.parse(localStorage.getItem("starredFav") || "[]");

  if (!fav) {
    // return the first favorite
    const favorites = getFavorites(crousId);
    return favorites.length > 0 ? favorites[0] : null;
  }

  return fav.filter((f: Favorite) => f.crousId === crousId)[0];
};

export const setFavAsHomePage = (activated: boolean) => {
  localStorage.setItem("favAsHomePage", JSON.stringify(activated));
};

export const getFavAsHomePage = (): boolean => {
  return JSON.parse(localStorage.getItem("favAsHomePage") || "false");
};

export const deleteFavAsHomePage = () => {
  localStorage.removeItem("favAsHomePage");
};

export const toggleDisplayGrid = (
  display: "list" | "grid",
  setDisplay: (value: "list" | "grid") => void
) => {
  setDisplay(display === "list" ? "grid" : "list");
  localStorage.setItem("display", display === "list" ? "grid" : "list");
};

export const shouldShowAnnouncement = (): AnnouncementLocalStorage => {
  const announcement: AnnouncementLocalStorage = JSON.parse(
    localStorage.getItem("announcement") || '{"show": true}'
  );

  return announcement;
};

export const hideAnnouncement = () => {
  localStorage.setItem(
    "announcement",
    JSON.stringify({ show: false, date: new Date() })
  );
};

export const showAnnouncement = () => {
  localStorage.setItem("announcement", JSON.stringify({ show: true }));
};

export const getGithubStarCount = async () => {
  const response = await fetch("https://api.github.com/repos/cherifad/SmartRU");
  const data = await response.json();

  return data.stargazers_count;
};

export const getSelectedCrous = (): Crous | null => {
  return JSON.parse(localStorage.getItem("selectedCrous") || "null");
};

export const setSelectedCrous = (crous: Crous) => {
  localStorage.setItem("selectedCrous", JSON.stringify(crous));
};
