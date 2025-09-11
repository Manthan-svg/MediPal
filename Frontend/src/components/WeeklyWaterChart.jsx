import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ✅ Example daily intake log (replace with backend/localStorage data)
const intakeLogs = {
  "2025-08-11": 2.5,
  "2025-08-12": 3.2,
  "2025-08-13": 1.8,
  "2025-08-14": 2.0,
  "2025-08-15": 4.1,
  "2025-08-16": 3.5,
  "2025-08-17": 2.2,
  "2025-08-04": 3.0,
  "2025-08-05": 2.8,
  "2025-08-06": 3.2,
  "2025-08-07": 1.5,
  "2025-08-08": 4.0,
  "2025-08-09": 2.7,
  "2025-08-10": 3.1,
};

function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sun
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export default function WeeklyWaterChart() {
  const today = new Date();
  const startOfThisWeek = getStartOfWeek(today);

  // Generate last 4 weeks including current
  const weeks = Array.from({ length: 4 }, (_, i) => {
    const start = new Date(startOfThisWeek);
    start.setDate(start.getDate() - i * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { label: i === 0 ? "This Week" : `Week -${i}`, start, end };
  });

  const [selectedWeek, setSelectedWeek] = useState(weeks[0]);

  // Generate data for selected week
  const chartData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = [];

    for (let i = 0; i < 7; i++) {
      const day = new Date(selectedWeek.start);
      day.setDate(day.getDate() + i);
      const key = formatDate(day);
      data.push({
        day: days[i],
        liters: intakeLogs[key] || 0, // 0 if no entry
      });
    }
    return data;
  }, [selectedWeek]);

  return (
    <div className="p-6 w-full h-[400px] flex flex-col space-y-4">
      {/* Dropdown */}
      <div className="flex justify-end">
        <select
          value={selectedWeek.label}
          onChange={(e) =>
            setSelectedWeek(weeks.find((w) => w.label === e.target.value))
          }
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          {weeks.map((week) => (
            <option key={week.label} value={week.label}>
              {week.label} ({week.start.toDateString()})
            </option>
          ))}
        </select>
      </div>

      {/* Graph */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis domain={[0, 10]} />
          <Tooltip />
          {/* ✅ Add daily goal line (e.g. 3L/day) */}
          <ReferenceLine y={3} stroke="red" strokeDasharray="5 5" label="Goal" />
          <Bar dataKey="liters" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
