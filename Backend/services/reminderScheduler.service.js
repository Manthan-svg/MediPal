import cron from 'node-cron';
import medicationModel from '../models/medication.model.js';
import { sendReminderNotification } from './notification.service.js';

class ReminderScheduler {
    constructor() {
        this.activeReminders = new Map(); // Store active cron jobs
        this.initializeScheduler();
    }

    // Initialize the scheduler to check for medications every minute
    initializeScheduler() {
        // Run every minute to check for due medications
        cron.schedule('* * * * *', async () => {
            await this.checkAndSendReminders();
        });
        
        console.log('Reminder scheduler initialized');
    }

    // Check all active medications and send reminders
    async checkAndSendReminders() {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toTimeString().split(' ')[0].substring(0, 5); // HH:MM format

            // Find all medications that are active and have reminders enabled
            const medications = await medicationModel.find({
                reminderEnabled: true,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate }
            });

            for (const medication of medications) {
                await this.processMedicationReminders(medication, currentDate, currentTime);
            }
        } catch (error) {
            console.error('Error checking reminders:', error);
        }
    }

    // Process reminders for a specific medication
    async processMedicationReminders(medication, currentDate, currentTime) {
        const times = medication.times;
        
        // Check each time slot (morning, afternoon, evening)
        for (const [timeSlot, scheduledTime] of Object.entries(times)) {
            if (!scheduledTime) continue;

            // Check if it's time for this medication
            if (this.isTimeForMedication(scheduledTime, currentTime)) {
                // Check if already taken today
                const alreadyTaken = medication.isTaken.some(entry => 
                    entry.date === currentDate && 
                    entry.time === timeSlot && 
                    entry.taken === true
                );

                // Check if reminder already sent
                const reminderSent = medication.isTaken.some(entry => 
                    entry.date === currentDate && 
                    entry.time === timeSlot && 
                    entry.reminderSent === true
                );

                if (!alreadyTaken && !reminderSent) {
                    await this.sendMedicationReminder(medication, timeSlot, scheduledTime);
                    await this.markReminderSent(medication._id, currentDate, timeSlot);
                }
            }
        }
    }

    // Check if current time matches medication time (with 1-minute tolerance)
    isTimeForMedication(scheduledTime, currentTime) {
        const scheduled = new Date(`2000-01-01T${scheduledTime}:00`);
        const current = new Date(`2000-01-01T${currentTime}:00`);
        const diffMinutes = Math.abs(current - scheduled) / (1000 * 60);
        
        return diffMinutes <= 1; // 1-minute tolerance
    }

    // Send reminder notification
    async sendMedicationReminder(medication, timeSlot, scheduledTime) {
        try {
            const reminderData = {
                medicationId: medication._id,
                medicationName: medication.name,
                dosage: medication.dosage,
                timeSlot: timeSlot,
                scheduledTime: scheduledTime,
                instruction: medication.instruction,
                medicationType: medication.medicationType,
                userId: medication.username
            };

            await sendReminderNotification(reminderData);
            console.log(`Reminder sent for ${medication.name} at ${timeSlot} (${scheduledTime})`);
        } catch (error) {
            console.error(`Error sending reminder for ${medication.name}:`, error);
        }
    }

    // Mark reminder as sent
    async markReminderSent(medicationId, date, timeSlot) {
        try {
            const medication = await medicationModel.findById(medicationId);
            if (!medication) return;

            // Find existing entry or create new one
            let entry = medication.isTaken.find(item => 
                item.date === date && item.time === timeSlot
            );

            if (entry) {
                entry.reminderSent = true;
            } else {
                medication.isTaken.push({
                    date: date,
                    time: timeSlot,
                    taken: false,
                    reminderSent: true,
                    takenAt: null
                });
            }

            await medication.save();
        } catch (error) {
            console.error('Error marking reminder as sent:', error);
        }
    }

    // Mark medication as taken
    async markMedicationTaken(medicationId, date, timeSlot) {
        try {
            const medication = await medicationModel.findById(medicationId);
            if (!medication) return null;

            let entry = medication.isTaken.find(item => 
                item.date === date && item.time === timeSlot
            );

            if (entry) {
                entry.taken = true;
                entry.takenAt = new Date();
            } else {
                medication.isTaken.push({
                    date: date,
                    time: timeSlot,
                    taken: true,
                    reminderSent: true,
                    takenAt: new Date()
                });
            }

            await medication.save();
            return medication;
        } catch (error) {
            console.error('Error marking medication as taken:', error);
            return null;
        }
    }

    // Get today's medication schedule for a user
    async getTodaysSchedule(userId) {
        try {
            const currentDate = new Date().toISOString().split('T')[0];
            
            const medications = await medicationModel.find({
                username: userId,
                reminderEnabled: true,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate }
            });

            return medications.map(med => ({
                ...med.toObject(),
                todaysSchedule: this.generateTodaysSchedule(med, currentDate)
            }));
        } catch (error) {
            console.error('Error getting today\'s schedule:', error);
            return [];
        }
    }

    // Generate today's schedule for a medication
    generateTodaysSchedule(medication, date) {
        const schedule = [];
        const times = medication.times;

        for (const [timeSlot, scheduledTime] of Object.entries(times)) {
            if (!scheduledTime) continue;

            const entry = medication.isTaken.find(item => 
                item.date === date && item.time === timeSlot
            );

            schedule.push({
                timeSlot,
                scheduledTime,
                taken: entry ? entry.taken : false,
                reminderSent: entry ? entry.reminderSent : false,
                takenAt: entry ? entry.takenAt : null
            });
        }

        return schedule.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    }

    // Update reminder settings for a medication
    async updateReminderSettings(medicationId, reminderEnabled) {
        try {
            const medication = await medicationModel.findByIdAndUpdate(
                medicationId,
                { reminderEnabled },
                { new: true }
            );
            return medication;
        } catch (error) {
            console.error('Error updating reminder settings:', error);
            return null;
        }
    }
}

// Export singleton instance
export const reminderScheduler = new ReminderScheduler();
export default reminderScheduler;
