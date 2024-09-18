import { ReviewDto } from '@core/review/entities/dtos/review.dto';
import { ServerResponse } from '@common/types';

export interface Review {
  id: string;
  name: string;
  date: Date;
  description: string;
  rating: number;
}

export interface ReviewMethods {
  create(data: ReviewDto): Promise<Review | ServerResponse<Review>>;
  find(): Promise<Review[] | ServerResponse<Review[]>>;
  update(id: string, data: Review): Promise<Review | ServerResponse<Review>>;
  delete(id: string): Promise<Review | ServerResponse<Review>>;
}
