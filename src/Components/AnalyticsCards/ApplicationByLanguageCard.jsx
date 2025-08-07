import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ADMIN_URL } from "../../utils/api";

const COLORS = [
  "#22D3EE", // cyan / bright teal 💧
  "#A78BFA", // soft purple 🔮
  "#34D399", // emerald green 🌿
  "#F472B6", // rose pink 🌸
  "#64748B", // slate gray 🧊
];



const SkeletonLoader = () => (
  <div className="bg-white shadow-lg rounded-xl p-4 w-full max-w-sm animate-pulse">
    <div className="h-5 bg-gray-300 rounded w-1/2 mb-6"></div>
    <div className="h-48 bg-gray-200 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/3"></div>
  </div>
);

const ApplicationByLanguageCard = () => {
  const [languageData, setLanguageData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios
      .get(`${ADMIN_URL}/analytics/application/language`, { headers })
      .then((res) => {
        console.log("API Response: ", res.data);
        setLanguageData(res.data);
      })
      .catch((err) => console.error("Language App Data Error:", err));
  }, []);

  if (!languageData || !languageData.applications_by_language) {
    return <SkeletonLoader />;
  }

  const pieData = Object.entries(languageData.applications_by_language).map(
    ([language, value]) => ({
      name: language,
      value: value.applications,
      percent: value.percent,
    })
  );

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-full ">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Applications by Language
      </h2>
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={2}
            labelLine={false}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name, props) => {
              const percent = props?.payload?.percent ?? 0;
              return [`${value} Applications (${percent}%)`, name];
            }}
          />

        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap text-xs mt-4 gap-4 w-full">
        {pieData.map((entry, index) => (
          <div key={index} className="flex items-center justify-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>



      <div className="mt-4 text-sm text-gray-600">
        Total Users:{" "}
        <span className="font-semibold">
          {languageData?.total_users?.toLocaleString() || 0}
        </span>
      </div>
    </div>
  );
};

export default ApplicationByLanguageCard;
