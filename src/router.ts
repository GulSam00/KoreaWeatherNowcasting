import express from 'express';
import expressPostModel from './api/ExpressPostModel.js';

const router = express.Router();

router.post('/weather', expressPostModel);

export default router;
