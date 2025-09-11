import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { body } from 'express-validator';
import { createHealthRoutineController, getHealthLogController, getHistoryHealthRoutineController, updateExistingHealthRoutineController } from '../controllers/healthRoutine.controller.js';
const router = express.Router();

router.post('/createHealthRoutine',authMiddleware,[
    body('waterIntake').notEmpty().withMessage('Water intake is required').isNumeric().withMessage('Water intake must be a number'),
    body('exerciseDuration').notEmpty().withMessage('Exercise duration is required').isNumeric().withMessage('Exercise duration must be a number'),
    body('sleepDuration').notEmpty().withMessage('Sleep duration is required').isNumeric().withMessage('Sleep duration must be a number'),
    body('stepsWalked').notEmpty().withMessage('Steps walked is required').isNumeric().withMessage('Steps walked must be a number'),
    body('meditationDuration').notEmpty().withMessage('Meditation duration is required').isNumeric().withMessage('Meditation duration must be a number')
],createHealthRoutineController)


router.put('/updateHealthRoutine',authMiddleware,[
    body('waterIntake').optional().notEmpty().withMessage('Water intake is required').isNumeric().withMessage('Water intake must be a number'),
    body('exerciseDuration').optional().notEmpty().withMessage('Exercise duration is required').isNumeric().withMessage('Exercise duration must be a number'),
    body('sleepDuration').optional().notEmpty().withMessage('Sleep duration is required').isNumeric().withMessage('Sleep duration must be a number'),
    body('stepsWalked').optional().notEmpty().withMessage('Steps walked is required').isNumeric().withMessage('Steps walked must be a number'),
    body('meditationDuration').optional().notEmpty().withMessage('Meditation duration is required').isNumeric().withMessage('Meditation duration must be a number')
],updateExistingHealthRoutineController)


router.post('/getHealthRoutine', authMiddleware,getHistoryHealthRoutineController);

router.post('/getHealthLog/:date',authMiddleware,getHealthLogController)






export default router;