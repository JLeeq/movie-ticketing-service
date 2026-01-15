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
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    setFilteredMovies(movies);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMovies(movies);
      setCurrentIndex(0);
    } else {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
      setCurrentIndex(0);
    }
  }, [searchQuery]);

  const visibleMovies = 4;
  const maxIndex = Math.max(0, filteredMovies.length - visibleMovies);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    // Google 로그인 또는 사용자 메타데이터에서 이름 가져오기
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) return fullName;
    // 이메일에서 @ 앞부분 사용
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">REGAL THEATER</h1>
        <div className="auth-section">
          {user && (
            <div className="user-greeting">
              Hello, {getUserDisplayName()}
            </div>
          )}
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
      <div className="search-section">
        <div className="search-container">
          <svg 
            className="search-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="search-clear-button"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
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
            {filteredMovies.length === 0 ? (
              <div className="no-results">
                <p>No movies found matching "{searchQuery}"</p>
              </div>
            ) : (
              filteredMovies.map((movie) => {
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
                  </div>
                  <h3 className="movie-title">{movie.title}</h3>
                  {!released && movie.releaseDate && (
                    <div className="release-date-text">
                      Release: {formatReleaseDate(movie.releaseDate)}
                    </div>
                  )}
                </div>
              );
            })
            )}
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

