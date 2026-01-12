import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // 임시 더미 데이터
  useEffect(() => {
    const dummyMovies: Movie[] = [
      { id: 1, title: '영화 1', poster: '', description: '영화 1 설명' },
      { id: 2, title: '영화 2', poster: '', description: '영화 2 설명' },
      { id: 3, title: '영화 3', poster: '', description: '영화 3 설명' },
      { id: 4, title: '영화 4', poster: '', description: '영화 4 설명' },
      { id: 5, title: '영화 5', poster: '', description: '영화 5 설명' },
      { id: 6, title: '영화 6', poster: '', description: '영화 6 설명' },
      { id: 7, title: '영화 7', poster: '', description: '영화 7 설명' },
      { id: 8, title: '영화 8', poster: '', description: '영화 8 설명' },
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
      <h1 className="home-title">영화 예매</h1>
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
                  {movie.poster || <div className="poster-placeholder">{movie.title}</div>}
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

