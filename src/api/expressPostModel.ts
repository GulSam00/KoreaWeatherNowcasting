import { Request, Response } from 'express';

import { postWeatherData, getWeatherData } from '../model/weather.js';
import { getNcst, getParamsByCode } from './getExactNcst.js';
import { parsePTY, getDateTime, categoryList } from '../utils.js';

import { NowcastResult, IWeatherData } from '../types.js';

const expressPostModel = async (req: Request, res: Response) => {
  try {
    const { code, dong }: { code: number; dong?: string } = req.body;

    if (!code) {
      res.status(400).json({
        status: 'error',
        message: 'code 값이 필요합니다.',
      });
    }

    const codeParams = getParamsByCode({ code, dong });
    const { x: nx, y: ny } = codeParams;

    const { baseDate, baseTime } = getDateTime();

    const findData = await getWeatherData({ baseDate, baseTime, nx, ny });
    if (findData) {
      res.status(200).json({
        status: 'duplicate',
        message: '중복 데이터 감지',
        data: findData,
      });
    }

    const result = await getNcst({ x: nx, y: ny, baseDate, baseTime });
    if (!result || !result[0]) {
      res.status(500).json({
        status: 'fail',
        message: 'API 요청 실패 또는 데이터 없음',
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

    res.status(201).json({
      status: 'success',
      message: '날씨 데이터 저장 완료',
      data: weatherData,
    });
  } catch (error) {
    console.error('expressPostModel error:', error);
    res.status(500).json({
      status: 'error',
      message: '서버 오류가 발생했습니다.',
    });
  }
};

export default expressPostModel;
