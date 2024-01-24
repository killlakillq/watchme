import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LogsDto } from '../../../common/types';

@Injectable()
export default class LogsRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(data: LogsDto) {
    return this.prisma.logs.create({
      data
    });
  }

  public async get() {
    return this.prisma.logs.findMany();
  }
}
