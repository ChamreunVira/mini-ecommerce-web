'use client';
import { authService } from '@/services/auth-service';
import { cartService } from '@/services/cart-service';
import { Cart, UserResponse } from '@/types';
import { getToken } from '@/utils/tokenManager';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppCtxValue {
  user: UserResponse | null;
  cart: Cart | null;
  addToCart: (productId: number, quantity?: number) => void;
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
  const [cart, setCart] = useState<Cart | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getToken() !== null);
  const router = useRouter();

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      const response = await cartService.add({ product_id: productId, quantity: quantity });
      if (response.success) {
        fetchCart();
      }
    } catch (error: any) {}
  };

  const fetchCart = async () => {
    try {
      const response = await cartService.get();
      if (response.success) {
        setCart(response.data);
      }
    } catch (error: any) {
      console.log('[Error]: failed to fetch user cart.');
    }
  };

  useEffect(() => {
    console.log('[INFO]: check authentication.');

    const currentUser = async () => {
      try {
        const response = await authService.me();
        console.log(response.data);
        if (response.success) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error: unknown) {}
    };

    if (isAuthenticated) {
      void currentUser();
      void fetchCart();
      router.push('/');
    }
  }, [isAuthenticated]);

  const ctxValue: AppCtxValue = {
    user,
    cart,
    addToCart,
  };

  return <Provider value={ctxValue}>{children}</Provider>;
};
