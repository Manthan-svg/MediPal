import mongoose from 'mongoose';

const careGiverSchema = new mongoose.Schema({
    careGiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    patientName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    accessGranted:{
        type:Date,
        default: new Date().toISOString().split('T')[0] 
    }
})

const careGiverModel = mongoose.model('CareGiver',careGiverSchema);

export default careGiverModel;