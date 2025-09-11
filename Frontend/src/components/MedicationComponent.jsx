import React, { useState, useEffect, useContext } from 'react';
import { FaBed, FaCog, FaHome, FaPills, FaRobot, FaSearch, FaSignOutAlt, FaTint, FaUserFriends, FaWalking } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SettingsComponent from './SettingsComponent';
import axios from '../utils/Axios.Config'
import { UserContext } from '../utils/UserContextComponent';
import { toast } from 'react-toastify';

function MedicationComponent() {
  const { user, setUser, token, setToken } = useContext(UserContext)
  const parseDosageToInt = (dosage) => {
    if (typeof dosage === 'number') return dosage;
    if (typeof dosage === 'string') {
      const match = dosage.match(/\d+/);
      const n = match ? parseInt(match[0], 10) : NaN;
      return Number.isFinite(n) && n > 0 ? n : 30;
    }
    return 30;
  };
  const [showTimetable, setShowTimetable] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMedicationId, setDeleteMedicationId] = useState(null);
  const [medications, setMedications] = useState(() => {
    const savedMedications = localStorage.getItem('All-Medications');
    if (savedMedications) {
      try {
        const parsed = JSON.parse(savedMedications);
        // Ensure each medication has the required fields with proper defaults
        return parsed.map(med => ({
          ...med,
          _id: med._id || med.id, // Handle both _id and id for backward compatibility
          total: parseDosageToInt(med.dosage),
          remaining: typeof med.remaining === 'number' ? med.remaining : parseDosageToInt(med.dosage),
          isActive: typeof med.isActive === 'boolean' ? med.isActive : true,
        }));
      } catch (error) {
        console.error('Error parsing medications from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const userRole = JSON.parse(localStorage.getItem('User-Role'));
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    times: {
      Morning: '',
      Afternoon: '',
      Evening: '',
    },
    medicationType: 'tablet',
    total: 30,
    color: '#FF6B6B',
    instruction: '',
    remainderEnabled: false,
  });
  async function handleMedication() {
    try {
      const allMedications = await axios.post('/medication/getAllMedication', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (allMedications?.data?.medications) {
        const uniqueMedications = [];
        const seenIds = new Set();
        for (const med of allMedications.data.medications) {
          if (med._id && !seenIds.has(med._id)) {
            uniqueMedications.push(med);
            seenIds.add(med._id);
          }
        }
        const medsWithDefaults = uniqueMedications.map((m) => {
          const normalizedTimes = {
            morning: m?.times?.morning ?? m?.times?.Morning ?? "",
            afternoon: m?.times?.afternoon ?? m?.times?.Afternoon ?? "",
            evening: m?.times?.evening ?? m?.times?.Evening ?? "",
          };
          return {
            ...m,
            times: normalizedTimes,
            _id: m._id, // Ensure _id is explicitly set
            total: parseDosageToInt(m.dosage),
            remaining: parseDosageToInt(m.dosage),
            isActive: typeof m.isActive === 'boolean' ? m.isActive : true,
          };
        });
        setMedications(medsWithDefaults);
        localStorage.setItem('All-Medications', JSON.stringify(medsWithDefaults));
      }

    } catch (err) {
    }
  }

  useEffect(() => {
    handleMedication()
  }, [])


  useEffect(() => {
    if (medications.length > 0) {
      localStorage.setItem('All-Medications', JSON.stringify(medications));
    }
  }, [medications]);

  const addMedication = async () => {
    const timesLower = {
      morning: newMedication.times.Morning?.trim() || "",
      afternoon: newMedication.times.Afternoon?.trim() || "",
      evening: newMedication.times.Evening?.trim() || "",
    };
    console.log(newMedication)
    try {
      const response = await axios.post('/medication/addNewMedication', {
        name: newMedication.name,
        dosage: newMedication.dosage,
        times: timesLower,
        frequency: newMedication.frequency,
        startDate: newMedication.startDate,
        endDate: newMedication.endDate,
        instruction: newMedication.instruction,
        reminderEnabled: newMedication.remainderEnabled,
        medicationType: newMedication.medicationType.toLowerCase()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log(response);
      const newMedi = response?.data?.medication;
      const medication = {
        ...newMedi,
        total: parseDosageToInt(newMedi?.dosage),
        remaining: parseDosageToInt(newMedi?.dosage),
        isActive: true
      };
      console.log(medication)
      setMedications((prev) => [...prev, medication]);

    } catch (err) {
      console.log(err)
    }
    setNewMedication({
      name: '',
      dosage: '',
      frequency: 'daily',
      time: '',
      medicationType: 'tablet',
      total: 30,
      color: '#FF6B6B'
    });

    setShowAddModal(false);
  };

  const takeMedication = (id) => {
    console.log('Taking medication with ID:', id);
    console.log('Current medications:', medications);
    setMedications(medications.map(med => {
      if (med._id === id && med.remaining > 0) {
        console.log('Updating medication:', med.name, 'from', med.remaining, 'to', med.remaining - 1);
        return { ...med, remaining: med.remaining - 1 };
      }
      return med;
    }));
  };

  const refillMedication = (id) => {
    console.log('Refilling medication with ID:', id);
    setMedications(medications.map(med => {
      if (med._id === id) {
        console.log('Refilling medication:', med.name, 'to', med.total);
        return { ...med, remaining: med.total };
      }
      return med;
    }));
  };

  const toggleMedication = (id) => {
    console.log('Toggling medication with ID:', id);
    setMedications(medications.map(med => {
      if (med._id === id) {
        console.log('Toggling medication:', med.name, 'from', med.isActive, 'to', !med.isActive);
        return { ...med, isActive: !med.isActive };
      }
      return med;
    }));
  };
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
    }
  }, [userRole])

  const deleteMedication = async (id) => {
    if (!id || id === null) {
      return;
    } 

    try {
      const newResponse = await axios.delete(`/medication/deleteMedication/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const allMedi = newResponse?.data?.medication;
      setMedications(allMedi);
      localStorage.removeItem('All-Medications');
      localStorage.setItem('All-Medications', JSON.stringify(allMedi));

      
    } catch (err) {
      console.log(err);
    }
  };

  const toggleReminder = async (medicationId, currentStatus) => {
    try {
      const response = await axios.put('/reminders/update-settings', {
        medicationId,
        reminderEnabled: !currentStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        toast.success(`Reminders ${!currentStatus ? 'enabled' : 'disabled'} for medication`);
        // Update local state
        setMedications(prev => prev.map(med => 
          med._id === medicationId 
            ? { ...med, reminderEnabled: !currentStatus }
            : med
        ));
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Failed to update reminder settings');
    }
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' ||
      (filterType === 'active' && med.isActive) ||
      (filterType === 'inactive' && !med.isActive) ||
      (filterType === 'low' && med.remaining <= 1);
    return matchesSearch && matchesFilter;
  });

  const getProgressPercentage = (total, remaining) => {
    if (!Number.isFinite(total) || total <= 0) return 0;
    const dosesTaken = Math.max(0, total - Math.max(0, remaining));
    const rawPercent = (dosesTaken / total) * 100;
    return Math.max(0, Math.min(100, rawPercent));
  };

  const getStatusColor = (remaining, total) => {
    if (!Number.isFinite(total) || total <= 0) return '#2ED573';
    const percentage = (remaining / total) * 100;
    if (percentage <= 20) return '#FF4757';
    if (percentage <= 50) return '#FFA502';
    return '#2ED573';
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
  const [activeTab, setActiveTab] = useState('Medication');

  return (
    <div className='flex w-full'>
      <div className="w-64 h-full bg-white shadow-lg hidden md:block fixed ">
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

      {(activeTab === 'Medication') ? (
        <div className="min-h-screen bg-gray-50 w-full ml-[270px]">
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

          <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
              <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication Tracker</h1>
                    <p className="text-gray-600">Manage your medications and stay on track with your health</p>
                  </div>
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-200"
                    onClick={() => setShowAddModal(true)}
                  >
                    <span className="text-xl">+</span>
                    Add Medication
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">💊</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{medications.length}</h3>
                      <p className="text-gray-600">Total Medications</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">✅</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{medications.filter(m => m.isActive).length}</h3>
                      <p className="text-gray-600">Active</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">⚠️</div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{medications.filter(m => m.remaining <= 5).length}</h3>
                      <p className="text-gray-600">Low Stock</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 relative">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">📅</div>
                    <div>
                      <button
                        className="mt-2 text-black-600 text-md font-medium hover:text-zinc-500 cursor-pointer transition-colors"
                        onClick={() => setShowTimetable(true)}
                        type="button"
                      >
                        View Daily Medication Timetable
                      </button>
                    </div>
                  </div>
                  {/* Timetable Modal */}
                  {showTimetable && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative animate-fade-in">
                        <button
                          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
                          onClick={() => setShowTimetable(false)}
                          aria-label="Close timetable"
                        >
                          ×
                        </button>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="text-2xl">🗓️</span> Daily Medication Timetable
                        </h2>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                              <tr className="bg-blue-50">
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Medication</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Morning</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Afternoon</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">Evening</th>
                              </tr>
                            </thead>
                            <tbody>
                              {medications.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="text-center py-6 text-gray-400">No medications scheduled for today.</td>
                                </tr>
                              ) : (
                                medications
                                  .filter(med => med.remaining > 0)
                                  .map((med, idx) => (
                                    <tr key={med._id || idx} className="border-t border-gray-100 hover:bg-blue-50 transition">
                                      <td className="px-4 py-2 font-medium text-gray-900">{med.name}</td>
                                      <td className="px-4 py-2 text-center">
                                        {med.times?.morning ? (
                                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                            {med.times.morning}
                                          </span>
                                        ) : (
                                          <span className="text-gray-300">—</span>
                                        )}
                                      </td>
                                      <td className="px-4 py-2 text-center">
                                        {med.times?.afternoon ? (
                                          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                                            {med.times.afternoon}
                                          </span>
                                        ) : (
                                          <span className="text-gray-300">—</span>
                                        )}
                                      </td>
                                      <td className="px-4 py-2 text-center">
                                        {med.times?.evening ? (
                                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                                            {med.times.evening}
                                          </span>
                                        ) : (
                                          <span className="text-gray-300">—</span>
                                        )}
                                      </td>
                                    </tr>
                                  ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-4 text-xs text-gray-500">
                          <span className="font-semibold">Tip:</span> Click the <span className="font-bold">"Take Now"</span> button on your medication card to mark as taken.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Filters and Search */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Search medications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${filterType === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => setFilterType('all')}
                    >
                      All
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${filterType === 'active'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => setFilterType('active')}
                    >
                      Active
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${filterType === 'low'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      onClick={() => setFilterType('low')}
                    >
                      Low Stock
                    </button>
                  </div>
                </div>
              </div>

              {/* Medications Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedications.length === 0 && (
                  <div className="col-span-full text-center text-gray-600">
                    No medications found matching your search criteria.
                  </div>
                )}
                {filteredMedications.map((medication, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white rounded-xl shadow border border-gray-200 p-5 group transition-all duration-200"
                  >
                    <div className="absolute top-4 right-4 flex gap-2 z-10">
                      <button
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-base font-bold border transition-colors duration-150
                          ${medication.isActive
                            ? 'bg-white text-green-700 border-green-500 hover:bg-green-50'
                            : 'bg-white text-gray-400 border-gray-300 hover:bg-gray-100'
                          }`}
                        title={medication.isActive ? "Active" : "Inactive"}
                        onClick={() => toggleMedication(medication._id)}
                      >
                        {medication.isActive ? (
                          <span className="text-xl">●</span>
                        ) : (
                          <span className="text-xl">○</span>
                        )}
                      </button>
                      <button
                        className="w-8 h-8 rounded-full bg-white text-red-600 border border-red-400 flex items-center justify-center text-lg font-bold hover:bg-red-50 transition-colors duration-150"
                        title="Delete"
                        onClick={() => {
                          setDeleteMedicationId(medication._id)
                          setShowDeleteModal(!showDeleteModal)
                          }
                        }
                      >
                        ×
                      </button>
                    </div>

                    {/* Header: Icon, Name, Dosage */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center shadow"
                        style={{
                          background: "#f3f4f6",
                        }}
                      >
                        {/* Icon based on type */}
                        {medication.medicationType === "tablet" && (
                          <span className="text-2xl" role="img" aria-label="Tablet">💊</span>
                        )}
                        {medication.medicationType === "capsule" && (
                          <span className="text-2xl" role="img" aria-label="Capsule">🟣</span>
                        )}
                        {medication.medicationType === "liquid" && (
                          <span className="text-2xl" role="img" aria-label="Liquid">🧴</span>
                        )}
                        {medication.medicationType === "injection" && (
                          <span className="text-2xl" role="img" aria-label="Injection">💉</span>
                        )}
                        {!["tablet", "capsule", "liquid", "injection"].includes(medication.medicationType) && (
                          <span className="text-2xl" role="img" aria-label="Pill">💊</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{medication.name}</h3>
                        <p className="text-gray-600 text-sm truncate">{medication.dosage}</p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Frequency</div>
                        <div className="text-sm font-medium text-gray-800 capitalize">{medication.frequency}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Type</div>
                        <div className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded capitalize font-semibold">
                          {medication.medicationType}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-xs text-gray-500 mb-1">Times</div>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-gray-800 text-xs font-medium">
                            <span className="font-bold">🌅</span> Morning: <span>{medication.times?.morning || "--"}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-gray-800 text-xs font-medium">
                            <span className="font-bold">🌞</span> Afternoon: <span>{medication.times?.afternoon || "--"}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded text-gray-800 text-xs font-medium">
                            <span className="font-bold">🌆</span> Evening: <span>{medication.times?.evening || "--"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress & Stock */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Stock</span>
                        <span className="text-xs text-gray-800 font-semibold">
                          {medication.total}/{medication.remaining} left
                        </span>
                      </div>
                      <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-3 rounded-full transition-all duration-200"
                          style={{
                            width: `${getProgressPercentage(medication.total, medication.remaining)}%`,
                            backgroundColor: getStatusColor(medication.remaining, medication.total),
                          }}
                        ></div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700 z-10">
                          {Math.round(getProgressPercentage(medication.total, medication.remaining))}%
                        </span>
                      </div>
                    </div>

                    {/* Instructions */}
                    {medication.instruction && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Instructions</div>
                        <div className="text-sm text-gray-800">{medication.instruction}</div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mb-2">
                      <button
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-sm text-white py-2 rounded font-semibold transition-colors duration-150 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={() => takeMedication(medication._id)}
                        disabled={medication.remaining === 0}
                      >
                        <span className=" items-center gap-2 justify-center">
                          <span className="text-base"></span> Take Now
                        </span>
                      </button>
                      <button
                        className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-2 rounded font-semibold transition-colors duration-150"
                        onClick={() => refillMedication(medication._id)}
                      >
                        <span className="inline-flex items-center gap-2 justify-center">
                          <span className="text-base">🔄</span> Refill
                        </span>
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center"
                        onClick={() => toggleReminder(medication._id, medication.reminderEnabled)}
                        title={medication.reminderEnabled ? 'Disable reminders' : 'Enable reminders'}
                      >
                        {medication.reminderEnabled === true ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium border border-green-200 hover:bg-green-100 transition-colors">
                            <span className="text-base">⏰</span> Reminder On
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded font-medium border border-gray-200 hover:bg-gray-100 transition-colors">
                            <span className="text-base">⏰</span> Reminder Off
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Low Stock Alert */}
                    {medication.remaining <= 1 && (
                      <div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 rounded p-2 flex items-center gap-2">
                        <span className="text-xl text-yellow-600">⚠️</span>
                        <span className="text-xs font-semibold text-yellow-800">
                          Low stock! Please refill soon.
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {showAddModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Medication</h2>
                    <button
                      className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-lg font-bold hover:bg-gray-200 transition-colors duration-200"
                      onClick={() => setShowAddModal(false)}
                    >
                      ×
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name</label>
                      <input
                        type="text"
                        value={newMedication.name}

                        onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                        placeholder="Enter medication name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                        <input
                          type="text"
                          value={newMedication.dosage}
                          onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                          placeholder="e.g., 100mg"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={newMedication.medicationType}
                          onChange={(e) => setNewMedication({ ...newMedication, medicationType: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="tablet">Tablet</option>
                          <option value="capsule">Capsule</option>
                          <option value="liquid">Liquid</option>
                          <option value="injection">Injection</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                        <select
                          value={newMedication.frequency}
                          onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                          value={newMedication.startDate}
                          onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          type="date" name="" id="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                          value={newMedication.endDate}
                          onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          type="date" name="" id="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reminder</label>
                        <div className="flex items-center">
                          <button
                            type="button"
                            onClick={() =>
                              setNewMedication({
                                ...newMedication,
                                remainderEnabled: !newMedication.remainderEnabled,
                              })
                            }
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${newMedication.remainderEnabled ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                          >
                            <span
                              className={`inline-block w-5 h-5 transform bg-white rounded-full transition-transform ${newMedication.remainderEnabled ? 'translate-x-5' : 'translate-x-1'
                                }`}
                            />
                          </button>
                          <span className="ml-2 text-sm text-gray-700">
                            {newMedication?.remainderEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Morning Time</label>
                        <input
                          value={newMedication.times.Morning}
                          onChange={(e) => setNewMedication({ ...newMedication, times: { ...newMedication.times, Morning: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          type="text" name="" id="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Afternoon Time</label>
                        <input
                          value={newMedication.times.Afternoon}
                          onChange={(e) => setNewMedication({ ...newMedication, times: { ...newMedication.times, Afternoon: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          type="text" name="" id="" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Evening Time</label>
                        <input
                          value={newMedication.times.Evening}
                          onChange={(e) => setNewMedication({ ...newMedication, times: { ...newMedication.times, Evening: e.target.value } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          type="text" name="" id="" />
                      </div>

                      <div className='col-span-2'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instruction</label>
                        <textarea
                          value={newMedication.instruction}
                          onChange={(e) => setNewMedication({ ...newMedication, instruction: e.target.value })}
                          placeholder="Enter instructions...."
                          className="w-full outline-none px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                      </div>
                    </div>

                  </div>
                  <div className="flex gap-3 p-6 border-t border-gray-200">
                    <button
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      onClick={addMedication}
                      disabled={!newMedication.name || !newMedication.dosage}
                    >
                      Add Medication
                    </button>
                  </div>
                </div>
              </div>
            )}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
                  <p className="text-gray-700 mb-6">Are you sure you want to delete this medication? This action cannot be undone.</p>
                  <div className="flex justify-end gap-3">
                    <button
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => setShowDeleteModal(!showDeleteModal)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                      onClick={() => {
                        deleteMedication(deleteMedicationId);
                        setShowDeleteModal(!showDeleteModal);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (activeTab === 'Dashboard') ? (
        navigate('/dashboard')
      ) : (activeTab === 'Sleep Logger') ? (
        navigate('/Sleep Logger')
      ) : (activeTab === 'Water Intake') ? (
        navigate('/waterIntake')
      ) : (activeTab === 'Caregiver') ? (
        navigate('/Caregiver')
      ) : (activeTab === 'Step Counter') ? (
        navigate('/Step Counter')
      ) : (activeTab === 'MediPal Assistant') ? (
        navigate('/MediPal Assitant')
      ) : (activeTab === 'Settings') ? (
        <SettingsComponent />
      ) : null}




    </div>
  );
}

export default MedicationComponent;
