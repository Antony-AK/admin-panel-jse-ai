import { useEffect, useState } from "react";
import axios from "axios";
import { ADMIN_URL } from "../../utils/api";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { UserGroupIcon } from "@heroicons/react/24/solid";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#F43F5E", "#06B6D4"];

const UserProgressCard = () => {
    const [progressData, setProgressData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const res = await axios.get(`${ADMIN_URL}/analytics/user-progress/count`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProgressData(res.data);
            } catch (err) {
                console.error("User progress fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgressData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md w-full">
                <p className="text-sm text-gray-500">Loading User Progress...</p>
            </div>
        );
    }

    if (!progressData) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md w-full">
                <p className="text-sm text-red-500">Unable to load user progress data</p>
            </div>
        );
    }

    const distribution = progressData.distribution;
    const chartData = Object.entries(distribution).map(([key, val], idx) => ({
        name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value: val.percent,
        count: val.count,
        fill: COLORS[idx % COLORS.length],
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, count, value } = payload[0].payload;
            return (
                <div className="bg-white border rounded-md p-2 shadow-sm text-xs">
                    <p className="font-semibold">{name}</p>
                    <p>{count} users</p>
                    <p>{value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full h-80">
            <div className="flex items-center justify-between -mb-2">
                <div>
                    <h3 className="text-base font-bold text-gray-800">
                        User Progress Status
                    </h3>
                    <p className="text-sm text-gray-500">
                        Total Users: {progressData.total_users.toLocaleString()}
                    </p>
                </div>
                <UserGroupIcon className="w-7 h-7 text-purple-500" />
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        labelLine={true}
                        label={({ name, percent, x, y }) => (
                            <text
                                x={x}
                                y={y}
                                fill="#333"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={10} // 👈 reduce font size here
                            >
                                {`${name}: ${(percent * 100).toFixed(0)}%`}
                            </text>
                        )}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>



                    <Tooltip content={<CustomTooltip />} />
                    {/* <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconSize={10}
            wrapperStyle={{ fontSize: "8px", marginTop: "20px" }}
          /> */}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserProgressCard;
