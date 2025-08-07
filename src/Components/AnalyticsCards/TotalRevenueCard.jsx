import React, { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_URL } from "../../utils/api";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/solid";

const TotalRevenueCard = () => {
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${ADMIN_URL}/analytics/total-revenue/count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRevenueData(response.data);
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };

    fetchRevenue();
  }, []);

  if (!revenueData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <p className="text-gray-500">Loading Total Revenue...</p>
      </div>
    );
  }

  const { currency, total_revenue, daily_trends } = revenueData;
  const isPositive = daily_trends?.percentage_change >= 0;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-sm text-gray-500">This includes all users</p>
        </div>
        <CurrencyEuroIcon className="w-7 h-7 text-green-500" />
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-xl font-bold">
            {currency} {total_revenue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center">
          {isPositive ? (
            <ArrowTrendingUpIcon className="w-5 h-5 text-green-500 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-5 h-5 text-red-500 mr-1" />
          )}
          <span
            className={`text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {daily_trends.percentage_change}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TotalRevenueCard;
