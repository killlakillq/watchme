import React, { FC } from 'react';
import Image from 'next/image';

interface MovieCardProps {
  title: string;
  date: string;
  poster: string;
}

const MovieCard: FC<MovieCardProps> = ({ title, date, poster }) => (
  <div className="w-40 rounded bg-zinc-700 text-white text-center font-bold mt-5 m-3 shadow-sm">
    <Image src={poster} alt="logo" width={175} height={345} />
    <p>{title}</p>
    <span className="text-xs">{date}</span>
  </div>
);

export default MovieCard;
