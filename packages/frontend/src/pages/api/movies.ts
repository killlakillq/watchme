export async function getMovies() {
  const request = await fetch(
    'http://localhost:3001/api/movies?lists=now_playing&language=en-US&page=1',
    {
      method: 'GET'
    }
  );

  const response = await request.json();

  return response.data;
}
