import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { useLike } from '../contexts/LikeContext';
import { getMovieById } from '../data/movies';
import './BookingHistoryModal.css';

interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

type TabType = 'bookings' | 'likes';

const BookingHistoryModal = ({ isOpen, onClose, onOpenLogin }: BookingHistoryModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getUserBookings, cancelBooking } = useBooking();
  const { getUserLikes } = useLike();
  const [activeTab, setActiveTab] = useState<TabType>('bookings');
  
  const bookings = user ? getUserBookings(user.id) : [];
  const likes = user ? getUserLikes(user.id) : [];

  const handleCancel = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await cancelBooking(bookingId);
      } catch (error) {
        console.error('Error canceling booking:', error);
        alert('예매 취소 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  const handleLoginClick = () => {
    onClose();
    onOpenLogin();
  };

  const handleMovieClick = (movieId: number) => {
    onClose();
    navigate(`/movie/${movieId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>My Page</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        {user && (
          <div className="modal-tabs">
            <button
              className={`tab-button ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Bookings
            </button>
            <button
              className={`tab-button ${activeTab === 'likes' ? 'active' : ''}`}
              onClick={() => setActiveTab('likes')}
            >
              Liked Movies
            </button>
          </div>
        )}
        <div className="modal-body">
          {!user ? (
            <div className="no-auth-message">
              <p>Login required.</p>
              <button className="login-button" onClick={handleLoginClick}>
                Login
              </button>
            </div>
          ) : activeTab === 'bookings' ? (
            bookings.length === 0 ? (
              <div className="no-bookings-message">
                <p>No booking history.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-movie-title">{booking.movieTitle || `Movie ${booking.movieId}`}</div>
                    <div className="booking-details">
                      <div className="booking-detail-row">
                        <span>Date:</span>
                        <span>{booking.date}</span>
                      </div>
                      <div className="booking-detail-row">
                        <span>Theater:</span>
                        <span>{booking.theater || 'Theater'}</span>
                      </div>
                      <div className="booking-detail-row">
                        <span>Time:</span>
                        <span>{booking.time || 'TBA'}</span>
                      </div>
                      <div className="booking-detail-row">
                        <span>Seats:</span>
                        <span>{booking.seats.join(', ')}</span>
                      </div>
                      <div className="booking-detail-row booking-total">
                        <span>Total:</span>
                        <span>₩{booking.totalPrice?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                    <button 
                      className="cancel-booking-button"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )
          ) : (
            likes.length === 0 ? (
              <div className="no-bookings-message">
                <p>No liked movies.</p>
              </div>
            ) : (
              <div className="liked-movies-list">
                {likes.map((like) => {
                  const movie = getMovieById(like.movieId);
                  return (
                    <div 
                      key={like.id} 
                      className="liked-movie-item"
                      onClick={() => handleMovieClick(like.movieId)}
                    >
                      {movie?.poster && (
                        <img 
                          src={movie.poster} 
                          alt={movie.title}
                          className="liked-movie-poster"
                        />
                      )}
                      <div className="liked-movie-info">
                        <div className="liked-movie-title">{movie?.title || `Movie ${like.movieId}`}</div>
                        {movie?.description && (
                          <div className="liked-movie-description">{movie.description}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryModal;

