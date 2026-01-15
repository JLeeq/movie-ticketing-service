import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일의 값이 process.env.PORT 로 들어옵니다.

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 기본 라우트
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// TODO: 영화 목록 API
app.get('/api/movies', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


