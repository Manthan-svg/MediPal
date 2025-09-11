import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ✅ Helper function: get start (Sunday) of current week
const getStartOfWeek = (date) => {
  const day = date.getDay(); // 0 = Sunday
  const diff = date.getDate() - day;
  return new Date(date.setDate(diff));
};

// ✅ Helper function: get all dates for a week
const getWeekDates = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const SleepChart = () => {
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = prev week
  const [weekDates, setWeekDates] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const startOfWeek = getStartOfWeek(
      new Date(today.setDate(today.getDate() + weekOffset * 7))
    );
    const dates = getWeekDates(startOfWeek);

    setWeekDates(dates);

    // ✅ Example dummy sleep data (replace with backend/localStorage)
    const sleepData = dates.map((d) => ({
      day: d.toLocaleDateString("en-US", { weekday: "long" }),
      hours: Math.floor(Math.random() * 5) + 6, // random 6–10 hrs
    }));

    setData(sleepData);
  }, [weekOffset]);

  return (
    <div className="p-4 bg-white shadow rounded-xl w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Weekly Sleep Tracker</h2>
        <select
          className="border px-2 py-1 rounded"
          value={weekOffset}
          onChange={(e) => setWeekOffset(Number(e.target.value))}
        >
          <option value={0}>Current Week</option>
          <option value={-1}>Last Week</option>
          <option value={-2}>2 Weeks Ago</option>
          <option value={-3}>3 Weeks Ago</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 12]} /> {/* Hours 0-12 */}
          <YAxis dataKey="day" type="category" />
          <Tooltip />
          <Bar dataKey="hours" fill="#4F46E5" barSize={25} radius={[6, 6, 6, 6]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepChart;
