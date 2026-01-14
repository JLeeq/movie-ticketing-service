import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { movies, isReleased } from '../data/movies';
import type { Movie } from '../data/movies';
import BookingHistoryModal from '../components/BookingHistoryModal';
import './Home.css';

const Home = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookingHistoryOpen, setIsBookingHistoryOpen] = useState(false);
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
          <button 
            className="my-page-button" 
            onClick={() => setIsBookingHistoryOpen(true)}
          >
            My Page
          </button>
          {user ? (
            <button className="auth-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="auth-button" onClick={openLoginModal}>
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
            {movieList.map((movie) => {
              const released = isReleased(movie.releaseDate);
              const formatReleaseDate = (dateString?: string) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              };

              return (
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
                    {!released && movie.releaseDate && (
                      <div className="release-date-badge">
                        Release: {formatReleaseDate(movie.releaseDate)}
                      </div>
                    )}
                  </div>
                  <h3 className="movie-title">{movie.title}</h3>
                </div>
              );
            })}
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
      <BookingHistoryModal
        isOpen={isBookingHistoryOpen}
        onClose={() => setIsBookingHistoryOpen(false)}
        onOpenLogin={() => {
          setIsBookingHistoryOpen(false);
          openLoginModal();
        }}
      />
    </div>
  );
};

export default Home;

