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
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid";

const CoverLettersCard = () => {
  const [clData, setClData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCLData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${ADMIN_URL}/analytics/cl-gen/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClData(response.data);
      } catch (error) {
        console.error("Error fetching cover letter data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCLData();
  }, []);

  const isPositive = clData?.daily_trends?.percentage_change >= 0;
  const graphColor = isPositive ? "#10B981" : "#EF4444";

  const TrendIndicator = () => {
    if (!clData) return null;
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const color = isPositive ? "text-green-500" : "text-red-500";
    const change = clData.daily_trends.percentage_change;
    return (
      <div className={`flex items-center ${color} text-sm`}>
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(change)}%
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full ">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-semibold text-gray-800 leading-snug">
            Cover Letters <br /> Generated
          </h2>
          {!loading && clData && (
            <p className="text-sm text-gray-500 mt-1">
              Peak: {clData.peak_cover_letters.toLocaleString()}
            </p>
          )}
        </div>
        <DocumentTextIcon className="h-7 w-7 text-pink-500" />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      ) : !clData ? (
        <p className="text-sm text-red-500 mt-4">Unable to load data</p>
      ) : (
        <>
          <div className="flex items-center justify-between mt-3 mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {clData.total_cover_letters_generated.toLocaleString()}
            </p>
            <TrendIndicator />
          </div>

          <div className="rounded-lg h-20 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={clData.graph_data}>
                <defs>
                  <linearGradient id="clGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={graphColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={graphColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} letters`, "Generated"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="basis"
                  dataKey="cover_generated"
                  stroke={graphColor}
                  strokeWidth={2}
                  fill="url(#clGradient)"
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

export default CoverLettersCard;
