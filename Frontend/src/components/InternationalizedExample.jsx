import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useLanguage } from '../contexts/LanguageContext'

// Example component showing how to use both theme and language contexts
const InternationalizedExample = () => {
  const { theme } = useTheme()
  const { t, formatDate, formatTime, formatNumber } = useLanguage()

  const currentDate = new Date()
  const sampleNumber = 1234.56

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl-dynamic font-bold text-primary-600 mb-4">
        {t('appInformation')}
      </h2>
      
      <div className="space-y-4">
        {/* Theme Information */}
        <div className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
          <h3 className="text-lg-dynamic font-semibold text-primary-700 mb-2">
            Current Theme Settings
          </h3>
          <div className="text-sm-dynamic text-gray-600 space-y-1">
            <p><strong>{t('colorScheme')}:</strong> {theme.colorScheme}</p>
            <p><strong>{t('fontSize')}:</strong> {theme.fontSize}</p>
            <p><strong>{t('animations')}:</strong> {theme.animations ? 'Enabled' : 'Disabled'}</p>
            <p><strong>{t('compactMode')}:</strong> {theme.compactMode ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
        
        {/* Internationalization Examples */}
        <div className="p-4 border border-primary-200 rounded-lg">
          <h4 className="text-base-dynamic font-medium text-primary-700 mb-2">
            Internationalization Examples
          </h4>
          <div className="text-sm-dynamic text-gray-600 space-y-2">
            <p><strong>Current Date:</strong> {formatDate(currentDate, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>Current Time:</strong> {formatTime(currentDate)}</p>
            <p><strong>Sample Number:</strong> {formatNumber(sampleNumber, { 
              style: 'currency', 
              currency: 'USD' 
            })}</p>
            <p><strong>Sample Number (Decimal):</strong> {formatNumber(sampleNumber, { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</p>
          </div>
        </div>
        
        {/* Dynamic Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn-primary px-4 py-2 rounded-lg">
            {t('save')}
          </button>
          <button className="px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
            {t('cancel')}
          </button>
        </div>
        
        {/* Font Size Examples */}
        <div className="p-4 border border-primary-200 rounded-lg">
          <h4 className="text-base-dynamic font-medium text-primary-700 mb-2">
            Dynamic Font Sizes
          </h4>
          <div className="space-y-1">
            <p className="text-xs-dynamic text-gray-600">Extra Small Text - {t('version')} 1.0.0</p>
            <p className="text-sm-dynamic text-gray-600">Small Text - {t('build')} 2024.01.15</p>
            <p className="text-base-dynamic text-gray-600">Base Text - {t('lastUpdated')} January 15, 2024</p>
            <p className="text-lg-dynamic text-gray-600">Large Text - {t('helpCenter')}</p>
            <p className="text-xl-dynamic text-gray-600">Extra Large Text - {t('contactSupport')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InternationalizedExample
