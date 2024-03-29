import { ReviewDto } from './dtos/review.dto';

export interface Review {
  id: string;
  name: string;
  date: Date;
  description: string;
  rating: number;
}

export interface ReviewMethods {
  create(data: ReviewDto): Promise<Review>;
  find(): Promise<Review[]>;
  update(id: string, data: Review): Promise<Review>;
  delete(id: string): Promise<Review>;
}
