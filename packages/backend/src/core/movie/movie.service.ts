import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { EXCEPTIONS, QUEUES, REDIS, TMDB } from '../../common/constants';
import { MovieDatabaseIntegration } from '../../integrations/movie.integration';
import { ShowMovieQueriesDto, SearchMovieQueriesDto } from './entities/dtos/movie.dto';
import MovieRepository from '../../infrastructure/database/repositories/movie.repository';
import RedisRepository from '../../infrastructure/database/repositories/redis.repository';
import { ServerResponse } from '../../common/types';
import WatchlistRepository from '../../infrastructure/database/repositories/watchlist.repository';

@Injectable()
export class MovieService {
  public constructor(
    private readonly movieRepository: MovieRepository,
    private readonly watchlistRepository: WatchlistRepository,
    private readonly redisRepository: RedisRepository,
    private readonly movieDatabaseIntegration: MovieDatabaseIntegration,
    @InjectQueue(QUEUES.MOVIE) private readonly recommendationQueue: Queue
  ) {}

  public async showMovies(queries: ShowMovieQueriesDto): Promise<ServerResponse> {
    const movies = await this.movieDatabaseIntegration.getMovies(queries);

    if (movies.status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException(EXCEPTIONS.MOVIES_NOT_FOUND);
    }

    if (movies.status === HttpStatus.UNAUTHORIZED) {
      throw new ForbiddenException(EXCEPTIONS.UNAUTHORIZED);
    }

    return {
      status: movies.status,
      message: 'List of movies were successfully fetched',
      data: movies.data
    };
  }

  public async addMovieToWatchlist(userId: string, movieId: string): Promise<ServerResponse> {
    const movie = await this.movieDatabaseIntegration.getMovieDetails(movieId);
    const foundMovie = await this.movieRepository.findById(movieId);

    if (foundMovie) {
      const watchlist = await this.watchlistRepository.create(userId, movieId);

      return {
        status: HttpStatus.CREATED,
        message: 'Movie was successfully added to watchlist',
        data: watchlist
      };
    }

    await this.movieRepository.create(movie.data);

    const watchlist = await this.watchlistRepository.create(userId, movieId);

    return {
      status: HttpStatus.CREATED,
      message: 'Movie was successfully added to watchlist',
      data: watchlist
    };
  }

  public async showWatchlist(userId: string): Promise<ServerResponse> {
    const cache = await this.redisRepository.get(TMDB.TYPE.MOVIE);

    if (cache) {
      return {
        status: HttpStatus.OK,
        message: 'Watchlist was successfully fetched',
        data: JSON.parse(cache)
      };
    }

    const watchlist = await this.watchlistRepository.findById(userId);

    if (!watchlist) {
      throw new NotFoundException(EXCEPTIONS.MOVIES_NOT_FOUND);
    }

    await this.redisRepository.set(REDIS.WATCHLIST, JSON.stringify(watchlist), REDIS.EXPIRE);

    return {
      status: HttpStatus.OK,
      message: 'Watchlist was successfully fetched',
      data: watchlist
    };
  }

  public async deleteMovieFromWatchlist(id: string): Promise<ServerResponse> {
    const deletedMovie = await this.movieRepository.delete(id);

    if (!deletedMovie) {
      throw new NotFoundException(EXCEPTIONS.MOVIES_NOT_FOUND);
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
      throw new NotFoundException(EXCEPTIONS.MOVIES_NOT_FOUND);
    }

    if (movies.status === HttpStatus.UNAUTHORIZED) {
      throw new ForbiddenException(EXCEPTIONS.UNAUTHORIZED);
    }

    return {
      status: movies.status,
      message: 'List of movies were successfully fetched',
      data: movies.data
    };
  }

  public async generateRecommendations(userId: string, movieId: string) {
    await this.watchlistRepository.findById(userId);
    await this.recommendationQueue.add('recommendation-task', { movieId });
  }
}
