import mongoose, { Schema, Document } from 'mongoose';

import { ICodeCoordJson } from '../types.js';

interface NowcastResult {
  weatherType: string;
  weatherTypeCode: string;
  obsrValue: number;
}

interface IWeatherData extends Document {
  baseDate: string;
  baseTime: string;
  localeCode: number;
  nx: number;
  ny: number;
  result: NowcastResult[];
}

const ResultSchema = new Schema<NowcastResult>({
  weatherType: String,
  weatherTypeCode: String,
  obsrValue: Number,
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

const saveWeatherData = async () => {
  const newModel = new WeatherModel({
    baseDate: '20241023',
    baseTime: '2100',
    localeCode: 112,
    nx: 56,
    ny: 112,
    result: [
      {
        weatherType: '비',
        weatherTypeCode: 'RN1',
        obsrValue: 62,
      },
      {
        weatherType: '흐림',
        weatherTypeCode: 'REH',
        obsrValue: 62,
      },
    ],
  });

  newModel
    .save()
    .then(() => console.log('새로운 날씨 데이터 저장 완료'))
    .catch(err => console.error('저장 실패:', err));

  const result = await WeatherModel.find();
  console.log('저장된 데이터:', result);
};

export default saveWeatherData;
