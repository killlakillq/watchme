/* eslint-disable max-classes-per-file */
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsDate, IsInt, IsObject, IsBoolean } from 'class-validator';
import { MovieList } from '../../../../common/types';

export class MovieDto {
  @ApiProperty()
  @IsDate()
  addedAt: Date;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  overview: string;

  @ApiProperty()
  @IsDate()
  releaseDate: Date;

  @ApiProperty()
  @IsInt()
  runtime: number;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  authors: string;

  @ApiProperty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsInt()
  ageRate: number;

  @ApiProperty()
  @IsString()
  originalLanguage: string;

  @ApiProperty()
  @Transform((val) => BigInt(val.value))
  budget: bigint;

  @ApiProperty()
  @Transform((val) => BigInt(val.value))
  revenue: bigint;
}

export class ShowMovieQueriesDto {
  @ApiProperty()
  @IsObject()
  @Type(() => MovieList)
  lists: MovieList;

  @ApiProperty()
  @IsString()
  language: string;

  @ApiProperty()
  @IsInt()
  page: number;
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
