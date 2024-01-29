import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
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
import { ServerResponse } from '../../common/types';
import {
  MovieDto,
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
    @Body(new ValidationPipe({ transform: true })) body: MovieDto
  ): Promise<ServerResponse> {
    return this.movieService.addMovieToWatchList(body);
  }

  @Get('/watch-list/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @ApiCreatedResponse(responseSchema)
  @ApiNotFoundResponse(notFoundSchema)
  @ApiOperation({ summary: 'Watch list' })
  @ApiParam({ type: 'string', name: 'id' })
  @ApiUnauthorizedResponse(unauthorizedSchema)
  @ApiInternalServerErrorResponse(internalServerErrorSchema)
  public async showWatchList(@Param('id') id: string): Promise<ServerResponse> {
    return this.movieService.showWatchList(id);
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
  public async deleteMovieFromWatchList(@Param('id') id: string): Promise<ServerResponse> {
    return this.movieService.deleteMovieFromWatchList(id);
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
    await this.movieService.recommendMovies(1);
  }
}
