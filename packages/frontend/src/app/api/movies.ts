export class MoviesAPI {
  public async getMovies() {
    const response = await fetch('/api/movies');
    const data = await response.json();
    return data;
  }
}
