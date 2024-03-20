'use client';

import React, { Dispatch, FC, SetStateAction } from 'react';
import Link from 'next/link';
import { History, HomeIcon, Plus, Search, XCircle } from 'lucide-react';
import ProfileBlock from '@/components/profile-block';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => (
  <div
    className={`flex min-h-screen w-72 flex-col p-5 bg-black ${
      isOpen ? 'left-0' : '-left-72'
    } absolute sm:relative h-full transition-all duration-500 ease-in-out z-10`}
  >
    <XCircle
      className="w-5 h-5 text-gray-300 cursor-pointer absolute top-2 right-1"
      onClick={() => setIsOpen(!isOpen)}
    />
    <div className="flex justify-center">
      <p className="text-red-500 text-2xl font-bold">Watchlist</p>
    </div>
    <div className="flex items-center pt-5">
      <Search className="mw-50 text-zinc-700 absolute ml-2" />
      <Input
        className="w-60 bg-black border-zinc-700 focus:outline-none pl-10 text-white"
        type="text"
        placeholder="Search"
      />
    </div>
    <div className="pt-5 space-y-5">
      <Button className="w-60 text-white flex justify-start" asChild>
        <Link href="/">
          <HomeIcon className="mr-2" /> Home
        </Link>
      </Button>
      <Button className="w-60 text-white flex justify-start" asChild>
        <Link href="/history">
          <History className="mr-2" /> History
        </Link>
      </Button>
      <Button className="w-60" variant="secondary">
        <Plus className="w-5 h-5" /> Create watchlist
      </Button>
    </div>
    <hr className="w-64 mt-5 mb-1" />
    <p className="text-gray-300">My Lists</p>
    <ProfileBlock className="absolute bottom-5" />
  </div>
);

export default Sidebar;
