import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUES } from '@common/constants';
import { MovieDatabaseIntegration } from '@integrations/movie.integration';
import { PrismaClient } from '@prisma/client';

@Processor(QUEUES.MOVIE)
export class MovieProcessor {
  public constructor(
    private readonly movieDatabaseIntegration: MovieDatabaseIntegration,
    private readonly prisma: PrismaClient
  ) {}

  @Process('recommendation-task')
  public async recommendMovies(job: Job<{ movieId: string; watchlistId: string }>) {
    const { movieId, watchlistId } = job.data;

    console.log(movieId);

    const { data } = await this.movieDatabaseIntegration.getMovieDetails(movieId);

    await this.prisma.$transaction(async (tx) => {
      await tx.movie.findMany({
        where: {}
      });
    });
  }
}
