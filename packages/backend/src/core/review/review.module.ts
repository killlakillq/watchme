import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ReviewService } from '@core/review/review.service';
import { ReviewController } from '@infrastructure/controllers/review.controller';
import ReviewRepository from '@infrastructure/database/repositories/review.repository';

@Module({
  imports: [],
  controllers: [ReviewController],
  providers: [ReviewService, PrismaClient, ReviewRepository, JwtService]
})
export class ReviewModule {}
