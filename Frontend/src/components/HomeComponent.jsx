// File: src/pages/Dashboard.jsx
import React from "react";
import { HeartPulse, Droplets, Footprints, BedDouble, Pill, Bell, UserCircle2, LogOut, CalendarDays } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LabelList, ResponsiveContainer } from "recharts";

const summaryData = [
  { label: "Heart Rate", value: "103 bpm", icon: <HeartPulse className="text-red-500" /> },
  { label: "Water Intake", value: "1.5 L", icon: <Droplets className="text-blue-500" /> },
  { label: "Steps", value: "4500", icon: <Footprints className="text-green-500" /> },
  { label: "Sleep", value: "6.5 hrs", icon: <BedDouble className="text-purple-500" /> },
  { label: "Next Dose", value: "10:30 AM", icon: <Pill className="text-pink-500" /> },
];

const graphData = [
  { day: "Mon", medication: 80, hydration: 60 },
  { day: "Tue", medication: 90, hydration: 70 },
  { day: "Wed", medication: 60, hydration: 50 },
  { day: "Thu", medication: 100, hydration: 80 },
  { day: "Fri", medication: 70, hydration: 60 },
  { day: "Sat", medication: 85, hydration: 75 },
  { day: "Sun", medication: 95, hydration: 90 },
];

const todaySchedule = [
  { time: "8:00 AM", task: "💊 Take Vitamin C" },
  { time: "9:30 AM", task: "🥤 Drink 1 glass of water" },
  { time: "12:00 PM", task: "💊 Blood Pressure Tablet" },
  { time: "4:00 PM", task: "🚶 Walk 2000 steps" },
  { time: "8:00 PM", task: "😴 Sleep log reminder" }
];

const recentLogs = [
  { type: "Water", value: "250 ml", time: "7:15 AM" },
  { type: "Sleep", value: "6.5 hrs", time: "Today Morning" },
  { type: "Steps", value: "1500 steps", time: "9:30 AM" },
  { type: "Medication", value: "Paracetamol", time: "8:00 AM" }
];

const healthTips = [
  "💧 Stay hydrated throughout the day – set water reminders every 2 hours.",
  "🚶 Walk for at least 30 minutes to reduce stress and improve heart health.",
  "☕ Avoid caffeine after 6 PM to improve sleep quality.",
  "🕒 Take medications at consistent times for better absorption."
];

export default function Dashboard() {

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6 space-y-6 border-r">
        <h1 className="text-2xl font-bold text-teal-600">MediPal</h1>
        <nav className="space-y-4 text-gray-700">
          <div className="flex items-center space-x-2 text-teal-600 font-semibold"><span>🏠</span><span>Dashboard</span></div>
          <div className="flex items-center space-x-2"><Pill /><span>Dashboard</span></div>
          <div className="flex items-center space-x-2"><Droplets /><span>Water Intake</span></div>
          <div className="flex items-center space-x-2"><Footprints /><span>Steps</span></div>
          <div className="flex items-center space-x-2"><BedDouble /><span>Sleep Tracker</span></div>
          <div className="flex items-center space-x-2"><BarChart /><span>Reports</span></div>
          <div className="flex items-center space-x-2"><LogOut /><span>Logout</span></div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
          <div className="flex items-center space-x-4">
            <Bell className="text-gray-600" />
            <UserCircle2 className="text-gray-600" />
            <span className="text-gray-500">Aug 1, 2025</span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {summaryData.map((item, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="text-lg font-bold">{item.value}</p>
              </div>
              {item.icon}
            </div>
          ))}
        </div>

        {/* Weekly Chart */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium mb-4">Weekly Health Stats</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={graphData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="medication" fill="#0d9488" name="Medication %" animationDuration={800}>
                <LabelList dataKey="medication" position="top" />
              </Bar>
              <Bar dataKey="hydration" fill="#3b82f6" name="Hydration %" animationDuration={800}>
                <LabelList dataKey="hydration" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium mb-4">Today's Schedule</h3>
          <ul className="space-y-2">
            {todaySchedule.map((item, i) => (
              <li key={i} className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-600">{item.task}</span>
                <span className="text-sm text-gray-400">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium mb-4">Recent Health Logs</h3>
          <ul className="space-y-2">
            {recentLogs.map((log, i) => (
              <li key={i} className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">{log.type}: <strong>{log.value}</strong></span>
                <span className="text-sm text-gray-400">{log.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Health Tips */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-medium mb-4">Daily Health Tips</h3>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            {healthTips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
