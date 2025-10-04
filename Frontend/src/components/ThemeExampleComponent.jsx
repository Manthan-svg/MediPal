import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

// Example component showing how to use the theme context
const ThemeExampleComponent = () => {
  const { theme } = useTheme()

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl-dynamic font-bold text-primary-600 mb-4">
        Theme Example Component
      </h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
          <h3 className="text-lg-dynamic font-semibold text-primary-700 mb-2">
            Current Theme Settings
          </h3>
          <div className="text-sm-dynamic text-gray-600 space-y-1">
            <p><strong>Color Scheme:</strong> {theme.colorScheme}</p>
            <p><strong>Font Size:</strong> {theme.fontSize}</p>
            <p><strong>Animations:</strong> {theme.animations ? 'Enabled' : 'Disabled'}</p>
            <p><strong>Compact Mode:</strong> {theme.compactMode ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="btn-primary px-4 py-2 rounded-lg">
            Primary Button
          </button>
          <button className="px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
            Secondary Button
          </button>
        </div>
        
        <div className="p-4 border border-primary-200 rounded-lg">
          <h4 className="text-base-dynamic font-medium text-primary-700 mb-2">
            Dynamic Font Sizes
          </h4>
          <p className="text-xs-dynamic text-gray-600 mb-1">Extra Small Text</p>
          <p className="text-sm-dynamic text-gray-600 mb-1">Small Text</p>
          <p className="text-base-dynamic text-gray-600 mb-1">Base Text</p>
          <p className="text-lg-dynamic text-gray-600 mb-1">Large Text</p>
          <p className="text-xl-dynamic text-gray-600 mb-1">Extra Large Text</p>
        </div>
      </div>
    </div>
  )
}

export default ThemeExampleComponent
