import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MovieDetail.css';

interface Movie {
  id: number;
  title: string;
  description: string;
  poster: string;
}

interface Schedule {
  id: number;
  theater: string;
  time: string;
  availableSeats: number;
}

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

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

  useEffect(() => {
    // 날짜가 선택되면 스케줄 데이터 로드
    if (selectedDate) {
      // TODO: API에서 상영 스케줄 가져오기
      const dummySchedules: Schedule[] = [
        { id: 1, theater: '1관', time: '10:00', availableSeats: 45 },
        { id: 2, theater: '2관', time: '13:30', availableSeats: 32 },
        { id: 3, theater: '3관', time: '16:00', availableSeats: 50 },
        { id: 4, theater: '1관', time: '19:00', availableSeats: 28 },
        { id: 5, theater: '2관', time: '21:30', availableSeats: 40 },
      ];
      setSchedules(dummySchedules);
      setSelectedSchedule(null);
    } else {
      setSchedules([]);
      setSelectedSchedule(null);
    }
  }, [selectedDate, id]);

  const handleScheduleClick = (scheduleId: number) => {
    setSelectedSchedule(scheduleId);
    navigate(`/movie/${id}/seat?date=${selectedDate}&scheduleId=${scheduleId}`);
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
          <h2>상영 스케줄</h2>
          <div className="selected-date-info">
            선택한 날짜: {formatDate(selectedDate)}
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
                  잔여좌석: {schedule.availableSeats}석
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;

