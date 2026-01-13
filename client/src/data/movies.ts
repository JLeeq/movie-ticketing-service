export interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
}

export const movies: Movie[] = [
  { id: 1, title: 'Avatar: Fire and Ash', poster: '/images/posters/movie_1_1.jpg', description: '2025 ‧ Action/Fantasy ‧ 3h 17m' },
  { id: 2, title: 'Zootopia 2', poster: '/images/posters/movie_2_1.webp', description: '2025 ‧ Family/Comedy ‧ 1h 50m' },
  { id: 3, title: 'Stranger Things Season 5', poster: '/images/posters/movie_3_1.jpg', description: '2016 ‧ Horror ‧ 5 seasons' },
  { id: 4, title: 'Avengers: Doomsday', poster: '/images/posters/movie_4_1.jpg', description: '2026 ‧ Sci-fi/Action' },
  { id: 5, title: 'Spider-Man: Brand New Day', poster: '/images/posters/movie_5_1.jpg', description: '2026 ‧ Sci-fi/Action' },
  { id: 6, title: 'The SpongeBob Movie: Search for SquarePants', poster: '/images/posters/movie_6_1.jpg', description: '2025 ‧ Family/Adventure ‧ 1h 28m' },
  { id: 7, title: '영화 7', poster: '/images/posters/movie_7_1.webp', description: '영화 7 설명' },
  { id: 8, title: '영화 8', poster: '/images/posters/movie_8_1.jpg', description: '영화 8 설명' },
];

export const getMovieById = (id: number): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

