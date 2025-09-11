import { getInviteToCareGiverDao } from "../dao/careGiver.dao.js";
import { validationResultUtil } from "../utlis/validationResult.util.js"

export const getInviteToCareGiverController = async (req,res) => {
    await validationResultUtil(req,res);

    try{
        const patiendId = req.body.patiendId;
        const careGiver = req.user;

        if(!patiendId || !careGiver){
            return res.status(400).json({
                message:'Invalid request'
            })
        }
       const newCareGiver = await getInviteToCareGiverDao(patiendId,careGiver._id);
        return res.status(200).json({
            message:'Care giver linked successfully',
            careGiver:newCareGiver
        })

    }catch(err){
        return res.status(500).json({
            message:'Internal server error',
            error:err.message
        })
    }
}

export const getLinkedPatientsController = async (req,res) => {
    try{
        const caregiver = req.user; 

        const allLinkedPatients = await getLinkedPatientsController(caregiver._id);
        return res.status(200).json({
            message:'All linked patients',
            patients:allLinkedPatients
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error',
            error:err.message
        })
    }
}

export const getPatientHealthRoutineController = async (req,res) => {
    try{
        const careTaker = req.user;
        const patiendId = req.body.patiendId;

        const allHealthRoutine = await getPatientHealthRoutineController(patiendId);

        return res.status(200).json({
            message:'All health routine for this patient',
            healthRoutine:allHealthRoutine
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error',
            error:err.message
        })
    }
}


export const getPatientMedicationController = async (req,res) => {
    try{
        const careTaker = req.user;
        const patiendId = req.body.patiendId;

        const allMedicationDetails = await getPatientMedicationController(patiendId);

        return res.status(200).json({
            message:'All medication details for this patient',
            healthRoutine:allMedicationDetails
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error',
            error:err.message
        })
    }
}