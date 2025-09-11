import { createNewHealthRoutineDao, getHistoryHealthRoutineDao, updateHealthRoutineDao } from "../dao/health.dao.js";
import healthRoutineModel from "../models/healthRoutine.model.js";

export const createHealthRoutineController = async (req,res) => {
    const  user  = req.user;
    if(!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    const todayDate = new Date().toISOString().split('T')[0];

    const { waterIntake, exerciseDuration, sleepDuration, stepsWalked, meditationDuration } = req.body;
    
    try {
        const savedRoutine = await createNewHealthRoutineDao(
            user,
            waterIntake,
            exerciseDuration,
            sleepDuration,
            stepsWalked,
            meditationDuration,
            todayDate
        )

        return res.status(201).json({
            message: 'Health routine created successfully',
            routine: savedRoutine
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }


}

export const updateExistingHealthRoutineController = async (req, res) => {
    const user = req.user;

    if(!user){
        return res.status(401).json({
            messsage:"User not found.."
        })
    }
    const todayDate = new Date().toISOString().split('T')[0];

    const updates= req.body;
    try {
        const updatedRoutine = await updateHealthRoutineDao(
            user,
             updates,
            todayDate
        ) ;
        return res.status(200).json({
            message: 'Health routine updated successfully',
            routine: updatedRoutine
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

export const getHistoryHealthRoutineController = async (req,res) => {
    const  user  = req.user;
    if(!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    try {
        const history = await getHistoryHealthRoutineDao(user);
        return res.status(200).json({
            message: 'Health routine history retrieved successfully',
            history:history
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

export const getHealthLogController = async (req,res) => {
    const {date} = req.params;
    if(!date){
        return res.status(400).json({
            message: 'Date parameter is required'
        });
    }

    try{
        const healthRoutine  = await healthRoutineModel.findOne({
            date: date,
            username: req.user._id
        });
        if(!healthRoutine){
            return res.status(404).json({
                message: 'No health routine found for the specified date'
            });
        }
        return res.status(200).json({
            message: 'Health routine retrieved successfully',
            healthRoutine: healthRoutine
        });
    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }

}

