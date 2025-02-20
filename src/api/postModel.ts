import { postWeatherData, getWeatherData } from '../model/weather.js';
import { getNcst, getParamsByCode } from './getExactNcst.js';
import { getDateTime, parsePTY, categoryList } from '../utils.js';

import { NowcastResult, IWeatherData } from '../types.js';

const postModel = async ({ code, dong }: { code: number; dong?: string }) => {
  const codeParams = getParamsByCode({ code, dong });
  const { x: nx, y: ny } = codeParams;

  const { baseDate, baseTime } = getDateTime();

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
    nx,
    ny,
    result: nowCastResult,
  };
  postWeatherData(weatherData);

  return 'save';
};

export default postModel;
