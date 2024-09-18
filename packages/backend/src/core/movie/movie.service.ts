import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ShowMovieQueriesDto, SearchMovieQueriesDto } from '@core/movie/entities/dtos/movie.dto';
import MovieRepository from '@infrastructure/database/repositories/movie.repository';
import RedisRepository from '@infrastructure/database/repositories/redis.repository';
import WatchlistRepository from '@infrastructure/database/repositories/watchlist.repository';
import { EXCEPTION, QUEUES, REDIS, TMDB } from '@common/constants';
import { ServerResponse } from '@common/types';
import { MovieDatabaseIntegration } from '@integrations/movie.integration';
import { Watchlist } from '@prisma/client';
import UserRepository from '@/infrastructure/database/repositories/user.repository';

@Injectable()
export class MovieService {
  public constructor(
    private readonly movieRepository: MovieRepository,
    private readonly watchlistRepository: WatchlistRepository,
    private readonly redisRepository: RedisRepository,
    private readonly movieDatabaseIntegration: MovieDatabaseIntegration,
    private readonly userRepository: UserRepository,
    @InjectQueue(QUEUES.MOVIE) private readonly recommendationQueue: Queue
  ) {}

  public async showMovies(queries: ShowMovieQueriesDto): Promise<ServerResponse<unknown>> {
    const movies = await this.movieDatabaseIntegration.getMovies(queries);

    if (movies.status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException(EXCEPTION.MOVIES_NOT_FOUND);
    }

    if (movies.status === HttpStatus.UNAUTHORIZED) {
      throw new ForbiddenException(EXCEPTION.UNAUTHORIZED);
    }

    return {
      status: movies.status,
      message: 'List of movies were successfully fetched',
      data: movies.data
    };
  }

  public async addMovieToWatchlist(
    userId: string,
    movieId: string
  ): Promise<ServerResponse<Watchlist>> {
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

  public async showWatchlist(userId: string) {
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
      throw new NotFoundException(EXCEPTION.MOVIES_NOT_FOUND);
    }

    await this.redisRepository.set(REDIS.WATCHLIST, JSON.stringify(watchlist), REDIS.EXPIRE);

    return watchlist;
  }

  public async deleteMovieFromWatchlist(id: string): Promise<ServerResponse<string>> {
    const deletedMovie = await this.movieRepository.delete(id);

    if (!deletedMovie) {
      throw new NotFoundException(EXCEPTION.MOVIES_NOT_FOUND);
    }

    return {
      status: HttpStatus.OK,
      message: 'Movie was successfully deleted from watchlist',
      data: deletedMovie.id
    };
  }

  public async searchMovies(queries: SearchMovieQueriesDto): Promise<ServerResponse<unknown>> {
    const movies = await this.movieDatabaseIntegration.searchMovies(queries);

    if (movies.status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException(EXCEPTION.MOVIES_NOT_FOUND);
    }

    if (movies.status === HttpStatus.UNAUTHORIZED) {
      throw new ForbiddenException(EXCEPTION.UNAUTHORIZED);
    }

    return {
      status: movies.status,
      message: 'List of movies were successfully fetched',
      data: movies.data
    };
  }

  public async generateRecommendations(userId: string, movieId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(EXCEPTION.USER_NOT_FOUND);
    }

    const watchlist = await this.watchlistRepository.findById(user.watchlistId);

    if (!watchlist) {
      throw new NotFoundException(EXCEPTION.WATCHLIST_NOT_FOUND);
    }

    const movie = await this.movieRepository.findById(movieId);

    if (!movie) {
      throw new NotFoundException(EXCEPTION.MOVIES_NOT_FOUND);
    }

    await this.recommendationQueue.add('recommendation-task', {
      movieId: movie.id,
      watchlistId: watchlist.id
    });
  }
}
