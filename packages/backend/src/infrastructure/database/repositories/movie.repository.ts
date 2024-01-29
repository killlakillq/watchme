import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { MovieDto } from '../../../core/movie/entities/dtos/movie.dto';
import { Movie, MovieMethods } from '../../../core/movie/entities/movie.entity';

@Injectable()
export default class MovieRepository implements MovieMethods {
  public constructor(private readonly prisma: PrismaClient) {}

  public async add(data: MovieDto): Promise<Movie> {
    return this.prisma.movie.create({ data });
  }

  public async delete(id: string): Promise<Movie> {
    return this.prisma.movie.delete({ where: { id } });
  }

  public async find(): Promise<Movie[]> {
    return this.prisma.movie.findMany();
  }

  public async findWatchListById(id: string): Promise<Movie> {
    return this.prisma.movie.findUnique({
      where: {
        id
      }
    });
  }
}
