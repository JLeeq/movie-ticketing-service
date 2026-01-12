import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    // TODO: API에서 영화 정보 가져오기
    const dummyMovie: Movie = {
      id: Number(id),
      title: `영화 ${id}`,
      description: `영화 ${id}의 상세 설명입니다.`,
      poster: '',
    };
    setMovie(dummyMovie);
  }, [id]);

  const handleBookingClick = () => {
    if (selectedDate) {
      navigate(`/movie/${id}/schedule?date=${selectedDate}`);
    } else {
      alert('날짜를 선택해주세요.');
    }
  };

  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="movie-detail-container">
      <div className="movie-info">
        <h1>{movie.title}</h1>
        <p>{movie.description}</p>
      </div>

      <div className="date-selection">
        <h2>날짜 선택</h2>
        <div className="date-buttons">
          {getDateOptions().map((date) => {
            const dateObj = new Date(date);
            const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
            const dayName = dayNames[dateObj.getDay()];
            const formattedDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}(${dayName})`;

            return (
              <button
                key={date}
                className={`date-button ${selectedDate === date ? 'selected' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                {formattedDate}
              </button>
            );
          })}
        </div>
      </div>

      <div className="booking-footer">
        <button className="booking-button" onClick={handleBookingClick}>
          예매
        </button>
      </div>
    </div>
  );
};

export default MovieDetail;

