import medicationModel from "../models/medication.model.js";

export const addNewMedicationDao = async (user, name, dosage, times, frequency,startDate, endDate, instruction,reminderEnabled,medicationType) => {
    const newMedication = await new medicationModel({
        username: user._id,
        name,
        dosage,
        times,
        frequency,
        startDate,
        endDate,
        instruction,
        reminderEnabled: reminderEnabled ?? true,
        medicationType,
    })

    const savedMedication = await newMedication.save();

    return savedMedication;
}

export const updateMedicationDao = async (user, updates) => {
    const updatedMedication = await medicationModel.findOneAndUpdate(
        { username: user._id },
        { $set: updates },
        { new: true }
    )

    console.log(updatedMedication);

    const savedUpdatedMedication = await updatedMedication.save();
    return savedUpdatedMedication;
}

export const getAllMedicationDao = async (user) => {
    const medications = await medicationModel.find({username:user._id});
    if(!medications || medications.length === 0) {
        return [];
    }

    return medications;
}

export const deleteMedicationDao = async (user,medicationId) => {
    const updatedMedication = await medicationModel.findOneAndDelete({username:user._id, _id: medicationId});
    if (!updatedMedication) {
        return null;
    }
    const allUpdatedMedication = await medicationModel.find({username:user._id});

;    return allUpdatedMedication;
}

export const isTakenMedicationDao = async (user, medicationId) => {
    const medication = await medicationModel.findOne({ username: user._id, _id: medicationId });
    if (!medication) {
        return null;
    }
    medication.reminderEnabled = !medication.reminderEnabled;
    const updatedMedication = await medication.save();
    return updatedMedication;
}

// Get medications with reminder status for today
export const getMedicationsWithReminderStatusDao = async (user) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const medications = await medicationModel.find({
        username: user._id,
        reminderEnabled: true,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate }
    });

    return medications.map(medication => {
        const todaysSchedule = [];
        const times = medication.times;

        for (const [timeSlot, scheduledTime] of Object.entries(times)) {
            if (!scheduledTime) continue;

            const entry = medication.isTaken.find(item => 
                item.date === currentDate && item.time === timeSlot
            );

            todaysSchedule.push({
                timeSlot,
                scheduledTime,
                taken: entry ? entry.taken : false,
                reminderSent: entry ? entry.reminderSent : false,
                takenAt: entry ? entry.takenAt : null
            });
        }

        return {
            ...medication.toObject(),
            todaysSchedule: todaysSchedule.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
        };
    });
}

// Mark medication as taken for specific time slot
export const markMedicationTakenDao = async (user, medicationId, timeSlot) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const medication = await medicationModel.findOne({ 
        username: user._id, 
        _id: medicationId 
    });
    
    if (!medication) {
        return null;
    }

    let entry = medication.isTaken.find(item => 
        item.date === currentDate && item.time === timeSlot
    );

    if (entry) {
        entry.taken = true;
        entry.takenAt = new Date();
    } else {
        medication.isTaken.push({
            date: currentDate,
            time: timeSlot,
            taken: true,
            reminderSent: true,
            takenAt: new Date()
        });
    }

    await medication.save();
    return medication;
}

// Update reminder settings
export const updateReminderSettingsDao = async (user, medicationId, reminderEnabled) => {
    const medication = await medicationModel.findOneAndUpdate(
        { username: user._id, _id: medicationId },
        { reminderEnabled },
        { new: true }
    );
    
    return medication;
}

// Get medication adherence statistics
export const getMedicationAdherenceDao = async (user, startDate, endDate) => {
    const medications = await medicationModel.find({
        username: user._id,
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
    });

    let totalDoses = 0;
    let takenDoses = 0;
    const adherenceByMedication = [];

    medications.forEach(medication => {
        const times = medication.times;
        let medTotalDoses = 0;
        let medTakenDoses = 0;

        for (const [timeSlot, scheduledTime] of Object.entries(times)) {
            if (!scheduledTime) continue;

            // Count doses in the date range
            const start = new Date(startDate);
            const end = new Date(endDate);
            const current = new Date(start);

            while (current <= end) {
                const currentDateStr = current.toISOString().split('T')[0];
                
                // Check if medication is active on this date
                if (currentDateStr >= medication.startDate && currentDateStr <= medication.endDate) {
                    medTotalDoses++;
                    totalDoses++;

                    const entry = medication.isTaken.find(item => 
                        item.date === currentDateStr && item.time === timeSlot
                    );

                    if (entry && entry.taken) {
                        medTakenDoses++;
                        takenDoses++;
                    }
                }

                current.setDate(current.getDate() + 1);
            }
        }

        adherenceByMedication.push({
            medicationId: medication._id,
            medicationName: medication.name,
            totalDoses: medTotalDoses,
            takenDoses: medTakenDoses,
            adherenceRate: medTotalDoses > 0 ? (medTakenDoses / medTotalDoses) * 100 : 0
        });
    });

    return {
        overallAdherence: totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0,
        totalDoses,
        takenDoses,
        adherenceByMedication
    };
}