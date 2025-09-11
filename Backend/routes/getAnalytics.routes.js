import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/getWeekReports',authMiddleware,getWeekReportsAnalyticsController);


export default router;