import { PrismaClient } from '@prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ReviewDto } from '@core/review/entities/dtos/review.dto';
import { Review, ReviewMethods } from '@core/review/entities/review.entity';

@Injectable()
export default class ReviewRepository implements ReviewMethods {
  public constructor(private readonly prisma: PrismaClient) {}

  public async create(data: ReviewDto): Promise<Review> {
    return this.prisma.review.create({ data }).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  public async find(): Promise<Review[]> {
    return this.prisma.review.findMany().catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  public async update(id: string, data: ReviewDto): Promise<Review> {
    return this.prisma.review
      .update({
        data,
        where: { id }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }

  public async delete(id: string): Promise<Review> {
    return this.prisma.review.delete({ where: { id } }).catch((error) => {
      throw new BadRequestException(error.message);
    });
  }

  public async findReviewComment(id: string) {
    return this.prisma.reviewComment
      .findUnique({
        where: { id }
      })
      .catch((error) => {
        throw new BadRequestException(error.message);
      });
  }
}
