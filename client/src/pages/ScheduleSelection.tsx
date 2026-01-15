import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import './ScheduleSelection.css';

interface Schedule {
  id: number;
  theater: string;
  time: string;
  availableSeats: number;
}

const ScheduleSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get('date') || '';
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null);

  useEffect(() => {
    // TODO: API에서 상영 스케줄 가져오기
    const dummySchedules: Schedule[] = [
      { id: 1, theater: '1 Theater', time: '10:00', availableSeats: 45 },
      { id: 2, theater: '2 Theater', time: '13:30', availableSeats: 32 },
      { id: 3, theater: '3 Theater', time: '16:00', availableSeats: 50 },
      { id: 4, theater: '1 Theater', time: '19:00', availableSeats: 28 },
      { id: 5, theater: '2 Theater', time: '21:30', availableSeats: 40 },
    ];
    setSchedules(dummySchedules);
  }, [id, selectedDate]);

  const handleScheduleClick = (scheduleId: number) => {
    setSelectedSchedule(scheduleId);
    navigate(`/movie/${id}/seat?date=${selectedDate}&scheduleId=${scheduleId}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayName = dayNames[date.getDay()];
    return `${date.getMonth() + 1}/${date.getDate()}(${dayName})`;
  };

  return (
    <div className="schedule-selection-container">
      <div className="schedule-header">
        <h1>Schedule</h1>
        {selectedDate && (
          <div className="selected-date">
            Selected Date: {formatDate(selectedDate)}
          </div>
        )}
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
              Remaining Seats: {schedule.availableSeats} seats
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSelection;


