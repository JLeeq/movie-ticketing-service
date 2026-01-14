import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface Booking {
  id: string;
  scheduleId: number;
  movieId: number;
  date: string;
  seats: string[];
  userId: string;
  movieTitle?: string;
  theater?: string;
  time?: string;
  totalPrice?: number;
}

interface BookingContextType {
  bookings: Booking[];
  bookSeats: (scheduleId: number, movieId: number, date: string, seats: string[], userId: string, movieTitle?: string, theater?: string, time?: string, totalPrice?: number) => void;
  cancelBooking: (bookingId: string) => void;
  getBookedSeatsCount: (scheduleId: number) => number;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const bookSeats = useCallback((scheduleId: number, movieId: number, date: string, seats: string[], userId: string, movieTitle?: string, theater?: string, time?: string, totalPrice?: number) => {
    const bookingId = `${scheduleId}-${userId}-${Date.now()}`;
    setBookings((prev) => [
      ...prev,
      {
        id: bookingId,
        scheduleId,
        movieId,
        date,
        seats,
        userId,
        movieTitle,
        theater,
        time,
        totalPrice,
      },
    ]);
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  }, []);

  const getUserBookings = useCallback((userId: string) => {
    return bookings.filter((booking) => booking.userId === userId);
  }, [bookings]);

  const getBookedSeatsCount = useCallback((scheduleId: number) => {
    return bookings
      .filter((booking) => booking.scheduleId === scheduleId)
      .reduce((total, booking) => total + booking.seats.length, 0);
  }, [bookings]);

  return (
    <BookingContext.Provider value={{ bookings, bookSeats, cancelBooking, getBookedSeatsCount, getUserBookings }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

