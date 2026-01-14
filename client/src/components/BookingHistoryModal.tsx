import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooking, type Booking } from '../contexts/BookingContext';
import './BookingHistoryModal.css';

interface BookingHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingHistoryModal = ({ isOpen, onClose }: BookingHistoryModalProps) => {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();
  
  const bookings = user ? getUserBookings(user.id) : [];

  const handleCancel = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      cancelBooking(bookingId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="booking-history-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Booking History</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {!user ? (
            <div className="no-auth-message">
              <p>Login required.</p>
            </div>
          ) : bookings.length === 0 ? (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingHistoryModal;

