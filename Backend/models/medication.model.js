import mongoose from "mongoose";

const medicationSechema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    dosage: {
        type: String,
    },
    times: {
        type: Object,
        required: true,
        // Expected format: { morning: "08:00", afternoon: "14:00", evening: "20:00" }
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        default: 'daily',
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    instruction: {
        type: String,
        required: true,
    },
    emergencyNo: {
        type: String,
    },
    reminderEnabled: { type: Boolean, default: true },
    isTaken: [
        {
            date: String,  
            time: String, 
            taken: Boolean,
            reminderSent: { type: Boolean, default: false },
            takenAt: { type: Date, default: null }
        }
    ],
    medicationType:{
        type: String,
        enum: ['tablet', 'capsule', 'liquid', 'injection'],
        default: 'tablet',
    },
    todayDate:{
        type: String,
        default: new Date().toISOString().split('T')[0] 
    }
})

const medicationModel = mongoose.model('Medication', medicationSechema);

export default medicationModel;