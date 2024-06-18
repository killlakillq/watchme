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
  create(data: ReviewDto): Promise<Review | ServerResponse>;
  find(): Promise<Review[] | ServerResponse>;
  update(id: string, data: Review): Promise<Review | ServerResponse>;
  delete(id: string): Promise<Review | ServerResponse>;
}
