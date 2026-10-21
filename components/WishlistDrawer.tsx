import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Heart } from 'lucide-react';

const WishlistDrawer = () => {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <div className="relative">
          <Heart size={28} className="cursor-pointer rounded-full p-1 hover:bg-gray-100" />
          <div className="absolute top-0 right-0 w-3 h-3 flex items-center justify-center rounded-full bg-rose-500">
            <p className="text-white text-xs">0</p>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Wishlist</DrawerTitle>
        </DrawerHeader>
        <div className="p-4"></div>
        <DrawerFooter>
          <DrawerClose>Cancel</DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default WishlistDrawer;
