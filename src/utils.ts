import { format, getMinutes, subHours } from 'date-fns';

export const getDateTime = () => {
  let date = new Date();

  const baseDate = format(date, 'yyyyMMdd');
  if (getMinutes(date) <= 10) date = subHours(date, 1);
  const hour = format(date, 'HH');
  const baseTime = hour + '00';

  return { baseDate, baseTime };
};

export const parsePTY = (value: string) => {
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

export const categoryList: { [key: string]: string } = {
  T1H: '기온',
  RN1: '1시간 강수량',
  UUU: '동서바람성분',
  VVV: '남북바람성분',
  REH: '습도',
  PTY: '강수형태',
  VEC: '풍향',
  WSD: '풍속',
};
