import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; //로그인 상태를 **전역(Context)**으로 관리
import Layout from './components/Layout';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import SeatSelection from './pages/SeatSelection';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider> {/* 앱 전체에서 인증 상태를 쓰기 위해 이걸 감쌈. */}
      <BrowserRouter> {/* 주소창(URL)을 기준으로 페이지를 바꿔줌 */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/movie/:id/seat" element={<SeatSelection />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

