import { NextFunction, Request, Response } from 'express';

import { postWeatherData, getWeatherData } from '../model/weather.js';
import { getNcst } from './getExactNcst.js';
import { parsePTY, categoryList } from '../utils.js';
import { NowcastResult, IWeatherData } from '../types.js';

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
      return;
    }

    const findData = await getWeatherData({ baseDate, baseTime, nx, ny });
    if (findData) {
      res.status(200).json({
        status: 'success',
        message: '성공, 존재하는 데이터',
        data: findData,
      });
      return;
    }

    const result = await getNcst({ x: nx, y: ny, baseDate, baseTime });
    if (!result || !result[0]) {
      throw new Error('API 요청 실패');
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
      message: '성공, 데이터 추가',
      data: nowCastResult,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'API 요청 실패',
    });
    next(error);
  }
};

export default expressGetModel;
