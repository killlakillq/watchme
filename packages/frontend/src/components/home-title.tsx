import React, { FC } from 'react';
import { InputIcon } from './input-icon';

interface HomeTitleProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const HomeTitle: FC<HomeTitleProps> = ({ onChange }) => (
  <div className="min-h-48 min-w-96">
    <div className="text-white border-red-500 border border-solid rounded shadow-lg space-y-5 p-10">
      <h1 className="text-3xl">
        Welcome to <span className="text-red-500 text-3xl">Watchlist</span>
      </h1>
      <h2>
        Browse movies, add them to watchlists and share them with friends.
        <br />
        Just click the to add a movie, the poster to see more details or to mark the movie as
        watched.
      </h2>
    </div>
    <div className="mt-5 flex flex-row">
      <InputIcon
        type="text"
        placeholder="Search for movie by title"
        inputStyles="bg-zinc-800 border-zinc-700 pl-10 text-white focus:outline-none"
        iconStyles="mt-2"
        onChange={onChange}
      />
    </div>
  </div>
);

export default HomeTitle;
