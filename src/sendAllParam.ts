import postModel from './api/postModel.js';

import _code_local from './parse_api_code.js';
import { ICodeCoordJson } from './types.js';

const code_local = _code_local as ICodeCoordJson[]; // 타입 정의는 유지

async function sendAllRequests() {
  let i = 0;
  let count = 0;
  for (const item of code_local) {
    console.log('i : ', i);
    i++;

    if (i > 300) break;
    const result = await postModel({ code: item.code }); // API 요청

    switch (result) {
      case 'fail': {
        console.log('API 요청 실패');

        break;
      }
      case 'dup': {
        // console.log('중복 데이터 감지');
        break;
      }
      case 'save': {
        console.log('새로운 데이터 저장 완료');
        count++;
        break;
      }
      default: {
      }
    }
  }
  console.log('새로 저장된 데이터의 개수: ', count);
  // 1800
  // 1800 * 24 = 43200
}

sendAllRequests(); // 함수 실행
