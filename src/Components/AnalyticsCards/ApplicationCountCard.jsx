import React, { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_URL } from "../../utils/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
} from "@heroicons/react/24/solid";

const ApplicationCountCard = () => {
  const [appData, setAppData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    axios
      .get(`${ADMIN_URL}/analytics/application/count`, { headers })
      .then((res) => {
        setAppData(res.data);
      })
      .catch((err) => console.error("App Count Error:", err));
  }, []);

  if (!appData) return null;

  const isPositive = appData.trend_from_yesterday >= 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-52">
      <h2 className="text-lg font-semibold ">Total Applications</h2>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-gray-900">
            {appData.today_total_applications}
          </p>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            {isPositive ? (
              <ArrowUpRightIcon className="w-5 h-5 text-green-500 mr-1" />
            ) : (
              <ArrowDownRightIcon className="w-5 h-5 text-red-500 mr-1" />
            )}
            <span
              className={`font-medium me-2 ${isPositive ? "text-green-600" : "text-red-600"
                }`}
            >
              {Math.abs(appData.trend_from_yesterday).toFixed(2)}%
            </span>{" "}
            from yesterday
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-24  p-5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={appData.weekly_graph}>
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip />
            <defs>
              <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="applications"
              stroke="#4F46E5"
              fill="url(#colorApp)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default ApplicationCountCard;
