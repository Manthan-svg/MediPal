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
import confetti from 'canvas-confetti';


// Month names for X axis and data
const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Weekday names for weekly chart
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeeksInMonth(year, month) {
    // Returns an array of { label, value, days: [dates] }
    const weeks = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let current = new Date(firstDay);
    let weekIndex = 1;
    while (current <= lastDay) {
        const weekStart = new Date(current);
        const weekEnd = new Date(current);
        weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
        if (weekEnd > lastDay) weekEnd.setDate(lastDay.getDate());
        // Collect all days in this week
        const days = [];
        let dayIter = new Date(weekStart);
        while (dayIter <= weekEnd && dayIter.getMonth() === month) {
            days.push(new Date(dayIter));
            dayIter.setDate(dayIter.getDate() + 1);
        }
        weeks.push({
            label: `Week ${weekIndex} (${weekStart.getDate()}-${weekEnd.getDate()})`,
            value: `${year}-${month + 1}-${weekIndex}`,
            days,
            weekIndex
        });
        weekIndex++;
        current = new Date(weekEnd);
        current.setDate(current.getDate() + 1);
    }
    return weeks;
}

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
    const [chartRange, setChartRange] = useState("month"); // "month" or "week"
    const [selectedChart, setSelectedChart] = useState("heartRate"); // "heartRate", "pulse", "temperature", "bloodSugar"
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedWeek, setSelectedWeek] = useState(""); // week value string
    const [monthlyDataFiltered, setMonthlyDataFiltered] = useState([]);
    const [weeklyDataFiltered, setWeeklyDataFiltered] = useState([]);
    const [availableWeeks, setAvailableWeeks] = useState([]);

    // Sidebar tabs
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

    // Monthly data for each attribute
    const [monthlyData, setMonthlyData] = useState(() =>
        MONTHS.map((month, idx) => ({
            month,
            heartRate: 0,
            pulse: 0,
            temperature: 0,
            bloodSugar: 0
        }))
    );

    // Simulated daily data for weekly chart (for demo)
    // In real app, fetch this from backend or localStorage
    const [dailyData, setDailyData] = useState(() => {
        // For each day in the current month, generate random data
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let arr = [];
        for (let d = 1; d <= daysInMonth; d++) {
            arr.push({
                date: new Date(year, month, d),
                day: WEEK_DAYS[new Date(year, month, d).getDay()],
                heartRate: 70 + Math.floor(Math.random() * 30),
                pulse: 65 + Math.floor(Math.random() * 20),
                temperature: 97 + Math.random() * 3,
                bloodSugar: 90 + Math.floor(Math.random() * 40)
            });
        }
        return arr;
    });

    // Handler to update a month's value based on user input
    const handleMonthValueChange = (monthIndex, attribute, newValue) => {
        setMonthlyData(prev =>
            prev.map((m, idx) =>
                idx === monthIndex ? { ...m, [attribute]: Number(newValue) } : m
            )
        );
    };


    // Example: Set some demo values for demonstration
    useEffect(() => {
        handleMonthValueChange(0, 'heartRate', 75); // Jan
        handleMonthValueChange(1, 'heartRate', 80); // Feb
        handleMonthValueChange(2, 'heartRate', 90); // Mar
        handleMonthValueChange(3, 'heartRate', 85); // Apr

        handleMonthValueChange(0, 'pulse', 70);
        handleMonthValueChange(1, 'pulse', 72);
        handleMonthValueChange(2, 'pulse', 74);
        handleMonthValueChange(3, 'pulse', 76);

        handleMonthValueChange(0, 'temperature', 98.2);
        handleMonthValueChange(1, 'temperature', 98.6);
        handleMonthValueChange(2, 'temperature', 99.1);
        handleMonthValueChange(3, 'temperature', 98.7);

        handleMonthValueChange(0, 'bloodSugar', 100);
        handleMonthValueChange(1, 'bloodSugar', 110);
        handleMonthValueChange(2, 'bloodSugar', 120);
        handleMonthValueChange(3, 'bloodSugar', 115);
    }, []);

    // Filter monthly data for selected month
    useEffect(() => {
        setMonthlyDataFiltered(monthlyData);
    }, [monthlyData]);

    // Generate available weeks for selected month
    useEffect(() => {
        const year = new Date().getFullYear();
        const weeks = getWeeksInMonth(year, selectedMonth);
        setAvailableWeeks(weeks);
        // Set default selected week to first week if not set
        if (weeks.length > 0 && (selectedWeek === "" || !weeks.some(w => w.value === selectedWeek))) {
            setSelectedWeek(weeks[0].value);
        }
    }, [selectedMonth]);

    // Filter daily data for selected week
    useEffect(() => {
        if (chartRange === "week" && selectedWeek && availableWeeks.length > 0) {
            const weekObj = availableWeeks.find(w => w.value === selectedWeek);
            if (weekObj) {
                // For each day in the week, find the dailyData entry or fill with nulls
                const weekDaysData = weekObj.days.map(dateObj => {
                    const found = dailyData.find(d =>
                        d.date.getDate() === dateObj.getDate() &&
                        d.date.getMonth() === dateObj.getMonth() &&
                        d.date.getFullYear() === dateObj.getFullYear()
                    );
                    return found
                        ? {
                            ...found,
                            day: WEEK_DAYS[dateObj.getDay()]
                        }
                        : {
                            date: dateObj,
                            day: WEEK_DAYS[dateObj.getDay()],
                            heartRate: null,
                            pulse: null,
                            temperature: null,
                            bloodSugar: null
                        };
                });
                setWeeklyDataFiltered(weekDaysData);
            }
        }
    }, [chartRange, selectedWeek, availableWeeks, dailyData]);

    // For monthly chart, just use monthlyData
    useEffect(() => {
        if (chartRange === "month") {
            setMonthlyDataFiltered(monthlyData);
        }
    }, [chartRange, monthlyData]);

    const handleGoalSubmit = (e) => {
        e.preventDefault()
        if (currentGoal === '') {
            alert("Write Something..");
            return;
        }

        setGoalInput((prev) => [...prev, currentGoal]);
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
        });
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
    const [filterSideBarTabs, setFilterSidebarTabs] = useState([]);

    useEffect(() => {
        if (userRole === 'patient') {
            setFilterSidebarTabs(sidebarTabs.filter((tab) => tab.id !== 'Caregiver'));
        } else {
            setFilterSidebarTabs(sidebarTabs);
        }
    }, [userRole])

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
                                                const currentMonthIdx = new Date().getMonth();
                                                return (
                                                    <>
                                                        <span className="text-gray-500 text-sm font-bold">
                                                            {MONTHS[currentMonthIdx]} {new Date().getDate()}, {new Date().getFullYear()}
                                                        </span>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    {/* Health Statistics Chart Area with Time Range Selector */}
                                    <div className="space-y-6">
                                        {/* Chart Time Range Selector */}
                                        <div className="flex items-center mb-4 gap-4">
                                            <label htmlFor="chartRange" className="font-semibold text-gray-700">
                                                View By:
                                            </label>
                                            <select
                                                id="chartRange"
                                                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={chartRange}
                                                onChange={e => setChartRange(e.target.value)}
                                            >
                                                <option value="month">Month</option>
                                                <option value="week">Week</option>
                                            </select>
                                            {/* If week is selected, show week picker */}
                                            {chartRange === "week" && (
                                                <select
                                                    className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                                                    value={selectedWeek}
                                                    onChange={e => setSelectedWeek(e.target.value)}
                                                >
                                                    {availableWeeks.map((week, idx) => (
                                                        <option key={week.value} value={week.value}>
                                                            {week.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {/* If month is selected, show month picker */}
                                            {chartRange === "month" && (
                                                <select
                                                    className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                                                    value={selectedMonth}
                                                    onChange={e => setSelectedMonth(Number(e.target.value))}
                                                >
                                                    {MONTHS.map((m, idx) => (
                                                        <option key={m} value={idx}>
                                                            {m}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        {/* Chart Type Selector */}
                                        <div className="flex items-center mb-4 gap-4">
                                            <label htmlFor="chartType" className="font-semibold text-gray-700">
                                                Select Chart:
                                            </label>
                                            <select
                                                id="chartType"
                                                className="border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={selectedChart}
                                                onChange={e => setSelectedChart(e.target.value)}
                                            >
                                                <option value="heartRate">Heart Rate</option>
                                                <option value="pulse">Pulse (BPM)</option>
                                                <option value="temperature">Temperature (°F)</option>
                                                <option value="bloodSugar">Blood Sugar (mg/dL)</option>
                                            </select>
                                        </div>

                                        {/* Chart Display */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-lg font-semibold text-gray-700 mb-3">
                                                {selectedChart === "heartRate" && "Heart Rate"}
                                                {selectedChart === "pulse" && "Pulse (BPM)"}
                                                {selectedChart === "temperature" && "Temperature (°F)"}
                                                {selectedChart === "bloodSugar" && "Blood Sugar (mg/dL)"}
                                            </h4>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart
                                                    data={chartRange === "month" ? monthlyDataFiltered : weeklyDataFiltered}
                                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey={chartRange === "month" ? "month" : "day"}
                                                        tickFormatter={chartRange === "week"
                                                            ? (tick) => tick
                                                            : undefined
                                                        }
                                                    />
                                                    <YAxis
                                                        domain={
                                                            selectedChart === "heartRate" || selectedChart === "pulse"
                                                                ? [60, 120]
                                                                : selectedChart === "temperature"
                                                                    ? [95, 102]
                                                                    : [80, 140]
                                                        }
                                                    />
                                                    <Tooltip />
                                                    <Line
                                                        type="monotone"
                                                        dataKey={selectedChart}
                                                        stroke={
                                                            selectedChart === "heartRate"
                                                                ? "#ef4444"
                                                                : selectedChart === "pulse"
                                                                    ? "#3b82f6"
                                                                    : selectedChart === "temperature"
                                                                        ? "#f59e0b"
                                                                        : "#10b981"
                                                        }
                                                        strokeWidth={3}
                                                        dot={{ r: 5 }}
                                                        connectNulls
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
