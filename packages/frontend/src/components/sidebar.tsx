'use client';

import React, { Dispatch, FC, SetStateAction } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { History, HomeIcon, Plus, XCircle } from 'lucide-react';
import ProfileBlock from '@/components/profile-block';
import { Button } from '@/components/ui/button';
import { InputIcon } from './input-icon';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  return (
    <div
      className={`flex min-h-screen w-72 flex-col p-5 bg-black ${
        isOpen ? 'left-0' : '-left-72'
      } fixed h-full transition-all duration-500 ease-in-out z-10`}
    >
      <XCircle
        className="w-5 h-5 text-gray-300 cursor-pointer absolute top-2 right-1"
        onClick={() => setIsOpen(!isOpen)}
      />
      <div className="flex justify-center">
        <p className="text-red-500 text-2xl font-bold">Watchlist</p>
      </div>
      <div className="flex items-center pt-5">
        <InputIcon
          type="text"
          placeholder="Search"
          inputStyles="w-60 bg-black border-zinc-700 focus:outline-none pl-10 text-white"
        />
      </div>
      <div className="pt-5 space-y-5">
        <Button
          className={`w-60 text-white flex justify-start ${pathname === '/' ? 'bg-red-500' : ''}`}
          asChild
        >
          <Link href="/">
            <HomeIcon className="mr-2" /> Home
          </Link>
        </Button>
        <Button
          className={`w-60 text-white flex justify-start ${
            pathname === '/history' ? 'bg-red-500' : ''
          }`}
          asChild
        >
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
};

export default Sidebar;
