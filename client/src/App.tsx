import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import ScheduleSelection from './pages/ScheduleSelection';
import SeatSelection from './pages/SeatSelection';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/movie/:id/schedule" element={<ScheduleSelection />} />
          <Route path="/movie/:id/seat" element={<SeatSelection />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

