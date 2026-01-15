import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { requireSupabase } from '../lib/requireSupabase';

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
  loading: boolean;
  bookSeats: (scheduleId: number, movieId: number, date: string, seats: string[], userId: string, movieTitle?: string, theater?: string, time?: string, totalPrice?: number) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  getBookedSeatsCount: (scheduleId: number) => number;
  getUserBookings: (userId: string) => Booking[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Supabase에서 모든 예매 정보 불러오기
  useEffect(() => {
    // Supabase가 설정되지 않았으면 early return
    if (!supabase) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching bookings:', error);
          return;
        }

        if (data) {
          const formattedBookings: Booking[] = data.map((item) => ({
            id: item.id,
            scheduleId: item.schedule_id,
            movieId: item.movie_id,
            date: item.date,
            seats: item.seats,
            userId: item.user_id,
            movieTitle: item.movie_title,
            theater: item.theater,
            time: item.time,
            totalPrice: item.total_price,
          }));
          setBookings(formattedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // 실시간 구독 (다른 유저의 예매를 실시간으로 반영)
    if (!supabase) return;
    const subscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBooking: Booking = {
              id: payload.new.id,
              scheduleId: payload.new.schedule_id,
              movieId: payload.new.movie_id,
              date: payload.new.date,
              seats: payload.new.seats,
              userId: payload.new.user_id,
              movieTitle: payload.new.movie_title,
              theater: payload.new.theater,
              time: payload.new.time,
              totalPrice: payload.new.total_price,
            };
            setBookings((prev) => [...prev, newBooking]);
          } else if (payload.eventType === 'DELETE') {
            setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const bookSeats = useCallback(async (
    scheduleId: number,
    movieId: number,
    date: string,
    seats: string[],
    userId: string,
    movieTitle?: string,
    theater?: string,
    time?: string,
    totalPrice?: number
  ) => {
    try {
      const sb = requireSupabase();
      const { data, error } = await sb
        .from('bookings')
        .insert({
          schedule_id: scheduleId,
          movie_id: movieId,
          date: date,
          seats: seats,
          user_id: userId,
          movie_title: movieTitle,
          theater: theater,
          time: time,
          total_price: totalPrice,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      if (data) {
        const newBooking: Booking = {
          id: data.id,
          scheduleId: data.schedule_id,
          movieId: data.movie_id,
          date: data.date,
          seats: data.seats,
          userId: data.user_id,
          movieTitle: data.movie_title,
          theater: data.theater,
          time: data.time,
          totalPrice: data.total_price,
        };
        setBookings((prev) => [...prev, newBooking]);
      }
    } catch (error) {
      console.error('Error booking seats:', error);
      throw error;
    }
  }, []);

  const cancelBooking = useCallback(async (bookingId: string) => {
    try {
      const sb = requireSupabase();
      const { error } = await sb
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) {
        console.error('Error canceling booking:', error);
        throw error;
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
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
    <BookingContext.Provider value={{ bookings, loading, bookSeats, cancelBooking, getBookedSeatsCount, getUserBookings }}>
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

