import React, { useContext } from 'react'
import { BrowserRouter, Navigate, Route, Router, Routes } from 'react-router-dom'
import DashboardComponent from '../components/DashboardComponent'
import WaterIntakeComponent from '../components/WaterIntakeComponent'
import StepCounterComponent from '../components/StepCounterComponent'
import SleepLoggerCounter from '../components/SleepLoggerCounter'
import MedicationComponent from '../components/MedicationComponent'
import ReminderComponent from '../components/ReminderComponent'
import CaregiverComponent from '../components/CaregiverComponent'
import MediPalAssitantComponent from '../components/MediPalAssitantComponent'
import LoginComponent from '../components/LoginComponent'
import RegisterComponent from '../components/RegisterComponent'
import { UserContext } from '../utils/UserContextComponent'
import Profilecomponent from '../components/Profilecomponent'
import OnboardingPageComponent from '../components/OnboardingPageComponent'

function AppRoutes() {
    const { user } = useContext(UserContext);

  return (
    <BrowserRouter >
        <Routes>
            <Route path='/' element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path='/login' element={!user ? <LoginComponent /> : <Navigate to="/dashboard" />} />
            <Route path='/register' element={!user ? <RegisterComponent /> : <Navigate to="/dashboard" />} />
            <Route path='/dashboard' element={user ? <DashboardComponent /> : <Navigate to="/login" />} />
            <Route path='/waterIntake' element={user ? <WaterIntakeComponent /> : <Navigate to="/login" />} />
            <Route path='/Step Counter' element={user ? <StepCounterComponent /> : <Navigate to="/login" />} />
            <Route path='/Sleep Logger' element={user ? <SleepLoggerCounter /> : <Navigate to="/login" />} />
            <Route path='/Medication' element={user ? <MedicationComponent /> : <Navigate to="/login" />} />
            <Route path='/Reminders' element={user ? <ReminderComponent /> : <Navigate to="/login" />} />
            <Route path='/Caregiver' element={user ? <CaregiverComponent /> : <Navigate to="/login" />} />
            <Route path='/onboardPage' element={user ? <DashboardComponent /> : <OnboardingPageComponent />} />

            <Route path='/MediPal Assistant' element={user ? <MediPalAssitantComponent /> : <Navigate to="/login" />} /> 
            <Route path='/profile' element={user ? <Profilecomponent /> : <Navigate to="/login" />} />

            <Route path='*' element={<Navigate to="/login" />} />

        </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
