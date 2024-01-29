import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request } from 'undici';
import { ShowMovieQueriesDto, SearchMovieQueriesDto } from '../core/movie/entities/dtos/movie.dto';
import { TMDB } from '../common/constants';

@Injectable()
export class MovieDatabaseIntegration {
  private token: string;

  private url: string;

  public constructor(private readonly configService: ConfigService) {
    this.token = this.configService.get('TMDB_ACCESS_TOKEN');
    this.url = this.configService.get('TMDB_URL');
  }

  public async getMovies({ lists, language, page }: ShowMovieQueriesDto) {
    const { body, statusCode: status } = await request(
      `${this.url}/${TMDB.TYPE.MOVIE}/${lists}?language=${language}&page=${page}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      }
    );
    const data = await body.json();
    return { data, status };
  }

  public async searchMovies(queries: SearchMovieQueriesDto) {
    const { body, statusCode: status } = await request(
      `${this.url}/search/${TMDB.TYPE.MOVIE}
      ?query=${queries.title}
      &include_adult=${queries.includeAdult}
      &language=${queries.language}
      &page=${queries.page}
      &region=${queries.region}
      &primary_release_year=${queries.primaryReleaseYear}
      &year=${queries.year}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      }
    );
    const data = await body.json();
    return { data, status };
  }

  public async recommendMovies(movieId: number) {
    const { body, statusCode: status } = await request(
      `${this.url}/movie/${movieId}/${TMDB.TYPE.RECOMMENDATIONS}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      }
    );
    const data = await body.json();
    return { data, status };
  }

  public async getMovieDetails(movieId: number) {
    const { body, statusCode: status } = await request(`${this.url}/movie/${movieId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.token}`
      }
    });

    const data = await body.json();
    return { data, status };
  }
}
