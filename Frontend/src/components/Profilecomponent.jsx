import React, { useContext, useEffect, useState } from 'react'
import { FaBed, FaCog, FaHome, FaPills, FaRobot, FaTint, FaUserFriends, FaWalking, FaEdit, FaBell, FaChartLine, FaCalendarAlt, FaHeart, FaShieldAlt, FaStethoscope, FaThermometerHalf, FaWeight, FaEye, FaTooth, FaBrain, FaLungs } from 'react-icons/fa'
import { UserContext } from '../utils/UserContextComponent'
import SettingsComponent from './SettingsComponent';
import { useNavigate } from 'react-router-dom';
import image from '../Animations/profileImage.jpg'
import axios from '../utils/Axios.Config';

function Profilecomponent() {
    const { user, setUser, token } = useContext(UserContext);
    const [patientData, setPatientData] = useState({});
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [file,setFile] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName: {
            firstName: user?.fullName?.firstName || '',
            lastName: user?.fullName?.lastName || ''
        },
        email: user?.email || '',
        age: user?.age || '',
        profileImage: user?.profileImage || image, // Default to a placeholder image
    });


    useEffect(() => {
        getProfile();
    }, [editData])

    async function getProfile() {
        try {
            const profile = await axios.post('/profile/getProfile', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPatientData(profile?.data?.user);
        } catch (err) {
            console.log(err);
        }
    }
    // Mock patient data - replace with actual patient data
    // const patientData = {
    //     name: user?.fullName?.firstName + " " + user?.fullName?.lastName,
    //     email: user?.email || "sarah.mitchell@email.com",
    //     avatar: image,  
    //     age: user?.age,
    //     gender: "Male",
    //     bloodType: "O+",
    //     location: "New York, NY",
    //     emergencyContact: user?.emergencyContact || "No emergency contact set",
    //     memberSince: user?.startDate || "Jan 1, 2020",
    //     vitals: {
    //         bloodPressure: "120/80",
    //         heartRate: 72,
    //         temperature: 98.6,
    //         weight: 145,
    //         height: "5'6\"",
    //         bmi: 23.4
    //     },
    //     medications: [
    //         { name: "Lisinopril", dosage: "10mg", frequency: "Daily", time: "Morning" },
    //         { name: "Vitamin D3", dosage: "2000 IU", frequency: "Daily", time: "Morning" },
    //         { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", time: "When needed" }
    //     ],
    //     allergies: ["Penicillin", "Shellfish", "Latex"],
    //     upcomingAppointments: [
    //         { doctor: "Dr. Rodriguez", date: "Dec 15, 2024", time: "10:00 AM", type: "Check-up" },
    //         { doctor: "Dr. Chen", date: "Dec 22, 2024", time: "2:30 PM", type: "Dental Cleaning" },
    //         { doctor: "Dr. Williams", date: "Jan 5, 2025", time: "9:00 AM", type: "Eye Exam" }
    //     ],
    //     recentVisits: [
    //         { date: "Nov 20, 2024", doctor: "Dr. Rodriguez", reason: "Annual Physical", status: "Completed" },
    //         { date: "Oct 15, 2024", doctor: "Dr. Chen", reason: "Dental Check-up", status: "Completed" },
    //         { date: "Sep 10, 2024", doctor: "Dr. Williams", reason: "Vision Test", status: "Completed" }
    //     ],
    //     waterIntake: {
    //         current: 1.5, // in liters
    //         goal: 2.0 // in liters
    //     },
    //     steps: {
    //         current: 7500, // steps
    //         goal: 10000 // steps
    //     },
    //     sleep: {
    //         hours: 7.5 // hours
    //     },
    //     summary: {
    //         waterIntake: {
    //             current: 1.5, // in liters
    //             goal: 2.0 // in liters
    //         },
    //         steps: {
    //             current: 7500, // steps
    //             goal: 10000 // steps
    //         },
    //         sleep: {
    //             hours: 7.5 // hours
    //         },
    //         medAdherence: 85 // percentage
    //     },

    // };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleSaveChanges =async (e) => {
        e.preventDefault();

        try{    
            const updatedData = await axios.put('/profile/updateProfile', {
                fullName: {
                    firstName: editData.fullName.firstName,
                    lastName: editData.fullName.lastName
                },
                email: editData.email,
                age: editData.age,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(updatedData?.data?.user);
            const data = localStorage.getItem('User-Data-Information');
            localStorage.setItem('User-Data-Information',JSON.stringify(updatedData?.data?.user));
    

        }catch(err){
            console.log(err);
        }
        setIsEditing(false);
    }


    const editProfileImage =async (file) => {
        if(!file) return;
        const formData = new FormData();

        formData.append("profileImage",file);

        try{
            const response = await axios.put(`/profile/upload-profile-image/${user._id}`,formData,{
                headers:{
                    Authorization:`Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                }
            })

            const updatedUser = response?.data?.user;
            const imageUp = updatedUser?.profileImage;
            setEditData({
                ...editData,
                profileImage:imageUp
            });
            console.log(editData);
            const data = localStorage.getItem('User-Data-Information');
            localStorage.setItem('User-Data-Information',JSON.stringify(response?.data?.user));

        }catch(err){
            console.log(err);
        }
    }

    const fileChange = async (e) => {
        const file  = e.target.files[0];    
        setFile(file);


        await editProfileImage(file);
    }
    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 p-6">
                <button
                    className="cursor-pointer absolute top-4 scale-150 right-4 text-gray-400 hover:text-gray-700 transition"
                    onClick={() => navigate('/')}
                    aria-label="Close Profile"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 transform transition-all duration-300 hover:shadow-xl">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                            {/* Avatar Section */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-100 shadow-lg transform transition-all duration-300 group-hover:scale-105">
                                    <img
                                        src={editData.profileImage}
                                        alt={"Patient Avatar"}
                                        className="w-full h-full object-cover"
                                    />  
                                </div>
                                <button
                                onClick={() => {
                                    document.querySelector('#fileInput').click();
                                }}
                                className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg transform transition-all duration-200 hover:scale-110 hover:bg-blue-700">
                                    <input id='fileInput' onChange={fileChange} type="file" className='hidden'/>
                                    <FaEdit
                                    className='cursor-pointer'
                                    size={16} />
                                </button>
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{patientData?.fullName?.firstName + " " + patientData?.fullName?.lastName}</h1>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                                            <span className="flex items-center gap-1">
                                                <FaHeart className="text-red-400" />
                                                {patientData.age} years • {patientData.gender || "Not specified"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaShieldAlt className="text-blue-400" />
                                                Blood Type: {patientData.bloodType || "Not specified"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaHome className="text-green-400" />
                                                {patientData.location || "Location not specified"}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 text-sm">Patient since {patientData.memberSince || "Not Specified"}</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transform transition-all duration-200 hover:bg-blue-700 hover:scale-105 shadow-md">
                                            Book Caregiver
                                        </button>
                                        <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold transform transition-all duration-200 hover:bg-gray-200 hover:scale-105">
                                            <FaBell className="inline mr-2" />
                                            Notifications
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vital Signs Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                        {[
                            { icon: FaHeart, label: "Heart Rate", value: 23, unit: "bpm", color: "red" },
                            { icon: FaThermometerHalf, label: "Temperature", value: 78, unit: "°F", color: "orange" },
                            { icon: FaWeight, label: "Weight", value: 88, unit: "lbs", color: "blue" },
                            { icon: FaEye, label: "Blood Pressure", value: 98, unit: "", color: "purple" },
                            { icon: FaWalking, label: "Height", value: 88, unit: "", color: "green" },
                            { icon: FaChartLine, label: "BMI", value: 67, unit: "", color: "teal" }
                        ].map((vital, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-4 shadow-lg transform transition-all duration-300 hover:shadow-xl hover:scale-105"
                            >
                                <div className={`w-10 h-10 rounded-lg bg-${vital.color}-100 flex items-center justify-center mb-3`}>
                                    <vital.icon className={`text-${vital.color}-600 text-lg`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{vital.value}{vital.unit}</h3>
                                <p className="text-gray-600 text-sm">{vital.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Tabs */}
                        <div className="lg:col-span-2">
                            <div className="bg-white h-[45vw] rounded-2xl shadow-lg overflow-hidden">
                                {/* Tab Navigation */}
                                <div className="flex border-b border-gray-200">
                                    {[
                                        { id: 'overview', label: 'Overview', icon: FaChartLine },
                                        { id: 'medications', label: 'Medications', icon: FaPills },
                                        { id: 'appointments', label: 'Appointments', icon: FaCalendarAlt },
                                        { id: 'history', label: 'History', icon: FaStethoscope }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`flex-1 px-4 py-4 text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <tab.icon className="inline mr-2" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Tab Content */}
                                <div className="p-6">
                                    {activeTab === 'overview' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-xl h-[450px] p-6 relative overflow-hidden">
                                                <h3 className="text-xl font-extrabold text-blue-700 mb-4 flex items-center gap-2">
                                                    <span className="inline-block w-2 h-6 bg-blue-400 rounded-full mr-2"></span>
                                                    Basic Information
                                                </h3>
                                                <ul className="space-y-3">
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-blue-600">Name:</span>
                                                        <span className="text-gray-900 font-medium">{patientData?.fullName?.firstName + " " + patientData?.fullName?.lastName}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-blue-600">Age:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.age}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-blue-600">Gender:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.gender || "Male"}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-blue-600">Location:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.location || "Not Specified"}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-blue-600">Contact:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.contact || "123456789"}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5 ">
                                                        <span className="w-32 font-semibold text-blue-600">Email:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.email}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            {/* Other Details Card */}
                                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-6 relative overflow-hidden">
                                                <div className="absolute left-0 bottom-0 opacity-10 text-8xl pointer-events-none select-none">
                                                    <span role="img" aria-label="details">📝</span>
                                                </div>
                                                <h3 className="text-xl font-extrabold text-purple-700 mb-4 flex items-center gap-2">
                                                    <span className="inline-block w-2 h-6 bg-purple-400 rounded-full mr-2"></span>
                                                    Other Details
                                                </h3>
                                                <ul className="space-y-3">
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-purple-600">Blood Group:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.bloodGroup || "Not Specified"}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-purple-600">Allergies:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.allergies || "None"}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-purple-600">Chronic Conditions:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.chronicConditions || "None"}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-purple-600">Emergency Contact:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.emergencyContact || "Not Specified"}</span>
                                                    </li>
                                                    <li className="flex items-center mb-5">
                                                        <span className="w-32 font-semibold text-purple-600">Insurance:</span>
                                                        <span className="text-gray-900 font-medium">{patientData.insurance || "N/A"}</span>
                                                    </li>
                                                </ul>
                                                
                                            </div>

                                        <div className='flex justify-end h-full w-full ml-[380px]'>
                                        <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="cursor-pointer mt-6 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-150 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                                                type="button"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414z" />
                                                </svg>
                                                Update Profile
                                            </button>
                                        </div>
                                        </div>
                                    )}

                                    {activeTab === 'medications' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-semibold text-gray-800">Current Medications</h3>
                                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                                                    Add Medication
                                                </button>
                                            </div>

                                        </div>
                                    )}

                                    {activeTab === 'appointments' && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h3>
                                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">
                                                    Schedule New
                                                </button>
                                            </div>

                                        </div>
                                    )}

                                    {activeTab === 'history' && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Medical History</h3>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Quick Actions */}
                        <div className="space-y-6">

                            {/* Health Tips */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Health Tips</h3>
                                <div className="space-y-4">
                                    {[
                                        { icon: FaHeart, title: "Heart Health", tip: "Aim for 150 minutes of moderate exercise weekly", color: "red" },
                                        { icon: FaTint, title: "Hydration", tip: "Drink 8 glasses of water daily", color: "blue" },
                                        { icon: FaBed, title: "Sleep", tip: "Get 7-9 hours of quality sleep", color: "indigo" }
                                    ].map((tip, index) => (
                                        <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg border-l-4 border-blue-500">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-8 h-8 rounded-full bg-${tip.color}-100 flex items-center justify-center`}>
                                                    <tip.icon className={`text-${tip.color}-600`} />
                                                </div>
                                                <h4 className="font-semibold text-gray-800">{tip.title}</h4>
                                            </div>
                                            <p className="text-gray-600 text-sm">{tip.tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Emergency Info */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Emergency Information</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <p className="text-sm text-gray-600"><span className="font-semibold">Emergency Contact:</span></p>
                                        <p className="text-red-600 font-semibold">{patientData.emergencyContact}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-50 rounded-lg">
                                        <p className="text-sm text-gray-600"><span className="font-semibold">Blood Type:</span></p>
                                        <p className="text-yellow-700 font-semibold">{patientData.bloodType}</p>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <p className="text-sm text-gray-600"><span className="font-semibold">Allergies:</span></p>
                                        <p className="text-red-600 text-sm">Kele</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fadeIn">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
                            onClick={() => setIsEditing(false)}
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Details</h2>
                        <form
                            onSubmit={(e)=>{
                                handleSaveChanges(e);
                            }}
                            className="space-y-5"
                        >
                               
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={editData.fullName.firstName}
                                    onChange={e => setEditData({ ...editData,fullName:{...editData.fullName,firstName:e.target.value} })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={editData.fullName.lastName}
                                    onChange={e => setEditData({ ...editData, fullName: { ...editData.fullName, lastName: e.target.value } })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={editData.email}
                                    onChange={e => setEditData({ ...editData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">Age</label>
                                <input
                                    type="tel"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={editData.age}
                                    onChange={e => setEditData({ ...editData, age: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default Profilecomponent
