import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById, isReleased, getDaysUntilRelease } from '../data/movies';
import { useBooking } from '../contexts/BookingContext';
import { useLike } from '../contexts/LikeContext';
import { useAuth } from '../contexts/AuthContext';
import type { Movie } from '../data/movies';
import './MovieDetail.css';

interface MovieWithDetailImage extends Movie {
  detailImage?: string;
}

const getDetailImagePath = (movieId: number): string => {
  const imageMap: Record<number, string> = {
    1: '/images/posters/movie_1_2.webp',
    2: '/images/posters/movie_2_2.png',
    3: '/images/posters/movie_3_2.jpg',
    4: '/images/posters/movie_4_2.jpg',
    5: '/images/posters/movie_5_2.jpg',
    6: '/images/posters/movie_6_2.jpg',
    7: '/images/posters/movie_7_2.jpg',
    8: '/images/posters/movie_8_2.jpeg',
  };
  return imageMap[movieId] || '';
};

interface Schedule {
  id: number;
  theater: string;
  time: string;
  availableSeats: number;
  totalSeats: number;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookedSeatsCount } = useBooking();
  const { toggleLike, getLikeCount, isLiked } = useLike();
  const { user } = useAuth();
  const [movie, setMovie] = useState<MovieWithDetailImage | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

  useEffect(() => {
    // TODO: API에서 영화 정보 가져오기
    const movieData = getMovieById(Number(id));
    if (movieData) {
      setMovie(movieData);
    }
  }, [id]);

  useEffect(() => {
    // 날짜가 선택되면 스케줄 데이터 로드
    if (selectedDate) {
      // TODO: API에서 상영 스케줄 가져오기
      const totalSeats = 56;
      const baseSchedules: Schedule[] = [
        { id: 1, theater: 'Theater 1', time: '10:00', availableSeats: totalSeats, totalSeats },
        { id: 2, theater: 'Theater 2', time: '13:30', availableSeats: totalSeats, totalSeats },
        { id: 3, theater: 'Theater 3', time: '16:00', availableSeats: totalSeats, totalSeats },
        { id: 4, theater: 'Theater 4', time: '19:00', availableSeats: totalSeats, totalSeats },
        { id: 5, theater: 'Theater 5', time: '21:30', availableSeats: totalSeats, totalSeats },
      ];
      
      // 예매된 좌석 수를 반영하여 availableSeats 계산
      const updatedSchedules = baseSchedules.map((schedule) => {
        const bookedCount = getBookedSeatsCount(schedule.id);
        return {
          ...schedule,
          availableSeats: Math.max(0, schedule.totalSeats - bookedCount),
        };
      });
      
      setSchedules(updatedSchedules);
      setSelectedSchedule(null);
    } else {
      setSchedules([]);
      setSelectedSchedule(null);
    }
  }, [selectedDate, id, getBookedSeatsCount]);

  const handleScheduleClick = (scheduleId: number) => {
    setSelectedSchedule(scheduleId);
    const schedule = schedules.find((s) => s.id === scheduleId);
    if (schedule) {
      navigate(`/movie/${id}/seat?date=${selectedDate}&scheduleId=${scheduleId}&theater=${encodeURIComponent(schedule.theater)}&time=${encodeURIComponent(schedule.time)}`);
    } else {
      navigate(`/movie/${id}/seat?date=${selectedDate}&scheduleId=${scheduleId}`);
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

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNames[date.getDay()];
    return `${date.getMonth() + 1}/${date.getDate()}(${dayName})`;
  };

  const handleLikeClick = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await toggleLike(movie!.id, user.id);
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  if (!movie) return <div>Loading...</div>;

  const detailImage = getDetailImagePath(movie.id);
  const released = isReleased(movie.releaseDate);
  const daysUntilRelease = getDaysUntilRelease(movie.releaseDate);
  const likeCount = getLikeCount(movie.id);
  const liked = user ? isLiked(movie.id, user.id) : false;
  const formatReleaseDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNames[date.getDay()];
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. (${dayName})`;
  };

  return (
    <div className="movie-detail-container">
      {detailImage && (
        <div className="movie-detail-image">
          <img src={detailImage} alt={movie.title} />
        </div>
      )}
      <div className="movie-info">
        <div className="movie-title-header">
          <h1>{movie.title}</h1>
          <button 
            className={`like-button ${liked ? 'liked' : ''}`}
            onClick={handleLikeClick}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill={liked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="like-count">{likeCount}</span>
          </button>
        </div>
        <p>{movie.description}</p>
      </div>

      {released ? (
        <>
          <div className="date-selection">
            <h2>Date Selection</h2>
            <div className="date-buttons">
              {getDateOptions().map((date) => {
                const dateObj = new Date(date);
                const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
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

          {selectedDate && (
            <div className="schedule-selection">
              <h2>Schedule</h2>
              <div className="selected-date-info">
                Selected Date: {formatDate(selectedDate)}
              </div>
              <div className="schedules-list">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className={`schedule-item ${selectedSchedule === schedule.id ? 'selected' : ''}`}
                    onClick={() => handleScheduleClick(schedule.id)}
                  >
                    <div className="schedule-theater">{schedule.theater}</div>
                    <div className="schedule-time">{schedule.time}</div>
                    <div className="schedule-seats">
                      {schedule.availableSeats}/{schedule.totalSeats}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="release-countdown">
          <h2>Release Countdown</h2>
          <div className="countdown-content">
            <div className="countdown-days">
              <span className="days-number">{daysUntilRelease}</span>
              <span className="days-label">DAYS</span>
            </div>
            <div className="release-date-info">
              <p className="release-date-text">Release Date</p>
              <p className="release-date-value">{formatReleaseDate(movie.releaseDate)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;

