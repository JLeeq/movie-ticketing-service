import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import ScheduleSelection from './pages/ScheduleSelection';
import SeatSelection from './pages/SeatSelection';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} />
        <Route path="/movie/:id/schedule" element={<ScheduleSelection />} />
        <Route path="/movie/:id/seat" element={<SeatSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

