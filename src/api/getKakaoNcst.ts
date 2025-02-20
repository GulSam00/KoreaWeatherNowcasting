import axios from 'axios';

import { getParamsByCode, getNcst } from './getExactNcst.js';
import { getDateTime } from '../utils.js';
import { ICodeCoordJson, GetKakaoNcstRequest, GetNcstResponseTypes } from '../types.js';

const kakaoURL = process.env.KAKAO_URL;
const kakaoKey = process.env.KAKAO_KEY;

export const getKakaoLocal = async ({ x, y }: GetKakaoNcstRequest): Promise<ICodeCoordJson | undefined> => {
  try {
    if (typeof x !== 'number' || typeof y !== 'number') throw new Error('x, y 자료형이 number가 아닙니다.');
    if (!kakaoKey) throw new Error('kakaoKey가 필요합니다.');
    const url = kakaoURL + '/geo/coord2regioncode';
    const result = await axios.get(url, {
      params: {
        x,
        y,
      },
      headers: {
        Authorization: `KakaoAK ${kakaoKey}`,
      },
    });

    const document = result?.data?.documents[1];
    if (!document) throw new Error('API 요청이 실패했습니다.');

    const { code, region_3depth_name } = document;
    const parsedLocal = getParamsByCode({ code, dong: region_3depth_name });

    return parsedLocal;
  } catch (e) {
    console.error('getKakaoLocal error');
    console.error(e);
    return undefined;
  }
};

export const getKakaoNcst = async ({ x, y }: GetKakaoNcstRequest): Promise<GetNcstResponseTypes | undefined> => {
  try {
    if (typeof x !== 'number' || typeof y !== 'number') throw new Error('x, y 자료형이 number가 아닙니다.');

    if (!kakaoKey) throw new Error('kakaoKey가 필요합니다.');

    const local = await getKakaoLocal({ x, y });
    if (!local) throw new Error('지역 정보를 가져올 수 없습니다.');

    const { baseDate, baseTime } = getDateTime();

    return getNcst({ x: local.x, y: local.y, baseDate, baseTime });
  } catch (e) {
    console.error('getKakaoNcst error');
    console.error(e);
    return undefined;
  }
};
