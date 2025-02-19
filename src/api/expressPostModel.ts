import { Request, Response } from 'express';

import { postWeatherData, getWeatherData } from '../model/weather.js';
import { getNcst, getParamsByCode } from './getExactNcst.js';
import { format, getMinutes, subHours } from 'date-fns';

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

const expressPostModel = async (req: Request, res: Response) => {
  try {
    const { code, dong }: { code: number; dong?: string } = req.body;

    if (!code) {
      return res.status(400).json({
        status: 'error',
        message: 'code 값이 필요합니다.',
      });
    }

    const codeParams = getParamsByCode({ code, dong });
    const { x: nx, y: ny } = codeParams;

    let date = new Date();
    const baseDate = format(date, 'yyyyMMdd');

    if (getMinutes(date) <= 10) date = subHours(date, 1);
    const hour = format(date, 'HH');
    const baseTime = hour + '00';

    const findData = await getWeatherData({ baseDate, baseTime, nx, ny });
    if (findData) {
      return res.status(200).json({
        status: 'duplicate',
        message: '중복 데이터 감지',
        data: findData,
      });
    }

    const result = await getNcst({ x: nx, y: ny, baseDate, baseTime });
    if (!result || !result[0]) {
      return res.status(500).json({
        status: 'fail',
        message: 'API 요청 실패 또는 데이터 없음',
      });
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

    return res.status(201).json({
      status: 'success',
      message: '날씨 데이터 저장 완료',
      data: weatherData,
    });
  } catch (error) {
    console.error('expressPostModel error:', error);
    return res.status(500).json({
      status: 'error',
      message: '서버 오류가 발생했습니다.',
    });
  }
};

export default expressPostModel;
