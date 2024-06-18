import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ServerResponse } from '../../common/types';
import {
  SearchMovieQueriesDto,
  ShowMovieQueriesDto
} from '../../core/movie/entities/dtos/movie.dto';
import { MovieService } from '../../core/movie/movie.service';
import { JwtAccessGuard } from '../../common/guards/access-token.guard';
import {
  responseSchema,
  internalServerErrorSchema,
  notFoundSchema,
  unauthorizedSchema
} from '../../common/documents';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  public constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiNotFoundResponse(notFoundSchema)
  @ApiQuery({ type: ShowMovieQueriesDto })
  @ApiOperation({ summary: 'Show movies' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiResponse({ status: 200, ...responseSchema })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async showMovies(@Query() queries: ShowMovieQueriesDto): Promise<ServerResponse> {
    return this.movieService.showMovies(queries);
  }

  @Post('/watch-list/:userId/:movieId')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiParam({ type: 'string', name: 'userId' })
  @ApiParam({ type: 'string', name: 'movieId' })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiOperation({ summary: 'Add movie to watch list' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async addMovieToWatchlist(
    @Param('userId') userId: string,
    @Param('movieId') movieId: string
  ): Promise<ServerResponse> {
    return this.movieService.addMovieToWatchlist(userId, movieId);
  }

  @Get('/watch-list/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Watch list' })
  @ApiParam({ type: 'string', name: 'id' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async showWatchlist(@Param('userId') userId: string): Promise<ServerResponse> {
    return this.movieService.showWatchlist(userId);
  }

  @Delete('/watch-list/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiParam({ type: 'string', name: 'id' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiOperation({ summary: 'Delete movie from watch list' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async deleteMovieFromWatchlist(@Param('id') id: string): Promise<ServerResponse> {
    return this.movieService.deleteMovieFromWatchlist(id);
  }

  @Get('/search')
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiQuery({ type: SearchMovieQueriesDto })
  @ApiOperation({ summary: 'Search movies' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async searchMovies(@Query() queries: SearchMovieQueriesDto): Promise<ServerResponse> {
    return this.movieService.searchMovies(queries);
  }

  @Get('/recommendations')
  public async recommendMovies() {
    await this.movieService.generateRecommendations('9602cd3d-1d5f-4b71-b531-a4f57199075c', 'asd');
    return { status: 200, message: 'Recommendations were successfully fetched' };
  }
}
