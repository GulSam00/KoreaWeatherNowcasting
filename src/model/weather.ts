import mongoose, { Schema } from 'mongoose';

import { NowcastResult, IWeatherData } from '../types.js';

const ResultSchema = new Schema<NowcastResult>({
  weatherType: String, // 한글 이름 (예: "기온")
  weatherTypeCode: String, // 코드 (예: "T1H")
  obsrValue: String, // 해당 값 (예: 25.3)
});

const WeatherSchema = new Schema<IWeatherData>({
  baseDate: String,
  baseTime: String,
  localeCode: Number,
  nx: Number,
  ny: Number,
  result: [ResultSchema],
});

const WeatherModel = mongoose.model<IWeatherData>('WeatherData', WeatherSchema);

export const saveWeatherData = async ({ baseDate, baseTime, localeCode, nx, ny, result }: IWeatherData) => {
  const newModel = new WeatherModel({
    baseDate,
    baseTime,
    localeCode,
    nx,
    ny,
    result,
  });

  newModel
    .save()
    .then(() => console.log('새로운 날씨 데이터 저장 완료'))
    .catch(err => console.error('저장 실패:', err));
};

export default saveWeatherData;
