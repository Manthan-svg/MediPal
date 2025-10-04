# Dynamic Theme System Guide

This guide explains how to use the dynamic theme system implemented in MediPal. The system allows users to change color schemes, font sizes, and other appearance settings that apply across the entire application.

## Features

- **Dynamic Color Schemes**: 6 predefined color schemes (Blue, Green, Purple, Red, Indigo, Teal)
- **Dynamic Font Sizes**: 4 font size options (Small, Medium, Large, Extra Large)
- **Animation Control**: Toggle animations on/off
- **Compact Mode**: Reduce spacing for more content
- **Persistent Storage**: Settings are saved to localStorage
- **Real-time Updates**: Changes apply immediately across all components

## How It Works

### 1. Theme Context Provider

The theme system is built around a React Context that manages theme state globally:

```jsx
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

// Wrap your app with ThemeProvider
<ThemeProvider>
  <App />
</ThemeProvider>

// Use theme in components
const { theme, updateTheme } = useTheme()
```

### 2. CSS Variables

The system uses CSS custom properties (variables) that are dynamically updated:

```css
:root {
  --primary-color: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-50: #eff6ff;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  /* ... more variables */
}
```

### 3. Dynamic Classes

Use these classes in your components for dynamic theming:

#### Color Classes
- `bg-primary` - Primary background color
- `bg-primary-50` - Light primary background
- `bg-primary-600` - Medium primary background
- `text-primary` - Primary text color
- `text-primary-600` - Medium primary text
- `border-primary` - Primary border color
- `ring-primary` - Primary ring color

#### Font Size Classes
- `text-xs-dynamic` - Extra small text
- `text-sm-dynamic` - Small text
- `text-base-dynamic` - Base text size
- `text-lg-dynamic` - Large text
- `text-xl-dynamic` - Extra large text
- `text-2xl-dynamic` - 2x large text
- `text-3xl-dynamic` - 3x large text

#### Utility Classes
- `btn-primary` - Primary button styling
- `input-primary` - Primary input styling
- `card-primary` - Primary card styling

## Usage Examples

### Basic Component with Theme

```jsx
import React from 'react'
import { useTheme } from '../contexts/ThemeContext'

const MyComponent = () => {
  const { theme } = useTheme()

  return (
    <div className={`${!theme.animations ? 'no-animations' : ''} ${theme.compactMode ? 'compact-mode' : ''}`}>
      <h1 className="text-2xl-dynamic font-bold text-primary-600">
        Dynamic Title
      </h1>
      <p className="text-base-dynamic text-gray-600">
        This text will scale with the selected font size
      </p>
      <button className="btn-primary">
        Themed Button
      </button>
    </div>
  )
}
```

### Updating Theme Programmatically

```jsx
import { useTheme } from '../contexts/ThemeContext'

const ThemeControls = () => {
  const { theme, updateTheme } = useTheme()

  const changeColorScheme = (color) => {
    updateTheme({ colorScheme: color })
  }

  const changeFontSize = (size) => {
    updateTheme({ fontSize: size })
  }

  const toggleAnimations = () => {
    updateTheme({ animations: !theme.animations })
  }

  return (
    <div>
      <button onClick={() => changeColorScheme('green')}>
        Green Theme
      </button>
      <button onClick={() => changeFontSize('large')}>
        Large Font
      </button>
      <button onClick={toggleAnimations}>
        Toggle Animations
      </button>
    </div>
  )
}
```

## Available Color Schemes

1. **Blue** (default): `#2563eb`
2. **Green**: `#16a34a`
3. **Purple**: `#9333ea`
4. **Red**: `#dc2626`
5. **Indigo**: `#4f46e5`
6. **Teal**: `#0d9488`

## Available Font Sizes

1. **Small**: 0.875rem base
2. **Medium**: 1rem base (default)
3. **Large**: 1.125rem base
4. **Extra Large**: 1.25rem base

## Theme Object Structure

```javascript
{
  colorScheme: 'blue',     // Current color scheme
  fontSize: 'medium',      // Current font size
  animations: true,        // Whether animations are enabled
  compactMode: false       // Whether compact mode is enabled
}
```

## Best Practices

1. **Always use dynamic classes** for colors and font sizes that should change with theme
2. **Apply theme classes to container elements** for animations and compact mode
3. **Test all color schemes** to ensure good contrast and readability
4. **Use semantic color names** (primary, secondary) instead of specific colors
5. **Provide fallbacks** for when theme context is not available

## Migration Guide

To migrate existing components to use the theme system:

1. Import the theme context:
   ```jsx
   import { useTheme } from '../contexts/ThemeContext'
   ```

2. Replace hardcoded colors with dynamic classes:
   ```jsx
   // Before
   className="bg-blue-600 text-white"
   
   // After
   className="bg-primary-600 text-white"
   ```

3. Replace hardcoded font sizes with dynamic classes:
   ```jsx
   // Before
   className="text-lg"
   
   // After
   className="text-lg-dynamic"
   ```

4. Apply theme container classes:
   ```jsx
   <div className={`${!theme.animations ? 'no-animations' : ''} ${theme.compactMode ? 'compact-mode' : ''}`}>
     {/* Component content */}
   </div>
   ```

## Troubleshooting

### Theme not applying
- Ensure the component is wrapped with `ThemeProvider`
- Check that you're using the correct dynamic class names
- Verify CSS variables are being set in the browser dev tools

### Colors not changing
- Make sure you're using the dynamic color classes (e.g., `bg-primary-600`)
- Check that the color scheme is being updated in the theme context
- Verify CSS variables are being updated in the root element

### Font sizes not scaling
- Use the dynamic font size classes (e.g., `text-base-dynamic`)
- Check that the font size is being updated in the theme context
- Verify CSS variables are being updated correctly

## Future Enhancements

- Dark mode support
- Custom color scheme creation
- More granular font size controls
- Theme presets
- Accessibility improvements
- Animation customization
