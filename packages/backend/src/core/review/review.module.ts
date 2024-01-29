import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ReviewController } from '../../infrastructure/controllers/review.controller';
import { ReviewService } from './review.service';
import ReviewRepository from '../../infrastructure/database/repositories/review.repository';

@Module({
  imports: [],
  controllers: [ReviewController],
  providers: [ReviewService, PrismaClient, ReviewRepository, JwtService]
})
export class ReviewModule {}
