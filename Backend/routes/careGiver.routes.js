import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { body } from 'express-validator';
import { getInviteToCareGiverController, getLinkedPatientsController, getPatientHealthRoutineController, getPatientMedicationController } from '../controllers/giveCareTaker.controller.js';
const router = express.Router();


router.post('/getInviteToCareGiver',authMiddleware,[
    body('patiendId').notEmpty().withMessage('Patient ID is required'),
],getInviteToCareGiverController);

router.post('/getLinkedPatients',authMiddleware,getLinkedPatientsController);

router.post('/getPatientHealthRoutine',authMiddleware,[
    body('patientId').notEmpty().withMessage('Patient ID is required'),
],getPatientHealthRoutineController);


router.post('/getPatientHealthRoutine',authMiddleware,[
    body('patientId').notEmpty().withMessage('Patient ID is required'),
],getPatientMedicationController);


export default router;