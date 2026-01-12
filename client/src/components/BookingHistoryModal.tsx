import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './BookingHistoryModal.css';

interface Booking {
  id: number;
  movieTitle: string;
  date: string;
  theater: string;
  time: string;
  seats: string[];
  totalPrice: number;
}

interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingHistoryModal = ({ isOpen, onClose }: BookingHistoryModalProps) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (isOpen && user) {
      // TODO: API에서 예매 내역 가져오기
      const dummyBookings: Booking[] = [
        {
          id: 1,
          movieTitle: '영화 1',
          date: '2024-01-15',
          theater: '1관',
          time: '10:00',
          seats: ['A1', 'A2'],
          totalPrice: 24000,
        },
        {
          id: 2,
          movieTitle: '영화 2',
          date: '2024-01-16',
          theater: '2관',
          time: '13:30',
          seats: ['B5'],
          totalPrice: 12000,
        },
      ];
      setBookings(dummyBookings);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>예매 내역</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {!user ? (
            <div className="no-auth-message">
              <p>로그인이 필요합니다.</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings-message">
              <p>예매 내역이 없습니다.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-movie-title">{booking.movieTitle}</div>
                  <div className="booking-details">
                    <div className="booking-detail-row">
                      <span>날짜:</span>
                      <span>{booking.date}</span>
                    </div>
                    <div className="booking-detail-row">
                      <span>상영관:</span>
                      <span>{booking.theater}</span>
                    </div>
                    <div className="booking-detail-row">
                      <span>시간:</span>
                      <span>{booking.time}</span>
                    </div>
                    <div className="booking-detail-row">
                      <span>좌석:</span>
                      <span>{booking.seats.join(', ')}</span>
                    </div>
                    <div className="booking-detail-row booking-total">
                      <span>총 금액:</span>
                      <span>{booking.totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryModal;

