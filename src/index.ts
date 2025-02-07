import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connect from './mongoDB/connect.js';
import axios from 'axios';
import saveWeatherData from './model/weather.js';
import { format } from 'date-fns';
import _code_local from './parse_api_code.js';
import { ICodeCoordJson } from './types.js';

const code_local = _code_local as ICodeCoordJson[]; // 타입 정의는 유지

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

const testAPI = async () => {
  const ncstURL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0';
  const url = ncstURL + '/getUltraSrtNcst';
  const today = new Date();
  const base_date = format(today, 'yyyyMMdd');
  const base_time = format(today, 'HH00');
  const ncstKey = process.env.NCST_KEY;
  const params = {
    serviceKey: ncstKey,
    dataType: 'JSON',
    base_date,
    base_time,
    numOfRows: '1000',
    nx: 55,
    ny: 127,
    localeCode: 0,
  };
  const result = await axios.get(url, { params });
  saveWeatherData();

  // params.localeCode = getLocaleCode(params.nx, params.ny);

  // console.log(result.data.response?.body?.items.item);
  return result.data;
};

testAPI();
