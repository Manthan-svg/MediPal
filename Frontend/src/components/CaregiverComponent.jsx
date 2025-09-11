import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsComponent from './SettingsComponent';
import { FaBed, FaCog, FaHome, FaPills, FaRobot, FaSignOutAlt, FaTint, FaUserFriends, FaWalking } from 'react-icons/fa';
import { UserContext } from '../utils/UserContextComponent';

function CaregiverComponent() {
  const [patients, setPatients] = useState([
    { id: 1, name: 'Sarah Johnson', age: 72, condition: 'Diabetes', status: 'active', lastVisit: '2024-01-15' },
    { id: 2, name: 'Robert Chen', age: 68, condition: 'Hypertension', status: 'active', lastVisit: '2024-01-14' },
    { id: 3, name: 'Maria Garcia', age: 75, condition: 'Arthritis', status: 'inactive', lastVisit: '2024-01-10' }
  ]);
  const [appointments] = useState([
    { id: 1, patientName: 'Sarah Johnson', time: '09:00 AM', date: '2024-01-16', type: 'Medication Check' },
    { id: 2, patientName: 'Robert Chen', time: '02:30 PM', date: '2024-01-16', type: 'Blood Pressure' },
    { id: 3, patientName: 'Maria Garcia', time: '11:00 AM', date: '2024-01-17', type: 'Physical Therapy' }
  ]);
  const [notifications] = useState([
    { id: 1, message: 'Sarah Johnson needs medication refill', priority: 'high', time: '2 hours ago' },
    { id: 2, message: 'New patient assignment: John Smith', priority: 'medium', time: '1 day ago' },
    { id: 3, message: 'Monthly report due tomorrow', priority: 'low', time: '3 days ago' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', condition: '' });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.condition) {
      const patient = {
        id: patients.length + 1,
        ...newPatient,
        status: 'active',
        lastVisit: new Date().toISOString().split('T')[0]
      };
      setPatients([...patients, patient]);
      setNewPatient({ name: '', age: '', condition: '' });
      setShowAddPatient(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-emerald-500' : 'bg-red-500';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-gray-400';
    }
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

  const navigate = useNavigate();
  const [activeTab,setActiveTab] = useState('Caregiver');
  const [caregiverTab,setCaregiverTab] = useState('dashboard');
  const {user,setUser} = useContext(UserContext);
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
                    {sidebarTabs.map((tab) => {
                        const Icon = tab.icon
                        return (
                            tab.id == "Settings" ? (
                                <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center px-6 py-3 text-left mt-17   transition-colors ${activeTab === tab.id 
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

            
            {(activeTab === 'Caregiver') ? (
                <div className="min-h-screen bg-gray-50 w-full ml-[260px]">
                {/* Header */}
                <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-emerald-700">Caregiver Dashboard</h1>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search patients..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 py-2 w-[40vw] rounded-md border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                      <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-900 pointer-events-none"
                      >
                        <circle cx="11" cy="11" r="7" stroke="#6B7280" strokeWidth="2" />
                        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                      </svg>
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
                  </div>
                </header>
        
                {/* Navigation Tabs */}
                <nav className="bg-white shadow-sm flex gap-2 px-6 py-2">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${caregiverTab === 'dashboard' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setCaregiverTab('dashboard')}
                  >
                    <i className="fas fa-tachometer-alt"></i>
                    Dashboard
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${caregiverTab === 'patients' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setCaregiverTab('patients')}
                  >
                    <i className="fas fa-users"></i>
                    Patients
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${caregiverTab === 'schedule' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setCaregiverTab('schedule')}
                  >
                    <i className="fas fa-calendar-alt"></i>
                    Schedule
                  </button>
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition ${caregiverTab === 'reports' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'}`}
                    onClick={() => setCaregiverTab('reports')}
                  >
                    <i className="fas fa-chart-bar"></i>
                    Reports
                  </button>
                </nav>
        
                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 py-8">
                  {caregiverTab === 'dashboard' && (
                    <div>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
                          <div className="bg-emerald-100 text-emerald-600 rounded-full p-3 text-xl">
                            <i className="fas fa-users"></i>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{patients.length}</h3>
                            <p className="text-gray-500 text-sm">Total Patients</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
                          <div className="bg-blue-100 text-blue-600 rounded-full p-3 text-xl">
                            <i className="fas fa-calendar-check"></i>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{appointments.length}</h3>
                            <p className="text-gray-500 text-sm">Today's Appointments</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
                          <div className="bg-yellow-100 text-yellow-600 rounded-full p-3 text-xl">
                            <i className="fas fa-clock"></i>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">8.5</h3>
                            <p className="text-gray-500 text-sm">Hours Worked</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
                          <div className="bg-pink-100 text-pink-600 rounded-full p-3 text-xl">
                            <i className="fas fa-star"></i>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">4.8</h3>
                            <p className="text-gray-500 text-sm">Rating</p>
                          </div>
                        </div>
                      </div>
        
                      {/* Quick Actions */}
                      <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-3 text-emerald-700">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                          <button className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-md shadow hover:bg-emerald-600 transition">
                            <i className="fas fa-plus"></i>
                            Add Patient
                          </button>
                          <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition">
                            <i className="fas fa-calendar-plus"></i>
                            Schedule Visit
                          </button>
                          <button className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md shadow hover:bg-yellow-600 transition">
                            <i className="fas fa-file-medical"></i>
                            Create Report
                          </button>
                          <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition">
                            <i className="fas fa-phone"></i>
                            Emergency Call
                          </button>
                        </div>
                      </div>
        
                      {/* Recent Activity */}
                      <div>
                        <h2 className="text-lg font-semibold mb-3 text-emerald-700">Recent Activity</h2>
                        <div className="space-y-3">
                          {notifications.map(notification => (
                            <div key={notification.id} className="flex items-center bg-white rounded-lg shadow p-4 gap-4">
                              <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white ${getPriorityColor(notification.priority)}`}>
                                <i className="fas fa-info"></i>
                              </div>
                              <div>
                                <p className="text-gray-700">{notification.message}</p>
                                <span className="text-xs text-gray-400">{notification.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
        
                  {caregiverTab === 'patients' && (
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-emerald-700">Patient Management</h2>
                        <button
                          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-md shadow hover:bg-emerald-600 transition"
                          onClick={() => setShowAddPatient(true)}
                        >
                          <i className="fas fa-plus"></i>
                          Add New Patient
                        </button>
                      </div>
        
                      {/* Add Patient Modal */}
                      {showAddPatient && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4 text-emerald-700">Add New Patient</h3>
                            <div className="mb-3">
                              <label className="block text-gray-600 mb-1">Name:</label>
                              <input
                                type="text"
                                value={newPatient.name}
                                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              />
                            </div>
                            <div className="mb-3">
                              <label className="block text-gray-600 mb-1">Age:</label>
                              <input
                                type="number"
                                value={newPatient.age}
                                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-gray-600 mb-1">Condition:</label>
                              <input
                                type="text"
                                value={newPatient.condition}
                                onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                              />
                            </div>
                            <div className="flex gap-3 justify-end">
                              <button
                                className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition"
                                onClick={handleAddPatient}
                              >
                                Add Patient
                              </button>
                              <button
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                                onClick={() => setShowAddPatient(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
        
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {filteredPatients.map(patient => (
                          <div key={patient.id} className="bg-white rounded-lg shadow p-5 flex flex-col">
                            <div className="flex items-center justify-between mb-3">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 flex items-center justify-center bg-gray-100">
                                <img src={`https://via.placeholder.com/60?text=${patient.name.charAt(0)}`} alt={patient.name} className="w-full h-full object-cover" />
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize text-white ${getStatusColor(patient.status)}`}>
                                {patient.status}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-800">{patient.name}</h3>
                              <p className="text-gray-500 text-sm">Age: {patient.age}</p>
                              <p className="text-gray-500 text-sm">Condition: {patient.condition}</p>
                              <p className="text-gray-400 text-xs">Last Visit: {patient.lastVisit}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button className="flex-1 flex items-center justify-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200 text-sm transition">
                                <i className="fas fa-eye"></i>
                                View
                              </button>
                              <button className="flex-1 flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 text-sm transition">
                                <i className="fas fa-edit"></i>
                                Edit
                              </button>
                              <button className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-sm transition">
                                <i className="fas fa-calendar"></i>
                                Schedule
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
        
                  {caregiverTab === 'schedule' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 text-emerald-700">Today's Schedule</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {appointments.map(appointment => (
                          <div key={appointment.id} className="bg-white rounded-lg shadow p-5 flex flex-col gap-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-bold text-emerald-700">{appointment.time}</span>
                              <span className="text-xs text-gray-400">{appointment.date}</span>
                            </div>
                            <div>
                              <h3 className="text-md font-semibold text-gray-800">{appointment.patientName}</h3>
                              <p className="text-gray-500 text-sm">{appointment.type}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button className="flex-1 flex items-center justify-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200 text-sm transition">
                                <i className="fas fa-check"></i>
                                Complete
                              </button>
                              <button className="flex-1 flex items-center justify-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-200 text-sm transition">
                                <i className="fas fa-clock"></i>
                                Reschedule
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
        
                  {caregiverTab === 'reports' && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6 text-emerald-700">Reports & Analytics</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                          <h3 className="font-bold text-gray-700 mb-2">Patient Care Summary</h3>
                          <div className="flex flex-col items-center justify-center h-32 w-full">
                            <i className="fas fa-chart-pie text-4xl text-emerald-400 mb-2"></i>
                            <p className="text-gray-400 text-sm">Patient Care Distribution</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                          <h3 className="font-bold text-gray-700 mb-2">Monthly Performance</h3>
                          <div className="flex flex-col items-center justify-center h-32 w-full">
                            <i className="fas fa-chart-line text-4xl text-blue-400 mb-2"></i>
                            <p className="text-gray-400 text-sm">Performance Metrics</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
                          <h3 className="font-bold text-gray-700 mb-2">Time Tracking</h3>
                          <div className="flex flex-col items-center justify-center h-32 w-full">
                            <i className="fas fa-chart-bar text-4xl text-yellow-400 mb-2"></i>
                            <p className="text-gray-400 text-sm">Hours Worked</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </main>
              </div>
            ):(activeTab === 'Dashboard') ? (
                    navigate('/dashboard')
            ):(activeTab === 'Sleep Logger') ? (
                    navigate('/Sleep Logger')
            ):(activeTab === 'Water Intake') ? (
                    navigate('/waterIntake')
            ):(activeTab === 'Medication') ? (
                    navigate('/Medication')
            ):(activeTab === 'Step Counter') ? (
                    navigate('/Step Counter')
            ):(activeTab === 'MediPal Assistant') ? (
                    navigate('/MediPal Assitant')
            ):(activeTab === 'Settings') ? (
                <SettingsComponent />
            ):null} 

      
    </div>


  );
}

export default CaregiverComponent;
