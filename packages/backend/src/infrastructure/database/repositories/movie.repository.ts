import { Movie, PrismaClient } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { MovieDto } from '../../../core/movie/entities/dtos/movie.dto';

export interface MovieMethods {
  create(data: MovieDto): Promise<Movie>;
  findById(id: string): Promise<Movie>;
  delete(id: string): Promise<Movie>;
}

@Injectable()
export default class MovieRepository implements MovieMethods {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(data: MovieDto) {
    return this.prisma.movie
      .create({
        data: {
          id: data.id,
          imdbId: data.imdb_id,
          revenue: data.revenue,
          runtime: data.runtime,
          status: data.status,
          tagline: data.tagline,
          title: data.title,
          video: data.video,
          overview: data.overview,
          budget: data.budget,
          homepage: data.homepage,
          adult: data.adult,
          backdrop: data.backdrop_path,
          originalLanguage: data.original_language,
          originalTitle: data.original_title,
          popularity: data.popularity,
          poster: data.poster_path,
          releaseDate: new Date(data.release_date),
          voteAverage: data.vote_average,
          voteCount: data.vote_count,
          genres: {
            connectOrCreate: data.genres.map((genre) => ({
              where: {
                id: genre.id,
                name: genre.name
              },
              create: {
                id: genre.id,
                name: genre.name
              }
            }))
          },
          productionCompanies: {
            connectOrCreate: data.production_companies.map((company) => ({
              where: {
                id: company.id,
                logoPath: company.logo_path,
                name: company.name,
                originCountry: company.origin_country
              },
              create: {
                id: company.id,
                logoPath: company.logo_path,
                name: company.name,
                originCountry: company.origin_country
              }
            }))
          },
          productionCountries: {
            create: data.production_countries.map((country) => ({
              iso31661: country.iso_3166_1,
              name: country.name
            }))
          },
          spokenLanguages: {
            create: data.spoken_languages.map((language) => ({
              iso6391: language.iso_639_1,
              englishName: language.english_name,
              name: language.name
            }))
          }
        }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async findById(id: string) {
    return this.prisma.movie.findUnique({ where: { id } }).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  public async delete(id: string) {
    return this.prisma.movie.delete({ where: { id } }).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }
}
