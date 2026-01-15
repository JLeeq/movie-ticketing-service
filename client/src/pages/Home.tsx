import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';
import { useComment } from '../contexts/CommentContext';
import { movies, isReleased } from '../data/movies';
import type { Movie } from '../data/movies';
import BookingHistoryModal from '../components/BookingHistoryModal';
import './Home.css';

const Home = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBookingHistoryOpen, setIsBookingHistoryOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { openLoginModal } = useModal();
  const { addComment, getMovieComments } = useComment();
  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<Record<number, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleCommentSubmit = async (e: React.FormEvent, movieId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      openLoginModal();
      return;
    }

    const commentText = commentTexts[movieId] || '';
    if (!commentText.trim()) {
      alert('Please enter a comment.');
      return;
    }

    setIsSubmitting((prev) => ({ ...prev, [movieId]: true }));
    try {
      const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
      await addComment(movieId, user.id, userName, commentText.trim());
      setCommentTexts((prev) => ({ ...prev, [movieId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [movieId]: false }));
    }
  };

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="home-container">
      <div className="content-wrapper">
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
        <div className="ad-section">
          <video
            ref={videoRef}
            className="ad-video"
            src="/ad.mov"
            autoPlay
            loop
            playsInline
            muted={isMuted}
          >
            Your browser does not support the video tag.
          </video>
          <button
            className="mute-button"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
              }
            }}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <line x1="23" y1="9" x2="17" y2="15"/>
                <line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
        </div>
        <div className="search-section">
        <button
          className="search-toggle-button"
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          aria-label="Toggle search"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        {isSearchOpen && (
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
              autoFocus
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
        )}
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

              const comments = getMovieComments(movie.id);
              const commentText = commentTexts[movie.id] || '';

              return (
                <div
                  key={movie.id}
                  className="movie-card"
                >
                  <div 
                    className="movie-poster-wrapper"
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
                  <div className="movie-comments" onClick={(e) => e.stopPropagation()}>
                    {user ? (
                      <form 
                        className="comment-form" 
                        onSubmit={(e) => handleCommentSubmit(e, movie.id)}
                      >
                        <textarea
                          className="comment-input"
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentTexts((prev) => ({ ...prev, [movie.id]: e.target.value }))}
                          rows={2}
                        />
                        <button 
                          type="submit" 
                          className="comment-submit-button"
                          disabled={isSubmitting[movie.id] || !commentText.trim()}
                        >
                          {isSubmitting[movie.id] ? 'Posting...' : 'Post'}
                        </button>
                      </form>
                    ) : (
                      <div className="comment-login-prompt">
                        <button 
                          className="comment-login-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLoginModal();
                          }}
                        >
                          Login to comment
                        </button>
                      </div>
                    )}
                    <div className="comments-list">
                      {comments.length > 0 && (
                        comments.map((comment) => (
                          <div key={comment.id} className="comment-item">
                            <div className="comment-header">
                              <span className="comment-author">{comment.userName || 'Anonymous'}</span>
                            </div>
                            <div className="comment-content">{comment.content}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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

