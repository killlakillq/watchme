/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { MovieList } from '../../../../common/types';

export class MovieDto {
  @ApiProperty()
  addedAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  overview: string;

  @ApiProperty()
  releaseDate: Date;

  @ApiProperty()
  runtime: number;

  @ApiProperty()
  country: string;

  @ApiProperty()
  authors: string;

  @ApiProperty()
  genre: string;

  @ApiProperty()
  ageRate: number;

  @ApiProperty()
  originalLanguage: string;

  @ApiProperty()
  budget: bigint;

  @ApiProperty()
  revenue: bigint;
}

export class ShowMovieQueriesDto {
  @ApiProperty()
  lists: MovieList;

  @ApiProperty()
  language: string;

  @ApiProperty()
  page: number;
}

export class SearchMovieQueriesDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  includeAdult: boolean;

  @ApiProperty()
  primaryReleaseYear: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  region: string;

  @ApiProperty()
  year: string;
}
