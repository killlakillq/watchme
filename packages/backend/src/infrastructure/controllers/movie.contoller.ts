import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ServerResponse } from '../../common/types';
import {
  MovieDto,
  SearchMovieQueriesDto,
  ShowMovieQueriesDto
} from '../../core/movie/entities/dtos/movie.dto';
import { MovieService } from '../../core/movie/movie.service';
import { JwtAccessGuard } from '../../common/guards/access-token.guard';
import {
  ApiBearerAuth,
  ApiBody,
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
import {
  responseSchema,
  internalServerErrorSchema,
  notFoundSchema,
  unauthorizedSchema
} from '../../common/documents';
import { Response } from 'express';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  public constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiQuery({
    name: 'list',
    type: String
  })
  @ApiQuery({
    name: 'language',
    type: String
  })
  @ApiQuery({
    name: 'page',
    type: Number
  })
  @ApiOperation({ summary: 'Show movies' })
  @ApiResponse({ status: 200, ...responseSchema })
  @ApiNotFoundResponse(notFoundSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async showMovies(
    @Query() queries: ShowMovieQueriesDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.movieService.showMovies(queries);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Post('/watch-list')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiBody({ type: MovieDto })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiOperation({ summary: 'Add movie to watch list' })
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async addMovieToWatchList(
    @Body() body: MovieDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.movieService.addMovieToWatchList(body);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Get('/watch-list')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Watch list' })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async showWatchList(@Res({ passthrough: true }) res: Response): Promise<ServerResponse> {
    const { status, message, data } = await this.movieService.showWatchList();

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Delete('/watch-list/:id')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiParam({ type: 'string', name: 'id' })
  @ApiOperation({ summary: 'Delete movie from watch list' })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async deleteMovieFromWatchList(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.movieService.deleteMovieFromWatchList(id);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }

  @Get('/search')
  @ApiQuery({
    name: 'title',
    type: String
  })
  @ApiQuery({
    name: 'language',
    type: String
  })
  @ApiQuery({
    name: 'includeAdult',
    type: Boolean
  })
  @ApiQuery({
    name: 'primaryReleaseYear',
    type: String
  })
  @ApiQuery({
    name: 'page',
    type: Number
  })
  @ApiQuery({
    name: 'region',
    type: String
  })
  @ApiQuery({
    name: 'year',
    type: String
  })
  @ApiOperation({ summary: 'Search movies' })
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async searchMovies(
    @Query() queries: SearchMovieQueriesDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<ServerResponse> {
    const { status, message, data } = await this.movieService.searchMovies(queries);

    res.status(status);

    return {
      status,
      message,
      data
    };
  }
}
