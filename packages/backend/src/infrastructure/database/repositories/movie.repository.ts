import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { MovieDto } from '../../../core/movie/entities/dtos/movie.dto';

@Injectable()
export default class MovieRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async createWatchlist(userId: string, movieId: number) {
    return this.prisma.watchlist.create({ data: { userId, movieId } }).catch((error) => error);
  }

  public async createMovie(data: MovieDto) {
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
          backdropPath: data.backdrop_path,
          originalLanguage: data.original_language,
          originalTitle: data.original_title,
          popularity: data.popularity,
          posterPath: data.poster_path,
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
              iso_3166_1: country.iso_3166_1,
              name: country.name
            }))
          },
          spokenLanguages: {
            create: data.spoken_languages.map((language) => ({
              iso_639_1: language.iso_639_1,
              englishName: language.english_name,
              name: language.name
            }))
          }
        }
      })
      .catch((error) => error);
  }

  public async delete(id: number) {
    return this.prisma.movie.delete({ where: { id } });
  }

  public async findMovieById(id: number) {
    return this.prisma.movie.findUnique({ where: { id } });
  }

  public async findWatchlistById(userId: string) {
    const watchlist = await this.prisma.watchlist.findMany({
      where: {
        userId
      },
      include: {
        movie: true
      }
    });

    return watchlist.map((entry) => entry.movie);
  }
}
