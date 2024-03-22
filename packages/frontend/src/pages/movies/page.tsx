import React, { FC, useEffect, useState } from 'react';
import HomeTitle from '@/components/home-title';
import MovieCard from '@/components/movie-card';
import { MOVIE_DATA } from '../../../movies';

interface Movie {
  id: number;
  title: string;
  date: string;
  poster: string;
}

interface MoviesProps {
  isOpen: boolean;
}

const Movies: FC<MoviesProps> = ({ isOpen }) => {
  const [movieData, setMovieData] = useState<Movie[]>([]);
  const [searchField, setSearchField] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(event.target.value);
  };

  const filteredMovies = movieData.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchField.toLowerCase()) ||
      movie.date.toLowerCase().includes(searchField.toLowerCase())
  );

  useEffect(() => {
    // MoviesAPI.getMovies().then((data) => setMovieData(data));
    setMovieData(MOVIE_DATA);
  }, []);

  return (
    <div className="pt-20 grid place-items-center">
      <div className="w-3/4">
        <HomeTitle onChange={handleSearch} />
      </div>
      <div className={`flex flex-wrap w-3/4 ${!isOpen ? 'ml-10' : ''}`}>
        {filteredMovies.map((movie) => (
          <MovieCard key={movie.id} title={movie.title} date={movie.date} poster={movie.poster} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
