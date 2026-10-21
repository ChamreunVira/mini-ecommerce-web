import React from 'react';
import { AppContainer } from './Container';
import { Button } from './ui/button';

export const NewsLetterSection = () => {
  return (
    <AppContainer>
      <div className="my-24 max-w-2xl mx-auto">
        <div className="px-12 py-8 flex flex-col space-y-4 border rounded-md text-center">
          <h1 className="text-2xl font-medium">Subscribe to Quality Release Notes</h1>
          <p className="text-slate-600">Join 12,000+ subscriber architects, creators, and designers. Zero spam.</p>
          <div className="flex items-center space-x-4">
            <input type="text" placeholder="virachamreun@gmail.com" className="flex-1" />
            <Button className="px-4">Subscribe</Button>
          </div>
        </div>
      </div>
    </AppContainer>
  );
};
