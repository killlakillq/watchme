import React, { FC } from 'react';

const HomeTitle: FC = () => (
  <div className="text-white border-red-500 min-w-96 border border-solid rounded shadow-lg min-h-48 space-y-5 p-10 m-12">
    <h1 className="text-3xl">
      Welcome to <span className="text-red-500 text-3xl">Watchlist</span>
    </h1>
    <h2>
      Browse movies, add them to watchlists and share them with friends.
      <br />
      Just click the to add a movie, the poster to see more details or to mark the movie as watched.
    </h2>
  </div>
);

export default HomeTitle;
