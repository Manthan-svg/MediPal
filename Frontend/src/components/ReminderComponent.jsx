import React, { useState, useEffect, useContext } from 'react';
import { FaBell, FaBellSlash, FaCheck, FaClock, FaPills, FaTimes } from 'react-icons/fa';
import { UserContext } from '../utils/UserContextComponent';
import axios from '../utils/Axios.Config';
import { toast } from 'react-toastify';

function ReminderComponent() {
  const { user, token } = useContext(UserContext);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [stats, setStats] = useState({
    totalReminders: 0,
    takenReminders: 0,
    pendingReminders: 0,
    adherenceRate: 0
  });

  // Fetch today's medication schedule with reminder status
  const fetchTodaysSchedule = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/reminders/todays-schedule', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMedications(response?.data?.schedule || []);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to fetch medication schedule');
    } finally {
      setLoading(false);  
    }
  };

  // Fetch reminder statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get('/reminders/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response?.data?.stats) setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Mark medication as taken
  const markAsTaken = async (medicationId, timeSlot) => {
    try {
      const response = await axios.post('/reminders/mark-taken', {
        medicationId,
        timeSlot
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        toast.success('Medication marked as taken!');
        fetchTodaysSchedule();
        fetchStats();
      }
    } catch (error) {
      console.error('Error marking medication as taken:', error);
      toast.error('Failed to mark medication as taken');
    }
  };

  // Toggle reminder settings
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
        fetchTodaysSchedule();
      }
    } catch (error) {
      console.error('Error toggling reminder:', error);
      toast.error('Failed to update reminder settings');
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchTodaysSchedule();
      fetchStats();
      // Auto-refresh every 60s so UI reflects backend reminders
      const id = setInterval(() => {
        fetchTodaysSchedule();
        fetchStats();
      }, 60000);
      return () => clearInterval(id);
    }
  }, [user, token]);

  // Filter medications based on selected time slot
  const filteredMedications = medications.filter(medication => {
    if (selectedTimeSlot === 'all') return true;
    return medication.todaysSchedule.some(slot => slot.timeSlot === selectedTimeSlot);
  });

  // Get time slot color
  const getTimeSlotColor = (timeSlot) => {
    switch (timeSlot) {
      case 'morning': return 'text-yellow-600 bg-yellow-100';
      case 'afternoon': return 'text-orange-600 bg-orange-100';
      case 'evening': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status color
  const getStatusColor = (taken, reminderSent) => {
    if (taken) return 'text-green-600 bg-green-100';
    if (reminderSent) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medication Reminders</h1>
        <p className="text-gray-600">Manage your medication schedule and reminders</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaPills className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reminders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReminders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheck className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taken</p>
              <p className="text-2xl font-bold text-gray-900">{stats.takenReminders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReminders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaBell className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.adherenceRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTimeSlot('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTimeSlot === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Times
          </button>
          <button
            onClick={() => setSelectedTimeSlot('morning')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTimeSlot === 'morning'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Morning
          </button>
          <button
            onClick={() => setSelectedTimeSlot('afternoon')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTimeSlot === 'afternoon'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Afternoon
          </button>
          <button
            onClick={() => setSelectedTimeSlot('evening')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedTimeSlot === 'evening'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Evening
          </button>
        </div>
      </div>

      {/* Medications List */}
      <div className="space-y-6">
        {filteredMedications.length === 0 ? (
          <div className="text-center py-12">
            <FaPills className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medications found</h3>
            <p className="text-gray-500">
              {selectedTimeSlot === 'all' 
                ? 'You don\'t have any medications scheduled for today.'
                : `No medications scheduled for ${selectedTimeSlot} today.`
              }
            </p>
          </div>
        ) : (
          filteredMedications.map((medication) => (
            <div key={medication._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {medication.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Dosage: {medication.dosage || 'As prescribed'}</span>
                    <span>Type: {medication.medicationType}</span>
                    <span>Frequency: {medication.frequency}</span>
                  </div>
                  {medication.instruction && (
                    <p className="text-sm text-gray-600 mt-2">
                      Instructions: {medication.instruction}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => toggleReminder(medication._id, medication.reminderEnabled)}
                  className={`p-2 rounded-full transition-colors ${
                    medication.reminderEnabled
                      ? 'text-green-600 bg-green-100 hover:bg-green-200'
                      : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                  }`}
                  title={medication.reminderEnabled ? 'Disable reminders' : 'Enable reminders'}
                >
                  {medication.reminderEnabled ? <FaBell className="h-5 w-5" /> : <FaBellSlash className="h-5 w-5" />}
                </button>
              </div>

              {/* Today's Schedule */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Today's Schedule</h4>
                {medication.todaysSchedule.map((slot, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTimeSlotColor(slot.timeSlot)}`}
                      >
                        {slot.timeSlot.charAt(0).toUpperCase() + slot.timeSlot.slice(1)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {slot.scheduledTime}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(slot.taken, slot.reminderSent)}`}
                      >
                        {slot.taken ? 'Taken' : slot.reminderSent ? 'Reminder Sent' : 'Pending'}
                      </span>
                      
                      {!slot.taken && (
                        <button
                          onClick={() => markAsTaken(medication._id, slot.timeSlot)}
                          className="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
                        >
                          Mark as Taken
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ReminderComponent;
