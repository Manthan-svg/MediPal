import React from 'react'
import AppRoutes from './pages/AppRoutes';
import { ToastContainer } from 'react-toastify';
import { useTheme } from './contexts/ThemeContext';





function App() {
  const { theme } = useTheme()
  
  return (
    <div className={`${!theme.animations ? 'no-animations' : ''} ${theme.compactMode ? 'compact-mode' : ''}`}>
      <AppRoutes />
      <ToastContainer />
    </div>
  )
}

export default App;
