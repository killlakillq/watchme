'use client';

import React, { useState } from 'react';
import { PanelRightOpen } from 'lucide-react';
import Sidebar from '@/components/sidebar';
import Movies from '@/pages/movies/page';

export default function Home() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <main className={isOpen ? 'ml-72' : ''}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      {!isOpen && (
        <PanelRightOpen
          className="cursor-pointer fixed -left-1 top-0 text-gray-300"
          onClick={() => setIsOpen(!isOpen)}
        />
      )}
      <Movies isOpen={isOpen} />
    </main>
  );
}
