'use client';
import { authService } from '@/services/auth-service';
import { cartService } from '@/services/cart-service';
import { wishlistService } from '@/services/wishlist-service';
import { Cart, UserResponse, WishlistItem } from '@/types';
import { clearToken, getToken } from '@/utils/tokenManager';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppCtxValue {
  user: UserResponse | null;
  isAuthLoading: boolean;
  updateUser: (user: UserResponse) => void;
  cart: Cart | null;
  wishlist: WishlistItem[];
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  removeCartItem: (cartItemId: number) => Promise<void>;
  adjustCartItem: (cartItemId: number, quantity: number) => Promise<void>;
  toggleWishlist: (productId: number) => Promise<void>;
  logout: () => Promise<void>;
}

export const Provider = createContext<AppCtxValue | null>(null);

export const useAppContext = (): AppCtxValue => {
  const context = useContext(Provider);

  if (context === null) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }

  return context;
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(() => getToken() !== null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getToken() !== null);
  const router = useRouter();

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      clearToken();
      setUser(null);
      setCart(null);
      setWishlist([]);
      setIsAuthenticated(false);
      router.replace('/login');
    }
  };

  const updateUser = (updatedUser: UserResponse) => {
    setUser(updatedUser);
  };

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const response = await cartService.add({ product_id: productId, quantity: quantity });
      if (response.success) {
        setCart(response.data);
        return true;
      }
    } catch {}

    return false;
  };

  const removeCartItem = async (itemId: number) => {
    setCart((prev) => {
      if (prev === null) {
        return null;
      }

      return { ...prev, items: prev.items.filter((item) => item.id !== itemId) };
    });

    try {
      const response = await cartService.remove(itemId);
      if (response.success)
        setCart((current) =>
          current ? { ...current, items: current.items.filter((item) => item.id !== itemId) } : current,
        );
    } catch {
      await fetchCart();
    }
  };

  const adjustCartItem = async (itemId: number, delta: number) => {
    const item = cart?.items.find((cartItem) => cartItem.id === itemId);
    if (!item) return;

    const nextQuantity = item.quantity + delta;
    if (nextQuantity < 1) return;

    setCart((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.map((cartItem) =>
              cartItem.id === itemId ? { ...cartItem, quantity: nextQuantity } : cartItem,
            ),
          }
        : prev,
    );

    try {
      await cartService.adjust(itemId, { quantity: nextQuantity });
    } catch {
      await fetchCart();
    }
  };

  const fetchCart = async () => {
    try {
      const response = await cartService.get();
      if (response.success) {
        setCart(response.data);
      }
    } catch {
      console.log('[Error]: failed to fetch user cart.');
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await wishlistService.getAll();
      if (response.success) setWishlist(response.data);
    } catch {
      setWishlist([]);
    }
  };

  const toggleWishlist = async (productId: number) => {
    const existing = wishlist.find((item) => item.product_id === productId);

    try {
      if (existing) {
        const response = await wishlistService.remove(existing.id);
        if (response.success) setWishlist((current) => current.filter((item) => item.id !== existing.id));
      } else {
        const response = await wishlistService.add(productId);
        if (response.success) setWishlist((current) => [response.data, ...current]);
      }
    } catch {}
  };

  useEffect(() => {
    console.log('[INFO]: check authentication.');

    const currentUser = async () => {
      try {
        const response = await authService.me();
        if (response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };

    if (isAuthenticated) {
      void currentUser();
      void fetchCart();
      void Promise.resolve().then(fetchWishlist);
    }
  }, [isAuthenticated]);

  const ctxValue: AppCtxValue = {
    user,
    isAuthLoading,
    updateUser,
    cart,
    wishlist,
    addToCart,
    removeCartItem,
    adjustCartItem,
    toggleWishlist,
    logout,
  };

  return <Provider value={ctxValue}>{children}</Provider>;
};
