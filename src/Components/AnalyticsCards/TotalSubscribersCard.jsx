import { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";
import { ADMIN_URL } from "../../utils/api";

const TotalSubscribersCard = () => {
  const [subsData, setSubsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubsData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${ADMIN_URL}/analytics/total-subs/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubsData(response.data);
      } catch (error) {
        console.error("Error fetching subscriber data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubsData();
  }, []);

  const isPositive = subsData?.daily_trends?.percentage_change >= 0;
const graphColor = isPositive ? "#10B981" : "#EF4444"; // Emerald or Red

  const TrendIndicator = () => {
    if (!subsData) return null;
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const color = isPositive ? "text-green-500" : "text-red-500";
    const change = subsData.daily_trends.percentage_change;
    return (
      <div className={`flex items-center ${color} text-sm`}>
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(change)}%
      </div>
    );
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-lg w-full h-52 transition-transform duration-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Total Subscribers
          </h2>
          {!loading && subsData && (
            <p className="text-sm text-gray-500">
              Peak: {subsData.peak_subscribers.toLocaleString()}
            </p>
          )}
        </div>
        <UserGroupIcon className="h-8 w-8 text-purple-500" />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : !subsData ? (
        <p className="text-sm text-red-500">Unable to load data</p>
      ) : (
        <>
          <div className="flex items-center justify-between ">
            <p className="text-2xl font-bold text-gray-900">
              {subsData.total_subscribers.toLocaleString()}
            </p>
            <TrendIndicator />
          </div>

          {/* AreaChart with Dynamic Gradient */}
          <div className="rounded-lg p-2 h-28 -mt-5">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={subsData.graph_data}>
                <defs>
                  <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={graphColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={graphColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} subs`, "Subscribers"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke={graphColor}
                  strokeWidth={2}
                  fill="url(#subsGradient)"
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default TotalSubscribersCard;
