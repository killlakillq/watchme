import { REDIS, TMDB } from '../../common/constants';
import { MovieDatabaseIntegration } from '../../integrations/movie.integration';
import { MovieDto, ShowMovieQueriesDto, SearchMovieQueriesDto } from './entities/dtos/movie.dto';
import MovieRepository from '../../infrastructure/database/repositories/movie.repository';
import RedisRepository from '../../infrastructure/database/repositories/redis.repository';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ServerResponse } from '../../common/types';

@Injectable()
export class MovieService {
  public constructor(
    private readonly movieRepository: MovieRepository,
    private readonly redisRepository: RedisRepository,
    private readonly movieDatabaseIntegration: MovieDatabaseIntegration
  ) {}

  public async showMovies(queries: ShowMovieQueriesDto): Promise<ServerResponse> {
    const movies = await this.movieDatabaseIntegration.getMovies(queries);
    if (movies.status == HttpStatus.NOT_FOUND) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'List of movies not found',
        data: movies.data
      };
    }

    return {
      status: movies.status,
      message: 'List of movies were successfully fetched',
      data: movies.data
    };
  }

  public async addMovieToWatchList(body: MovieDto): Promise<ServerResponse> {
    const movie = await this.movieRepository.add(body);

    if (!movie) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Movie not found',
        data: null
      };
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Movie was successfully added to watchlist',
      data: movie
    };
  }

  public async showWatchList(): Promise<ServerResponse> {
    const cache = await this.redisRepository.get(TMDB.TYPE.MOVIE);
    if (cache) {
      return {
        status: HttpStatus.OK,
        message: 'Watchlist successfully fetched',
        data: JSON.parse(cache)
      };
    }

    const watchList = await this.movieRepository.find();
    await this.redisRepository.set('watchlist', JSON.stringify(watchList), REDIS.EXPIRE);
    if (!watchList) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Movies in watch list not found',
        data: null
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Watchlist successfully fetched',
      data: watchList
    };
  }

  public async deleteMovieFromWatchList(id: string): Promise<ServerResponse> {
    const deletedMovie = await this.movieRepository.delete(id);

    if (!deletedMovie) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Movies in watch list not found',
        data: null
      };
    }

    return {
      status: HttpStatus.OK,
      message: 'Movie was successfully deleted from watchlist',
      data: deletedMovie.id
    };
  }

  public async searchMovies(queries: SearchMovieQueriesDto): Promise<ServerResponse> {
    const movies = await this.movieDatabaseIntegration.searchMovies(queries);

    if (movies.status === HttpStatus.NOT_FOUND) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Movie not found',
        data: movies.data
      };
    }

    return {
      status: movies.status,
      message: 'List of movies were successfully fetched',
      data: movies.data
    };
  }
}
