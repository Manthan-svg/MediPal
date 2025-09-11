# MediPal Reminder System Guide

## Overview
The MediPal Reminder System is a comprehensive medication reminder solution that automatically sends notifications to users based on their medication schedules. The system supports multiple time slots (morning, afternoon, evening) and provides detailed tracking of medication adherence.

## Features

### 🕐 Automatic Reminders
- **Cron-based Scheduling**: Runs every minute to check for due medications
- **Time-based Triggers**: Sends reminders at scheduled times (morning, afternoon, evening)
- **Smart Detection**: Only sends reminders for active medications within their date range
- **Duplicate Prevention**: Prevents multiple reminders for the same medication slot

### 📊 Comprehensive Tracking
- **Adherence Statistics**: Track medication adherence rates
- **Real-time Status**: See which medications have been taken, pending, or had reminders sent
- **Historical Data**: View medication history and adherence patterns
- **Visual Indicators**: Color-coded status indicators for easy understanding

### 🔧 Flexible Configuration
- **Per-Medication Settings**: Enable/disable reminders for individual medications
- **Time Slot Management**: Configure different times for morning, afternoon, and evening doses
- **Date Range Support**: Set start and end dates for medication courses
- **Multiple Medication Types**: Support for tablets, capsules, liquids, and injections

## Architecture

### Backend Components

#### 1. Reminder Scheduler Service (`services/reminderScheduler.service.js`)
- **Purpose**: Core scheduling engine that manages medication reminders
- **Key Features**:
  - Cron job that runs every minute
  - Processes all active medications
  - Sends notifications at scheduled times
  - Tracks reminder status and medication adherence

#### 2. Notification Service (`services/notification.service.js`)
- **Purpose**: Handles delivery of reminder notifications
- **Current Implementation**: Console logging (ready for email, SMS, push notifications)
- **Extensible**: Easy to add new notification channels

#### 3. Reminder Controller (`controllers/reminder.controller.js`)
- **Purpose**: API endpoints for reminder management
- **Endpoints**:
  - `GET /reminders/todays-schedule` - Get today's medication schedule
  - `POST /reminders/mark-taken` - Mark medication as taken
  - `PUT /reminders/update-settings` - Update reminder settings
  - `GET /reminders/stats` - Get adherence statistics
  - `GET /reminders/notification-history` - Get notification history

#### 4. Updated Medication Model
- **Enhanced Fields**:
  - `reminderEnabled`: Boolean flag for reminder status
  - `isTaken`: Array with detailed tracking including `reminderSent` and `takenAt`
  - `times`: Object with morning, afternoon, evening time slots

### Frontend Components

#### 1. ReminderComponent (`components/ReminderComponent.jsx`)
- **Purpose**: Main interface for managing medication reminders
- **Features**:
  - Today's medication schedule with status indicators
  - Adherence statistics dashboard
  - Time slot filtering (morning, afternoon, evening)
  - Mark medications as taken
  - Toggle reminder settings

#### 2. Enhanced MedicationComponent
- **New Features**:
  - Clickable reminder toggle buttons
  - Visual reminder status indicators
  - Integration with reminder system

## API Endpoints

### Reminder Management

#### Get Today's Schedule
```http
GET /reminders/todays-schedule
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Today's schedule retrieved successfully",
  "schedule": [
    {
      "_id": "medication_id",
      "name": "Medication Name",
      "dosage": "10mg",
      "times": {
        "morning": "08:00",
        "afternoon": "14:00",
        "evening": "20:00"
      },
      "todaysSchedule": [
        {
          "timeSlot": "morning",
          "scheduledTime": "08:00",
          "taken": false,
          "reminderSent": true,
          "takenAt": null
        }
      ]
    }
  ]
}
```

#### Mark Medication as Taken
```http
POST /reminders/mark-taken
Authorization: Bearer <token>
Content-Type: application/json

{
  "medicationId": "medication_id",
  "timeSlot": "morning"
}
```

#### Update Reminder Settings
```http
PUT /reminders/update-settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "medicationId": "medication_id",
  "reminderEnabled": true
}
```

#### Get Adherence Statistics
```http
GET /reminders/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Reminder statistics retrieved successfully",
  "stats": {
    "totalReminders": 12,
    "takenReminders": 10,
    "pendingReminders": 2,
    "adherenceRate": 83.33
  }
}
```

## Usage Instructions

### 1. Setting Up Medications with Reminders

When adding a new medication, ensure the `times` object follows this format:
```javascript
{
  "times": {
    "morning": "08:00",
    "afternoon": "14:00", 
    "evening": "20:00"
  },
  "reminderEnabled": true,
  "startDate": "2024-01-01",
  "endDate": "2024-12-31"
}
```

### 2. Time Format
- Use 24-hour format (HH:MM)
- Examples: "08:00", "14:30", "20:15"
- Leave empty string "" for time slots not needed

### 3. Frontend Integration

#### Adding to Navigation
The ReminderComponent is already integrated into the main navigation. Users can access it via the "Reminders" tab in the sidebar.

#### Using the Reminder Interface
1. **View Today's Schedule**: See all medications scheduled for today
2. **Filter by Time Slot**: Use the filter buttons to view specific time periods
3. **Mark as Taken**: Click "Mark as Taken" when you take your medication
4. **Toggle Reminders**: Click the reminder status to enable/disable reminders
5. **View Statistics**: Monitor your adherence rate and medication history

### 4. Backend Configuration

#### Starting the Reminder Scheduler
The reminder scheduler automatically starts when the server starts. It's initialized in `server.js`:

```javascript
import './services/reminderScheduler.service.js'; // Initialize reminder scheduler
```

#### Customizing Reminder Timing
To modify the reminder check frequency, edit the cron expression in `reminderScheduler.service.js`:

```javascript
// Current: Every minute
cron.schedule('* * * * *', async () => {
    await this.checkAndSendReminders();
});

// Example: Every 5 minutes
cron.schedule('*/5 * * * *', async () => {
    await this.checkAndSendReminders();
});
```

## Extending the System

### Adding New Notification Channels

1. **Email Notifications**:
   - Install email service (SendGrid, AWS SES, etc.)
   - Update `notification.service.js` to implement `sendEmailNotification`
   - Add user email preferences to the user model

2. **SMS Notifications**:
   - Install SMS service (Twilio, AWS SNS, etc.)
   - Update `notification.service.js` to implement `sendSMSNotification`
   - Add user phone number to the user model

3. **Push Notifications**:
   - Install push notification service (FCM, APNS, etc.)
   - Update `notification.service.js` to implement `sendPushNotification`
   - Add device token management

### Adding New Time Slots

1. Update the medication model to include new time slots
2. Modify the reminder scheduler to process new time slots
3. Update the frontend components to display new time slots
4. Update validation in routes to accept new time slots

### Adding Reminder Types

1. Create new reminder types (e.g., "refill reminders", "appointment reminders")
2. Extend the medication model with new reminder fields
3. Update the scheduler to handle different reminder types
4. Create new UI components for different reminder types

## Troubleshooting

### Common Issues

1. **Reminders Not Sending**:
   - Check if `reminderEnabled` is true for the medication
   - Verify the medication is within its date range
   - Check server logs for cron job execution
   - Ensure the notification service is working

2. **Time Zone Issues**:
   - Ensure server and client are using the same time zone
   - Consider storing times in UTC and converting for display

3. **Duplicate Reminders**:
   - The system prevents duplicates using `reminderSent` flag
   - Check if the flag is being properly set

### Debugging

Enable debug logging by adding console.log statements in:
- `reminderScheduler.service.js` - Check cron execution
- `notification.service.js` - Check notification sending
- `reminder.controller.js` - Check API responses

## Security Considerations

1. **Authentication**: All reminder endpoints require valid JWT tokens
2. **Authorization**: Users can only access their own medication data
3. **Input Validation**: All inputs are validated using express-validator
4. **Rate Limiting**: Consider adding rate limiting for reminder endpoints

## Performance Optimization

1. **Database Indexing**: Add indexes on frequently queried fields
2. **Caching**: Consider caching today's schedule for better performance
3. **Batch Processing**: Process multiple medications in batches
4. **Connection Pooling**: Use MongoDB connection pooling for better performance

## Future Enhancements

1. **Smart Reminders**: AI-powered reminder timing based on user behavior
2. **Medication Interactions**: Check for drug interactions before sending reminders
3. **Caregiver Notifications**: Send reminders to caregivers when patients miss doses
4. **Voice Reminders**: Integration with voice assistants
5. **Wearable Integration**: Send reminders to smartwatches and fitness trackers

## Support

For issues or questions about the reminder system:
1. Check the server logs for error messages
2. Verify API endpoints are working correctly
3. Test with a simple medication schedule first
4. Check database connectivity and data integrity
