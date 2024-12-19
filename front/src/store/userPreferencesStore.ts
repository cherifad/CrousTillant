import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ScrapingLog } from '@prisma/client';

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
  ScrapingLog: ScrapingLog[] | null;
};

type DisplayType = 'list' | 'map';

interface StoreState {
  favorites: Favorite[];
  starredFav: Favorite[];
  announcement: AnnouncementLocalStorage;
  display: DisplayType;
  selectedCrous: Crous | null;
  favAsHomePage: boolean;

  // Actions
  addOrRemoveFromFavorites: (favorite: Favorite) => void;
  getFavorites: () => Favorite[];
  isFavorite: (id: string) => boolean;
  clearUserPreferences: () => void;
  toggleDisplayGrid: () => void;
  hideAnnouncement: () => void;
  showAnnouncement: () => void;
  setSelectedCrous: (crous: Crous) => void;
  setStarredFav: (id: string) => void;
  getStarredFav: () => Favorite | undefined;
  setFavAsHomePage: (value: boolean) => void;
}

export const useUserPreferences = create<StoreState>()(
  persist(
    (set, get) => ({
      favorites: [],
      starredFav: [],
      announcement: { show: true },
      display: 'list',
      selectedCrous: null,
      favAsHomePage: false,

      setFavAsHomePage: (value) => {
        set({ favAsHomePage: value });
      },

      addOrRemoveFromFavorites: (favorite: Favorite) => {
        const { favorites } = get();
        if (favorites.some((f) => f.id === favorite.id)) {
          set((state) => ({
            favorites: state.favorites.filter((f) => f.id !== favorite.id),
          }));

          // second pass to remove from starredFav if present
          if (get().favorites.filter((f) => f.crousId === favorite.crousId).length === 0) {
            // remove from starredFav
            set({ starredFav: get().starredFav.filter((f) => f.crousId !== favorite.crousId) });
          }
        } else {
          // Add to favorites
          set({ favorites: [...favorites, favorite] });

          // second pass to set starredFav if it's the first favorite added in this crous
          if (get().favorites.filter((f) => f.crousId === favorite.crousId).length === 1) {
            // add to starredFav
            set({ starredFav: [...get().starredFav, favorite] });
          }
        }
      },

      getFavorites: () => {
        if (!get().selectedCrous) return [];
        return get().favorites.filter((f) => f.crousId === get().selectedCrous?.id);
      },

      isFavorite: (id) => get().favorites.some((favorite) => favorite.id === id),

      clearUserPreferences: () => {
        set({
          favorites: [],
          starredFav: [],
          announcement: { show: true },
          display: 'list',
          selectedCrous: null,
        });
      },

      toggleDisplayGrid: () => {
        set((state) => ({
          display: state.display === 'list' ? 'map' : 'list',
        }));
      },

      hideAnnouncement: () => {
        set({ announcement: { show: false, date: new Date() } });
      },

      showAnnouncement: () => {
        set({ announcement: { show: true } });
      },

      setSelectedCrous: (crous) => {
        set({ selectedCrous: crous });
      },

      setStarredFav: (id) => {
        const favorite = get().favorites.find((f) => f.id === id);
        if (!favorite) return;
        
        // only one favorite by crous can be starred
        // check if there is already a starred favorite for this crous
        const starredFav = get().starredFav.find((f) => f.crousId === favorite.crousId);
        if (starredFav) {
          // remove the previous starred favorite
          set({ starredFav: get().starredFav.filter((f) => f.crousId !== favorite.crousId) });
        }
        // add the new starred favorite
        set({ starredFav: [...get().starredFav, favorite] });
      },

      getStarredFav: () => {
        if (!get().selectedCrous) return undefined;
        return get().starredFav.find((f) => f.crousId === get().selectedCrous?.id);
      }
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage(() => localStorage), // Automatically uses localStorage
    }
  )
);
