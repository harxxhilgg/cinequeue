import { create } from "zustand";

type MediaStore = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export const useMediaStore = create<MediaStore>((set) => ({
  searchQuery: "",

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
}));
