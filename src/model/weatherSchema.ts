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

const WeatherDataSchema = new Schema({
  baseDate: String,
  baseTime: String,
  localeCode: Number,
  nx: Number,
  ny: Number,
});
