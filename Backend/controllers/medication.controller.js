import { addNewMedicationDao, deleteMedicationDao, getAllMedicationDao, isTakenMedicationDao, updateMedicationDao, getMedicationsWithReminderStatusDao } from "../dao/medication.dao.js";
import medicationModel from "../models/medication.model.js";
import { validationResultUtil } from "../utlis/validationResult.util.js"

export const addNewMedicationController = async (req, res) => {
    await validationResultUtil(req, res);

    try{
        const user = req.user;
        if(!user){
            return res.status(401).json({
                message: "User not found."
            });
        }

        const {name,dosage,times,frequency,startDate,endDate,instruction,reminderEnabled,medicationType} = req.body;
        console.log(req.body)
        if(!name || !times || !startDate || !endDate || !instruction || !frequency){
            return res.status(400).json({
                message: 'All fields must be required.'
            });
        }

        const savedMedication = await addNewMedicationDao(user, name, dosage, times, frequency ,startDate, endDate, instruction,reminderEnabled,medicationType);
        console.log(savedMedication);
        if(!savedMedication){
            return res.status(500).json({
                message: 'Error saving medication.'
            });
        }
        return res.status(201).json({
            message: 'Medication added successfully',
            medication: savedMedication
        });
    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

export const updateExistingMedicationController = async (req,res) =>{
    await validationResultUtil(req,res);
    
    try{
        const user = req.user;

        if(!user){
            return res.status(401).json({
                message: "User not found."
            });
        }
        const updates = req.body;

        const savedUpdatedMedication = await updateMedicationDao(user,updates);
        if(!savedUpdatedMedication){
            return res.status(500).json({
                message: 'Error updating medication.'
            });
        }
        return res.status(200).json({
            message: 'Medication updated successfully',
            medication: savedUpdatedMedication
        });
    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

export const getAllMedicationController = async (req, res) => {
    try{
        const user = req.user;

        if(!user){
            return res.status(401).json({
                message: "User not found."
            });
        }
        const medications = await getAllMedicationDao(user);
        if(!medications || medications.length === 0){
            return res.status(404).json({
                message: 'No medications found.'
            });
        }

        return res.status(200).json({
            message: 'Medications retrieved successfully',
            medications: medications
        });
    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

export const deleteMedicationController = async (req,res) => {
    try{
        const user = req.user;

        if(!user){
            return res.status(401).json({
                message: "User not found."
            });
        }

        const updatedMedication = await deleteMedicationDao(user, req.params.medicationId);
        if(!updatedMedication){
            return res.status(404).json({
                message: 'Medication not found.'
            });
        }
        console.log(updatedMedication);
        return res.status(200).json({
            message: 'Medication deleted successfully',
            medication: updatedMedication
        });
    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

export const isTakenMEdicationController = async (req,res) => {
    const user = req.user;
    if(!user){
        return res.status(401).json({
            message: "User not found."
        });
    }

    try{
        const medication = await isTakenMedicationDao(user, req.params.medicationId);
        if(!medication){
            return res.status(404).json({
                message: 'Medication not found.'
            });
        }
        return res.status(200).json({
            message: 'Medication status updated successfully',
            medication: medication
        });

    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        })
    }
}

export const getAllMedicationControllerByDate = async (req,res) => {
    const {date} = req.params;
    if(!date){
        return res.status(400).json({
            message: 'Date parameter is required'
        });
    }

    try{
        const medication  = await medicationModel.findOne({
            date: date,
            username: req.user._id
        });
        if(!medication){
            return res.status(404).json({
                message: 'No medication  found for the specified date'
            });
        }
        return res.status(200).json({
            message: 'Medication routine retrieved successfully',
            medication: medication
        });
    }catch(err){
        return res.status(500).json({
            message: 'Internal server error',
            error: err.message
        });
    }
}

// Get medications with reminder status
export const getMedicationsWithReminderStatusController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        const medications = await getMedicationsWithReminderStatusDao(user);
        
        return res.status(200).json({
            message: 'Medications with reminder status retrieved successfully',
            medications: medications
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
}