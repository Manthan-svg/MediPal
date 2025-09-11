import healthRoutineModel from "../models/healthRoutine.model.js";
import medicationModel from "../models/medication.model.js";
import userModel from "../models/user.model.js";

export const getTodayHealthDashboardController = async (req, res) => {
    const {userId} = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    }
    const todayDate = new Date().toISOString().split('T')[0];

    const takenMedication  = await medicationModel.find({
        username:user._id,
        todayDate: todayDate,
    })
    if (!takenMedication) {
        return res.status(404).json({
            message: 'No medication taken today'
        });
    }

    //Now for health Rotuines

    const todayHealthRoutine = await healthRoutineModel.findOne({
        username: user._id,
        date: todayDate
    });
    if (!todayHealthRoutine) {
        return res.status(404).json({
            message: 'No health routine found for today'
        });
    }

    return res.status(200).json({
        message: 'Today\'s health dashboard retrieved successfully',
        dashBoardData : {
            date: todayDate,
            todayMedications: takenMedication,
            todayHealthRoutine: todayHealthRoutine ,
            message: "You're doing great! Keep going 💪"
        }
    })
}