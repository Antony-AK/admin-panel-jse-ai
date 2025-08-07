import { useEffect, useState } from "react";
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
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

const InterviewsCard = () => {
  const [intData, setIntData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${ADMIN_URL}/analytics/interview/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIntData(response.data);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntData();
  }, []);

  const isPositive = intData?.daily_trends?.percentage_change >= 0;
  const graphColor = isPositive ? "#F59E0B" : "#EF4444";

  const TrendIndicator = () => {
    if (!intData) return null;
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const color = isPositive ? "text-yellow-500" : "text-red-500";
    const change = intData.daily_trends.percentage_change;
    return (
      <div className={`flex items-center ${color} text-sm`}>
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(change)}%
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-[295px] h-[400px]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-semibold text-gray-800 leading-snug">
            Interviews <br /> Generated
          </h2>
          {!loading && intData && (
            <p className="text-sm text-gray-500 mt-1">
              Peak: {intData.peak_interviews.toLocaleString()}
            </p>
          )}
        </div>
        <CalendarDaysIcon className="h-7 w-7 text-yellow-500" />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      ) : !intData ? (
        <p className="text-sm text-red-500 mt-4">Unable to load data</p>
      ) : (
        <>
          <div className="flex items-center justify-between mt-3 mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {intData.total_interviews.toLocaleString()}
            </p>
            <TrendIndicator />
          </div>

          <div className="rounded-lg h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={intData.graph_data}>
                <defs>
                  <linearGradient id="intGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={graphColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={graphColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} interviews`, "Generated"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="basis"
                  dataKey="count"
                  stroke={graphColor}
                  strokeWidth={2}
                  fill="url(#intGradient)"
                  dot={{ r: 2 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default InterviewsCard;
