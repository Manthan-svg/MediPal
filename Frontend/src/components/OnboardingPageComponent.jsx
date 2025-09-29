import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser,
    FaHeartbeat,
    FaRunning,
    FaCheck,
    FaArrowLeft,
    FaArrowRight,
    FaWeight,
    FaRuler,
    FaVenusMars,
    FaBirthdayCake,
    FaLock,
    FaDumbbell,
    FaBed,
    FaNotesMedical,
    FaPhoneAlt,
    FaInfoCircle,
} from 'react-icons/fa';

import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../utils/UserContextComponent';

function OnboardingPageComponent() {
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location?.state?.userData;
    const {user,setUser} = useContext(UserContext);
    console.log(userData);
    const [currentStep, setCurrentStep] = useState(1);
    const [basicInfo, setBasicInfo] = useState({
        Username: userData?.fullName?.firstName + " " + userData?.fullName?.lastName,
        Age: userData?.age,
        Email: userData?.email,
        password: '',
        Gender: '',
        StartDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
        BloodType: '',
        Location: '',
        Role: '',
    })
    const [vitalSigns, setVitalSigns] = useState({
        HeartRate: '',
        BloodPressure: '',
        BodyTemperature: '',
        RespiratoryRate: '',
        OxygenSaturation: '',
        HydrationStreak: '',
    })
    const [physicalMeasurements, setPhysicalMeasurements] = useState({
        Weight: '',
        Height: '',
        BMI: '',
        WaistCircumference: '',
    })
    const [fitness, setFitness] = useState({
        DailyStepGoal: '',
        AverageStep: '',
        ExerciseFreq: '',
        ExerciseDur: '',
        ActivityLevel: '',

        AverageSleep: '',
        SleepQuality: '',
        SleepSchedule: '',
        StressLevel: '',
    })
    const [medicalConditions, setMedicalConditions] = useState({
        SmokingStatus: '',
        AlcoholConsumption: '',
        DietaryPref: '',
        WaterIntake: '',
        CaffeineConsumption: '',
        CaffeineConsumptionAmount: '',
        EmergencyContact:'',

    })



    const handleInputChange = (field, value) => {
        setBasicInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleConditionToggle = (condition) => {
        setFormData(prev => ({
            ...prev,
            medicalConditions: prev.medicalConditions.includes(condition)
                ? prev.medicalConditions.filter(c => c !== condition)
                : [...prev.medicalConditions, condition]
        }));
    };

    const nextStep = () => {
        if (currentStep < 6) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleSubmit = () => {
        setUser(userData);
        localStorage.setItem('Health-Related-Data',JSON.stringify(vitalSigns));
        localStorage.setItem('MedicalConditions-Related-Data',JSON.stringify(medicalConditions));
        localStorage.setItem("User-Role",JSON.stringify(basicInfo.Role));
        localStorage.setItem('Fitness-Related-Data',JSON.stringify(fitness));
        navigate('/dashboard')
    };

    const steps = [
        { number: 1, title: 'Basic Info', icon: FaUser },
        { number: 2, title: 'Vital Signs & Measurements', icon: FaHeartbeat },
        { number: 3, title: 'Physical Measurements', icon: FaRuler },
        { number: 4, title: 'Activity & Fitness Metrics', icon: FaDumbbell },
        { number: 5, title: 'Sleep & Wellness', icon: FaBed },
        { number: 6, title: 'Medical History & Conditions', icon: FaNotesMedical },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to MediPal</h1>
                    <p className="text-gray-600">Let's personalize your health journey</p>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-2xl mx-auto mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.number
                                    ? 'bg-teal-500 border-teal-500 text-white'
                                    : 'border-gray-300 text-gray-400'
                                    }`}>
                                    {currentStep > step.number ? (
                                        <FaCheck className="w-5 h-5" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-16 h-1 mx-2 ${currentStep > step.number ? 'bg-teal-500' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
                        </span>
                    </div>
                </motion.div>

                {/* Form Container */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="bg-white  rounded-2xl shadow-xl p-8">
                        <AnimatePresence mode="wait">
                            //Basic Info of Users...
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6 "
                                >
                                    <div className="text-center mb-6">
                                        <FaUser className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                                        <h2 className="text-2xl font-semibold text-gray-800">Basic Information</h2>
                                        <p className="text-gray-600">Tell us about more yourself</p>
                                    </div>


                                    <div className="space-y-4 flex flex-wrap w-full gap-5">
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                value={basicInfo.Username}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[60px]'>
                                            <label className="block text-sm  font-medium text-gray-700 mb-2">
                                                <FaBirthdayCake className="inline w-4 h-4 mr-2" />
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                value={basicInfo.Age}
                                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <label className="block text-sm  font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect x="3" y="5" width="18" height="14" rx="2" ry="2" stroke="currentColor" fill="none" />
                                                    <polyline points="3 7 12 13 21 7" stroke="currentColor" fill="none" />
                                                </svg>
                                                Email
                                            </label>
                                            <input
                                                type="text"
                                                value={basicInfo.Email}
                                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[60px]'>
                                            <label className="block text-sm  font-medium text-gray-700 mb-2">
                                                <FaLock className="inline w-4 h-4 mr-2" />
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Enter a new password"
                                                value={basicInfo.password}
                                                onChange={(e) => setBasicInfo((prev) => ({ ...prev, password: e.target.value }))}
                                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaVenusMars className="inline w-4 h-4 mr-2" />
                                                Gender
                                            </label>
                                            <div className="flex space-x-4">
                                                {['Male', 'Female', 'Other'].map((gender) => (
                                                    <button
                                                        key={gender}
                                                        onClick={() => handleInputChange('gender', gender)}
                                                        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${basicInfo.gender === gender
                                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                                            : 'border-gray-300 text-gray-600 hover:border-teal-300'
                                                            }`}
                                                    >
                                                        {gender}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='w-[40%] ml-[60px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 1 0-8 0v4" />
                                                    <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 16h6" />
                                                </svg>
                                                Role
                                            </label>
                                            <div className=" flex items-center gap-5">
                                                {[
                                                    {
                                                        value: 'patient',
                                                        label: ' Patient',
                                                        description: 'I need health monitoring and care',
                                                        icon: '🌱'
                                                    },
                                                    {
                                                        value: 'caregiver',
                                                        label: 'Caregiver',
                                                        description: 'I provide care for someone else',
                                                        icon: '🤝'
                                                    }
                                                ].map((role) => (
                                                    <button
                                                        key={role.value}
                                                        onClick={() => setBasicInfo((prev) => ({ ...prev, Role: role.value }))}
                                                        className={`w-1/2  p-2 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${basicInfo.Role === role.value
                                                            ? 'border-teal-500 bg-teal-50 shadow-lg'
                                                            : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`text-2xl ${basicInfo.Role === role.value ? 'animate-pulse' : ''}`}>
                                                                {role.icon}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className={`font-semibold text-lg ${basicInfo.Role === role.value ? 'text-teal-700' : 'text-gray-800'
                                                                    }`}>
                                                                    {role.label}
                                                                </div>
                                                                <div className={`text-sm ${basicInfo.Role === role.value ? 'text-teal-600' : 'text-gray-500'
                                                                    }`}>
                                                                    {role.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='w-[50%]'>
                                            <label className="block text-sm  font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-5.373-8-9.5A8 8 0 0 1 20 11.5C20 15.627 16.418 21 12 21z" />
                                                    <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                value={basicInfo.Location}
                                                onChange={(e) => setBasicInfo((prev) => ({ ...prev, Location: e.target.value }))}
                                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[60px]'>
                                            <label className="block text-sm  font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-5.373-8-9.5A8 8 0 0 1 20 11.5C20 15.627 16.418 21 12 21z" />
                                                    <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                                                </svg>
                                                Start of Application Date
                                            </label>
                                            <input
                                                type="text"
                                                value={basicInfo.StartDate}
                                                onChange={(e) => setBasicInfo((prev) => ({ ...prev, StartDate: e.target.value }))}
                                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaVenusMars className="inline w-4 h-4 mr-2" />
                                                Date of Birth
                                            </label>
                                            <input
                                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                type="date" name="" id="" />
                                        </div>
                                        <div className='w-[40%] ml-[60px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <FaVenusMars className="inline w-4 h-4 mr-2" />
                                                Contact No.
                                            </label>
                                            <input
                                                className="w-full px-4 py-3 border outline-none border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                                type="number" />
                                        </div>


                                    </div>
                                </motion.div>
                            )}

                            //Vitals and Measurements
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-6">
                                        <FaHeartbeat className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                                        <h2 className="text-2xl font-semibold text-gray-800">Vitals Details</h2>
                                       
                                    </div>

                                    <div className="space-y-6 flex flex-wrap items-center gap-5">
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Heart Rate: {vitalSigns.HeartRate} BPM
                                            </label>
                                            <input
                                                type="range"
                                                min="40"
                                                max="200"
                                                value={vitalSigns.HeartRate}
                                                onChange={(e) => setVitalSigns((prev) => ({ ...vitalSigns, HeartRate: e.target.value }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <rect x="3" y="7" width="8" height="10" rx="2" ry="2" stroke="currentColor" fill="none" />
                                                    <circle cx="7" cy="12" r="2" stroke="currentColor" fill="none" />
                                                    <path d="M11 12h2a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-1" stroke="currentColor" fill="none" />
                                                </svg>
                                                Blood Sugar: {vitalSigns.BloodPressure} mg/dL
                                            </label>
                                            <input
                                                type="range"
                                                min="80"
                                                max="200"
                                                value={vitalSigns.BloodPressure}
                                                onChange={(e) => setVitalSigns((prev) => ({ ...vitalSigns, BloodPressure: e.target.value }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" fill="none" />
                                                    <line x1="12" y1="14" x2="12" y2="22" stroke="#F59E42" strokeWidth="2" />
                                                    <circle cx="12" cy="19" r="2" fill="#F59E42" />
                                                </svg>
                                                Body Temperature: {vitalSigns.BodyTemperature} F
                                            </label>
                                            <input
                                                type="range"
                                                min="90"
                                                max="110"
                                                value={vitalSigns.BodyTemperature}
                                                onChange={(e) => setVitalSigns((prev) => ({ ...vitalSigns, BodyTemperature: e.target.value }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M4 12c2-4 6-4 8 0s6 4 8 0" stroke="currentColor" strokeWidth="2" fill="none" />
                                                    <circle cx="12" cy="12" r="2" stroke="currentColor" fill="none" />
                                                    <path d="M12 14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                Respiratory Rate: {vitalSigns.RespiratoryRate} min
                                            </label>
                                            <input
                                                type="range"
                                                min="8"
                                                max="40"
                                                value={vitalSigns.RespiratoryRate}
                                                onChange={(e) => setVitalSigns((prev) => ({ ...vitalSigns, RespiratoryRate: e.target.value }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="9" stroke="#38BDF8" strokeWidth="2" fill="none" />
                                                    <path d="M8 14c1.5-2 6.5-2 8 0" stroke="#38BDF8" strokeWidth="2" fill="none" />
                                                    <circle cx="12" cy="12" r="3" fill="#38BDF8" />
                                                    <text x="12" y="17" textAnchor="middle" fontSize="4" fill="#38BDF8" fontFamily="Arial" dy=".3em">O₂</text>
                                                </svg>
                                                Oxygen Saturation(SpO2): {vitalSigns.OxygenSaturation} %
                                            </label>
                                            <input
                                                type="range"
                                                min="70"
                                                max="100"
                                                value={vitalSigns.OxygenSaturation}
                                                onChange={(e) => setVitalSigns((prev) => ({ ...vitalSigns, OxygenSaturation: e.target.value }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="9" stroke="#38BDF8" strokeWidth="2" fill="none" />
                                                    <path d="M8 14c1.5-2 6.5-2 8 0" stroke="#38BDF8" strokeWidth="2" fill="none" />
                                                    <circle cx="12" cy="12" r="3" fill="#38BDF8" />
                                                    <text x="12" y="17" textAnchor="middle" fontSize="4" fill="#38BDF8" fontFamily="Arial" dy=".3em">O₂</text>
                                                </svg>
                                                Hydration : {vitalSigns.HydrationStreak} %
                                            </label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={vitalSigns.HydrationStreak}
                                                onChange={(e) => setVitalSigns((prev) => ({ ...vitalSigns, HydrationStreak: e.target.value }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>


                                    </div>
                                </motion.div>
                            )}

                            //Physical Measurements

                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-6">
                                        <FaRunning className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                                        <h2 className="text-2xl font-semibold text-gray-800"> Physical Measurements</h2>
                                       
                                    </div>

                                    <div className="space-y-6 flex flex-wrap items-center gap-5">
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                                Enter your Weight(kg)
                                            </label>
                                            <input
                                                type="number"
                                                value={physicalMeasurements.Weight}
                                                onChange={(e) => setPhysicalMeasurements((prev) => ({ ...physicalMeasurements, Weight: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Enter your Height(cm)
                                            </label>
                                            <input
                                                type="number"
                                                value={physicalMeasurements.Height}
                                                onChange={(e) => setPhysicalMeasurements((prev) => ({ ...physicalMeasurements, Height: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Your BMI
                                            </label>
                                            <input
                                                type="number"
                                                value={

                                                    physicalMeasurements.BMI = (physicalMeasurements.Weight / ((physicalMeasurements.Height*100) * (physicalMeasurements.Height*100) ))
                                                }
                                                onChange={(e) => setPhysicalMeasurements((prev) => ({ ...physicalMeasurements, BMI: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Waist Circumference: {physicalMeasurements.WaistCircumference} (inches)
                                            </label>
                                            <input
                                                type="range"
                                                min={10}
                                                max={100}
                                                value={physicalMeasurements.WaistCircumference}
                                                onChange={(e) => setPhysicalMeasurements((prev) => ({ ...physicalMeasurements, WaistCircumference: e.target.value }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                            />
                                        </div>
                                    </div>


                                </motion.div>
                            )}



                            {currentStep === 4 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-6">
                                        <FaRunning className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                                        <h2 className="text-2xl font-semibold text-gray-800"> Activity,Fitness,Sleep & Wellness</h2>
                    
                                    </div>

                                    <div className="space-y-6 flex flex-wrap items-center gap-5">
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                                Enter your daily step goal
                                            </label>
                                            <input
                                                type="number"
                                                value={fitness.DailyStepGoal}
                                                onChange={(e) => setFitness((prev) => ({ ...fitness, DailyStepGoal: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Enter your average daily steps
                                            </label>
                                            <input
                                                type="number"
                                                value={fitness.AverageStep}
                                                onChange={(e) => setFitness((prev) => ({ ...fitness, AverageStep: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Enter your exercise frequency(Days per Week)
                                            </label>
                                            <input
                                                type="number"
                                                value={
                                                    fitness.ExerciseFreq
                                                }
                                                onChange={(e) => setFitness((prev) => ({ ...fitness, ExerciseFreq: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Enter your exercise Duration
                                            </label>
                                            <input
                                                type="number"
                                                value={fitness.ExerciseDur}
                                                onChange={(e) => setFitness((prev) => ({ ...fitness, ExerciseDur: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[50%] '>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Select your Activity Level
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Sedentary", "Light", "Moderate", "Very", "Active"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setFitness((prev) => ({ ...fitness, ActivityLevel: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer     rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${fitness.ActivityLevel === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='w-[40%] ml-[30px] '>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Select your Sleep Quality
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Poor", "Fair", "Good", "Excellent"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setFitness((prev) => ({ ...fitness, SleepQuality: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer     rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${fitness.SleepQuality === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='w-[50%] '>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Select your Stress Level
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Low", "Medium", "High"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setFitness((prev) => ({ ...fitness, StressLevel: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${fitness.StressLevel === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Enter your average sleep hrs(Per night)
                                            </label>
                                            <input
                                                type="number"
                                                value={fitness.AverageSleep}
                                                onChange={(e) => setFitness((prev) => ({ ...fitness, AverageSleep: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Enter your sleep goal (hrs)
                                            </label>
                                            <input
                                                type="number"
                                                value={fitness.SleepSchedule}
                                                onChange={(e) => setFitness((prev) => ({ ...fitness, SleepSchedule: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>


                                </motion.div>
                            )}

                            {currentStep === 5 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-10">
                                        <FaRunning className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                                        <h2 className="text-2xl font-semibold text-gray-800"> Medical Conditions & LifeStyle Factors.</h2>
                                        
                                    </div>

                                    <div className="space-y-6 flex flex-wrap items-center gap-5">
                                        <div className='w-[50%]'>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                </svg>
                                                Enter your daily target(liters)
                                            </label>
                                            <input
                                                type="number"
                                                value={medicalConditions.WaterIntake}
                                                onChange={(e) => setMedicalConditions((prev) => ({ ...medicalConditions, WaterIntake: e.target.value }))}
                                                className="w-full  px-4 py-3 outline-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Alcohol Consumption
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Light", "Moderate","High"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setMedicalConditions((prev) => ({ ...medicalConditions, AlcoholConsumption: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer     rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${medicalConditions.AlcoholConsumption === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            
                                        </div>
                                        <div className='w-[50%]'>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Select Caffeine Source
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Coffee", "Tea"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setMedicalConditions((prev) => ({ ...medicalConditions, CaffeineConsumption: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer     rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${medicalConditions.CaffeineConsumption === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Caffeine Consumption
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Low", "Moderate","High"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setMedicalConditions((prev) => ({ ...medicalConditions, CaffeineConsumptionAmount: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer     rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${medicalConditions.CaffeineConsumptionAmount === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='w-[50%]'>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Dietary Preference
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Vegeterian", "Non-Vegeterian", "Mixed"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setMedicalConditions((prev) => ({ ...medicalConditions, DietaryPref: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer     rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${medicalConditions.DietaryPref === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='w-[40%] ml-[30px]'>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 21s-4.5-4.36-7.5-7.5C2.42 11.42 2 9.5 2 8a6 6 0 0 1 12 0c0 1.5-.42 3.42-2.5 5.5C16.5 16.64 21 21 21 21" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                    <polyline points="8 13 10.5 16 15.5 9" stroke="#10B981" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                               Smoking Status
                                            </label>
                                            <div className='flex flex-wrap items-center gap-2'>
                                                {["Never", "Former", "Current"].map((activity, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            onClick={(e) => setMedicalConditions((prev) => ({ ...medicalConditions, SmokingStatus: activity }))}
                                                            className={`h-[50px] flex items-center justify-center  w-[120px] border-2 cursor-pointer     rounded-[25px] outline-none border-gray-200 bg-white hover:border-teal-300 hover:bg-teal-25 ${medicalConditions.SmokingStatus === activity && 'border-teal-500 bg-teal-50 shadow-lg '}`}>
                                                            {activity}
                                                        </div>
                                                    )
                                                })}
                                            </div>


                                        </div>
                                    </div>


                                </motion.div>
                            )}

                        {/* Emergency Contact Section - Only show at last step */}
                        {currentStep === 6 && (
                            <motion.div
                                key="emergency-contact"
                                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                                transition={{ type: "spring", stiffness: 120, damping: 12 }}
                                className="mt-10 flex flex-col items-center"
                            >
                                <div className="relative w-full max-w-2xl mb-8">
                                    {/* Animated Big Red Emergency Bus */}
                                    <motion.div
                                        initial={{ x: -300, scale: 0.8 }}
                                        animate={{ x: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 70, damping: 12 }}
                                        className="flex items-end"
                                    >
                                        {/* Big Red Bus SVG */}
                                        <svg width="320" height="120" viewBox="0 0 320 120" fill="none" className="drop-shadow-2xl">
                                            {/* Main body */}
                                            <rect x="20" y="40" width="260" height="50" rx="18" fill="#ef4444" />
                                            {/* Windows */}
                                            <rect x="40" y="50" width="40" height="25" rx="5" fill="#fff" />
                                            <rect x="90" y="50" width="40" height="25" rx="5" fill="#fff" />
                                            <rect x="140" y="50" width="40" height="25" rx="5" fill="#fff" />
                                            <rect x="190" y="50" width="40" height="25" rx="5" fill="#fff" />
                                            <rect x="240" y="50" width="30" height="25" rx="5" fill="#fff" />
                                            {/* Wheels */}
                                            <circle cx="60" cy="100" r="15" fill="#222" />
                                            <circle cx="220" cy="100" r="15" fill="#222" />
                                            {/* Headlights */}
                                            <rect x="270" y="70" width="12" height="12" rx="3" fill="#f87171" />
                                            <rect x="28" y="70" width="12" height="12" rx="3" fill="#fbbf24" />
                                            {/* SOS text */}
                                            <text x="150" y="80" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" style={{ letterSpacing: 2 }}>SOS</text>
                                            {/* Siren */}
                                            <ellipse cx="150" cy="38" rx="18" ry="7" fill="#f87171" opacity="0.7">
                                                <animate attributeName="opacity" values="0.7;1;0.7" dur="1.2s" repeatCount="indefinite" />
                                            </ellipse>
                                            {/* Door */}
                                            <rect x="270" y="60" width="10" height="30" rx="2" fill="#fff" />
                                        </svg>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="ml-8"
                                        >
                                            <span className="text-2xl font-bold text-red-700 flex items-center">
                                                <FaPhoneAlt className="mr-2 text-red-500" />
                                                Add Emergency Contact Details
                                            </span>
                                            <span className="block text-gray-500 text-sm mt-1">
                                                Please provide the name and number of your emergency contact.
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                    className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center"
                                >
                                    <div className="w-full flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <label className="block text-md font-medium text-gray-700 mb-2 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.304.534 6.121 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Emergency Contact Name
                                            </label>
                                            <motion.input
                                                type="text"
                                                placeholder="Enter contact person's name"
                                                value={medicalConditions.EmergencyContactName || ""}
                                                onChange={e => setMedicalConditions(prev => ({ ...prev, EmergencyContactName: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-lg transition-all"
                                                whileFocus={{ scale: 1.03, boxShadow: "0 0 0 2px #ef4444" }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-md font-medium text-gray-700 mb-2 flex items-center">
                                                <FaPhoneAlt className="text-red-500 mr-2" />
                                                Emergency Contact Number
                                            </label>
                                            <motion.input
                                                type="tel"
                                                pattern="[0-9]{10,15}"
                                                placeholder="Enter emergency contact number"
                                                value={medicalConditions.EmergencyContact || ""}
                                                onChange={e => setMedicalConditions(prev => ({ ...prev, EmergencyContact: e.target.value }))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-transparent text-lg transition-all"
                                                whileFocus={{ scale: 1.03, boxShadow: "0 0 0 2px #ef4444" }}
                                            />
                                        </div>
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1 }}
                                        className="mt-4 text-gray-500 text-sm flex items-center"
                                    >
                                        <FaInfoCircle className="mr-1 text-yellow-500" />
                                        This information will be used in case of emergency. Please double-check for accuracy.
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}





                        </AnimatePresence>

                        <div className="flex justify-between mt-8">
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`flex items-center px-6 py-3 rounded-xl border-2 transition-all ${currentStep === 1
                                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'border-teal-500 text-teal-600 hover:bg-teal-50'
                                    }`}
                            >
                                <FaArrowLeft className="w-4 h-4 mr-2" />
                                Previous
                            </button>

                            {currentStep < 6 ? (
                                <button
                                    onClick={nextStep}
                                    className="flex items-center px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all"
                                >
                                    Next
                                    <FaArrowRight className="w-4 h-4 ml-2" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition-all"
                                >
                                    Complete Setup
                                    <FaCheck className="w-4 h-4 ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #14b8a6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
        </div>
    );
}

export default OnboardingPageComponent;
