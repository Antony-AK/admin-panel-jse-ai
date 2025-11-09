import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import search_icon from "../../assets/search.png";
import avatar from "../../assets/avatar.png";
import edit from "../../assets/edit.png";
import drop_down from "../../assets/drop-arrow.png";
import { ADMIN_URL } from "../../utils/api";

const UserDetails = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const hoverCardRef = useRef(null);

  // Get User data
  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No User found. Please log in.");
        return;
      }
      const res = await fetch(`${ADMIN_URL}/edit/user-data`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        toast.error("Failed to fetch user data");
      }
      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.meta || {});
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = async (id, email) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No User found. Please log in.");
        return;
      }

      const res = await fetch(`${ADMIN_URL}/edit/user-data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        toast.error("Failed to fetch user details");
        return;
      }

      const data = await res.json();

      sessionStorage.setItem("selectedUser", JSON.stringify(data));

      navigate(`/users/${id}`);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const getHoverCardPosition = () => {
    if (!hoverCardRef.current) return { top: mousePos.y + 15, left: mousePos.x + 15 };

    const cardWidth = hoverCardRef.current.offsetWidth;
    const cardHeight = hoverCardRef.current.offsetHeight;
    let posX = mousePos.x + 15;
    let posY = mousePos.y + 15;

    if (posX + cardWidth > window.innerWidth) {
      posX = mousePos.x - cardWidth - 15;
    }
    if (posY + cardHeight > window.innerHeight) {
      posY = mousePos.y - cardHeight - 15;
    }
    return { top: posY, left: posX };
  };

  return (
    <div>
      <div className="px-8 py-5">
        <div
          className={`grid ${showAll ? "grid-cols-5" : "grid-cols-5"} gap-6 transition-all duration-300`}
        >
          {(showAll
            ? [
              { label: "Total Users", value: stats.total },
              { label: "Pro Tier", value: stats.pro_tier_count },
              { label: "Email Verified", value: stats.email_verified_count },
              { label: "Data Entry Complete", value: stats.data_entry_complete_count },
              { label: "Dashboard Complete", value: stats.dashboard_complete_count },
              { label: "Job Consumers", value: stats.job_consumer_count },
              { label: "Subscribed", value: stats.subscribed_count },
              { label: "Seeker Role", value: stats.role_seeker_count },
              { label: "Developer Role", value: stats.role_developer_count },
              { label: "Admin Role", value: stats.role_admin_count },
            ]
            : [
              { label: "Total Users", value: stats.total },
              { label: "Pro Tier", value: stats.pro_tier_count },
              { label: "Email Verified", value: stats.email_verified_count },
              { label: "Data Entry Complete", value: stats.data_entry_complete_count },
              { label: "Dashboard Complete", value: stats.dashboard_complete_count },
            ]
          ).map((item, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-white/80 to-gray-100/40 backdrop-blur-xl shadow-[0_4px_10px_rgba(0,0,0,0.03)] border border-gray-200 hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:scale-[1.03] transition-all duration-300 ease-in-out rounded-2xl p-5 flex flex-col gap-3"
            >
              {/* Accent Bar */}
              <div className="absolute top-0 left-2 w-[93%] h-1 rounded-t-full bg-gradient-to-r from-[#2c6472] to-[#3b8d99]" />

              {/* Label */}
              <p className="text-sm font-medium text-gray-600 tracking-wide">{item.label}</p>

              {/* Value */}
              <h2 className="font-extrabold text-3xl text-[#2c6472] ">
                {item.value}
              </h2>
            </div>
          ))}
        </div>


        <div className="mt-4 flex justify-center">
          <div
            onClick={() => setShowAll(!showAll)}
            className="flex justify-center items-center w-10 h-10 rounded-full cursor-pointer hover:bg-gray-300"
          >
            <img
              className={`w-4 h-2.5 transition-transform ${showAll ? "rotate-180" : ""}`}
              src={drop_down}
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-8 pb-5">
        <div className="relative w-full max-w-[500px]">
          <img
            src={search_icon}
            className="absolute top-1/2 -translate-y-1/2 right-3 w-5 cursor-pointer"
            alt=""
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full outline-none border border-[#0000001F] p-3 pl-5 rounded-xl bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 px-8 pb-8">
        <h2 className="font-semibold text-lg">Users</h2>

        {users.map((user, index) => (
          <div
            key={index}
            className="relative flex justify-between items-center border border-[#0000001F] rounded-xl px-8 py-3 bg-white"
            onMouseEnter={(e) => {
              setHoveredUser(user);
              setMousePos({ x: e.clientX, y: e.clientY });
            }}
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setHoveredUser(null)}
          >
            <div>
              <p className="font-medium text-gray-700">{user.email}</p>
              <h1 className=" font-semibold text-[#00000069]">
                {user.first_name} {user.second_name}{" "}
                <span
                  className={`font-semibold text-sm ${user.role === "developer"
                      ? "text-red-500"
                      : user.role === "seeker"
                        ? "text-green-500"
                        : user.role === "admin"
                          ? "text-blue-500"
                          : "text-gray-500"
                    }`}
                >
                  ({user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "Unknown"})
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-5">
              <div className="flex items-center space-x-8">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm capitalize ${user.tier === "free" ? "bg-red-500" : "bg-green-500 w-14 ps-4.5"
                    }`}
                >
                  {user.tier}
                </span>
                <span className="w-18 text-sm">{user.is_active ? "Active" : "Inactive"}</span>
              </div>
              <div
                className="flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
                onClick={() => handleEditClick(user.auth_user_id, user.email)}
              >
                <img src={edit} className="w-4" alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {hoveredUser && (
        <div
          ref={hoverCardRef}
          style={{
            position: "fixed",
            ...getHoverCardPosition(),
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "0.5rem",
            padding: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            minWidth: "350px",
          }}
        >
          <div className="flex gap-3">
            <p className="font-semibold text-gray-700">Email:</p> {hoveredUser.email}
          </div>
          <div className="flex gap-3">
            <p className="font-semibold text-gray-700">Role:</p> {hoveredUser.role}
          </div>
          <div className="flex gap-3">
            <p className="font-semibold text-gray-700">Subscribed:</p>{" "}
            {hoveredUser.subscribed ? "Yes" : "No"}
          </div>
          <div className="flex gap-3">
            <p className="font-semibold text-gray-700">Email Verified:</p>{" "}
            {hoveredUser.email_verified ? "Yes" : "No"}
          </div>
          <div className="flex gap-3">
            <p className="font-semibold text-gray-700">Data Entry Complete:</p>{" "}
            {hoveredUser.data_entry_complete ? "Yes" : "No"}
          </div>
          <div className="flex gap-3">
            <p className="font-semibold text-gray-700">Dashboard Complete:</p>{" "}
            {hoveredUser.dashboard_complete ? "Yes" : "No"}
          </div>
          <div className="flex gap-3">
            <p className="font-semibold text-gray-700">Job Consumer:</p>{" "}
            {hoveredUser.job_consumer ? "Yes" : "No"}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
