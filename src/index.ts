import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import { scheduleJob } from './scheduler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// MongoDB 연결
// mongoose
//   .connect(process.env.MONGO_URI as string)
//   .then(() => console.log('✅ MongoDB 연결 성공'))
//   .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// API 라우트
// app.get('/data', async (req: Request, res: Response) => {
//   try {
//     const data = await mongoose.connection.db.collection('apidatas').find().sort({ timestamp: -1 }).limit(1).toArray();
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: '데이터 조회 실패' });
//   }
// });

// 크론 스케줄 실행
// scheduleJob();

app.listen(PORT, () => {
  console.log(`🚀 서버가 ${PORT}번 포트에서 실행 중`);
});
