import { PrismaClient } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface WatchlistMethods {
  create(userId: string, movieId: string): Promise<unknown>;
  findById(userId: string): Promise<unknown>;
}

@Injectable()
export default class WatchlistRepository implements WatchlistMethods {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(userId: string, movieId: string) {
    return this.prisma.watchlist
      .create({
        data: {}
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async findById(id: string) {
    return this.prisma.watchlist
      .findUnique({
        where: {
          id
        }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }
}
