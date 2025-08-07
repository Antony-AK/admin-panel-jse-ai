import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ADMIN_URL } from "../../utils/api";
import { BriefcaseIcon } from "@heroicons/react/24/solid";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#F43F5E", "#06B6D4"];

const TopJobTitlesCard = () => {
  const [titleData, setTitleData] = useState(null);

useEffect(() => {
  const fetchTopTitles = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(
        `${ADMIN_URL}/analytics/job-titles/popular/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitleData(response.data);
    } catch (error) {
      console.error("Error fetching top job titles:", error);
    }
  };

  fetchTopTitles();
}, []);


  if (!titleData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <p className="text-gray-500">Loading Top Job Titles...</p>
      </div>
    );
  }

  const chartData = titleData.top_titles.map((item, index) => ({
    name: item.title,
    value: item.count,
    percent: item.percent,
    color: COLORS[index % COLORS.length], // Use "color" key for clarity
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full h-72">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Top Job Titles</h3>
          <p className="text-sm text-gray-500">
            Total Users: {titleData.total_users.toLocaleString()}
          </p>
        </div>
        <BriefcaseIcon className="w-7 h-7 text-indigo-500" />
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
        >
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value, name, props) => {
              const percent = props?.payload?.percent ?? 0;
              return [`${value} People (${percent}%)`, name];
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopJobTitlesCard;
