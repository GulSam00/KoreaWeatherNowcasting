import { NextFunction, Request, Response } from 'express';

import { postWeatherData, getWeatherData } from '../model/weather.js';
import { getNcst } from './getExactNcst.js';

import { NowcastResult, IWeatherData } from '../types.js';

const categoryList: { [key: string]: string } = {
  T1H: '기온',
  RN1: '1시간 강수량',
  UUU: '동서바람성분',
  VVV: '남북바람성분',
  REH: '습도',
  PTY: '강수형태',
  VEC: '풍향',
  WSD: '풍속',
};

const parsePTY = (value: string) => {
  switch (value) {
    case '0':
      return '없음';
    case '1':
      return '비';
    case '2':
      return '비/눈';
    case '3':
      return '눈';
    case '5':
      return '빗방울';
    case '6':
      return '빗방울눈날림';
    case '7':
      return '눈날림';
    default:
      return '알 수 없음';
  }
};

// Request의 body 타입을 정의해야 함.
interface RequestBodyType {
  // nx, ny, baseDate, baseTime
  nx: number;
  ny: number;
  baseDate: string;
  baseTime: string;
}

const expressGetModel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nx, ny, baseDate, baseTime }: RequestBodyType = req.body;

    if (!nx || !ny || !baseDate || !baseTime) {
      res.status(400).json({
        status: 'error',
        message: 'code 값이 필요합니다.',
      });
    }

    const findData = await getWeatherData({ baseDate, baseTime, nx, ny });
    if (findData) {
      res.status(200).json({
        status: 'success',
        message: '성공',
        data: findData,
      });
      return;
    }

    const result = await getNcst({ x: nx, y: ny, baseDate, baseTime });
    if (!result || !result[0]) {
      res.status(500).json({
        status: 'fail',
        message: 'API 요청 실패',
      });
      return;
    }

    const nowCastResult: NowcastResult[] = result.map(item => ({
      weatherType: categoryList[item.category],
      weatherTypeCode: item.category,
      obsrValue: item.category === 'PTY' ? parsePTY(item.obsrValue) : item.obsrValue,
    }));

    const weatherData: IWeatherData = {
      baseDate,
      baseTime,
      nx,
      ny,
      result: nowCastResult,
    };

    await postWeatherData(weatherData);

    res.status(200).json({
      status: 'success',
      message: '성공',
      data: nowCastResult,
    });
  } catch (error) {
    // catch (error) {
    //   console.error('expressPostModel error:', error);
    //   res.status(500).json({
    //     status: 'error',
    //     message: '서버 오류가 발생했습니다.',
    //   });
    // }
    next(error);
  }
};

export default expressGetModel;
