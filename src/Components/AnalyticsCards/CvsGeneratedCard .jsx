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
  DocumentDuplicateIcon,
} from "@heroicons/react/24/solid";

const CvsGeneratedCard = () => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCvData = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${ADMIN_URL}/analytics/cv-gen/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCvData(response.data);
      } catch (error) {
        console.error("Error fetching CV data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCvData();
  }, []);

  const isPositive = cvData?.daily_trends?.percentage_change >= 0;
  const graphColor = isPositive ? "#3B82F6" : "#EF4444"; // Blue or red wave

  const TrendIndicator = () => {
    if (!cvData) return null;
    const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const color = isPositive ? "text-blue-500" : "text-red-500";
    const change = cvData.daily_trends.percentage_change;
    return (
      <div className={`flex items-center ${color} text-sm`}>
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(change)}%
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base font-semibold text-gray-800 leading-snug">
            CVs <br /> Generated
          </h2>
          {!loading && cvData && (
            <p className="text-sm text-gray-500 mt-1">
              Peak: {cvData.peak_cvs.toLocaleString()}
            </p>
          )}
        </div>
        <DocumentDuplicateIcon className="h-7 w-7 text-blue-500" />
      </div>

      {loading ? (
        <p className="text-sm text-gray-500 mt-4">Loading...</p>
      ) : !cvData ? (
        <p className="text-sm text-red-500 mt-4">Unable to load data</p>
      ) : (
        <>
          <div className="flex items-center justify-between mt-3 mb-2">
            <p className="text-2xl font-bold text-gray-900">
              {cvData.total_cvs_generated.toLocaleString()}
            </p>
            <TrendIndicator />
          </div>

          <div className="rounded-lg h-20 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cvData.graph_data}>
                <defs>
                  <linearGradient id="cvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={graphColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={graphColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value} CVs`, "Generated"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area
                  type="basis" // smooth wavy curve
                  dataKey="cv_generated"
                  stroke={graphColor}
                  strokeWidth={2}
                  fill="url(#cvGradient)"
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

export default CvsGeneratedCard;
