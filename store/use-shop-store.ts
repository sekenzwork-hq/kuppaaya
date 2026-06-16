import { create } from "zustand";

type ShopState = {
  wishlist: string[];
  toggleWishlist: (id: string) => void;
};

export const useShopStore = create<ShopState>((set) => ({
  wishlist: [],
  toggleWishlist: (id) =>
    set((state) => ({
      wishlist: state.wishlist.includes(id)
        ? state.wishlist.filter((item) => item !== id)
        : [...state.wishlist, id]
    }))
}));
