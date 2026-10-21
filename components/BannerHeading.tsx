import { X } from 'lucide-react';
import React from 'react';

export const BannerHeading = () => {
  return (
    <div className="w-full flex items-center bg-gray-900 py-1 px-8">
      <p className="flex-1 text-xs text-center text-white">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, autem.
      </p>
      <button className="cursor-pointer">
        <X className="text-white" size={14} />
      </button>
    </div>
  );
};
