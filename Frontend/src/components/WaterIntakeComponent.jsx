import React, { useContext, useEffect, useState } from 'react'
import { FaChartLine, FaClock, FaHeart, FaRegCalendarCheck, FaTint, FaRegLemon, FaHome, FaWalking, FaBed, FaPills, FaUserFriends, FaRobot, FaCog, FaSignOutAlt, FaSearch } from 'react-icons/fa'
import { useLoaderData, useLocation, useNavigate } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import SettingsComponent from './SettingsComponent';
import { toast } from 'react-toastify';
import { UserContext } from '../utils/UserContextComponent';
import { motion } from "framer-motion";
import WeeklyWaterChart from './WeeklyWaterChart';

function WaterIntakeComponent() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [waterInput, setWaterInput] = useState(0)
  const [activeTab, setActiveTab] = useState('Water Intake');
  const [height, setHeight] = useState(0);
  const [count, setCount] = useState(0);
  const [percentage, setPercentage] = useState(() => {
    const savedPercentage = localStorage.getItem('Total-Percentage');
    return savedPercentage ? JSON.parse(savedPercentage) : 0
  });
  const medicalConditionRelatedData = JSON.parse(localStorage.getItem('MedicalConditions-Related-Data'));
  const userRole = JSON.parse(localStorage.getItem('User-Role'));
  const [totalWaterIntake, setTotalWaterIntake] = useState(() => {
    const savedWaterIntake = localStorage.getItem('Total-Water-Intake');
    return savedWaterIntake ? JSON.parse(savedWaterIntake) : 0
  });
  const [congModal, setCongModal] = useState(()=>{
      if(totalWaterIntake === Number(medicalConditionRelatedData?.WaterIntake)){
            return true;
      }else{
        return false;
      }
  });
  const data = [
    { name: "Tea/Coffee", value: 19 },
    { name: "Milk based", value: 41 },
    { name: "Other", value: 39 },
  ];
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

  const handleLogOut = () => {
    localStorage.removeItem('User-Data-Information');
    localStorage.removeItem('token');
    setUser(null);
    localStorage.clear();
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
  let dailyGoal = JSON.parse(localStorage.getItem("MedicalConditions-Related-Data"));


  const handleWaterFunction = (e) => {
    e.preventDefault();
    const newTotal = Number(totalWaterIntake) + Number(waterInput);
    setTotalWaterIntake(newTotal);
    setPercentage(Math.min((newTotal / medicalConditionRelatedData?.WaterIntake) * 100, 100));

    if (newTotal === Number(medicalConditionRelatedData?.WaterIntake)) {
      setCongModal(true);
    }

  }

  useEffect(() => {
    localStorage.setItem('Total-Water-Intake', JSON.stringify(totalWaterIntake))
    localStorage.setItem('Total-Percentage', JSON.stringify(percentage))
  }, [totalWaterIntake])






  const COLORS = ["#8B5CF6", "#F87171", "#06B6D4"];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text fontSize={16} x={x} y={y} fill={COLORS[index]} textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${data[index].name}\n${data[index].value} (${(percent * 100).toFixed(2)}%)`}
      </text>
    );
  };

  return (
    <div className='flex'>
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

      {(activeTab === 'Water Intake') ? (
        <div className='flex flex-col w-full ml-[260px]'>
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
                      <h3 className="font-semibold text-gray-800">Total Intake</h3>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-6 p-6">
                    {/* Glass Container */}
                    <div className="relative w-32 h-40 border-4 border-blue-500 rounded-b-3xl overflow-hidden bg-white">
                      {/* Water Level */}
                      <motion.div
                        className="water absolute bottom-0 w-full bg-blue-400"
                        initial={{ height: 0 }}
                        animate={{ height: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <div className="absolute inset-0 -top-[370%] flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{totalWaterIntake} L</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hydration Widget */}
                <div className="bg-white rounded-xl p-6 h-[270px] w-[230px] shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaRegLemon className="text-yellow-400 text-xl mr-2" />
                      <h3 className="font-semibold text-gray-800">Daily Goal</h3>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
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
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeDasharray={`${medicalConditionRelatedData?.WaterIntake * 1.005}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>

                      <div className="absolute inset-0 flex  top-[55px] items-center justify-center">
                        <span className="text-3xl font-bold text-gray-800">{medicalConditionRelatedData?.WaterIntake} L</span>
                      </div>
                    </div>
                  </div>
                </div>


                {/* Oxygen Saturation Widget */}
                <div className="bg-white rounded-xl p-6 h-[270px] w-[230px] shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <FaRegCalendarCheck className="text-blue-400 text-xl mr-2" />
                      <h3 className="font-semibold text-gray-800">Total Intake Required</h3>
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
                          strokeDasharray={`${Number(medicalConditionRelatedData?.WaterIntake - totalWaterIntake) * 1.005}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 top-[55px]">
                        <span className="text-3xl font-bold text-gray-800">{Number(medicalConditionRelatedData?.WaterIntake - totalWaterIntake)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full bg-white h-[400px] mt-10 rounded-lg shadow-lg">
                <WeeklyWaterChart />
              </div>
            </div>

            <div className='h-full w-[37%]'>
              <div className='h-[300px] bg-white rounded-lg shadow-lg'>
                {congModal ? (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <div className="flex flex-col items-center">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mb-4"
                      >
                        <circle cx="40" cy="40" r="40" fill="#D1FAE5"/>
                        <path d="M24 42L36 54L56 34" stroke="#10B981" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h2 className="text-2xl font-bold text-green-600 mb-2 text-center">Congratulations!</h2>
                      <p className="text-gray-700 text-lg text-center mb-4">
                        You’ve reached your daily water intake goal.<br />
                        Keep up the great work and stay hydrated!
                      </p>
                    </div>
                  </div>
                ) :
                  <div className="flex flex-col h-full justify-center items-center p-6">
                    <h2 className="text-xl font-bold text-blue-600 mb-2">Log Your Daily Water Intake</h2>
                    <p className="text-gray-500 mb-4 text-center">Stay hydrated! Enter the amount of water you've consumed today.</p>
                    <form
                      className="w-full flex flex-col items-center"
                      onSubmit={e => {
                        handleWaterFunction(e);
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="number"
                          value={typeof waterInput !== 'undefined' ? waterInput : ''}
                          onChange={e => setWaterInput(e.target.value)}
                          className="w-28 px-3 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg text-center"
                          required
                        />
                        <span className="text-gray-700 font-medium">L</span>
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors shadow"
                      >
                        Add Intake
                      </button>
                    </form>
                  </div>
                }
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
      ) : (activeTab === 'Dashboard') ? (
        navigate('/dashboard')
      ) : (activeTab === 'Step Counter') ? (
        navigate('/Step Counter')
      ) : (activeTab === 'Sleep Logger') ? (
        navigate('/Sleep Logger')
      ) : (activeTab === 'Medication') ? (
        navigate('/Medication')
      ) : (activeTab === 'Caregiver') ? (
        navigate('/Caregiver')
      ) : (activeTab === 'MediPal Assistant') ? (
        navigate('/MediPal Assitant')
      ) : (activeTab === 'Settings') ? (
        <SettingsComponent />
      ) : null}




    </div>


  )
}

export default WaterIntakeComponent
