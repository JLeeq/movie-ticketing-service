import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { getMovieById } from '../data/movies';
import LoginBanner from '../components/LoginBanner';
import './SeatSelection.css';

interface Seat {
  row: string;
  number: number;
  isSelected: boolean;
  isBooked: boolean;
}

const SeatSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { bookSeats, bookings } = useBooking();
  const scheduleId = Number(searchParams.get('scheduleId')) || 0;
  const date = searchParams.get('date') || '';
  const theater = searchParams.get('theater') || 'Theater 1';
  const time = searchParams.get('time') || '10:00';
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginBanner, setShowLoginBanner] = useState(false);
  const seatPrice = 12000;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const seatsPerRow = 8;

  useEffect(() => {
    // 좌석 초기화 (A1-G8)
    const initialSeats: Seat[] = [];
    rows.forEach((row) => {
      for (let num = 1; num <= seatsPerRow; num++) {
        const seatKey = `${row}${num}`;
        // 예매된 좌석인지 확인
        const isBooked = bookings.some((booking) => 
          booking.scheduleId === scheduleId && booking.seats.includes(seatKey)
        );
        
        initialSeats.push({
          row,
          number: num,
          isSelected: false,
          isBooked,
        });
      }
    });
    setSeats(initialSeats);
  }, [scheduleId, bookings]);

  const handleSeatClick = (row: string, number: number) => {
    setSeats((prevSeats) => {
      const updatedSeats = prevSeats.map((seat) => {
        if (seat.row === row && seat.number === number) {
          if (seat.isBooked) return seat;
          const newSelectionState = !seat.isSelected;
          
          // selectedSeats 업데이트
          setSelectedSeats((prev) => {
            const seatKey = `${row}${number}`;
            if (newSelectionState) {
              // 선택됨 - 추가
              if (!prev.find((s) => `${s.row}${s.number}` === seatKey)) {
                return [...prev, { ...seat, isSelected: true }];
              }
            } else {
              // 선택 해제됨 - 제거
              return prev.filter((s) => `${s.row}${s.number}` !== seatKey);
            }
            return prev;
          });
          
          return { ...seat, isSelected: newSelectionState };
        }
        return seat;
      });
      return updatedSeats;
    });
  };

  const handleBuy = () => {
    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요.');
      return;
    }
    
    // 로그인 체크
    if (!user) {
      setShowLoginBanner(true);
      return;
    }
    
    setShowPaymentModal(true);
  };

  const handlePaymentConfirm = async () => {
    if (user && selectedSeats.length > 0 && scheduleId > 0) {
      try {
        // 좌석 예매 처리
        const seatStrings = selectedSeats.map((seat) => `${seat.row}${seat.number}`);
        const totalPrice = selectedSeats.length * seatPrice;
        
        // 영화 정보 가져오기
        const movie = getMovieById(Number(id));
        const movieTitle = movie?.title || `Movie ${id}`;
        
        // 스케줄 정보는 URL 파라미터나 기본값 사용
        const scheduleTheater = theater;
        const scheduleTime = time;
        
        // Supabase에 저장 (비동기)
        await bookSeats(scheduleId, Number(id), date, seatStrings, user.id, movieTitle, scheduleTheater, scheduleTime, totalPrice);
        
        // 선택한 좌석을 예매 완료 상태로 변경
        setSeats((prevSeats) => {
          return prevSeats.map((seat) => {
            const seatKey = `${seat.row}${seat.number}`;
            if (seatStrings.includes(seatKey)) {
              return { ...seat, isBooked: true, isSelected: false };
            }
            return seat;
          });
        });
        
        setSelectedSeats([]);
        setShowPaymentModal(false);
        navigate('/');
      } catch (error) {
        console.error('Payment failed:', error);
        alert('예매 중 오류가 발생했습니다. 다시 시도해주세요.');
        setShowPaymentModal(false);
      }
    } else {
      setShowPaymentModal(false);
    }
  };

  const totalPrice = selectedSeats.length * seatPrice;

  return (
    <div className="seat-selection-container">
      <h1>좌석 선택</h1>

      <div className="screen-indicator">SCREEN</div>

      <div className="seats-grid">
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seatNumber = i + 1;
              const seat = seats.find((s) => s.row === row && s.number === seatNumber);
              const isSelected = seat?.isSelected || false;
              const isBooked = seat?.isBooked || false;

              return (
                <button
                  key={seatNumber}
                  className={`seat ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`}
                  onClick={() => handleSeatClick(row, seatNumber)}
                  disabled={isBooked}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-seat available"></div>
          <span>예약 가능</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat selected"></div>
          <span>선택</span>
        </div>
        <div className="legend-item">
          <div className="legend-seat booked"></div>
          <span>예약 완료</span>
        </div>
      </div>

      <div className="booking-footer">
        <div className="selected-info">
          <div className="selected-seats">
            선택한 좌석: {selectedSeats.map((s) => `${s.row}${s.number}`).join(', ') || '없음'}
          </div>
          <div className="total-price">총 가격: {totalPrice.toLocaleString()}원</div>
        </div>
        <button className="buy-button" onClick={handleBuy}>
          Buy
        </button>
      </div>

      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>결제 완료</h2>
            <p>예매가 완료되었습니다!</p>
            <div className="payment-details">
              <p>선택한 좌석: {selectedSeats.map((s) => `${s.row}${s.number}`).join(', ')}</p>
              <p>총 금액: {totalPrice.toLocaleString()}원</p>
            </div>
            <button className="modal-button" onClick={handlePaymentConfirm}>
              확인
            </button>
          </div>
        </div>
      )}

      <LoginBanner isOpen={showLoginBanner} onClose={() => setShowLoginBanner(false)} />
    </div>
  );
};

export default SeatSelection;

