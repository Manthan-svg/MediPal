import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { body } from 'express-validator';
import { addNewMedicationController, deleteMedicationController, getAllMedicationController, getAllMedicationControllerByDate, isTakenMEdicationController, updateExistingMedicationController } from '../controllers/medication.controller.js';
const router = express.Router();

router.post('/addNewMedication',authMiddleware,[
    body('name').notEmpty().withMessage('Medication name is required'),
    body('dosage').optional().isString().withMessage('Dosage must be a string'),
    body('times').notEmpty().isObject().withMessage('Times must be an Object'),
    body('frequency').optional().isIn(['daily', 'weekly', 'monthly']).withMessage('Frequency must be daily, weekly, or monthly'),
    body('startDate').notEmpty().isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').notEmpty().isISO8601().withMessage('End date must be a valid date'),
    body('instruction').notEmpty().isString().withMessage('Instruction is required'),
    body('reminderEnabled').optional().isBoolean().withMessage('Reminder enabled must be a boolean'),
    body('medicationType').optional().isIn(['tablet', 'capsule', 'liquid', 'injection']).withMessage('Medication type must be tablet, capsule, liquid, or injection'),
],addNewMedicationController);

router.put('/updateMedication', authMiddleware, [
    body('name').optional().isString().withMessage('Medication name must be a string'),
    body('dosage').optional().isString().withMessage('Dosage must be a string'),
    body('times').optional().isArray().withMessage('Times must be an array'),
    body('startDate').optional().isISO8601().withMessage('Start date must be a valid date'),
    body('endDate').optional().isISO8601().withMessage('End date must be a valid date'),
    body('instruction').optional().isString().withMessage('Instruction must be a string'),
    body('emergencyNo').optional().isString().withMessage('Emergency number must be a string')
], updateExistingMedicationController);

router.post('/getAllMedication', authMiddleware,getAllMedicationController);


router.delete('/deleteMedication/:medicationId',authMiddleware,deleteMedicationController);

router.patch('/markAsTaken/:medicationId', authMiddleware,isTakenMEdicationController);

router.post('/getMedicationLog/:date', authMiddleware, getAllMedicationControllerByDate);

export default router;