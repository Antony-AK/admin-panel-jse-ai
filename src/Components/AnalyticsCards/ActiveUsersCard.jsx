import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ADMIN_URL } from '../../utils/api';

const ActiveUsersCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const token = sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(
          `${ADMIN_URL}/analytics/active-users/count`,
          { headers }
        );
        console.log("✅ Active Users Data", response.data);
        setData(response.data);
      } catch (err) {
        console.error("❌ Error fetching active users data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveUsers();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full md:w-full lg:w-full transition-transform duration-200">
      <h2 className="text-lg font-bold text-gray-800 mb-4"> Active Users</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading data...</p>
      ) : !data ? (
        <p className="text-sm text-red-500">Failed to load data 😢</p>
      ) : (
        <>
          <div className="flex items-center justify-between text-gray-600 ">
            <p>
              Last 1 hour:{" "}
              <span className="font-semibold text-black">
                {data.active_users_last_1_hour}
              </span>
            </p>
            <p>
              Peak:{" "}
              <span className="font-semibold text-black">
                {data.peak_active_users}
              </span>
            </p>
          </div>

          {/* <ResponsiveContainer width="100%" height={150}>
            <AreaChart
              data={data.graph_data.map((item) => ({
                time: formatDate(item.time_stamp),
                active: item.peak_active_users,
              }))}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorActive)"
              />
            </AreaChart>
          </ResponsiveContainer> */}
        </>
      )}
    </div>
  );
};

export default ActiveUsersCard;
