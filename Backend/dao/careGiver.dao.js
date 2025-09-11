import careGiverModel from "../models/careGiver.model.js"
import healthRoutineModel from "../models/healthRoutine.model.js"
import medicationModel from "../models/medication.model.js"

export const getInviteToCareGiverDao = async (patiendId,careGiverId) => {
    const linkedCareGiver = await careGiverModel.findOne({
        careGiver:careGiverId,
        patientName:patiendId
    })
    if(linkedCareGiver){
        return res.status(400).json({
            message:'Care giver already linked'
        })
     }

     const newCareGiver = new careGiverModel({  
        careGiver:careGiverId,
        patientName:patiendId
    })
    await newCareGiver.save();
    return newCareGiver;
}

export const getLinkedPatientsDao = async (careGiverId) => {
    const allLinkedPatients = await careGiverModel.find({
        careGiver:careGiverId
    }).populate('patientName','name email');
    if(!allLinkedPatients){
        return res.status(400).json({
            message:'No patients linked'
        })
    }
    return allLinkedPatients;
}


export const getPatientHealthRoutineDao = async (patiendId) => {
    const allHealthRoutine = await healthRoutineModel.find({
        username: patiendId
    })
    if(!allHealthRoutine){
        return res.status(400).json({
            message:'No health routine found for this patient'
        })
    }
    return allHealthRoutine;
}

export const getPatientMedicationDao = async (patiendId) => {
    const allMedicationDetails = await medicationModel.find({
        username: patiendId
    })
    if(!allMedicationDetails){
        return res.status(400).json({
            message:'No health routine found for this patient'
        })
    }
    return allMedicationDetails;
}