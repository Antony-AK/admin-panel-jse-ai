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
import { BriefcaseIcon } from "@heroicons/react/24/solid";

const COLORS = [
  "#6366F1",
  "#10B981",
  "#F59E0B",
  "#F43F5E",
  "#06B6D4",
  "#8B5CF6",
  "#EC4899",
  "#22C55E",
  "#EAB308",
  "#3B82F6",
];

const TopJobTitlesCard = () => {
  const [titleData, setTitleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTitles = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `https://a1.arshan.digital/a1/admin/analytics/job-titles/popular/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTitleData(response.data);
      } catch (error) {
        console.error("❌ Error fetching top job titles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTitles();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <p className="text-gray-500">Loading Top Job Titles...</p>
      </div>
    );
  }

  if (!titleData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <p className="text-red-500">Unable to load job title data</p>
      </div>
    );
  }

  // 🧩 No slice — show ALL titles now!
  const chartData = titleData.titles.map((item, index) => ({
    name: item.title,
    value: item.count,
    percent: item.percent.toFixed(1),
    color: COLORS[index % COLORS.length],
  }));

  // 🧠 Dynamic chart height based on total titles
  const chartHeight = chartData.length * 40; // 40px per bar for spacing

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            All Job Titles
          </h3>
          <p className="text-sm text-gray-500">
            Total Seekers: {titleData.total_seekers.toLocaleString()}
          </p>
        </div>
        <BriefcaseIcon className="w-7 h-7 text-indigo-500" />
      </div>

      {/* Scrollable chart area */}
      <div className="h-[205px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            barCategoryGap={8}
          >
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={200}
              tick={{ fontSize: 12 }}
              interval={0} // ✅ show all labels
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
    </div>
  );
};

export default TopJobTitlesCard;
