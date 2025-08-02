import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-gallery border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-accent flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <span>PosterValue</span>
              <Sparkles className="w-5 h-5 text-gallery-accent" />
            </h1>
            <p className="text-sm text-muted-foreground">AI-Powered Poster Identification & Valuation</p>
          </div>
        </div>
      </div>
    </header>
  );
};