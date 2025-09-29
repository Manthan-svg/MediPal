# Medication Reminder System - Implementation Guide

## Overview
This document provides a comprehensive guide to the enhanced medication reminder system implemented for MediPal. The system includes real-time notifications, multiple delivery methods, user preferences, and a robust scheduling system.

## Architecture

### Backend Components

#### 1. Notification Model (`models/notification.model.js`)
- **Purpose**: Stores all notification data in MongoDB
- **Key Features**:
  - Multiple delivery methods tracking
  - Priority levels (low, medium, high, urgent)
  - Expiration dates for automatic cleanup
  - Read/unread status tracking
  - Medication association

#### 2. Enhanced Notification Service (`services/notification.service.js`)
- **Purpose**: Handles all notification delivery logic
- **Key Features**:
  - Multiple delivery methods (email, SMS, push, in-app, webhook)
  - User preference-based delivery
  - Retry logic and error handling
  - Database persistence
  - Real-time WebSocket integration

#### 3. Enhanced Reminder Scheduler (`services/reminderScheduler.service.js`)
- **Purpose**: Manages medication reminder timing and missed medication detection
- **Key Features**:
  - Cron-based scheduling (every minute for reminders, every 30 minutes for missed checks)
  - 1-minute tolerance for reminder timing
  - Missed medication detection (30 minutes to 2 hours after scheduled time)
  - Comprehensive error handling
  - Individual medication processing

#### 4. WebSocket Service (`services/websocket.service.js`)
- **Purpose**: Real-time communication with frontend
- **Key Features**:
  - JWT-based authentication
  - User-specific rooms
  - Real-time notification delivery
  - Medication confirmation handling
  - Connection management

#### 5. Notification Preferences Service (`services/notificationPreferences.service.js`)
- **Purpose**: Manages user notification preferences
- **Key Features**:
  - Granular preference control
  - Quiet hours support
  - Delivery method preferences
  - Notification type preferences
  - Time-based filtering

### Frontend Components

#### 1. WebSocket Hook (`hooks/useWebSocket.js`)
- **Purpose**: React hook for WebSocket communication
- **Key Features**:
  - Automatic connection management
  - Notification handling
  - Medication confirmation
  - Browser notification support

#### 2. Notification Center (`components/NotificationCenter.jsx`)
- **Purpose**: UI component for notification management
- **Key Features**:
  - Real-time notification display
  - Mark as read/unread functionality
  - Medication confirmation buttons
  - Notification history
  - Responsive design

## API Endpoints

### Notification Management
- `GET /notifications/history` - Get notification history
- `GET /notifications/unread` - Get unread notifications
- `PATCH /notifications/:id/read` - Mark notification as read
- `PATCH /notifications/read-all` - Mark all notifications as read
- `DELETE /notifications/:id` - Delete notification
- `GET /notifications/stats` - Get notification statistics

### Notification Preferences
- `GET /notification-preferences` - Get user preferences
- `PUT /notification-preferences` - Update all preferences
- `PATCH /notification-preferences/:path` - Update specific preference
- `POST /notification-preferences/reset` - Reset to defaults
- `PATCH /notification-preferences/quiet-hours` - Update quiet hours
- `PATCH /notification-preferences/contact-info` - Update contact info

## Key Features

### 1. Multi-Channel Delivery
- **Email**: For important notifications
- **SMS**: For urgent reminders
- **Push Notifications**: For mobile devices
- **In-App**: Real-time WebSocket notifications
- **Webhook**: For third-party integrations

### 2. Smart Scheduling
- **Reminder Timing**: 1-minute tolerance for precise delivery
- **Missed Detection**: 30 minutes to 2 hours after scheduled time
- **Quiet Hours**: Respect user's sleep schedule
- **Timezone Support**: Automatic timezone handling

### 3. User Preferences
- **Delivery Methods**: Choose preferred notification channels
- **Notification Types**: Control which types of notifications to receive
- **Quiet Hours**: Set do-not-disturb periods
- **Contact Information**: Manage email, phone, device tokens

### 4. Real-Time Updates
- **WebSocket Integration**: Instant notification delivery
- **Live Status Updates**: Connection status indicators
- **Medication Confirmation**: Real-time medication taking confirmation
- **Preference Sync**: Live preference updates

## Database Schema Updates

### User Model Enhancements
```javascript
{
  username: String,
  phoneNumber: String,
  deviceToken: String,
  webhookUrl: String,
  notificationPreferences: {
    email: Boolean,
    sms: Boolean,
    push: Boolean,
    inApp: Boolean,
    webhook: Boolean,
    medicationReminders: Boolean,
    missedMedicationAlerts: Boolean,
    goalAchievements: Boolean,
    generalNotifications: Boolean,
    quietHours: {
      enabled: Boolean,
      start: String,
      end: String
    }
  }
}
```

### Notification Model
```javascript
{
  userId: String,
  medicationId: ObjectId,
  type: String, // medication_reminder, medication_missed, goal_achieved, general
  title: String,
  message: String,
  timeSlot: String,
  scheduledTime: String,
  status: String, // pending, sent, delivered, failed, read
  deliveryMethods: [{
    method: String,
    status: String,
    sentAt: Date,
    deliveredAt: Date,
    error: String
  }],
  priority: String, // low, medium, high, urgent
  metadata: Map,
  readAt: Date,
  expiresAt: Date
}
```

## Installation and Setup

### Backend Dependencies
```bash
npm install socket.io jsonwebtoken node-cron
```

### Frontend Dependencies
```bash
npm install socket.io-client
```

### Environment Variables
```env
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

## Usage Examples

### 1. Basic Notification Sending
```javascript
import { sendReminderNotification } from './services/notification.service.js';

const result = await sendReminderNotification({
  medicationId: 'med123',
  medicationName: 'Aspirin',
  dosage: '100mg',
  timeSlot: 'morning',
  scheduledTime: '08:00',
  instruction: 'Take with food',
  medicationType: 'tablet',
  userId: 'user123'
});
```

### 2. WebSocket Integration
```javascript
import useWebSocket from './hooks/useWebSocket';

const { 
  isConnected, 
  notifications, 
  confirmMedicationTaken 
} = useWebSocket(token);

// Confirm medication taken
confirmMedicationTaken({
  medicationId: 'med123',
  timeSlot: 'morning'
});
```

### 3. Notification Preferences
```javascript
import { updateNotificationPreferences } from './services/notificationPreferences.service.js';

await updateNotificationPreferences('user123', {
  email: true,
  sms: false,
  push: true,
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
});
```

## Monitoring and Logging

### Console Logs
- Reminder sending status
- WebSocket connection events
- Notification delivery results
- Error messages and stack traces

### Database Tracking
- Notification delivery status
- User interaction tracking
- Performance metrics
- Error logging

## Error Handling

### Retry Logic
- Failed delivery attempts are retried
- Exponential backoff for rate limiting
- Dead letter queue for persistent failures

### Graceful Degradation
- Fallback to in-app notifications if external services fail
- User preference respect even during service outages
- Connection state management

## Security Considerations

### Authentication
- JWT-based WebSocket authentication
- Token validation on every connection
- User-specific notification filtering

### Data Privacy
- User data encryption
- Secure API endpoints
- GDPR compliance considerations

## Performance Optimizations

### Database Indexing
- User ID and timestamp indexes
- Notification type and status indexes
- Expiration date indexes for cleanup

### Caching
- User preference caching
- Connection state caching
- Notification history pagination

## Future Enhancements

### Planned Features
1. **Machine Learning**: Predictive medication timing
2. **Voice Notifications**: Text-to-speech reminders
3. **Smart Scheduling**: AI-powered optimal timing
4. **Integration APIs**: Third-party health apps
5. **Analytics Dashboard**: Usage and compliance metrics

### Scalability Considerations
- Redis for session management
- Message queues for high-volume notifications
- Microservices architecture
- Load balancing for WebSocket connections

## Troubleshooting

### Common Issues
1. **WebSocket Connection Failures**: Check authentication token
2. **Notification Delivery Issues**: Verify user preferences
3. **Database Connection Errors**: Check MongoDB connection
4. **Cron Job Failures**: Verify server time and timezone

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` and check console output for detailed error information.

## Support

For technical support or questions about the reminder system implementation, please refer to the code comments or contact the development team.
