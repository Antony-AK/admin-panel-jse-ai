import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { UserGroupIcon } from "@heroicons/react/24/solid";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#F43F5E", "#06B6D4", "#8B5CF6"];

const UserProgressCard = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(`https://a1.arshan.digital/a1/admin/analytics/user-progress/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProgressData(res.data);
      } catch (err) {
        console.error("❌ User progress fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <p className="text-sm text-gray-500">Loading User Progress...</p>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <p className="text-sm text-red-500">Unable to load user progress data</p>
      </div>
    );
  }

  // 🧩 Extract values and compute percentages
  const { total_users, ...categories } = progressData;
  const chartData = Object.entries(categories).map(([key, count], idx) => ({
    name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    count,
    value: ((count / total_users) * 100).toFixed(1), // percent
    fill: COLORS[idx % COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, count, value } = payload[0].payload;
      return (
        <div className="bg-white border rounded-md p-2 shadow-sm text-xs">
          <p className="font-semibold">{name}</p>
          <p>{count} users</p>
          <p>{value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-80">
      <div className="flex items-center justify-between -mb-2">
        <div>
          <h3 className="text-base font-bold text-gray-800">
            User Progress Status
          </h3>
          <p className="text-sm text-gray-500">
            Total Users: {total_users.toLocaleString()}
          </p>
        </div>
        <UserGroupIcon className="w-7 h-7 text-purple-500" />
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            labelLine={true}
            label={({ name, value, x, y }) => (
              <text
                x={x}
                y={y}
                fill="#333"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={10}
              >
                {`${name}: ${value}%`}
              </text>
            )}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>

          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserProgressCard;
