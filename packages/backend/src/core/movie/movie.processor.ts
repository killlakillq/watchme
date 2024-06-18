import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Watchlist } from '@prisma/client';
import { QUEUES } from '@common/constants';
import { MovieDatabaseIntegration } from '@integrations/movie.integration';

@Processor(QUEUES.MOVIE)
export class MovieProcessor {
  public constructor(private readonly movieDatabaseIntegration: MovieDatabaseIntegration) {}

  @Process('recommendation-task')
  public async recommendMovies(job: Job<Watchlist>) {
    const { movieId } = job.data;

    console.log(movieId);

    const { data } = await this.movieDatabaseIntegration.getMovieDetails(movieId);

    console.log(data);
  }
}
