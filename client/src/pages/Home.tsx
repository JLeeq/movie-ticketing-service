import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { movies } from '../data/movies';
import type { Movie } from '../data/movies';
import './Home.css';

const Home = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { openLoginModal } = useModal();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    setMovieList(movies);
  }, []);

  const visibleMovies = 4;
  const maxIndex = Math.max(0, movieList.length - visibleMovies);

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
        <h1 className="home-title">REGAL THEATER</h1>
        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={openLoginModal}>
              Login
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
            {movieList.map((movie) => (
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

