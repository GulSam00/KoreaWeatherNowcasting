import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connect from './mongoDB/connect.js';
import postModel from './postModel.js';

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

// 에러 처리 미들웨어
app.use((err: Error, req: Request, res: Response) => {
  console.error(err);
  res.status(500).send('Something went wrong');
});

app.listen(PORT, () => {
  console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중`);
});

// baseDate / baseTime / code

postModel({ code: 1100000000 });
postModel({ code: 1111000000 });
postModel({ code: 1111051500 });
