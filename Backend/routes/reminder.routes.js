import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { body } from 'express-validator';
import {
    getTodaysScheduleController,
    markMedicationTakenController,
    updateReminderSettingsController,
    getNotificationHistoryController,
    getReminderStatsController,
    testReminderController
} from '../controllers/reminder.controller.js';

const router = express.Router();

// Get today's medication schedule with reminder status
router.get('/todays-schedule', authMiddleware, getTodaysScheduleController);

// Mark medication as taken
router.post('/mark-taken', authMiddleware, [
    body('medicationId').notEmpty().withMessage('Medication ID is required'),
    body('timeSlot').notEmpty().isIn(['morning', 'afternoon', 'evening']).withMessage('Time slot must be morning, afternoon, or evening')
], markMedicationTakenController);

// Update reminder settings for a medication
router.put('/update-settings', authMiddleware, [
    body('medicationId').notEmpty().withMessage('Medication ID is required'),
    body('reminderEnabled').isBoolean().withMessage('Reminder enabled must be a boolean')
], updateReminderSettingsController);

// Get notification history
router.get('/notification-history', authMiddleware, getNotificationHistoryController);

// Get reminder statistics
router.get('/stats', authMiddleware, getReminderStatsController);

// Test reminder system (for development)
router.post('/test', authMiddleware, testReminderController);

export default router;
