import { toast } from 'react-toastify';

class NotificationService {
  constructor() {
    this.scheduledNotifications = new Map();
    this.intervalId = null;
    this.isRunning = false;
    this.medications = [];
    this.startService();
    this.loadFromStorage();
  }

  // Start the notification service
  startService() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    // Check every 30 seconds for notifications (more frequent for testing)
    this.intervalId = setInterval(() => {
      this.checkScheduledNotifications();
    }, 30000); // Check every 30 seconds

    console.log('Medication notification service started');
  }

  // Load medications from localStorage and reschedule notifications
  loadFromStorage() {
    try {
      const savedMedications = localStorage.getItem('All-Medications');
      if (savedMedications) {
        this.medications = JSON.parse(savedMedications);
        console.log('Loaded medications from storage:', this.medications.length);
        
        // Reschedule notifications for all medications
        this.medications.forEach(medication => {
          this.scheduleMedicationNotifications(medication);
        });
      }
    } catch (error) {
      console.error('Error loading medications from storage:', error);
    }
  }

  // Update medications and reschedule notifications
  updateMedications(medications) {
    this.medications = medications;
    this.scheduledNotifications.clear();
    
    // Reschedule all notifications
    medications.forEach(medication => {
      this.scheduleMedicationNotifications(medication);
    });
    
    console.log('Updated medications and rescheduled notifications:', medications.length);
  }

  // Stop the notification service
  stopService() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    this.scheduledNotifications.clear();
    console.log('Medication notification service stopped');
  }

  // Schedule notifications for a medication
  scheduleMedicationNotifications(medication) {
    if (!medication.reminderEnabled || !medication.isActive) {
      this.cancelMedicationNotifications(medication._id);
      return;
    }

    const today = new Date();
    const startDate = new Date(medication.startDate);
    const endDate = new Date(medication.endDate);

    // Check if medication is within date range
    if (today < startDate || today > endDate) {
      this.cancelMedicationNotifications(medication._id);
      return;
    }

    const times = medication.times;
    const medicationId = medication._id;

    // Cancel existing notifications for this medication
    this.cancelMedicationNotifications(medicationId);

    // Schedule morning notification
    if (times.morning) {
      this.scheduleNotification(medicationId, 'morning', times.morning, medication);
    }

    // Schedule afternoon notification
    if (times.afternoon) {
      this.scheduleNotification(medicationId, 'afternoon', times.afternoon, medication);
    }

    // Schedule evening notification
    if (times.evening) {
      this.scheduleNotification(medicationId, 'evening', times.evening, medication);
    }
  }

  // Schedule a single notification
  scheduleNotification(medicationId, timeOfDay, timeString, medication) {
    if (!timeString || timeString.trim() === '') {
      console.log(`No time specified for ${timeOfDay} notification for ${medication.name}`);
      return;
    }

    const today = new Date();
    const timeParts = timeString.split(':');
    
    if (timeParts.length !== 2) {
      console.error(`Invalid time format: ${timeString}. Expected format: HH:MM`);
      return;
    }

    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error(`Invalid time values: ${timeString}. Hours: ${hours}, Minutes: ${minutes}`);
      return;
    }
    
    // Create notification time for today
    const notificationTime = new Date(today);
    notificationTime.setHours(hours, minutes, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (notificationTime <= today) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const notificationId = `${medicationId}_${timeOfDay}_${notificationTime.getTime()}`;
    
    this.scheduledNotifications.set(notificationId, {
      medicationId,
      timeOfDay,
      medication,
      scheduledTime: notificationTime,
      timeString
    });

    console.log(`Scheduled ${timeOfDay} notification for ${medication.name} at ${timeString} (${notificationTime.toLocaleString()})`);
  }

  // Check for notifications that should be triggered
  checkScheduledNotifications() {
    const now = new Date();
    const notificationsToTrigger = [];

    console.log(`Checking notifications at ${now.toLocaleTimeString()}. Total scheduled: ${this.scheduledNotifications.size}`);

    for (const [notificationId, notification] of this.scheduledNotifications) {
      const timeDiff = notification.scheduledTime - now;
      const timeDiffMinutes = Math.round(timeDiff / 60000);
      
      console.log(`Notification ${notificationId}: scheduled for ${notification.scheduledTime.toLocaleTimeString()}, diff: ${timeDiffMinutes} minutes`);
      
      // Trigger notification if it's time (within 1 minute tolerance)
      if (timeDiff <= 60000 && timeDiff >= -60000) {
        console.log(`Triggering notification for ${notification.medication.name} at ${notification.timeOfDay}`);
        notificationsToTrigger.push(notification);
        this.scheduledNotifications.delete(notificationId);
      }
    }

    // Trigger notifications
    notificationsToTrigger.forEach(notification => {
      this.triggerNotification(notification);
    });

    // Reschedule for next day if needed
    this.rescheduleDailyNotifications();
  }

  // Trigger a notification
  triggerNotification(notification) {
    const { medication, timeOfDay, timeString } = notification;
    
    // Check if medication is still active and within date range
    if (!this.isMedicationActive(medication)) {
      return;
    }

    const timeOfDayEmoji = {
      morning: '🌅',
      afternoon: '🌞',
      evening: '🌆'
    };

    const timeOfDayText = {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening'
    };

    toast.info(
      `${timeOfDayEmoji[timeOfDay]} Time to take your medication!\n\n${medication.name} (${medication.dosage})\n${timeOfDayText[timeOfDay]} - ${timeString}`,
      {
        position: "top-center",
        autoClose: 10000, // 10 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: '#3B82F6',
          color: 'white',
          fontSize: '16px',
          fontWeight: '500',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        },
        className: 'medication-notification-toast'
      }
    );

    console.log(`Triggered ${timeOfDay} notification for ${medication.name}`);
  }

  // Check if medication is still active and within date range
  isMedicationActive(medication) {
    const today = new Date();
    const startDate = new Date(medication.startDate);
    const endDate = new Date(medication.endDate);

    return medication.isActive && 
           medication.reminderEnabled && 
           today >= startDate && 
           today <= endDate;
  }

  // Reschedule daily notifications
  rescheduleDailyNotifications() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // Reschedule notifications for tomorrow
    for (const [notificationId, notification] of this.scheduledNotifications) {
      const tomorrowNotification = new Date(tomorrow);
      const [hours, minutes] = notification.timeString.split(':').map(Number);
      tomorrowNotification.setHours(hours, minutes, 0, 0);

      const newNotificationId = `${notification.medicationId}_${notification.timeOfDay}_${tomorrowNotification.getTime()}`;
      
      this.scheduledNotifications.set(newNotificationId, {
        ...notification,
        scheduledTime: tomorrowNotification
      });
      
      this.scheduledNotifications.delete(notificationId);
    }
  }

  // Cancel all notifications for a specific medication
  cancelMedicationNotifications(medicationId) {
    for (const [notificationId, notification] of this.scheduledNotifications) {
      if (notification.medicationId === medicationId) {
        this.scheduledNotifications.delete(notificationId);
      }
    }
    console.log(`Cancelled all notifications for medication ${medicationId}`);
  }

  // Update notifications for a medication
  updateMedicationNotifications(medication) {
    this.scheduleMedicationNotifications(medication);
  }

  // Get all scheduled notifications
  getScheduledNotifications() {
    return Array.from(this.scheduledNotifications.values());
  }

  // Get notifications for a specific medication
  getMedicationNotifications(medicationId) {
    return Array.from(this.scheduledNotifications.values())
      .filter(notification => notification.medicationId === medicationId);
  }

  // Clear all notifications
  clearAllNotifications() {
    this.scheduledNotifications.clear();
    console.log('Cleared all scheduled notifications');
  }

  // Get next notification time for a medication
  getNextNotificationTime(medication) {
    if (!medication.reminderEnabled || !medication.isActive) {
      return null;
    }

    const now = new Date();
    const times = medication.times;
    const nextTimes = [];

    // Check all times for today and tomorrow
    ['morning', 'afternoon', 'evening'].forEach(timeOfDay => {
      if (times[timeOfDay]) {
        const [hours, minutes] = times[timeOfDay].split(':').map(Number);
        
        // Today's time
        const todayTime = new Date(now);
        todayTime.setHours(hours, minutes, 0, 0);
        
        // Tomorrow's time
        const tomorrowTime = new Date(todayTime);
        tomorrowTime.setDate(tomorrowTime.getDate() + 1);

        if (todayTime > now) {
          nextTimes.push({ time: todayTime, timeOfDay, timeString: times[timeOfDay] });
        } else {
          nextTimes.push({ time: tomorrowTime, timeOfDay, timeString: times[timeOfDay] });
        }
      }
    });

    // Return the earliest time
    if (nextTimes.length > 0) {
      nextTimes.sort((a, b) => a.time - b.time);
      return nextTimes[0];
    }

    return null;
  }

  // Format time for display
  formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Get notification status for a medication
  getNotificationStatus(medication) {
    const isActive = this.isMedicationActive(medication);
    const nextNotification = this.getNextNotificationTime(medication);
    
    return {
      isActive,
      nextNotification: nextNotification ? {
        time: nextNotification.time,
        timeOfDay: nextNotification.timeOfDay,
        timeString: nextNotification.timeString,
        formattedTime: this.formatTime(nextNotification.time)
      } : null,
      scheduledCount: this.getMedicationNotifications(medication._id).length
    };
  }

  // Test notification immediately
  testNotification(medication) {
    const timeOfDayEmoji = {
      morning: '🌅',
      afternoon: '🌞',
      evening: '🌆'
    };

    const timeOfDayText = {
      morning: 'Morning',
      afternoon: 'Afternoon',
      evening: 'Evening'
    };

    // Find the next scheduled time
    const times = medication.times;
    let testTime = null;
    let testTimeOfDay = 'morning';

    if (times.morning) {
      testTime = times.morning;
      testTimeOfDay = 'morning';
    } else if (times.afternoon) {
      testTime = times.afternoon;
      testTimeOfDay = 'afternoon';
    } else if (times.evening) {
      testTime = times.evening;
      testTimeOfDay = 'evening';
    }

    if (testTime) {
      toast.info(
        `${timeOfDayEmoji[testTimeOfDay]} Test notification!\n\n${medication.name} (${medication.dosage})\n${timeOfDayText[testTimeOfDay]} - ${testTime}`,
        {
          position: "top-center",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            background: '#3B82F6',
            color: 'white',
            fontSize: '16px',
            fontWeight: '500',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          },
          className: 'medication-notification-toast'
        }
      );
    }
  }

  // Force check notifications (for testing)
  forceCheckNotifications() {
    console.log('Force checking notifications...');
    this.checkScheduledNotifications();
  }

  // Create a test notification that triggers in 5 seconds
  createTestNotification(medication) {
    const testTime = new Date();
    testTime.setSeconds(testTime.getSeconds() + 5); // 5 seconds from now

    const notificationId = `test_${medication._id}_${Date.now()}`;
    
    this.scheduledNotifications.set(notificationId, {
      medicationId: medication._id,
      timeOfDay: 'test',
      medication,
      scheduledTime: testTime,
      timeString: 'test'
    });

    console.log(`Created test notification for ${medication.name} in 5 seconds`);
  }

  // Get debug information
  getDebugInfo() {
    return {
      isRunning: this.isRunning,
      scheduledCount: this.scheduledNotifications.size,
      medicationsCount: this.medications.length,
      scheduledNotifications: Array.from(this.scheduledNotifications.values()).map(n => ({
        medication: n.medication.name,
        timeOfDay: n.timeOfDay,
        scheduledTime: n.scheduledTime.toLocaleString(),
        timeString: n.timeString
      }))
    };
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
