import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getTodayHealthDashboardController } from '../controllers/dashboard.controller.js';

const router = express.Router();


router.post('/getTodayHealthDashboard/:userId',authMiddleware,getTodayHealthDashboardController); 



export default router;