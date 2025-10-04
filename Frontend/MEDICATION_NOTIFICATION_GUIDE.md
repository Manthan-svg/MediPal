# Medication Notification System Guide

This guide explains the comprehensive medication notification system implemented in MediPal. The system provides real-time toast notifications for medication reminders based on scheduled times and date ranges.

## Features

- **Real-time Notifications**: Toast notifications appear at scheduled medication times
- **Time-based Scheduling**: Supports morning, afternoon, and evening medication times
- **Date Range Validation**: Notifications only appear within medication start/end dates
- **Smart Rescheduling**: Automatically reschedules notifications for the next day
- **Visual Indicators**: Shows notification status on medication cards
- **Management Panel**: Complete notification management interface
- **Test Functionality**: Test notifications before scheduling
- **Persistent Service**: Runs continuously in the background

## How It Works

### 1. Notification Service

The system uses a singleton `NotificationService` that runs continuously:

```javascript
import notificationService from '../services/NotificationService'

// The service automatically starts when imported
// It checks for notifications every minute
```

### 2. Medication Time Format

Medications use the following time format:
- **Morning**: "9:00" (24-hour format)
- **Afternoon**: "12:00" (24-hour format)  
- **Evening**: "21:00" (24-hour format)

### 3. Date Range Validation

Notifications only trigger when:
- Current date >= medication start date
- Current date <= medication end date
- Medication is active (`isActive: true`)
- Reminders are enabled (`reminderEnabled: true`)

## Usage Examples

### Basic Notification Setup

```javascript
// When adding a new medication
const medication = {
  name: "Aspirin",
  dosage: "100mg",
  times: {
    morning: "9:00",
    afternoon: "15:00",
    evening: "21:00"
  },
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  reminderEnabled: true,
  isActive: true
};

// Schedule notifications
notificationService.scheduleMedicationNotifications(medication);
```

### Notification Management

```javascript
// Update notifications for a medication
notificationService.updateMedicationNotifications(medication);

// Cancel notifications for a medication
notificationService.cancelMedicationNotifications(medicationId);

// Clear all notifications
notificationService.clearAllNotifications();

// Get notification status
const status = notificationService.getNotificationStatus(medication);
```

### Notification Status Object

```javascript
{
  isActive: true,                    // Whether notifications are active
  nextNotification: {                // Next scheduled notification
    time: Date,                      // Next notification time
    timeOfDay: "morning",           // Time of day
    timeString: "9:00",             // Time string
    formattedTime: "9:00 AM"        // Formatted time
  },
  scheduledCount: 3                 // Number of scheduled notifications
}
```

## User Interface

### Notification Bell

- **Location**: Top-right header
- **Badge**: Shows number of scheduled notifications
- **Animation**: Pulsing animation when notifications are active
- **Click**: Opens notification management panel

### Notification Panel

- **Active Notifications**: Count of medications with active notifications
- **Scheduled Today**: Number of notifications scheduled for today
- **Total Medications**: Total number of medications
- **Medication List**: Shows each medication with next notification time
- **Controls**: Refresh, Clear All, Close buttons

### Medication Cards

- **Notification Status**: Shows "Notifications On" with bell icon
- **Next Notification**: Displays next scheduled time
- **Visual Indicators**: Green bell icon for active notifications

### Add Medication Modal

- **Reminder Toggle**: Enable/disable notifications
- **Test Button**: Test notification appearance
- **Time Inputs**: Morning, Afternoon, Evening times
- **Date Range**: Start and end dates for notifications

## Notification Toast Format

```javascript
// Toast notification structure
{
  title: "🌅 Time to take your medication!",
  message: "Aspirin (100mg)\nMorning - 9:00",
  duration: 10000, // 10 seconds
  position: "top-center",
  style: {
    background: '#3B82F6',
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    padding: '16px',
    borderRadius: '12px'
  }
}
```

## Time Format Examples

### Valid Time Formats
- "9:00" → 9:00 AM
- "15:30" → 3:30 PM
- "21:00" → 9:00 PM
- "00:00" → 12:00 AM (midnight)

### Invalid Time Formats
- "9" → Invalid (missing minutes)
- "25:00" → Invalid (hour > 23)
- "9:60" → Invalid (minutes > 59)
- "abc" → Invalid (not a number)

## API Integration

### Backend Endpoints

```javascript
// Update reminder settings
PUT /reminders/update-settings
{
  medicationId: "medication_id",
  reminderEnabled: true
}

// Get all medications
POST /medication/getAllMedication

// Add new medication
POST /medication/addNewMedication

// Delete medication
DELETE /medication/deleteMedication/:id
```

### Local Storage

```javascript
// Medications are stored in localStorage
localStorage.setItem('All-Medications', JSON.stringify(medications));

// Notification service uses in-memory storage
// Notifications are not persisted across page reloads
```

## Error Handling

### Common Issues

1. **Invalid Time Format**
   - Solution: Use "HH:MM" format (24-hour)
   - Example: "9:00", "15:30", "21:00"

2. **Date Range Issues**
   - Solution: Ensure start date <= end date
   - Check date format: "YYYY-MM-DD"

3. **Notifications Not Triggering**
   - Check: Medication is active
   - Check: Reminders are enabled
   - Check: Current date is within range
   - Check: Time format is correct

4. **Service Not Running**
   - Solution: Service starts automatically
   - Check: Browser console for errors
   - Refresh: Page to restart service

## Performance Considerations

### Memory Usage
- Notifications are stored in memory
- Service checks every minute
- Automatic cleanup of expired notifications

### CPU Usage
- Minimal impact with 1-minute intervals
- Efficient date/time calculations
- Smart rescheduling to avoid duplicates

### Browser Compatibility
- Works in all modern browsers
- Uses standard JavaScript APIs
- No external dependencies for core functionality

## Testing

### Manual Testing

1. **Add Medication**
   - Set times: "9:00", "15:00", "21:00"
   - Enable reminders
   - Set date range
   - Click "Test" button

2. **Check Notifications**
   - Wait for scheduled time
   - Verify toast appears
   - Check notification panel

3. **Test Edge Cases**
   - Past dates (no notifications)
   - Future dates (scheduled correctly)
   - Disabled reminders (no notifications)

### Automated Testing

```javascript
// Test notification scheduling
const medication = {
  name: "Test Medication",
  times: { morning: "9:00" },
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  reminderEnabled: true,
  isActive: true
};

notificationService.scheduleMedicationNotifications(medication);
const status = notificationService.getNotificationStatus(medication);
console.assert(status.isActive === true);
```

## Troubleshooting

### Notifications Not Appearing

1. Check browser console for errors
2. Verify medication settings:
   - `reminderEnabled: true`
   - `isActive: true`
   - Valid date range
   - Correct time format
3. Check notification service status
4. Refresh page to restart service

### Incorrect Timing

1. Verify time format: "HH:MM"
2. Check timezone settings
3. Ensure system clock is correct
4. Check for daylight saving time issues

### Performance Issues

1. Check number of scheduled notifications
2. Clear all notifications if needed
3. Restart browser if memory usage is high
4. Check for infinite loops in console

## Future Enhancements

- **Sound Notifications**: Audio alerts for notifications
- **Push Notifications**: Browser push notifications
- **Snooze Functionality**: Delay notifications
- **Custom Notification Times**: User-defined intervals
- **Notification History**: Track past notifications
- **Mobile App Integration**: Native mobile notifications
- **Email Notifications**: Backup notification method
- **SMS Notifications**: Text message alerts

## Security Considerations

- Notifications are client-side only
- No sensitive data in notifications
- Service runs in browser context
- No external API calls for notifications
- Local storage for medication data

## Accessibility

- Screen reader compatible
- Keyboard navigation support
- High contrast notifications
- Clear visual indicators
- Descriptive text and labels

This notification system provides a robust, user-friendly way to manage medication reminders with real-time feedback and comprehensive management tools.
