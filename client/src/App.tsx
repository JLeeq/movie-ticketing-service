import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ModalProvider } from './contexts/ModalContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/movie/:id/seat" element={<SeatSelection />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;

