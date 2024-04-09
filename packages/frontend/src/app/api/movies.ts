export class MoviesAPI {
  public static async getMovies() {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos');
    const data = await response.json();
    return data;
  }
}
