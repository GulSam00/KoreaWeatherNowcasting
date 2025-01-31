import mongoose from 'mongoose';

const connect = async (next: Function) => {
  const url = process.env.MONGODB_URL;

  if (!url) {
    console.error('MONGODB_URL 정의되지 않았습니다.');
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    console.log('이미 DB에 연결되어 있습니다.');
    return;
  }

  try {
    await mongoose.connect(url);
    console.log('MongoDB 연결 성공');
  } catch (error) {
    console.error('MongoDB 연결 실패:', error);
    next(error); // 에러 미들웨어로 넘겨줍니다.
  }
};

export default connect;
