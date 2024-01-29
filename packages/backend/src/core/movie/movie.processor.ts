import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUES } from '../../common/constants';

@Processor(QUEUES.MOVIE)
export class MovieProcessor {
  @Process('recommendation-task')
  public async recommendMovies(job: Job<unknown>) {
    console.log(`Job ${job.id} of type ${job.name} with data ${job.data} processed.`);
  }
}
