import { Body, Controller, Delete, Get, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { ReviewService } from '../../core/review/review.service';
import { ReviewDto } from '../../core/review/entities/dtos/review.dto';
import { ServerResponse } from '../../common/types';
import { JwtAccessGuard } from '../../common/guards/access-token.guard';
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
import {
  responseSchema,
  notFoundSchema,
  unauthorizedSchema,
  internalServerErrorSchema
} from '../../common/documents';
import { Response } from 'express';

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
  public async createReview(
    @Body() body: ReviewDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.reviewService.createReview(body);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Get()
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Show reviews' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async showReviews(@Res({ passthrough: true }) res: Response): Promise<ServerResponse> {
    const { status, message, data } = await this.reviewService.showReviews();

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Get('/:id')
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiParam({ type: 'string', name: 'id' })
  @ApiOperation({ summary: 'Show review' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async getReviewComment(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.reviewService.getReviewComment(id);

    res.status(status);

    return {
      status,
      message,
      data
    };
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
    @Body() body: ReviewDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.reviewService.updateReview(id, body);

    res.status(status);

    return {
      status,
      message,
      data
    };
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
  public async deleteReview(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.reviewService.deleteReview(id);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }
}
