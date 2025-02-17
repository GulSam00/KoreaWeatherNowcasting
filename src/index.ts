import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connect from './mongoDB/connect.js';
import postModel from './api/postModel.js';

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

import _code_local from './parse_api_code.js';
import { ICodeCoordJson } from './types.js';

const code_local = _code_local as ICodeCoordJson[]; // 타입 정의는 유지

async function sendRequests() {
  let count = 0;
  for (const item of code_local) {
    const result = await postModel({ code: item.code }); // API 요청

    switch (result) {
      case 'fail': {
        // console.log('API 요청 실패');
      }
      case 'dup': {
        // console.log('중복 데이터 감지');
      }
      case 'save': {
        console.log('새로운 데이터 저장 완료');
        count++;
      }
      default: {
      }
    }
  }
  console.log('새로 저장된 데이터의 개수: ', count);
}

sendRequests(); // 함수 실행
