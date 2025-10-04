import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getUserProfileController, updateUserProfileController, updateUserProfileImageController,changePasswordController } from '../controllers/profile.controller.js';
import { body } from 'express-validator';
import upload from '../utlis/multerConfig.js';
const router = express.Router();


router.post('/getProfile',authMiddleware,getUserProfileController);

router.put('/updateProfile',authMiddleware,[
        body('fullName').optional().isString().withMessage('Full name must be a string'),
        body('email').optional().isEmail().withMessage('Email must be a valid email address'),
        body('age').optional().isNumeric().withMessage('Age must be a number')
],updateUserProfileController);

router.put('/upload-profile-image/:userId',authMiddleware,upload.single("profileImage"),updateUserProfileImageController);

router.put('/change-password',authMiddleware,[
        body('currentPassword').notEmpty().withMessage('Current password is required'),
        body('newPassword').notEmpty().withMessage('New password is required'),
],changePasswordController);



export default router;