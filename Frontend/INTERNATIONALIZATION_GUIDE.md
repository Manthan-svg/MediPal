# Internationalization (i18n) Guide

This guide explains how to use the internationalization system implemented in MediPal. The system supports multiple languages, timezones, and locale-specific formatting.

## Features

- **Multi-language Support**: 6 languages (English, Spanish, French, German, Chinese, Japanese)
- **Timezone Support**: 10 major timezones with automatic time formatting
- **Locale-specific Formatting**: Numbers, dates, and times formatted according to locale
- **Persistent Storage**: Language and timezone preferences saved to localStorage
- **Real-time Switching**: Language changes apply immediately across all components
- **Fallback Support**: Falls back to English if translation is missing

## How It Works

### 1. Language Context Provider

The i18n system is built around a React Context that manages language and timezone state:

```jsx
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'

// Wrap your app with LanguageProvider
<LanguageProvider>
  <App />
</LanguageProvider>

// Use language context in components
const { language, timezone, changeLanguage, changeTimezone, t, formatDate, formatTime, formatNumber } = useLanguage()
```

### 2. Translation Function

Use the `t()` function to get translated strings:

```jsx
const MyComponent = () => {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('settings')}</h1>
      <p>{t('profileInformation')}</p>
    </div>
  )
}
```

### 3. Locale-specific Formatting

Use the formatting functions for dates, times, and numbers:

```jsx
const MyComponent = () => {
  const { formatDate, formatTime, formatNumber } = useLanguage()
  const date = new Date()
  const number = 1234.56
  
  return (
    <div>
      <p>Date: {formatDate(date, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      <p>Time: {formatTime(date)}</p>
      <p>Number: {formatNumber(number, { style: 'currency', currency: 'USD' })}</p>
    </div>
  )
}
```

## Available Languages

1. **English (en)**: Default language
2. **Spanish (es)**: Español
3. **French (fr)**: Français
4. **German (de)**: Deutsch
5. **Chinese (zh)**: 中文
6. **Japanese (ja)**: 日本語

## Available Timezones

1. **America/New_York** (EST/EDT)
2. **America/Chicago** (CST/CDT)
3. **America/Denver** (MST/MDT)
4. **America/Los_Angeles** (PST/PDT)
5. **Europe/London** (GMT/BST)
6. **Europe/Paris** (CET/CEST)
7. **Europe/Berlin** (CET/CEST)
8. **Asia/Tokyo** (JST)
9. **Asia/Shanghai** (CST)
10. **Australia/Sydney** (AEST/AEDT)

## Translation Keys

### Common Actions
- `save` - Save
- `cancel` - Cancel
- `delete` - Delete
- `edit` - Edit
- `add` - Add
- `remove` - Remove
- `confirm` - Confirm
- `loading` - Loading...
- `error` - Error
- `success` - Success

### Settings
- `settings` - Settings
- `profile` - Profile
- `notifications` - Notifications
- `appearance` - Appearance
- `about` - About
- `saveSettings` - Save Settings
- `saveChanges` - Save Changes
- `settingsSaved` - Settings saved successfully!
- `themeUpdated` - Theme updated successfully!
- `languageChanged` - Language changed successfully!
- `timezoneChanged` - Timezone changed successfully!

### Profile
- `profileInformation` - Profile Information
- `fullName` - Full Name
- `age` - Age
- `email` - Email
- `phone` - Phone
- `securitySettings` - Security Settings
- `changePassword` - Change Password
- `twoFactorAuth` - Two-Factor Authentication
- `biometricAuth` - Biometric Authentication

### Notifications
- `notificationPreferences` - Notification Preferences
- `medicationReminders` - Medication Reminders
- `appointmentReminders` - Appointment Reminders
- `healthGoalUpdates` - Health Goal Updates
- `emergencyAlerts` - Emergency Alerts
- `deliveryMethods` - Delivery Methods
- `emailNotifications` - Email Notifications
- `pushNotifications` - Push Notifications
- `smsNotifications` - SMS Notifications

### Appearance
- `themeAndColors` - Theme & Colors
- `colorScheme` - Color Scheme
- `fontSize` - Font Size
- `languageAndRegion` - Language & Region
- `language` - Language
- `timezone` - Timezone
- `displayOptions` - Display Options
- `animations` - Animations
- `compactMode` - Compact Mode

### About
- `appInformation` - App Information
- `version` - Version
- `build` - Build
- `lastUpdated` - Last Updated
- `supportAndHelp` - Support & Help
- `helpCenter` - Help Center
- `contactSupport` - Contact Support
- `privacyPolicy` - Privacy Policy
- `termsOfService` - Terms of Service

## Usage Examples

### Basic Translation

```jsx
import { useLanguage } from '../contexts/LanguageContext'

const MyComponent = () => {
  const { t } = useLanguage()
  
  return (
    <div>
      <h1>{t('settings')}</h1>
      <button>{t('save')}</button>
    </div>
  )
}
```

### Language Switching

```jsx
import { useLanguage } from '../contexts/LanguageContext'

const LanguageSelector = () => {
  const { language, changeLanguage } = useLanguage()
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' }
  ]
  
  return (
    <select 
      value={language} 
      onChange={(e) => changeLanguage(e.target.value)}
    >
      {languages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  )
}
```

### Date and Time Formatting

```jsx
import { useLanguage } from '../contexts/LanguageContext'

const DateTimeExample = () => {
  const { formatDate, formatTime, formatNumber } = useLanguage()
  const date = new Date()
  
  return (
    <div>
      <p>Full Date: {formatDate(date, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      })}</p>
      
      <p>Short Date: {formatDate(date, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      })}</p>
      
      <p>Time: {formatTime(date)}</p>
      
      <p>Currency: {formatNumber(1234.56, { 
        style: 'currency', 
        currency: 'USD' 
      })}</p>
      
      <p>Percentage: {formatNumber(0.75, { 
        style: 'percent' 
      })}</p>
    </div>
  )
}
```

### Timezone Handling

```jsx
import { useLanguage } from '../contexts/LanguageContext'

const TimezoneExample = () => {
  const { timezone, changeTimezone, formatDate } = useLanguage()
  const date = new Date()
  
  return (
    <div>
      <p>Current timezone: {timezone}</p>
      <p>Current time: {formatDate(date, { 
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })}</p>
      
      <select 
        value={timezone} 
        onChange={(e) => changeTimezone(e.target.value)}
      >
        <option value="America/New_York">New York</option>
        <option value="Europe/London">London</option>
        <option value="Asia/Tokyo">Tokyo</option>
      </select>
    </div>
  )
}
```

## Adding New Translations

To add a new translation key:

1. Add the key to all language objects in `LanguageContext.jsx`:

```javascript
const translations = {
  en: {
    // ... existing keys
    newKey: 'New Value',
  },
  es: {
    // ... existing keys
    newKey: 'Nuevo Valor',
  },
  // ... other languages
}
```

2. Use the key in your components:

```jsx
const MyComponent = () => {
  const { t } = useLanguage()
  return <p>{t('newKey')}</p>
}
```

## Adding New Languages

To add a new language:

1. Add the language to the `translations` object in `LanguageContext.jsx`
2. Add the language to the `languages` array in `SettingsComponent.jsx`
3. Add the language option to any language selectors

## Best Practices

1. **Always use translation keys** instead of hardcoded strings
2. **Use descriptive key names** that indicate the context
3. **Group related keys** with consistent prefixes
4. **Test all languages** to ensure translations fit the UI
5. **Provide fallbacks** for missing translations
6. **Use locale-specific formatting** for dates, times, and numbers
7. **Consider text direction** for RTL languages (future enhancement)

## Troubleshooting

### Translation not showing
- Check that the key exists in the translations object
- Verify the language context is properly wrapped around your component
- Check browser console for missing translation warnings

### Date/time formatting issues
- Ensure the timezone is set correctly
- Check that the date object is valid
- Verify the formatting options are supported by the locale

### Language not persisting
- Check that localStorage is available
- Verify the language is being saved correctly
- Check for conflicts with other localStorage keys

## Future Enhancements

- RTL (Right-to-Left) language support
- Pluralization rules
- Dynamic translation loading
- Translation management system
- More granular locale settings
- Cultural formatting preferences
- Accessibility improvements for different languages
