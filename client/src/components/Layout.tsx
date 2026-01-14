import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';
import BookingHistoryModal from './BookingHistoryModal';
import LoginModal from './LoginModal';
import './Layout.css';

const Layout = () => {
  const [isBookingHistoryOpen, setIsBookingHistoryOpen] = useState(false);
  const { isLoginModalOpen, closeLoginModal } = useModal();

  return (
    <div className="app-layout">
      <button
        className="booking-history-button"
        onClick={() => setIsBookingHistoryOpen(true)}
      >
        Booking History
      </button>
      <Outlet />
      <BookingHistoryModal
        isOpen={isBookingHistoryOpen}
        onClose={() => setIsBookingHistoryOpen(false)}
      />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </div>
  );
};

export default Layout;

