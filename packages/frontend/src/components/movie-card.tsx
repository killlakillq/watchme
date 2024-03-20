import React, { FC } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const MovieCard: FC = () => (
  <div className="flex flex-row ml-12">
    <Input
      className="bg-zinc-800 border-zinc-700 focus:outline-none pl-10 text-white"
      type="text"
      placeholder="Search"
    />
    <Button variant="secondary">Search</Button>
  </div>
);

export default MovieCard;
