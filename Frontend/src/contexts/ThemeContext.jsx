import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    colorScheme: 'blue',
    fontSize: 'medium',
    animations: true,
    compactMode: false
  })

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('mediPal-theme')
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme)
        setTheme(parsedTheme)
        applyTheme(parsedTheme)
      } catch (error) {
        console.error('Error loading theme from localStorage:', error)
      }
    } else {
      applyTheme(theme)
    }
  }, [])

  // Apply theme to CSS variables
  const applyTheme = (themeConfig) => {
    const root = document.documentElement
    
    // Color scheme mapping
    const colorSchemes = {
      blue: {
        '--primary-color': '#2563eb',
        '--primary-hover': '#1d4ed8',
        '--primary-light': '#dbeafe',
        '--primary-50': '#eff6ff',
        '--primary-100': '#dbeafe',
        '--primary-500': '#3b82f6',
        '--primary-600': '#2563eb',
        '--primary-700': '#1d4ed8',
        '--primary-900': '#1e3a8a'
      },
      green: {
        '--primary-color': '#16a34a',
        '--primary-hover': '#15803d',
        '--primary-light': '#dcfce7',
        '--primary-50': '#f0fdf4',
        '--primary-100': '#dcfce7',
        '--primary-500': '#22c55e',
        '--primary-600': '#16a34a',
        '--primary-700': '#15803d',
        '--primary-900': '#14532d'
      },
      purple: {
        '--primary-color': '#9333ea',
        '--primary-hover': '#7c3aed',
        '--primary-light': '#e9d5ff',
        '--primary-50': '#faf5ff',
        '--primary-100': '#e9d5ff',
        '--primary-500': '#a855f7',
        '--primary-600': '#9333ea',
        '--primary-700': '#7c3aed',
        '--primary-900': '#581c87'
      },
      red: {
        '--primary-color': '#dc2626',
        '--primary-hover': '#b91c1c',
        '--primary-light': '#fecaca',
        '--primary-50': '#fef2f2',
        '--primary-100': '#fecaca',
        '--primary-500': '#ef4444',
        '--primary-600': '#dc2626',
        '--primary-700': '#b91c1c',
        '--primary-900': '#7f1d1d'
      },
      indigo: {
        '--primary-color': '#4f46e5',
        '--primary-hover': '#4338ca',
        '--primary-light': '#c7d2fe',
        '--primary-50': '#eef2ff',
        '--primary-100': '#c7d2fe',
        '--primary-500': '#6366f1',
        '--primary-600': '#4f46e5',
        '--primary-700': '#4338ca',
        '--primary-900': '#312e81'
      },
      teal: {
        '--primary-color': '#0d9488',
        '--primary-hover': '#0f766e',
        '--primary-light': '#ccfbf1',
        '--primary-50': '#f0fdfa',
        '--primary-100': '#ccfbf1',
        '--primary-500': '#14b8a6',
        '--primary-600': '#0d9488',
        '--primary-700': '#0f766e',
        '--primary-900': '#134e4a'
      }
    }

    // Font size mapping
    const fontSizes = {
      small: {
        '--font-size-xs': '0.75rem',
        '--font-size-sm': '0.875rem',
        '--font-size-base': '0.875rem',
        '--font-size-lg': '1rem',
        '--font-size-xl': '1.125rem',
        '--font-size-2xl': '1.25rem',
        '--font-size-3xl': '1.5rem'
      },
      medium: {
        '--font-size-xs': '0.75rem',
        '--font-size-sm': '0.875rem',
        '--font-size-base': '1rem',
        '--font-size-lg': '1.125rem',
        '--font-size-xl': '1.25rem',
        '--font-size-2xl': '1.5rem',
        '--font-size-3xl': '1.875rem'
      },
      large: {
        '--font-size-xs': '0.875rem',
        '--font-size-sm': '1rem',
        '--font-size-base': '1.125rem',
        '--font-size-lg': '1.25rem',
        '--font-size-xl': '1.5rem',
        '--font-size-2xl': '1.75rem',
        '--font-size-3xl': '2.25rem'
      },
      xlarge: {
        '--font-size-xs': '1rem',
        '--font-size-sm': '1.125rem',
        '--font-size-base': '1.25rem',
        '--font-size-lg': '1.5rem',
        '--font-size-xl': '1.75rem',
        '--font-size-2xl': '2rem',
        '--font-size-3xl': '2.5rem'
      }
    }

    // Apply color scheme
    const selectedColorScheme = colorSchemes[themeConfig.colorScheme] || colorSchemes.blue
    Object.entries(selectedColorScheme).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    // Apply font size
    const selectedFontSize = fontSizes[themeConfig.fontSize] || fontSizes.medium
    Object.entries(selectedFontSize).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })

    // Apply other theme properties
    root.style.setProperty('--animations-enabled', themeConfig.animations ? '1' : '0')
    root.style.setProperty('--compact-mode', themeConfig.compactMode ? '1' : '0')
  }

  const updateTheme = (newTheme) => {
    const updatedTheme = { ...theme, ...newTheme }
    setTheme(updatedTheme)
    applyTheme(updatedTheme)
    localStorage.setItem('mediPal-theme', JSON.stringify(updatedTheme))
  }

  const resetTheme = () => {
    const defaultTheme = {
      colorScheme: 'blue',
      fontSize: 'medium',
      animations: true,
      compactMode: false
    }
    setTheme(defaultTheme)
    applyTheme(defaultTheme)
    localStorage.setItem('mediPal-theme', JSON.stringify(defaultTheme))
  }

  const value = {
    theme,
    updateTheme,
    resetTheme,
    applyTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
