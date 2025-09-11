import React, { useContext, useEffect, useState } from 'react'
import {
    FaHome,
    FaTint,
    FaWalking,
    FaBed,
    FaPills,
    FaUserFriends,
    FaRobot,
    FaCog,
    FaSignOutAlt,
    FaSearch,
    FaHeart,
    FaClock,
    FaChartLine,
    FaPlus
} from 'react-icons/fa'
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import WaterIntakeComponent from './WaterIntakeComponent'
import SettingsComponent from './SettingsComponent'
import SleepLoggerComponent from './SleepLoggerCounter'
import StepCounterComponent from './StepCounterComponent'
import MedicationComponent from './MedicationComponent'
import ReminderComponent from './ReminderComponent'
import CaregiverComponent from './CaregiverComponent'
import MediPalAssistantComponent from './MediPalAssitantComponent'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../utils/UserContextComponent'
import { toast } from 'react-toastify'
import profile from '../Animations/profileImage.jpg'


function DashboardComponent({ children }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [vit, setVit] = useState(() => {
        const savedVitals = localStorage.getItem('Health-Related-Data');
        return savedVitals ? JSON.parse(savedVitals) : ''
    });
    const [goalInput, setGoalInput] = useState([]);
    const [currentGoal, setCurrentGoal] = useState('');
    const userRole = JSON.parse(localStorage.getItem('User-Role'));
    const { user, setUser } = useContext(UserContext);

    const sidebarTabs = [
        { id: 'Dashboard', icon: FaHome, label: 'Dashboard' },
        { id: 'Water Intake', icon: FaTint, label: 'Water Intake' },
        { id: 'Step Counter', icon: FaWalking, label: 'Step Counter' },
        { id: 'Sleep Logger', icon: FaBed, label: 'Sleep Logger' },
        { id: 'Medication', icon: FaPills, label: 'Medication' },
        { id: 'Reminders', icon: FaClock, label: 'Reminders' },
        { id: 'Caregiver', icon: FaUserFriends, label: 'Caregiver' },
        { id: 'MediPal Assistant', icon: FaRobot, label: 'MediPal Assistant' },
        { id: 'Settings', icon: FaCog, label: 'Settings' },
    ]




    const [weeks, setWeeks] = useState([
        // Dynamically generate weeks based on the current month
        ...(() => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth();
            // Get the first and last day of the month
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            // Calculate the week number for the first and last day
            // Week starts on Sunday (0)
            const getWeekOfMonth = (date) => {
                const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const dayOfWeek = firstDayOfMonth.getDay();
                // Calculate offset for the first week
                return Math.ceil((date.getDate() + dayOfWeek) / 7);
            };
            const totalWeeks = getWeekOfMonth(lastDay);
            // Generate week objects
            return Array.from({ length: totalWeeks }, (_, i) => ({
                week: `Week ${i + 1}`,
                heartRate: 0,
                pulse: 0,
                temperature: 0,
                bloodSugar: 0
            }));
        })()
    ]);

    // Handler to update a week's value based on user input
    const handleWeekValueChange = (weekIndex, attribute, newValue) => {
        setWeeks(prevWeeks =>
            prevWeeks.map((w, idx) =>
                idx === weekIndex ? { ...w, [attribute]: Number(newValue) } : w
            )
        );
    };

    useEffect(()=>{
        handleWeekValueChange(2, 'heartRate', 127);//calls with values 
        handleWeekValueChange(4, 'pulse', 80);//calls with values 
        handleWeekValueChange(1, 'temperature', 98.6);//calls with values 
        handleWeekValueChange(3, 'bloodSugar', 110);//calls with values 
    },[])

    const handleGoalSubmit = (e) => {
        e.preventDefault()
        console.log(currentGoal)
        if (currentGoal === '') {
            alert("Write Something..");
            return;
        }

        setGoalInput((prev) => [...prev, currentGoal]);
        setCurrentGoal('');
    }

    const handleLogOut = () => {
        localStorage.removeItem('User-Data-Information');
        localStorage.removeItem('token');
        localStorage.clear();
        setUser(null);

        toast.success('User logged out successfully', {
            position: "top-center",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }
    const [filterSideBarTabs,setFilterSidebarTabs] = useState([]);

    useEffect(()=>{
        if(userRole === 'patient'){
            setFilterSidebarTabs(sidebarTabs.filter((tab) => tab.id !== 'Caregiver'));
        } else {
            setFilterSidebarTabs(sidebarTabs);
        }
    },[userRole])

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-64 bg-white shadow-lg hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">MediPal</h1>
                    <p className="text-gray-500 text-sm">Smart Healthcare Assistant</p>
                </div>

                <div className={`bg-transparent  bg-cover bg-center rounded-full w-36 h-36 border-1 border-zinc-900  ml-[40px]`}>
                    <img
                        src={user.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>

                <nav className="mt-8">
                    {filterSideBarTabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            tab.id == "Settings" ? (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-6 py-3 text-left mt-17 transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="mr-3 text-lg" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ) : (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-6 py-3 text-left transition-colors ${activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="mr-3 text-lg" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            )

                        )
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex  flex-col">
                {/* Top Header */}
                <header className="bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search health records, medications..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Notifications">
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 1 0-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 0 0 6 19h12a1 1 0 0 0 .71-1.71L18 16zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" fill="#2563eb" />
                                <circle cx="18" cy="6" r="3" fill="#ef4444" />
                            </svg>
                            <span className="sr-only">View notifications</span>
                        </button>
                        <button
                            onClick={() => {
                                handleLogOut();
                            }}
                            className="ml-4 bg-red-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-red-700 cursor-pointer transition-colors">
                            Log Out
                        </button>

                        <h1
                            onClick={() => {
                                navigate('/profile')
                            }}
                            className="font-bold text-[20px] ml-5 cursor-pointer font-stretch-expanded  capitalize">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="black"
                                className="inline-block align-middle mr-2"
                            >
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-3.3137 3.134-6 8-6s8 2.6863 8 6v1H4v-1z" />
                            </svg>

                        </h1>
                    </div>
                </header>

                {(activeTab === 'Dashboard') ? (
                    <main className="p-4 md:p-6 overflow-y-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Dashboard Panel */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Welcome Card */}
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Good morning, {user?.fullName?.firstName}!</h2>
                                    <p className="text-gray-600">Here's your health summary for today</p>
                                    <div className="mt-4 flex items-center w-[100%] flex-wrap gap-4">
                                        <div className="bg-white rounded-xl w-[33%]  p-6 shadow-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center">
                                                    <FaClock className="text-yellow-500 text-xl mr-2" />
                                                    <h3 className="font-semibold text-gray-800">Next Dose</h3>
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-gray-800 mb-1">2:30 PM</div>
                                                <p className="text-sm text-gray-600">Blood Pressure Med</p>
                                                <div className="mt-3 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                                                    In 45 minutes
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-green-50 h-[180px] w-[28%] rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Overall Health</p>
                                            <p className="text-lg font-semibold text-green-600">Excellent</p>
                                        </div>
                                        <div className="bg-yellow-50 h-[180px] w-[28%]  rounded-lg p-4">
                                            <p className="text-md  font-semibold text-black">
                                                {(() => {
                                                    const thoughts = [
                                                        "Health is wealth. Take care of your body, it's the only place you have to live.",
                                                        "A healthy outside starts from the inside.",
                                                        "Small daily improvements are the key to staggering long-term results.",
                                                        "Your body hears everything your mind says. Think positive!",
                                                        "Drink water, move your body, and get enough sleep.",
                                                        "Wellness is the natural state of my body.",
                                                        "Every step you take is a step toward better health.",
                                                        "Rest and self-care are so important. Take time to recharge.",
                                                        "Eat well, feel well, live well.",
                                                        "Invest in your health today for a better tomorrow."
                                                    ];
                                                    const today = new Date();
                                                    // Use the day of the year to rotate thoughts
                                                    const start = new Date(today.getFullYear(), 0, 0);
                                                    const diff = today - start;
                                                    const oneDay = 1000 * 60 * 60 * 24;
                                                    const dayOfYear = Math.floor(diff / oneDay);
                                                    const index = dayOfYear % thoughts.length;
                                                    return thoughts[index];
                                                })()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stat Widgets */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                    {/* Heart Rate Widget */}
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">

                                            <div className="flex items-center">
                                                <FaHeart className="text-red-500 text-xl mr-2" />
                                                <h3 className="font-semibold text-gray-800">Heart Rate</h3>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="relative w-20 h-20 mx-auto mb-3">
                                                <svg className="w-22 h-22 transform -rotate-90" viewBox="0 0 36 36">
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        stroke="white"
                                                        strokeWidth="3"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        stroke="red"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${(vit?.HeartRate ? Math.min(Number(vit?.HeartRate), 200) / 200 * 100 : 0) * 1.005}, 100`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>

                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold text-gray-800">{vit?.HeartRate}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600">bpm</p>
                                        </div>
                                    </div>

                                    {/* Hydration Widget */}
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <FaTint className="text-blue-500 text-xl mr-2" />
                                                <h3 className="font-semibold text-gray-800">Hydration</h3>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="relative w-20 h-20 mx-auto mb-3">
                                                <svg className="w-22 h-22 transform -rotate-90" viewBox="0 0 36 36">
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        stroke="white"
                                                        strokeWidth="3"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        stroke="#10B981"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${(vit?.HydrationStreak ? Math.min(Number(vit?.HydrationStreak), 100) : 0) * 1.005}, 100`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>

                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold text-gray-800">{vit?.HydrationStreak}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Oxygen Saturation Widget */}
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center">
                                                <FaChartLine className="text-blue-400 text-xl mr-2" />
                                                <h3 className="font-semibold text-gray-800">Oxygen Saturation</h3>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="relative w-20 h-20 mx-auto mb-3">
                                                {/* Circular Progress Bar for Oxygen Saturation */}
                                                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        stroke="#e5e7eb"
                                                        strokeWidth="3"
                                                    />
                                                    <circle
                                                        cx="18"
                                                        cy="18"
                                                        r="16"
                                                        fill="none"
                                                        stroke="#3b82f6"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${(vit?.OxygenSaturation ? Math.min(Number(vit?.OxygenSaturation), 100) : 0) * 1.005}, 100`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-xl font-bold text-gray-800">{vit?.OxygenSaturation}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600">SpO₂ %</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Health Statistics Chart */}
                                <div className="bg-white rounded-xl p-6 shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Health Statistics</h3>
                                        <div className="flex items-center">
                                            {(() => {
                                                const months = [
                                                    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                                ];
                                                const currentMonthIdx = new Date().getMonth();
                                                return (
                                                    <>
                                                        <span className="text-gray-500 text-sm font-bold">
                                                            {months[currentMonthIdx]} {new Date().getDate()}, {new Date().getFullYear()}
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    {/* Health Statistics Chart Area */}
                                    <div className="space-y-6">
                                        {/* Heart Rate Chart */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-3">Heart Rate (BPM)</h4>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={weeks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="week" />
                                                    <YAxis domain={[60, 100]} />
                                                    <Tooltip />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="heartRate"
                                                        stroke="#ef4444"
                                                        strokeWidth={3}
                                                        dot={{ r: 5 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Pulse Chart */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-3">Pulse (BPM)</h4>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={weeks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="week" />
                                                    <YAxis domain={[60, 100]} />
                                                    <Tooltip />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="pulse"
                                                        stroke="#3b82f6"
                                                        strokeWidth={3}
                                                        dot={{ r: 5 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Temperature Chart */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-3">Temperature (°F)</h4>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={weeks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="week" />
                                                    <YAxis domain={[95, 102]} />
                                                    <Tooltip />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="temperature"
                                                        stroke="#f59e0b"
                                                        strokeWidth={3}
                                                        dot={{ r: 5 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>

                                        {/* Blood Sugar Chart */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-3">Blood Sugar (mg/dL)</h4>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={weeks} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="week" />
                                                    <YAxis domain={[80, 140]} />
                                                    <Tooltip />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="bloodSugar"
                                                        stroke="#10b981"
                                                        strokeWidth={3}
                                                        dot={{ r: 5 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar - Goals Panel */}
                            <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] justify-between">
                                <div className="bg-white h-[800px] rounded-xl p-6 shadow-sm flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Health Goals</h3>
                                    <form
                                        onSubmit={(e) => {
                                            handleGoalSubmit(e);
                                        }}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <textarea
                                                value={currentGoal}
                                                onChange={(e) => setCurrentGoal(e.target.value)}
                                                placeholder="Enter your health goal..."
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                rows="3"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Add Goal
                                        </button>
                                    </form>

                                    <div className="mt-6 flex-1 flex flex-col">
                                        {goalInput.length > 0 ?
                                            goalInput?.map((goal, idx) => {
                                                return (

                                                    <div key={idx} className="flex items-center mb-2">
                                                        <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <circle cx="10" cy="10" r="10" />
                                                            <path d="M7 10l2 2 4-4" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                        <span className="text-gray-700">{goal}</span>
                                                    </div>
                                                )

                                            })
                                            : 'No Goals Listed.'}

                                    </div>
                                </div>
                                <div className="flex flex-col mt-100 items-center justify-end flex-1 min-h-0 pb-6">
                                    {/* SVG Illustration: Doctor in Smartphone - Scaled to fill bottom */}
                                    <div className="w-full flex-1 flex items-end justify-center">
                                        <svg
                                            width="100%"
                                            height="100%"
                                            viewBox="0 0 320 420"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mb-4 max-w-[320px] max-h-[420px] w-full h-full"
                                            style={{ minHeight: 320, minWidth: 220 }}
                                        >
                                            <rect x="60" y="30" width="200" height="340" rx="36" fill="#E6F9F5" />
                                            <rect x="80" y="55" width="160" height="280" rx="24" fill="#fff" />
                                            {/* Doctor's Body */}
                                            <ellipse cx="160" cy="220" rx="48" ry="60" fill="#B2F2E9" />
                                            {/* Doctor's Head */}
                                            <ellipse cx="160" cy="140" rx="34" ry="34" fill="#FFD6E0" />
                                            {/* Doctor's Hair */}
                                            <ellipse cx="160" cy="132" rx="24" ry="16" fill="#A3A3A3" />
                                            {/* Doctor's Face Details */}
                                            <ellipse cx="150" cy="148" rx="3" ry="3" fill="#7C5E5E" />
                                            <ellipse cx="170" cy="148" rx="3" ry="3" fill="#7C5E5E" />
                                            <path d="M154 158 Q160 166 166 158" stroke="#7C5E5E" strokeWidth="2" fill="none" />
                                            {/* Doctor's Coat */}
                                            <path d="M120 250 Q160 300 200 250 Q180 270 160 270 Q140 270 120 250Z" fill="#fff" />
                                            {/* Stethoscope */}
                                            <circle cx="160" cy="260" r="10" fill="#E6F9F5" stroke="#10B981" strokeWidth="3" />
                                            <path d="M160 260 Q160 270 170 274" stroke="#10B981" strokeWidth="3" fill="none" />
                                            <circle cx="174" cy="276" r="3" fill="#10B981" />
                                            {/* Thumbs Up Hand */}
                                            <g>
                                                <rect x="210" y="200" width="28" height="16" rx="8" fill="#FFD6E0" />
                                                <rect x="232" y="184" width="16" height="36" rx="8" fill="#FFD6E0" />
                                                <rect x="229" y="180" width="10" height="12" rx="5" fill="#FFD6E0" />
                                            </g>
                                            {/* Chat Bubbles */}
                                            <g>
                                                <rect x="90" y="80" width="48" height="24" rx="12" fill="#B2F2E9" />
                                                <rect x="182" y="96" width="48" height="24" rx="12" fill="#FFD6E0" />
                                                <rect x="110" y="320" width="54" height="22" rx="11" fill="#B2F2E9" />
                                                <rect x="180" y="300" width="45" height="18" rx="9" fill="#FFD6E0" />
                                            </g>
                                            {/* Medical Cross Overlay */}
                                            <g>
                                                <rect x="240" y="45" width="42" height="42" rx="21" fill="#fff" stroke="#10B981" strokeWidth="3" />
                                                <rect x="258" y="58" width="6" height="18" rx="3" fill="#10B981" />
                                                <rect x="250" y="68" width="24" height="6" rx="3" fill="#10B981" />
                                            </g>
                                        </svg>
                                    </div>
                                    <div className="text-center w-full">
                                        <h4 className="text-2xl font-semibold mb-2" style={{ color: "#10B981" }}>MediPal Assistant</h4>
                                        <p className="text-gray-500 text-base mb-2">
                                            Ask me anything about your health, medication, or wellness. <br />
                                            I'm here to help you 24/7!
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1"></div>
                            </div>
                        </div>
                    </main>
                ) : (activeTab === 'Water Intake') ? (
                    navigate('/waterIntake')
                ) : (activeTab === 'Step Counter') ? (
                    navigate('/Step Counter')
                ) : (activeTab === 'Sleep Logger') ? (
                    navigate('/Sleep Logger')
                ) : (activeTab === 'Medication') ? (
                    navigate('/Medication')
                ) : (activeTab === 'Reminders') ? (
                    navigate('/Reminders')
                ) : (activeTab === 'Caregiver') ? (
                    navigate('/Caregiver')
                ) : (activeTab === 'MediPal Assistant') ? (
                    navigate('/MediPal Assitant')
                ) : (activeTab === 'Settings') ? (
                    <SettingsComponent />
                ) : null}



            </div>
        </div>
    )
}

export default DashboardComponent
