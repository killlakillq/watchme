'use client';

import React, { useState } from 'react';
import { PanelRightOpen } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import HomeTitle from '@/components/home-title';
import MovieCard from '@/components/movie-card';

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="space-y-5">
        <HomeTitle />
        <MovieCard />
        {!isOpen && (
          <PanelRightOpen
            className="cursor-pointer absolute -left-1 -top-2 text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}
      </div>
    </main>
  );
}
