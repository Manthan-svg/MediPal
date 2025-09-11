import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { FaChartLine, FaClock, FaHeart, FaRegCalendarCheck, FaTint, FaRegLemon, FaHome, FaWalking, FaBed, FaPills, FaUserFriends, FaRobot, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa'
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import SettingsComponent from "./SettingsComponent";
import SleepChart from "./SleepChart";
import { UserContext } from "../utils/UserContextComponent";


const data = [
  { day: "Monday", steps: 3900 },
  { day: "Tuesday", steps: 1200 },
  { day: "Wednesday", steps: 2000 },
  { day: "Thursday", steps: 1300 },
  { day: "Friday", steps: 4800 },
  { day: "Saturday", steps: 3500 },
];

const COLORS = {
  Monday: "#8B5CF6",
  Tuesday: "#FB7185",
  Wednesday: "#22D3EE",
  Thursday: "#FBBF24",
  Friday: "#3B82F6",
  Saturday: "#34D399",
};

const sidebarTabs = [
  { id: 'Dashboard', icon: FaHome, label: 'Dashboard' },
  { id: 'Water Intake', icon: FaTint, label: 'Water Intake' },
  { id: 'Step Counter', icon: FaWalking, label: 'Step Counter' },
  { id: 'Sleep Logger', icon: FaBed, label: 'Sleep Logger' },
  { id: 'Medication', icon: FaPills, label: 'Medication' },
  { id: 'Caregiver', icon: FaUserFriends, label: 'Caregiver' },
  { id: 'MediPal Assistant', icon: FaRobot, label: 'MediPal Assistant' },
  { id: 'Settings', icon: FaCog, label: 'Settings' },
]

export default function SleepLoggerCounter() {
  const navigate = useNavigate();
  const [isSleeping,setIsSleeping] = useState(()=>{
    const savedMode = localStorage.getItem('Sleeping-Mode');
    return savedMode ? JSON.parse(savedMode) : false  ;
  }); 
  const {user,setUser} = useContext(UserContext);
  const [isSleepingDate,setIsSleepingDate] = useState(()=>{
    const savedModeDate = localStorage.getItem('Sleeping-Date');
    if (savedModeDate) {
      return JSON.parse(savedModeDate);
    } else {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  });
  const [isWakingDate,setIsWaking] = useState(()=>{
    const savedWakingMode = localStorage.getItem('Waking-Date');
    if (savedWakingMode) {
      return JSON.parse(savedWakingMode);
    } else {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  });
  const [activeTab, setActiveTab] = useState('Sleep Logger');
  const [totalSleepAmt,setTotalSleepAmt] = useState(0);
  const [totalDailySleepAmt,setTotalDailySleepAmt] = useState(0);
  const userRole = JSON.parse(localStorage.getItem('User-Role'));
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
        }
    },[userRole])


  useEffect(()=>{
    const totalHrs = Number(isWakingDate?.split(':')[0]) - Number(isSleepingDate?.split(':')[0]);
    const totalTime = Number(isWakingDate?.split(':')[1]) - Number(isSleepingDate?.split(':')[1]);

    const totalHrsNum = Number(totalHrs);
    const totalTimeNum = Number(totalTime);
    if (isNaN(totalHrsNum) || isNaN(totalTimeNum)) {
      setTotalSleepAmt(0);
    } else {
      setTotalSleepAmt(`${totalHrsNum} : ${totalTimeNum}`);
    }
  },[isWakingDate])

  useEffect(()=>{
    const t = Number(isWakingDate?.split(':')[0]) - Number(isSleepingDate?.split(':')[0]);
    setTotalDailySleepAmt((prev) => {
      const prevVal = isNaN(Number(prev)) ? 0 : Number(prev);
      const tVal = isNaN(Number(t)) ? 0 : Number(t);
      return prevVal + tVal;
    });
  },[isWakingDate])


  return (
   <div className="flex">
    <div className="w-64 h-full bg-white shadow-lg hidden md:block fixed">
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


      {(activeTab === 'Sleep Logger') ? (
        <div className="flex flex-col w-full ml-[260px]">
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

              <div className='p-4 md:p-6 overflow-y-auto flex items-center justify-between'>
              <div className='w-[60%] h-full flex flex-col '>
                <div className="flex rounded-lg shadow-lg items-center justify-between gap-4 bg-white w-full p-7 ">
                  {/* Heart Rate Widget */}
                  <div className="bg-white rounded-xl p-6 h-[270px] w-[230px] shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaTint className="text-blue-500 text-xl mr-2" />
                        <h3 className="font-semibold text-gray-800">Your Sleep Today</h3>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-3">      
                        <div className="absolute inset-0 top-[58px] flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-800">{totalSleepAmt}</span>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  {/* Hydration Widget */}
                  <div className="bg-white rounded-xl p-6 h-[270px] w-[230px] shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaRegLemon className="text-yellow-400 text-xl mr-2" />
                        <h3 className="font-semibold text-gray-800">Daily Sleep Goal</h3>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        <div className="absolute inset-0 flex gap-3 top-[65px] items-center justify-center">
                          <span className="text-3xl font-bold text-gray-800">{totalDailySleepAmt} 
                            
                            <br/>
                          </span>
                          <span className="text-md font-bold text-zinc-400">HRS</span>
                        </div>
                      </div>
                    </div>
                  </div>
      
      
                  {/* Oxygen Saturation Widget */}
                  <div className="bg-white rounded-xl p-6 h-[270px] w-[230px] shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaRegCalendarCheck className="text-blue-400 text-xl mr-2" />
                        <h3 className="font-semibold text-gray-800">Sleep Required</h3>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="relative w-20 h-20 mx-auto mb-3">
                        {/* Circular Progress Bar for Oxygen Saturation */}
                        <svg className="w-40 h-40 -ml-10 transform -rotate-90" viewBox="0 0 36 36">
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
                            stroke="orange"
                            strokeWidth="3"
                            strokeDasharray={`${50 * 1.005}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 top-[55px]">
                          <span className="text-3xl font-bold text-gray-800">300</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      
                <div className="w-full bg-white h-[400px] mt-10 rounded-lg shadow-lg">
                <div className='p-4 md:p-6 overflow-y-auto flex items-center justify-between'>
                <div className='w-[60%] h-full flex flex-col '>
                  <div className="w-[700px] bg-white h-[370px]  rounded-lg shadow-lg">
                    <SleepChart />
                  </div>
                </div>
              </div>
                </div>
              </div>
              <div className='h-full w-[37%]'>
                <div className="h-[200px] bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-6">
                  <h2 className="text-xl font-bold text-blue-600 mb-4">Sleep Logger</h2>
                  <div className="flex gap-6">
                    {/* Sleep Button */}
                    <button
                      className={`flex flex-col items-center px-6 py-3 rounded-xl shadow transition-all duration-200 border-2 ${
                        isSleeping
                          ? "bg-blue-300 border-blue-600 text-black scale-105"
                          : "bg-white border-gray-200 text-blue-600  hover:bg-blue-50"
                      }`}
                      onClick={() => {
                          const now = new Date();
                          const hours = now.getHours().toString().padStart(2, '0');
                          const minutes = now.getMinutes().toString().padStart(2, '0');
                          setIsSleepingDate(`${hours}:${minutes}`);
                          setIsSleeping(true);
                          localStorage.setItem("Sleeping-Mode",JSON.stringify(!isSleeping));
                          localStorage.setItem("Sleeping-Date",JSON.stringify(isSleepingDate));
                      }
                      }
                    >
                      <span className="text-3xl mb-1">
                        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="16" fill="#2563eb" opacity="0.15"/>
                          <path d="M20 10a6 6 0 1 1-8 8 7 7 0 0 0 8-8z" fill="#2563eb"/>
                        </svg>
                      </span>
                      <span className="font-semibold">Sleeping</span>
                    </button>
                    {/* Wake Up Button */}
                    <button
                      className={`flex flex-col items-center px-6 py-3 rounded-xl shadow transition-all duration-200 border-2 ${
                        !isSleeping
                          ? "bg-green-300 border-green-500 text-black scale-105"
                          : "bg-white border-gray-200 text-green-600 hover:bg-green-50"
                      }`}
                      onClick={()=>{
                        const now = new Date();
                          const hours = now.getHours().toString().padStart(2, '0');
                          const minutes = now.getMinutes().toString().padStart(2, '0');
                          setIsWaking(`${hours}:${minutes}`);
                          localStorage.setItem("Waking-Date",JSON.stringify(isWakingDate));
                          localStorage.removeItem("Sleeping-Mode");
                          setIsSleeping(false);
                          localStorage.setItem("Sleeping-Mode",JSON.stringify(!isSleeping))
                      }}>
                      <span className="text-3xl mb-1 scale-125">
                        <svg width="32" height="32" fill="none" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="16" fill="#10B981" opacity="0.15"/>
                          <path d="M16 8v8l6 3" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="16" cy="16" r="7" stroke="#10B981" strokeWidth="2"/>
                        </svg>
                      </span>
                      <span className="font-semibold">Waking Up</span>
                    </button>
                  </div>
                  <div className="mt-4">
                    {isSleeping === null ? (
                      <span className="text-gray-400">Select your current state</span>
                    ) : isSleeping ? (
                      <span className="text-blue-600 font-medium">You are now <b>Sleeping</b> Time : <b>{isSleepingDate}</b></span>
                    ) : (
                      <span className="text-green-600 font-medium">You are <b>Awake</b> Time: <b>{isWakingDate}</b></span>
                    )}
                  </div>
                </div>
      
                <div className='h-[500px] mt-2 rounded-lg'>
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
              </div>
            </div>
        </div>
            ):(activeTab === 'Dashboard') ? (
                    navigate('/dashboard')
            ):(activeTab === 'Step Counter') ? (
                    navigate('/Step Counter')
            ):(activeTab === 'Water Intake') ? (
                    navigate('/waterIntake')
            ):(activeTab === 'Medication') ? (
                    navigate('/Medication')
            ):(activeTab === 'Caregiver') ? (
                    navigate('/Caregiver')
            ):(activeTab === 'MediPal Assistant') ? (
                    navigate('/MediPal Assitant')
            ):(activeTab === 'Settings') ? (
                <SettingsComponent />
            ):null} 
   </div>
  
  );
}
