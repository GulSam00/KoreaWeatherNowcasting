import { postWeatherData, getWeatherData } from '../model/weather.js';
import { getNcst, getParamsByCode } from './getExactNcst.js';

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
  const result = await getNcst(getParamsByCode({ code, dong }));
  if (!result || !result[0]) return 'fail';
  const { baseDate, baseTime, nx, ny } = result[0];

  // 중복 체크, 중복이면 localeCode만 교체해서 Save, API 요청 횟수 줄이기
  const findData = await getWeatherData({ baseDate, baseTime, nx, ny });
  if (findData) {
    // console.log('중복 데이터 감지 - X : ', nx, 'Y : ', ny);
    findData.localeCode = code;
    await findData.save();
    return 'dup';
  }

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
    localeCode: code,
    nx,
    ny,
    result: nowCastResult,
  };
  postWeatherData(weatherData);

  return 'save';
};

export default postModel;
