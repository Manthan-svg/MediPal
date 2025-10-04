import React, { useState, useContext, useEffect } from 'react'
import { 
  FaUser, 
  FaBell, 
  FaShieldAlt, 
  FaPalette, 
  FaSave, 
  FaDownload, 
  FaTrash, 
  FaCog, 
  FaHeart, 
  FaChartLine, 
  FaDatabase, 
  FaMobile, 
  FaDesktop, 
  FaWifi,
  FaLock,
  FaKey,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaGlobe,
  FaSync,
  FaExclamationTriangle,
  FaInfoCircle,
  FaQuestionCircle,
  FaPills
} from 'react-icons/fa'
import { UserContext } from '../utils/UserContextComponent'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'
import { toast } from 'react-toastify'
import axios from '../utils/Axios.Config'

function SettingsComponent() {
  const { user, setUser, token } = useContext(UserContext)
  const { theme, updateTheme } = useTheme()
  const { language, timezone, changeLanguage, changeTimezone, t } = useLanguage()
  const [activeTab, setActiveTab] = useState('profile')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    medication: true,
    appointments: true,
    healthGoals: true,
    emergency: true,
    email: true,
    push: true,
    sms: false
  })
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
    locationTracking: false
  })
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: false,
    sessionTimeout: 30,
    passwordChange: false
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const settingsTabs = [
    { id: 'profile', label: t('profile'), icon: FaUser, color: 'blue' },
    { id: 'notifications', label: t('notifications'), icon: FaBell, color: 'green' },
    { id: 'appearance', label: t('appearance'), icon: FaPalette, color: 'purple' },
    { id: 'about', label: t('about'), icon: FaInfoCircle, color: 'gray' }
  ]

  const colorSchemes = [
    { name: 'Blue', value: 'blue', primary: 'bg-blue-600', secondary: 'bg-blue-100' },
    { name: 'Green', value: 'green', primary: 'bg-green-600', secondary: 'bg-green-100' },
    { name: 'Purple', value: 'purple', primary: 'bg-purple-600', secondary: 'bg-purple-100' },
    { name: 'Red', value: 'red', primary: 'bg-red-600', secondary: 'bg-red-100' },
    { name: 'Indigo', value: 'indigo', primary: 'bg-indigo-600', secondary: 'bg-indigo-100' },
    { name: 'Teal', value: 'teal', primary: 'bg-teal-600', secondary: 'bg-teal-100' }
  ]

  const fontSizeOptions = [
    { name: 'Small', value: 'small', class: 'text-sm' },
    { name: 'Medium', value: 'medium', class: 'text-base' },
    { name: 'Large', value: 'large', class: 'text-lg' },
    { name: 'Extra Large', value: 'xlarge', class: 'text-xl' }
  ]

  const languages = [
    { name: 'English', value: 'en', flag: '🇺🇸' },
    { name: 'Spanish', value: 'es', flag: '🇪🇸' },
    { name: 'French', value: 'fr', flag: '🇫🇷' },
    { name: 'German', value: 'de', flag: '🇩🇪' },
    { name: 'Chinese', value: 'zh', flag: '🇨🇳' },
    { name: 'Japanese', value: 'ja', flag: '🇯🇵' }
  ]

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ]

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('mediPal-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setNotifications(settings.notifications || notifications)
      setPrivacy(settings.privacy || privacy)
      setSecurity(settings.security || security)
    }
  }, [])

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      const settings = {
        notifications,
        privacy,
        security,
      }
      
      localStorage.setItem('mediPal-settings', JSON.stringify(settings))
      
      toast.success(t('settingsSaved'))
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleThemeChange = (newTheme) => {
    updateTheme(newTheme)
    toast.success(t('themeUpdated'))
  }

  const handleLanguageChange = (newLanguage) => {
    changeLanguage(newLanguage)
    toast.success(t('languageChanged'))
  }

  const handleTimezoneChange = (newTimezone) => {
    changeTimezone(newTimezone)
    toast.success(t('timezoneChanged'))
  }

  const handlePasswordChange = async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match')
      return
    }
    
    try {
      const changedPasswordResponse = await axios.put('/profile/change-password', {
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      console.log(changedPasswordResponse);
      toast.success('Password changed successfully!')
      setShowPasswordModal(false)
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    }
  }

  const renderPrivacyTab = () => (
    <div className="space-y-6 absolute overflow-y-auto">

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaLock className="mr-2 text-orange-600" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={security.twoFactor}
            onChange={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            icon={FaShieldAlt}
          />
          
          <ToggleSwitch
            enabled={security.biometric}
            onChange={() => setSecurity({ ...security, biometric: !security.biometric })}
            label="Biometric Authentication"
            description="Use fingerprint or face recognition"
            icon={FaMobile}
          />
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaKey className="text-gray-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Password</h3>
                  <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
            <select
              value={security.sessionTimeout}
              onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={0}>Never</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaGlobe className="mr-2 text-indigo-600" />
          Privacy Policy & Terms
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Privacy Policy</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Terms of Service</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Data Processing Agreement</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Cookie Policy</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  const handleDataExport = async () => {
    try {
      const response = await axios.get('/profile/export-data', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mediPal-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export data')
    }
  }

  const handleAccountDeletion = async () => {
    try {
      await axios.delete('/profile/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      localStorage.clear()
      setUser(null)
      toast.success('Account deleted successfully')
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error('Failed to delete account')
    }
  }

  const ToggleSwitch = ({ enabled, onChange, label, description, icon: Icon }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        {Icon && <Icon className="text-gray-600" />}
        <div>
          <h3 className="font-medium text-gray-900">{label}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? 'bg-primary-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaUser className="mr-2 text-blue-600" />
          Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={`${user?.fullName?.firstName || ''} ${user?.fullName?.lastName || ''}`}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="text"
              value={user?.age || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaLock className="mr-2 text-red-600" />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaKey className="text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-500">Last changed 30 days ago</p>
              </div>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Change Password
            </button>
          </div>
          
          <ToggleSwitch
            enabled={security.twoFactor}
            onChange={() => setSecurity({ ...security, twoFactor: !security.twoFactor })}
            label="Two-Factor Authentication"
            description="Add an extra layer of security to your account"
            icon={FaShieldAlt}
          />
          
          <ToggleSwitch
            enabled={security.biometric}
            onChange={() => setSecurity({ ...security, biometric: !security.biometric })}
            label="Biometric Authentication"
            description="Use fingerprint or face recognition"
            icon={FaMobile}
          />
        </div>
      </div>
    </div>
  )


  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaBell className="mr-2 text-green-600" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={notifications.medication}
            onChange={() => setNotifications({ ...notifications, medication: !notifications.medication })}
            label="Medication Reminders"
            description="Get notified about medication schedules"
            icon={FaPills}
          />
          
          <ToggleSwitch
            enabled={notifications.appointments}
            onChange={() => setNotifications({ ...notifications, appointments: !notifications.appointments })}
            label="Appointment Reminders"
            description="Remind me about upcoming appointments"
            icon={FaCalendarAlt}
          />
          
          <ToggleSwitch
            enabled={notifications.healthGoals}
            onChange={() => setNotifications({ ...notifications, healthGoals: !notifications.healthGoals })}
            label="Health Goal Updates"
            description="Track progress on your health goals"
            icon={FaHeart}
          />
          
          <ToggleSwitch
            enabled={notifications.emergency}
            onChange={() => setNotifications({ ...notifications, emergency: !notifications.emergency })}
            label="Emergency Alerts"
            description="Critical health alerts and emergencies"
            icon={FaExclamationTriangle}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaEnvelope className="mr-2 text-blue-600" />
          Delivery Methods
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={notifications.email}
            onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
            label="Email Notifications"
            description="Receive notifications via email"
            icon={FaEnvelope}
          />
          
          <ToggleSwitch
            enabled={notifications.push}
            onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
            label="Push Notifications"
            description="Browser and mobile push notifications"
            icon={FaMobile}
          />
          
          <ToggleSwitch
            enabled={notifications.sms}
            onChange={() => setNotifications({ ...notifications, sms: !notifications.sms })}
            label="SMS Notifications"
            description="Text message notifications"
            icon={FaPhone}
          />
        </div>
      </div>
    </div>
  )


  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaPalette className="mr-2 text-purple-600" />
          {t('themeAndColors')}
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('colorScheme')}</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => handleThemeChange({ colorScheme: scheme.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    theme.colorScheme === scheme.value
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full mx-auto mb-2 ${scheme.primary}`}></div>
                  <div className={`w-4 h-4 rounded-full mx-auto ${scheme.secondary}`}></div>
                  <p className="text-xs text-gray-600 mt-1">{scheme.name}</p>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">{t('fontSize')}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {fontSizeOptions.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleThemeChange({ fontSize: size.value })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    theme.fontSize === size.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`${size.class} text-center`}>Aa</p>
                  <p className="text-xs text-gray-600 mt-1">{size.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaGlobe className="mr-2 text-indigo-600" />
          {t('languageAndRegion')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('language')}</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('timezone')}</label>
            <select
              value={timezone}
              onChange={(e) => handleTimezoneChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaCog className="mr-2 text-gray-600" />
          {t('displayOptions')}
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={theme.animations}
            onChange={() => handleThemeChange({ animations: !theme.animations })}
            label={t('animations')}
            description="Enable smooth transitions and animations"
            icon={FaSync}
          />
          
          <ToggleSwitch
            enabled={theme.compactMode}
            onChange={() => handleThemeChange({ compactMode: !theme.compactMode })}
            label={t('compactMode')}
            description="Reduce spacing for more content"
            icon={FaDesktop}
          />
        </div>
      </div>
    </div>
  )

  const renderAccountTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaCog className="mr-2 text-indigo-600" />
          Account Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter emergency contact information"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({ ...security, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaDatabase className="mr-2 text-teal-600" />
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FaDownload className="text-gray-600" />
              <div>
                <h3 className="font-medium text-gray-900">Export Data</h3>
                <p className="text-sm text-gray-500">Download your health data</p>
              </div>
            </div>
            <button
              onClick={handleDataExport}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-3">
              <FaTrash className="text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-600">Permanently delete your account and data</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaDatabase className="mr-2 text-teal-600" />
          Backup & Sync
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            enabled={data.autoBackup}
            label="Automatic Backup"
            description="Automatically backup your data daily"
            icon={FaSync}
          />
          
          <ToggleSwitch
            enabled={data.cloudSync}
            label="Cloud Sync"
            description="Sync data across devices"
            icon={FaWifi}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data Retention</label>
            <select
              value={data.retentionPeriod}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={30}>30 days</option>
              <option value={90}>90 days</option>
              <option value={180}>6 months</option>
              <option value={365}>1 year</option>
              <option value={0}>Forever</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaDownload className="mr-2 text-blue-600" />
          Export Options
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`p-3 rounded-lg border-2 transition-all ${
                  data.exportFormat === 'json'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📄</div>
                  <p className="font-medium">JSON</p>
                  <p className="text-xs text-gray-500">Machine readable</p>
                </div>
              </button>
              <button
                className={`p-3 rounded-lg border-2 transition-all ${
                  data.exportFormat === 'csv'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="font-medium">CSV</p>
                  <p className="text-xs text-gray-500">Spreadsheet format</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAboutTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaInfoCircle className="mr-2 text-gray-600" />
          App Information
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Build</span>
            <span className="font-medium">2024.01.15</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Last Updated</span>
            <span className="font-medium">January 15, 2024</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaQuestionCircle className="mr-2 text-blue-600" />
          Support & Help
        </h3>
        <div className="space-y-3">
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Help Center</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Contact Support</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Privacy Policy</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
          <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <span>Terms of Service</span>
              <span className="text-gray-400">→</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab()
      case 'notifications': return renderNotificationsTab()
      case 'appearance': return renderAppearanceTab()
      case 'about': return renderAboutTab()
      default: return renderProfileTab()
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${!theme.animations ? 'no-animations' : ''} ${theme.compactMode ? 'compact-mode' : ''}`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl-dynamic font-bold text-gray-900 mb-2">{t('settings')}</h1>
          <p className="text-base-dynamic text-gray-600">Manage your account preferences and app settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <nav className="space-y-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="mr-3 text-lg" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {renderTabContent()}
              
              {/* Save Button */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{t('saveChanges')}</h3>
                    <p className="text-sm text-gray-500">Your settings will be saved automatically</p>
                  </div>
                  <button
                    onClick={saveSettings}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('loading')}
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        {t('saveSettings')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="text-red-600 text-xl mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Delete Account</h2>
            </div>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAccountDeletion}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SettingsComponent
