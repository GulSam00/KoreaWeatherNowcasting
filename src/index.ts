import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import router from './router.js';
import connect from './mongoDB/connect.js';

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

connect((error: Error) => {
  if (error) {
    console.error('DB 연결 중 에러 발생:', error);
    // 서버를 종료시킬 수도 있습니다.
    process.exit(1);
  }
});

app.get('/', async (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(express.json());

app.use(router);

// 에러 처리 미들웨어
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ status: 'error', message: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중`);
});
