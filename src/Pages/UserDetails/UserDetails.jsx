import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import search_icon from "../../assets/search.png";
import avatar from "../../assets/avatar.png";
import edit from "../../assets/edit.png";
import drop_down from "../../assets/drop-arrow.png";
import { ADMIN_URL } from "../../utils/api";
import TopJobTitlesCard from "../../Components/AnalyticsCards/TopJobTitlesCard";
import UserProgressCard from "../../Components/AnalyticsCards/UserProgressCard";

const UserDetails = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [hoveredUser, setHoveredUser] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);


  const hoverCardRef = useRef(null);

  // Get User data
  const fetchUsers = async () => {
    try {
      setIsLoading(true); // 🔥 show loader
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
    } finally {
      setIsLoading(false); // ✅ hide loader
    }
  };

  // 🧠 Add this function below your fetchUsers():
  const fetchFilteredUsers = async (query) => {
    try {
      setIsLoading(true);
      const token = sessionStorage.getItem("token");
      const url = `${ADMIN_URL}/edit/user-data${query.startsWith("?") ? query : `?${query}`}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        console.error("Response error:", await res.text());
        toast.error(`Failed to fetch users (${res.status})`);
        return;
      }

      const data = await res.json();
      setUsers(data.users || []);
      setStats(data.meta || {});
    } catch (err) {
      console.error("Fetch failed:", err);
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
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
          className={`grid ${showAll ? "grid-cols-4" : "grid-cols-5"} gap-6 transition-all duration-300`}
        >
          {(showAll
            ? [
              {
                label: "Total Users",
                main: stats.total,
                onClick: () => fetchFilteredUsers("?sort_by=is_active&sort_order=desc"),
              },
            {
                label: "Pro vs Free Tier",
                main: stats.pro_tier_count,
                secondary: stats.free_tier_count,
                mainLabel: "Pro",
                secondaryLabel: "Free",
                onMainClick: () => fetchFilteredUsers("?sort_by=subscribed&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=unsubscribed&sort_order=desc"),
              },
              {
                label: "Email Status",
                main: stats.email_verified_count,
                secondary: stats.email_unverified_count,
                mainLabel: "Verified",
                secondaryLabel: "Unverified",
                onMainClick: () => fetchFilteredUsers("?sort_by=email_verified&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=email_unverified&sort_order=asc"),
              },
              {
                label: "Data Entry",
                main: stats.data_entry_complete_count,
                secondary: stats.data_entry_incomplete_count,
                mainLabel: "Complete",
                secondaryLabel: "Incomplete",
                onMainClick: () => fetchFilteredUsers("?sort_by=data_entry_complete&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=data_entry_incomplete&sort_order=desc"),
              },
              {
                label: "Dashboard",
                main: stats.dashboard_complete_count,
                secondary: stats.dashboard_incomplete_count,
                mainLabel: "Complete",
                secondaryLabel: "Incomplete",
                onMainClick: () => fetchFilteredUsers("?sort_by=dashboard_complete&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=dashboard_incomplete&sort_order=asc"),
              },
              {
                label: "Job Consumers",
                main: stats.job_consumer_count,
                secondary: stats.non_job_consumer_count,
                mainLabel: "Consumers",
                secondaryLabel: "Non-Consumers",
                onMainClick: () => fetchFilteredUsers("?sort_by=job_consumer&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=non_job_consumer&sort_order=desc"),
              },
              {
                label: "Roles",
                seekers: stats.role_seeker_count,
                developers: stats.role_developer_count,
                admins: stats.role_admin_count,
                onSeekerClick: () => fetchFilteredUsers("?role=seeker&sort_by=subscribed&sort_order=desc"),
                onDeveloperClick: () => fetchFilteredUsers("?role=developer&sort_by=data_entry_complete&sort_order=asc"),
                onAdminClick: () => fetchFilteredUsers("?role=admin&sort_by=job_consumer&sort_order=desc"),
              },
            ]
            : [
              {
                label: "Total Users",
                main: stats.total,
                onClick: () => fetchFilteredUsers("?sort_by=is_active&sort_order=desc"),
              },
              {
                label: "Pro vs Free Tier",
                main: stats.pro_tier_count,
                secondary: stats.free_tier_count,
                mainLabel: "Pro",
                secondaryLabel: "Free",
                onMainClick: () => fetchFilteredUsers("?sort_by=subscribed&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=unsubscribed&sort_order=desc"),
              },
              {
                label: "Email Status",
                main: stats.email_verified_count,
                secondary: stats.email_unverified_count,
                mainLabel: "Verified",
                secondaryLabel: "Unverified",
                onMainClick: () => fetchFilteredUsers("?sort_by=email_verified&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=email_unverified&sort_order=asc"),
              },
              {
                label: "Data Entry",
                main: stats.data_entry_complete_count,
                secondary: stats.data_entry_incomplete_count,
                mainLabel: "Complete",
                secondaryLabel: "Incomplete",
                onMainClick: () => fetchFilteredUsers("?sort_by=data_entry_complete&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=data_entry_incomplete&sort_order=desc"),
              },
              {
                label: "Dashboard",
                main: stats.dashboard_complete_count,
                secondary: stats.dashboard_incomplete_count,
                mainLabel: "Complete",
                secondaryLabel: "Incomplete",
                onMainClick: () => fetchFilteredUsers("?sort_by=dashboard_complete&sort_order=desc"),
                onSecondaryClick: () => fetchFilteredUsers("?sort_by=dashboard_incomplete&sort_order=asc"),
              },
            ]
          ).map((item, index) => (
            <div
              key={index}
              onClick={item.onClick}
              className="relative cursor-pointer bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-300 ease-in-out p-5 flex flex-col gap-4"
            >
              <div className="absolute top-0 left-2 w-[93%] h-[3px] rounded-t-full bg-gradient-to-r from-[#2c6472] to-[#3b8d99]" />

              <p className="text-sm font-semibold text-gray-600 tracking-wide text-center">
                {item.label}
              </p>

              {/* Normal stats */}
              {!item.seekers ? (
                <div className="flex  items-center justify-center gap-2 ">
                  {/* 🔹 Main clickable area */}
                  <div
                    onClick={item.onMainClick}
                    className="w-full flex  items-center justify-center rounded-lg gap-3  transition-all duration-200 cursor-pointer hover:bg-[#2c6472]/10 active:scale-95"
                  >
                    <span className="text-[#2c6472] font-extrabold text-2xl leading-none">
                      {item.main ?? "—"}
                    </span>
                    {item.mainLabel && (
                      <span className="text-xs text-gray-500 py-2 font-semibold uppercase tracking-wide mt-1">
                        {item.mainLabel}
                      </span>
                    )}
                  </div>

                  {/* 🔻 Secondary clickable area */}
                  {item.secondary !== undefined && (
                    <div
                      onClick={item.onSecondaryClick}
                      className="w-full flex gap-3 items-center justify-center rounded-lg py-2 transition-all duration-200 cursor-pointer hover:bg-red-50 active:scale-95"
                    >
                      <span className="text-red-500 font-bold text-2xl leading-none">
                        {item.secondary ?? 0}
                      </span>
                      {item.secondaryLabel && (
                        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide mt-1">
                          {item.secondaryLabel}
                        </span>
                      )}
                    </div>
                  )}
                </div>

              ) : (
                // 🎨 Roles special display
                <div className="flex flex-col items-center justify-center gap-2">
                  <div
                    onClick={item.onSeekerClick}
                    className="flex items-center gap-3 cursor-pointer hover:text-green-600 transition"
                  >
                    <span className="text-green-600 font-bold text-xl">
                      {item.seekers}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Seekers
                    </span>
                  </div>
                  <div className="flex gap-5">
                    <div
                      onClick={item.onDeveloperClick}
                      className="flex items-center gap-3 cursor-pointer hover:text-red-500 transition"
                    >
                      <span className="text-red-500 font-bold text-xl">
                        {item.developers}
                      </span>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Devs
                      </span>
                    </div>
                    <div
                      onClick={item.onAdminClick}
                      className="flex items-center gap-3 cursor-pointer hover:text-blue-600 transition"
                    >
                      <span className="text-blue-600 font-bold text-xl">
                        {item.admins}
                      </span>
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Admins
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          ))}
          {/* 🧩 Conditionally show analytics cards only when expanded */}
          {showAll && (
            <>
              <div className="col-span-2">
                <TopJobTitlesCard />
              </div>
              <div className="col-span-2">
                <UserProgressCard />
              </div>
            </>
          )}
        </div>







        <div className="mt-4 flex justify-center">
          <div
            onClick={() => setShowAll(!showAll)}
            className="flex justify-center items-center w-10 h-10 text-[#2c6472] rounded-full cursor-pointer hover:bg-gray-300"
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

        {isLoading ? (
          // 💫 Loading shimmer effect
          <div className="flex flex-col gap-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center border border-gray-200 rounded-xl px-8 py-4 bg-gray-50"
              >
                <div className="flex flex-col gap-2 w-1/2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length > 0 ? (
          users.map((user, index) => (
            <div
              key={index}
              className="relative flex justify-between items-center border border-[#0000001F] rounded-xl px-8 py-3 bg-white transition-all duration-200 hover:shadow-sm hover:scale-[1.01]"
              onMouseEnter={(e) => {
                setHoveredUser(user);
                setMousePos({ x: e.clientX, y: e.clientY });
              }}
              onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <div>
                <p className="font-medium text-gray-700">{user.email}</p>
                <h1 className="font-semibold text-[#00000069]">
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
                    className={`px-3 py-1 rounded-full text-white text-sm capitalize ${user.tier === "free"
                      ? "bg-red-500"
                      : "bg-green-500 w-14 ps-4.5"
                      }`}
                  >
                    {user.tier}
                  </span>
                  <span className="w-18 text-sm">
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div
                  className="flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
                  onClick={() => handleEditClick(user.auth_user_id, user.email)}
                >
                  <img src={edit} className="w-4" alt="" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 italic mt-5">No users found.</div>
        )}

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
