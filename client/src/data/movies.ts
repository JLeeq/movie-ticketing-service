export interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
  releaseDate?: string; // YYYY-MM-DD 형식
}

export const movies: Movie[] = [
  { id: 1, title: 'Avatar: Fire and Ash', poster: '/images/posters/movie_1_1.jpg', description: '2025 ‧ Action/Fantasy ‧ 3h 17m', releaseDate: '2025-03-15' },
  { id: 2, title: 'Zootopia 2', poster: '/images/posters/movie_2_1.webp', description: '2025 ‧ Family/Comedy ‧ 1h 50m', releaseDate: '2025-04-20' },
  { id: 3, title: 'Stranger Things Season 5', poster: '/images/posters/movie_3_1.jpg', description: '2016 ‧ Horror ‧ 5 seasons', releaseDate: '2024-01-01' },
  { id: 4, title: 'Avengers: Doomsday', poster: '/images/posters/movie_4_1.jpg', description: '2026 ‧ Sci-fi/Action', releaseDate: '2026-05-01' },
  { id: 5, title: 'Spider-Man: Brand New Day', poster: '/images/posters/movie_5_1.jpg', description: '2026 ‧ Sci-fi/Action', releaseDate: '2026-07-15' },
  { id: 6, title: 'The SpongeBob Movie: Search for SquarePants', poster: '/images/posters/movie_6_1.jpg', description: '2025 ‧ Family/Adventure ‧ 1h 28m', releaseDate: '2025-02-10' },
  { id: 7, title: '영화 7', poster: '/images/posters/movie_7_1.webp', description: '영화 7 설명', releaseDate: '2025-06-01' },
  { id: 8, title: '영화 8', poster: '/images/posters/movie_8_1.jpg', description: '영화 8 설명', releaseDate: '2025-08-20' },
];

// 개봉일이 지났는지 확인하는 함수
export const isReleased = (releaseDate?: string): boolean => {
  if (!releaseDate) return true; // releaseDate가 없으면 개봉된 것으로 간주
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const release = new Date(releaseDate);
  release.setHours(0, 0, 0, 0);
  return release <= today;
};

// 디데이 계산 함수
export const getDaysUntilRelease = (releaseDate?: string): number => {
  if (!releaseDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const release = new Date(releaseDate);
  release.setHours(0, 0, 0, 0);
  const diffTime = release.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const getMovieById = (id: number): Movie | undefined => {
  return movies.find(movie => movie.id === id);
};

