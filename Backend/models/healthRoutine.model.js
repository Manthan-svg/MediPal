import mongoose from "mongoose";

const healthRoutineSchema = new mongoose.Schema({
    waterIntake:{
        type:Number,
        required:true,
        min:[0, 'Water intake must be a positive number'],
        default: 0
    },
    exerciseDuration:{
        type:Number,
        required:true,
        min:[0, 'Exercise duration must be a positive number'],
        default: 0
    },
    sleepDuration:{
        type:Number,
        required:true,
        min:[0, 'Sleep duration must be a positive number'],
        default: 0
    },
    stepsWalked:{
        type:Number,
        required:true,
        min:[0, 'Steps walked must be a positive number'],
        default: 0
    },
    meditationDuration:{
        type:Number,
        required:true,
        min:[0, 'Meditation duration must be a positive number'],
        default: 0
    },
    username:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date:{
        type: Date,
        default: new Date().toISOString().split('T')[0] 
    },
})

const healthRoutineModel = mongoose.model('HealthRoutine', healthRoutineSchema);
export default healthRoutineModel;