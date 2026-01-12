import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BookingHistoryModal from './BookingHistoryModal';
import './Layout.css';

const Layout = () => {
  const [isBookingHistoryOpen, setIsBookingHistoryOpen] = useState(false);

  return (
    <div className="app-layout">
      <button
        className="booking-history-button"
        onClick={() => setIsBookingHistoryOpen(true)}
      >
        예매 내역
      </button>
      <Outlet />
      <BookingHistoryModal
        isOpen={isBookingHistoryOpen}
        onClose={() => setIsBookingHistoryOpen(false)}
      />
    </div>
  );
};

export default Layout;

