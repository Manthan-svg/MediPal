import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Helper: get all weeks in the month, each week is exactly 7 days (may start in previous month)
function getWeeksInMonthStrict7(year, month) {
  const weeks = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Find the start of the first week (Monday of the week containing the 1st)
  const firstWeekStart = new Date(firstDay);
  const dayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to get Monday
  firstWeekStart.setDate(firstDay.getDate() + daysToMonday);

  let current = new Date(firstWeekStart);
  let weekNumber = 1;

  while (current <= lastDay) {
    const startDate = new Date(current);
    const endDate = new Date(current);
    endDate.setDate(endDate.getDate() + 6);

    // Only include weeks that have at least one day in the current month
    if (endDate >= firstDay) {
      weeks.push({
        weekNumber,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
      weekNumber++;
    }
    current.setDate(current.getDate() + 7);
  }
  return weeks;
}

function formatDate(date) {
  // Returns YYYY-MM-DD
  return date.toISOString().split("T")[0];
}

function getCurrentDateTimeString() {
  const now = new Date();
  return now.toLocaleString();
}

function getWaterIntakeHistoryFromLocalStorage() {
  try {
    const raw = localStorage.getItem("Water-Intake-History");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export default function WeeklyWaterChart() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed

  // Get all weeks in the current month, each week is exactly 7 days (except possibly the last)
  const weeks = useMemo(() => getWeeksInMonthStrict7(year, month), [year, month]);

  // Get water intake history from localStorage
  const intakeHistory = useMemo(() => getWaterIntakeHistoryFromLocalStorage(), []);

  // Calculate total intake per week (7 days per week, except possibly last week)
  const chartData = useMemo(() => {
    return weeks.map((week) => {
      let total = 0;
      let dayCount = 0;
      for (
        let d = new Date(week.startDate);
        d <= week.endDate && dayCount < 7;
        d.setDate(d.getDate() + 1), dayCount++
      ) {
        const key = formatDate(d);
        // intakeHistory[key]?.total is the value saved by WaterIntakeComponent
        total += intakeHistory[key]?.total ? Number(intakeHistory[key].total) : 0;
      }
      return {
        week: `Week ${week.weekNumber}`,
        totalLiters: Number(total.toFixed(2)),
      };
    });
  }, [weeks, intakeHistory]);

  // Calculate the sum of all totalLiters for the current month (all weeks)
  const totalMonthLiters = useMemo(() => {
    return chartData.reduce((sum, week) => sum + week.totalLiters, 0).toFixed(2);
  }, [chartData]);

  return (
    <div className="p-6 w-full h-[400px] flex flex-col space-y-4">
      {/* Current Date and Time */}
      <div className="flex justify-center mb-2">
        <span className="text-lg font-semibold text-blue-700">
          {getCurrentDateTimeString()}
        </span>
      </div>

      {/* Show sum of total liters for the month */}
      <div className="flex justify-center mb-2">
        <span className="text-md font-semibold text-green-700">
          Total Water Intake This Month: {totalMonthLiters} L
        </span>
      </div>

      {/* Graph */}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" label={{ value: "Weeks", position: "insideBottom", offset: -5 }} />
          <YAxis
            domain={[0, (dataMax) => Math.max(60, Math.ceil(dataMax + 1))]}
            label={{ value: "Total Liters", angle: -90, position: "insideLeft" }}
          />
          <Tooltip
            formatter={(value) => [`${value} L`, "Total Intake"]}
            labelFormatter={(label) => label}
          />
          <Bar dataKey="totalLiters" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
