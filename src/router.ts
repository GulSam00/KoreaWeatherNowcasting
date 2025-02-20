import express from 'express';
import expressPostModel from './api/expressPostModel.js';
import expressGetModel from './api/expressGetModel.js';
const router = express.Router();

router.post('/api/weather', expressPostModel);
router.get('/api/weather', expressGetModel);

export default router;
