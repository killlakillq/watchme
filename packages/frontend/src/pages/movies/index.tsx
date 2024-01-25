import React from 'react';
import { getMovies } from '../api/movies';

export default async function Movies() {
  const { results } = await getMovies();

  return <h1 className="flex space-x-4">{results.map((movie: any) => movie.backdrop_path)}</h1>;
}
