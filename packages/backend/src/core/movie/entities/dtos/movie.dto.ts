/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsEnum, IsNumber, IsObject } from 'class-validator';
import { MovieList } from '../../../../common/types';
import {
  Collection,
  Genre,
  ProductionCompanies,
  ProductionCountries,
  SpokenLanguages
} from '../../interfaces/movie.type';

export class MovieDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  original_title: string;

  @ApiProperty()
  @IsString()
  poster_path: string;

  @ApiProperty()
  @IsObject({ each: true })
  production_companies: ProductionCompanies[];

  @ApiProperty()
  @IsObject({ each: true })
  spoken_languages: SpokenLanguages[];

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  tagline: string;

  @ApiProperty()
  @IsBoolean()
  video: boolean;

  @ApiProperty()
  @IsNumber()
  vote_count: number;

  @ApiProperty()
  @IsNumber()
  vote_average: number;

  @ApiProperty()
  @IsNumber()
  popularity: number;

  @ApiProperty()
  @IsString()
  backdrop_path: string;

  @ApiProperty()
  @IsString()
  homepage?: string | null;

  @ApiProperty()
  @IsString()
  imdb_id?: string | null;

  @ApiProperty()
  @IsObject({ each: true })
  belongs_to_collection: Collection;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  overview: string;

  @ApiProperty()
  @IsString()
  release_date: string;

  @ApiProperty()
  @IsBoolean()
  adult: boolean;

  @ApiProperty()
  @IsInt()
  runtime: number;

  @ApiProperty()
  @IsObject({ each: true })
  production_countries: ProductionCountries[];

  @ApiProperty()
  @IsObject({ each: true })
  genres: Genre[];

  @ApiProperty()
  @IsString()
  original_language: string;

  @ApiProperty()
  @IsNumber()
  budget: number;

  @ApiProperty()
  @IsNumber()
  revenue: number;
}

export class ShowMovieQueriesDto {
  @ApiProperty()
  @IsString()
  @IsEnum(MovieList)
  lists: MovieList;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsString()
  page: string;
}

export class SearchMovieQueriesDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsBoolean()
  includeAdult: boolean;

  @ApiProperty()
  @IsString()
  primaryReleaseYear: string;

  @ApiProperty()
  @IsInt()
  page: number;

  @ApiProperty()
  @IsString()
  region: string;

  @ApiProperty()
  @IsString()
  year: string;
}

export class WatchlistDto {
  @ApiProperty()
  @IsString()
  movieId: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
