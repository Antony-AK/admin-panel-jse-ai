import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { ADMIN_URL } from '../../utils/api';

const TotalAccountsCard = () => {
  const [total, setTotal] = useState(null);
  const [change, setChange] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalAccounts = async () => {
      const token = sessionStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const res = await axios.get(`${ADMIN_URL}/analytics/total-acc`, { headers });
        setTotal(res.data.total_accounts);
        setChange(res.data.daily_trends.percentage_change);
      } catch (err) {
        console.error("❌ Fetch Total Accounts Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalAccounts();
  }, []);

  const TrendIndicator = () => {
    if (change === null) return null;
    const isUp = change >= 0;
    const Icon = isUp ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
    const color = isUp ? 'text-green-500' : 'text-red-500';
    return (
      <div className={`flex items-center ${color} text-sm`}>
        <Icon className="w-4 h-4 mr-1" />
        {Math.abs(change)}%
      </div>
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-full  transition-transform duration-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Total Accounts</h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : !total ? (
        <p className="text-sm text-red-500">Unable to load data</p>
      ) : (
        <div className="flex flex-col space-y-2">
          <p className="text-xl font-bold text-gray-900">{total.toLocaleString()}</p>
          <TrendIndicator />
        </div>
      )}
    </div>
  );
};

export default TotalAccountsCard;
