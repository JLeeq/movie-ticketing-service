import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

interface Movie {
  id: number;
  title: string;
  poster: string;
  description: string;
}

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  useEffect(() => {
    const dummyMovies: Movie[] = [
      { id: 1, title: 'Avatar: Fire and Ash', poster: '/images/posters/movie_1_1.jpg', description: '2025 ‧ Action/Fantasy ‧ 3h 17m' },
      { id: 2, title: 'Zootopia 2', poster: '/images/posters/movie_2_1.webp', description: '2025 ‧ Family/Comedy ‧ 1h 50m' },
      { id: 3, title: 'Stranger Things Season 5', poster: '/images/posters/movie_3_1.jpg', description: '2016 ‧ Horror ‧ 5 seasons' },
      { id: 4, title: 'Avengers: Doomsday', poster: '/images/posters/movie_4_1.jpg', description: '2026 ‧ Sci-fi/Action' },
      { id: 5, title: 'Spider-Man: Brand New Day', poster: '/images/posters/movie_5_1.jpg', description: '2026 ‧ Sci-fi/Action' },
      { id: 6, title: 'The SpongeBob Movie: Search for SquarePants', poster: '/images/posters/movie_6_1.jpg', description: '2025 ‧ Family/Adventure ‧ 1h 28m' },
      { id: 7, title: '영화 7', poster: '/images/posters/movie_7_1.webp', description: '영화 7 설명' },
      { id: 8, title: '영화 8', poster: '/images/posters/movie_8_1.jpg', description: '영화 8 설명' },
    ];
    setMovies(dummyMovies);
  }, []);

  const visibleMovies = 4;
  const maxIndex = Math.max(0, movies.length - visibleMovies);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">영화 예매</h1>
        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={() => navigate('/login')}>
              로그인
            </button>
          )}
        </div>
      </div>
      <div className="movies-section">
        <button
          className="nav-button nav-button-left"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ◀
        </button>
        <div className="movies-container">
          <div
            className="movies-list"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleMovies)}%)`,
            }}
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="movie-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <div className="movie-poster">
                  {movie.poster ? (
                    <img src={movie.poster} alt={movie.title} />
                  ) : (
                    <div className="poster-placeholder">{movie.title}</div>
                  )}
                </div>
                <h3 className="movie-title">{movie.title}</h3>
              </div>
            ))}
          </div>
        </div>
        <button
          className="nav-button nav-button-right"
          onClick={handleNext}
          disabled={currentIndex >= maxIndex}
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default Home;

