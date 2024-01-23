import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ReviewService } from '../../core/review/review.service';
import { ReviewDto } from '../../core/review/entities/dtos/review.dto';
import { ServerResponse } from '../../common/types';
import { JwtAccessGuard } from '../../common/guards/access-token.guard';
import {
  responseSchema,
  notFoundSchema,
  unauthorizedSchema,
  internalServerErrorSchema
} from '../../common/documents';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  public constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiBody({ type: ReviewDto })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Create review' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async createReview(@Body() body: ReviewDto): Promise<ServerResponse> {
    return this.reviewService.createReview(body);
  }

  @Get()
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Show reviews' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async showReviews(): Promise<ServerResponse> {
    return this.reviewService.showReviews();
  }

  @Get('/:id')
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiParam({ type: 'string', name: 'id' })
  @ApiOperation({ summary: 'Show review' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async getReviewComment(@Param('id') id: string): Promise<ServerResponse> {
    return this.reviewService.getReviewComment(id);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiBody({ type: ReviewDto })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiParam({ type: 'string', name: 'id' })
  @ApiOperation({ summary: 'Update review' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async updateReview(
    @Param('id') id: string,
    @Body() body: ReviewDto
  ): Promise<ServerResponse> {
    return this.reviewService.updateReview(id, body);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiParam({ type: 'string', name: 'id' })
  @ApiOperation({ summary: 'Delete review' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async deleteReview(@Param('id') id: string): Promise<ServerResponse> {
    return this.reviewService.deleteReview(id);
  }
}
