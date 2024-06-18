import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LogsDto } from '@common/types';

@Injectable()
export default class LogRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(data: LogsDto) {
    return this.prisma.log
      .create({
        data
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async get() {
    return this.prisma.log.findMany().catch((error) => {
      throw new BadRequestException(error.message);
    });
  }
}
