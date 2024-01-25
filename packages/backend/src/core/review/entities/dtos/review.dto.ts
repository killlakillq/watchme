import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, Min, Max, IsInt } from 'class-validator';

export class ReviewDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  date: Date;

  @ApiProperty()
  @Min(0)
  @Max(10)
  @IsInt()
  rating: number;
}
