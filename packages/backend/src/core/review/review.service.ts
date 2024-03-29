import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ReviewDto } from './entities/dtos/review.dto';
import ReviewRepository from '../../infrastructure/database/repositories/review.repository';
import { ServerResponse } from '../../common/types';
import { EXCEPTIONS } from '../../common/constants';

@Injectable()
export class ReviewService {
  public constructor(private readonly reviewRepository: ReviewRepository) {}

  public async createReview(body: ReviewDto): Promise<ServerResponse> {
    const review = await this.reviewRepository.create(body);

    if (!review) {
      throw new NotFoundException(EXCEPTIONS.REVIEW_NOT_FOUND);
    }

    return {
      status: HttpStatus.CREATED,
      message: 'Review was successfully created',
      data: review
    };
  }

  public async showReviews(): Promise<ServerResponse> {
    const review = await this.reviewRepository.find();

    if (!review) {
      throw new NotFoundException(EXCEPTIONS.REVIEW_NOT_FOUND);
    }

    return {
      status: HttpStatus.OK,
      message: 'Reviews were successfully fetched',
      data: review
    };
  }

  public async updateReview(id: string, body: ReviewDto): Promise<ServerResponse> {
    const review = await this.reviewRepository.update(id, body);

    if (!review) {
      throw new NotFoundException(EXCEPTIONS.REVIEW_NOT_FOUND);
    }

    return {
      status: HttpStatus.OK,
      message: 'Review was successfully updated',
      data: review
    };
  }

  public async deleteReview(id: string): Promise<ServerResponse> {
    const review = await this.reviewRepository.delete(id);

    if (!review) {
      throw new NotFoundException(EXCEPTIONS.REVIEW_NOT_FOUND);
    }

    return {
      status: HttpStatus.OK,
      message: 'Review was successfully deleted',
      data: review
    };
  }

  public async getReviewComment(id: string): Promise<ServerResponse> {
    const review = await this.reviewRepository.findReviewComment(id);

    return {
      status: HttpStatus.OK,
      message: 'Review was successfully fetched',
      data: review
    };
  }
}
