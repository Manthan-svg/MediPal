import { reminderScheduler } from '../services/reminderScheduler.service.js';
import { getNotificationHistory } from '../services/notification.service.js';
import { validationResultUtil } from '../utlis/validationResult.util.js';

// Get today's medication schedule with reminder status
export const getTodaysScheduleController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        const schedule = await reminderScheduler.getTodaysSchedule(user._id);
        
        return res.status(200).json({
            message: 'Today\'s schedule retrieved successfully',
            schedule: schedule
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Mark medication as taken
export const markMedicationTakenController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        const { medicationId, timeSlot } = req.body;
        const currentDate = new Date().toISOString().split('T')[0];

        if (!medicationId || !timeSlot) {
            return res.status(400).json({
                message: 'Medication ID and time slot are required'
            });
        }

        const updatedMedication = await reminderScheduler.markMedicationTaken(
            medicationId, 
            currentDate, 
            timeSlot
        );

        if (!updatedMedication) {
            return res.status(404).json({
                message: 'Medication not found'
            });
        }

        return res.status(200).json({
            message: 'Medication marked as taken successfully',
            medication: updatedMedication
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update reminder settings for a medication
export const updateReminderSettingsController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        const { medicationId, reminderEnabled } = req.body;

        if (!medicationId || typeof reminderEnabled !== 'boolean') {
            return res.status(400).json({
                message: 'Medication ID and reminder enabled status are required'
            });
        }

        const updatedMedication = await reminderScheduler.updateReminderSettings(
            medicationId, 
            reminderEnabled
        );

        if (!updatedMedication) {
            return res.status(404).json({
                message: 'Medication not found'
            });
        }

        return res.status(200).json({
            message: 'Reminder settings updated successfully',
            medication: updatedMedication
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get notification history
export const getNotificationHistoryController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        const { limit = 50 } = req.query;
        const history = await getNotificationHistory(user._id, parseInt(limit));

        return res.status(200).json({
            message: 'Notification history retrieved successfully',
            notifications: history.notifications
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get reminder statistics
export const getReminderStatsController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        const schedule = await reminderScheduler.getTodaysSchedule(user._id);
        
        // Calculate statistics
        let totalReminders = 0;
        let takenReminders = 0;
        let pendingReminders = 0;

        schedule.forEach(medication => {
            medication.todaysSchedule.forEach(slot => {
                totalReminders++;
                if (slot.taken) {
                    takenReminders++;
                } else {
                    pendingReminders++;
                }
            });
        });

        const adherenceRate = totalReminders > 0 ? (takenReminders / totalReminders) * 100 : 0;

        return res.status(200).json({
            message: 'Reminder statistics retrieved successfully',
            stats: {
                totalReminders,
                takenReminders,
                pendingReminders,
                adherenceRate: Math.round(adherenceRate * 100) / 100
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Test reminder system (for development)
export const testReminderController = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "User not found."
            });
        }

        // This endpoint can be used to manually trigger reminder checks
        await reminderScheduler.checkAndSendReminders();

        return res.status(200).json({
            message: 'Reminder check completed successfully'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};
