import { postWeatherData, getWeatherData } from '../model/weather.js';
import { getNcst, getParamsByCode } from './getExactNcst.js';
import { format, getMinutes, subHours } from 'date-fns';

import { NowcastResult, IWeatherData } from '../types.js';

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

const postModel = async ({ code, dong }: { code: number; dong?: string }) => {
  const codeParams = getParamsByCode({ code, dong });
  const { x: nx, y: ny } = codeParams;

  let date = new Date();

  const baseDate = format(date, 'yyyyMMdd');
  if (getMinutes(date) <= 10) date = subHours(date, 1);
  const hour = format(date, 'HH');
  const baseTime = hour + '00';

  const findData = await getWeatherData({ baseDate, baseTime, nx, ny });
  if (findData) {
    console.log('중복 데이터 감지 - X : ', nx, 'Y : ', ny);
    // 굳이 중복된 데이터를 code만 다르게 해서 저장해야 하나? 요청 올 때 nx, ny 맞는 거 있으면 그거 전달해주면 되잖아.
    // findData.localeCode = code;
    // await findData.save();
    return 'dup';
  }

  // 이 시점(API 요청) 전에 중복을 구분해야 함.
  const result = await getNcst({ x: nx, y: ny, baseDate, baseTime });
  if (!result || !result[0]) return 'fail';

  const nowCastResult: NowcastResult[] = result.map(item => {
    const { category, obsrValue } = item;
    return {
      weatherType: categoryList[category],
      weatherTypeCode: category,
      obsrValue: category === 'PTY' ? parsePTY(obsrValue) : obsrValue,
    };
  });

  const weatherData: IWeatherData = {
    baseDate,
    baseTime,
    // localeCode: code,
    nx,
    ny,
    result: nowCastResult,
  };
  postWeatherData(weatherData);

  return 'save';
};

export default postModel;
