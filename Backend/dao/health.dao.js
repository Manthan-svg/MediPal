import healthRoutineModel from "../models/healthRoutine.model.js";

export const createNewHealthRoutineDao = async (user, waterIntake, exerciseDuration, sleepDuration, stepsWalked, meditationDuration,todayDate) => {
    const existingRoutine = await healthRoutineModel.findOne({ username: user._id, date: todayDate });
    if (existingRoutine) {
        return null;
    }
    if (!waterIntake  || !exerciseDuration  || !sleepDuration  || !stepsWalked || !meditationDuration ) {
        return res.status(400).json({
            message: 'All fields must be required.'
        });
    }
    const newHealthRoutine = new healthRoutineModel({
        waterIntake,
        exerciseDuration,
        sleepDuration,
        stepsWalked,
        meditationDuration,
        username: user._id,
        date: todayDate
    }); 

    const savedRoutine = await newHealthRoutine.save();
    if (!savedRoutine) {
        throw new Error('Error saving health routine');
    }
    return savedRoutine;
}

export const updateHealthRoutineDao = async (user, updates, todayDate) => {
    const existingRoutine = await healthRoutineModel.findOneAndUpdate(
        { username: user._id, date: todayDate },
        { $set: updates },
        { new: true }
    );

    const updatedRoutine = await existingRoutine.save();
    if (!updatedRoutine) {
        throw new Error('Error updating health routine');
    }
    return updatedRoutine;
}

export const getHistoryHealthRoutineDao = async (user) => {
    const history = await healthRoutineModel.find({ username: user._id }).sort({ date: -1 });
    if (!history || history.length === 0) {
        return res.status(404).json({
            message: 'No health routine history found'
        });
    }

    return history;

}