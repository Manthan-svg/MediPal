import express from 'express';
import { body } from 'express-validator';
import { userRegistrationController , userLoginController } from '../controllers/user.controller.js';
const router = express.Router();

router.post('/register',[
    body('fullName').isEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
],userRegistrationController)

router.post('/login',[
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
],userLoginController)




export default router;