import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Navbar from '../../Components/Navbar/Navbar'
import avatar from '../../assets/avatar.png'
import { useNavigate } from 'react-router-dom';
import edit from '../../assets/edit.png'
import tick from '../../assets/tick.svg'
import { ADMIN_URL } from "../../utils/api"

const UserProfile = () => {

  const navigate = useNavigate();

  const [editUserInfo, setEditUserInfo] = useState(false);
  const [editPersonalInfo, setEditPersonalInfo] = useState(false);
  const [editAcademics, setEditAcademics] = useState(false);
  const [editWorkExperience, setEditWorkExperience] = useState(false);
  const [editProjects, setEditProjects] = useState(false);
  const [editLanguages, setEditLanguages] = useState(false);
  const [editCertificates, setEditCertificates] = useState(false);
  const [editNotifications, setEditNotifications] = useState(false);
  const [editPreferences, setEditPreferences] = useState(false);
  const [editSubscription, setEditSubscription] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);



  const [user, setUser] = useState(null);

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userStatus, setUserStatus] = useState({
    is_active: false,
    email_verified: false,
    two_factor_enabled: false,
  });
  const [personalInfo, setPersonalInfo] = useState({
    first_name: "",
    second_name: "",
    city: "",
    state: "",
    country: "",
    linkedin_profile: "",
    website: "",
    github: "",
    blog: "",
    social_media: "",
  });

  const [academics, setAcademics] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState({
    announcements: false,
    german_test: false,
    recommended_jobs: false,
    subscription: false,
  });
  const [preferences, setPreferences] = useState({
    cookie_policy: false,
    language: '',
    timezone: '',
  });
  const [editKeySkills, setEditKeySkills] = useState(false);
  const [keySkills, setKeySkills] = useState(user?.seekers?.[0]?.key_skills || []);
  const [primaryTitle, setPrimaryTitle] = useState('');
  const [secondaryTitle, setSecondaryTitle] = useState('');
  const [tertiaryTitle, setTertiaryTitle] = useState('');
  const [proficiencyTest, setProficiencyTest] = useState(0);
  const [topJobsCount, setTopJobsCount] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const [weeklyApplications, setWeeklyApplications] = useState(0);
  // 🔹 Subscription details
  const [subscriptionTier, setSubscriptionTier] = useState("");
  const [subscriptionPeriod, setSubscriptionPeriod] = useState("");
  const [subscriptionStart, setSubscriptionStart] = useState("");
  const [subscriptionEnd, setSubscriptionEnd] = useState("");

  // 🔹 Document format preferences
  const [cvFormat, setCvFormat] = useState("");
  const [clFormat, setClFormat] = useState("");

  // 🔹 Job tracking & usage stats
  const [jobResearchCount, setJobResearchCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [dailyCoverletterLimit, setDailyCoverletterLimit] = useState(0);

  // 🔹 Profile picture
  const [profilePic, setProfilePic] = useState("");

  // 🔹 Selected job applications
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
  const [selectedJobApplicationsCount, setSelectedJobApplicationsCount] = useState(0);

  // 🔹 Weekly applications count (new numeric field)
  const [weeklyApplicationsCount, setWeeklyApplicationsCount] = useState(0);


  // Convert array to comma-separated string for editing
  const [skillsInput, setSkillsInput] = useState(keySkills.join(", "));



  useEffect(() => {
    const storedUser = sessionStorage.getItem("selectedUser");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log(parsedUser);

      // 🔹 Basic auth info
      setUser(parsedUser);
      setPhone(parsedUser?.auth_user?.phone || "");
      setEmail(parsedUser?.auth_user?.email || "");

      setUserStatus({
        is_active: parsedUser?.auth_user?.is_active || false,
        email_verified: parsedUser?.auth_user?.email_verified || false,
        two_factor_enabled: parsedUser?.auth_user?.two_factor_enabled || false,
      });

      // 🔹 Personal info
      const personal = parsedUser?.seekers?.[0]?.personal_info;
      if (personal) {
        const externalLinks = personal.external_links || [];

        const getLink = (type) =>
          externalLinks.find((link) => link.type === type)?.url || "";

        setPersonalInfo({
          first_name: personal?.first_name || "",
          second_name: personal?.second_name || "",
          city: personal?.city || "",
          state: personal?.state || "",
          country: personal?.country || "",
          linkedin_profile: personal?.linkedin_profile || "",
          website: getLink("website"),
          github: getLink("github"),
          blog: getLink("blog"),
          social_media: getLink("social media"),
        });
      }

      // 🔹 Education, Work, Projects, Languages, Certificates
      setAcademics(parsedUser?.seekers?.[0]?.academics || []);
      setWorkExperiences(parsedUser?.seekers?.[0]?.work_experiences || []);
      setProjects(parsedUser?.seekers?.[0]?.past_projects || []);
      setLanguages(parsedUser?.seekers?.[0]?.languages || []);
      setCertificates(parsedUser?.seekers?.[0]?.certificates || []);

      // 🔹 Notifications
      const notificationData = parsedUser?.notifications?.[0];
      if (notificationData) {
        setNotifications({
          announcements: notificationData.announcements || false,
          german_test: notificationData.german_test || false,
          recommended_jobs: notificationData.recommended_jobs || false,
          subscription: notificationData.subscription || false,
        });
      }

      // 🔹 Preferences
      const prefData = parsedUser?.preferences?.[0];
      if (prefData) {
        setPreferences({
          cookie_policy: prefData.cookie_policy || false,
          language: prefData.language || "",
          timezone: prefData.timezone || "",
        });
      }

      // 🔹 Seeker details
      const seeker = parsedUser?.seekers?.[0] || {};

      setKeySkills(seeker.key_skills || []);
      setPrimaryTitle(seeker.primary_title || "");
      setSecondaryTitle(seeker.secondary_title || "");
      setTertiaryTitle(seeker.tertiary_title || "");
      setProficiencyTest(seeker.proficiency_test || 0);
      setTopJobsCount(seeker.top_jobs_count || 0);
      setTotalApplications(seeker.total_applications || 0);
      setWeeklyApplications(seeker.weekly_applications || 0);
      setWeeklyApplicationsCount(seeker.weekly_applications_count || 0); // 🆕 new field

      // 🔹 Subscription details (optional but useful)
      setSubscriptionTier(seeker.subscription_tier || "");
      setSubscriptionPeriod(seeker.subscription_period || "");
      setSubscriptionStart(seeker.subscription_interval_start || "");
      setSubscriptionEnd(seeker.subscription_interval_end || "");
      setCvFormat(seeker.cv_format || "");
      setClFormat(seeker.cl_format || "");
      setJobResearchCount(seeker.job_research_count || 0);
      setApplicationCount(seeker.application_count || 0);
      setDailyCoverletterLimit(seeker.daily_generatable_coverletter || 0);

      // 🔹 Profile pic
      setProfilePic(parsedUser?.profile_pic || "");

      // 🔹 Selected job applications (newly added)
      setSelectedJobApplications(parsedUser?.selected_job_applications || []);
      setSelectedJobApplicationsCount(
        parsedUser?.selected_job_applications?.length || 0
      );


    } else {
      navigate('/users');
    }

  }, [navigate])

  const toggleStatus = (key) => {
    setUserStatus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUserInfoUpdate = () => {
    const selectedRole = user?.auth_user?.role;

    // 🧩 Build fields to patch
    const updatedFields = {
      phone,
      email,
      is_active: userStatus.is_active,
      email_verified: userStatus.email_verified,
      two_factor_enabled: userStatus.two_factor_enabled,
      role: selectedRole,
      profile_pic: profilePic || "",
    };

    // 🔹 Send patch request to "auth_users" collection
    patchUserData("auth_users", updatedFields)
      .then(() => {
        setUser((prev) => {
          const updatedUser = {
            ...prev,
            auth_user: {
              ...prev.auth_user,
              phone,
              email,
              is_active: userStatus.is_active,
              email_verified: userStatus.email_verified,
              two_factor_enabled: userStatus.two_factor_enabled,
              role: selectedRole,
            },
            profile_pic: profilePic || prev.profile_pic,
          };

          // ✅ Store updated user in sessionStorage so it persists on refresh
          sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));

          return updatedUser;
        });

        console.log("✅ User info updated successfully & persisted!");
      })
      .catch((error) => {
        console.error("❌ Error updating user info:", error);
      });
  };





  const handlePersonalInfoUpdate = () => {
    const updatedFields = {
      personal_info: {
        first_name: personalInfo.first_name,
        second_name: personalInfo.second_name,
        city: personalInfo.city,
        state: personalInfo.state,
        country: personalInfo.country,
        linkedin_profile: personalInfo.linkedin_profile,
        external_links: [
          { type: "portfolio", url: personalInfo.portfolio },
          { type: "resume", url: personalInfo.resume },
          { type: "blog", url: personalInfo.blog },
        ]
      }
    };

    patchUserData("seekers", updatedFields).then(() => {
      setUser(prev => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              personal_info: updatedFields.personal_info
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));

        return updatedUser;
      });
    });
  };




  const handleWorkExpChange = (index, key, value) => {
    setWorkExperiences(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };

  const handleProjectChange = (index, key, value) => {
    setProjects(prev =>
      prev.map((project, i) =>
        i === index ? { ...project, [key]: value } : project
      )
    );
  };

  const handleLanguageChange = (idx, field, value) => {
    const updated = [...languages];
    updated[idx][field] = value;
    setLanguages(updated);
  };

  const handleCertificateChange = (idx, field, value) => {
    const updated = [...certificates];
    updated[idx][field] = value;
    setCertificates(updated);
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrefChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const patchUserData = async (collection, fields) => {
    try {
      const token = sessionStorage.getItem('token');

      let auth_user_id =
        user?.auth_user_id || user?.auth_user?.auth_user_id;

      if (!auth_user_id) {
        const storedUser = sessionStorage.getItem("selectedUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          auth_user_id = parsedUser?.auth_user?.id;
        }
      }

      if (!auth_user_id) {
        toast.error("User ID not found 😥 Try again.");
        return;
      }

      const payload = {
        auth_user_id,
        collection,
        fields,
      };

      const res = await fetch(`${ADMIN_URL}/edit/user-data`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("User data updated successfully ");
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (err) {
      console.error("PATCH error:", err);
      toast.error("Something went wrong ");
    }
  };



  const handleAcademicUpdate = (index) => {
    const updatedFields = {
      academics: [academics[index]]
    };

    patchUserData("seekers", { academics: updatedFields.academics }).then(() => {
      // Update session storage
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              academics: prev.seekers[0].academics.map((item, i) =>
                i === index ? updatedFields.academics[0] : item
              )
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };

  const handleWorkExperienceUpdate = (index) => {
    const updatedFields = {
      work_experiences: [workExperiences[index]]
    };

    patchUserData("seekers", { work_experiences: updatedFields.work_experiences }).then(() => {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              work_experiences: prev.seekers[0].work_experiences.map((item, i) =>
                i === index ? updatedFields.work_experiences[0] : item
              )
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };

  const handleProjectUpdate = (index) => {
    const updatedFields = {
      past_projects: [projects[index]]
    };

    patchUserData("seekers", { past_projects: updatedFields.past_projects }).then(() => {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              past_projects: prev.seekers[0].past_projects.map((item, i) =>
                i === index ? updatedFields.past_projects[0] : item
              )
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };


  const handleAllLanguagesUpdate = () => {
    patchUserData("seekers", { languages }).then(() => {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              languages
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };


  const handleAllCertificatesUpdate = () => {
    patchUserData("seekers", { certificates }).then(() => {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              certificates
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };


  const handleNotificationUpdate = () => {
    patchUserData("notifications", notifications).then(() => {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          notifications: [
            {
              ...notifications
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };


  const handlePreferencesUpdate = () => {
    patchUserData("preferences", preferences).then(() => {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          preferences: [
            {
              ...preferences
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };

  const handleSubscriptionUpdate = () => {
    const updatedFields = {
      cl_format: user.seekers[0].cl_format || "",
      cv_format: user.seekers[0].cv_format || "",
      subscription_tier: user.seekers[0].subscription_tier || "",
      subscription_period: user.seekers[0].subscription_period || "",
      subscription_interval_start: user.seekers[0].subscription_interval_start || "",
      subscription_interval_end: user.seekers[0].subscription_interval_end || ""
    };

    patchUserData("seekers", updatedFields).then(() => {
      setUser((prev) => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              ...updatedFields,
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

    });
  };



  const handleKeySkillsUpdate = () => {
    // Convert the string to an array before saving
    const cleanedSkills = skillsInput.split(",").map(s => s.trim()).filter(Boolean);

    const updatedFields = {
      key_skills: cleanedSkills,
      primary_title: primaryTitle,
      secondary_title: secondaryTitle,
      tertiary_title: tertiaryTitle,
      proficiency_test: proficiencyTest === "" ? null : Number(proficiencyTest),
      top_jobs_count: topJobsCount === "" ? null : Number(topJobsCount),
      total_applications: totalApplications === "" ? null : Number(totalApplications),
      weekly_applications: weeklyApplications === "" ? null : Number(weeklyApplications),
    };

    patchUserData("seekers", updatedFields).then(() => {
      setUser(prev => {
        const updatedUser = {
          ...prev,
          seekers: [
            {
              ...prev.seekers[0],
              ...updatedFields,
            }
          ]
        };

        sessionStorage.setItem("selectedUser", JSON.stringify(updatedUser));
        return updatedUser;
      });

      // Update local state so UI refreshes
      setKeySkills(cleanedSkills);

      // Close edit mode after saving
      setEditKeySkills(false);
    });
  };

  // Inside your component, update your edit toggle handler like this:
  const toggleEditKeySkills = () => {
    if (editKeySkills) {
      handleKeySkillsUpdate(); // Save changes before turning off edit
    } else {
      // When turning ON edit mode, fill input with current skills
      setSkillsInput(keySkills.join(", "));
    }
    setEditKeySkills(prev => !prev);
  };



  return (
    <div>

      <div className="flex flex-col gap-3 py-5 px-8">

        <div className='w-full flex gap-3'>

          {/* User Info */}
          <div className="relative w-1/2 flex flex-col items-center gap-5 border border-[#0000001F] rounded-xl px-8 py-5 bg-white shadow-sm transition-all duration-300 hover:shadow-md">

            {/* Edit / Save Button */}
            <div
              onClick={() => {
                if (editUserInfo) handleUserInfoUpdate();
                setEditUserInfo((prev) => !prev);
              }}
              className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer transition-all"
            >
              <img src={editUserInfo ? tick : edit} className="w-3" alt="Edit" />
            </div>

            <h2 className="text-xl font-semibold">User Info</h2>

            <div className="flex flex-col items-center gap-3 text-center">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={profilePic || avatar}
                  className="rounded-full w-24 h-24 border-4 border-gray-100 shadow object-cover"
                  alt="Profile"
                />
                {editUserInfo && (
                  <label className="absolute bottom-0 right-0 bg-[#2c6472] text-white rounded-full p-1 cursor-pointer hover:bg-[#22535e] transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setProfilePic(imageUrl);
                        }
                      }}
                    />
                    <span className="text-xs">✎</span>
                  </label>
                )}
              </div>

              {/* 🧩 Modern Role Dropdown */}
              {editUserInfo ? (
                <div className="relative my-5 w-48">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className={`w-full flex items-center justify-between px-5 py-2 rounded-full border-2 font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${user?.auth_user?.role === "seeker"
                        ? "bg-[#2c6472]/10 text-[#2c6472] border-[#2c6472]"
                        : user?.auth_user?.role === "developer"
                          ? "bg-red-100 text-red-700 border-red-300"
                          : user?.auth_user?.role === "admin"
                            ? "bg-blue-100 text-blue-700 border-blue-300"
                            : "bg-gray-100 text-gray-600 border-gray-300"
                      }`}
                  >
                    <span className="capitalize">{user?.auth_user?.role || "Select Role"}</span>
                    <svg
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ${roleDropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
                      {[
                        { value: "seeker", label: " Seeker", color: "text-[#2c6472]" },
                        { value: "developer", label: " Developer", color: "text-red-600" },
                        { value: "admin", label: " Admin", color: "text-blue-600" },
                      ].map((role) => (
                        <div
                          key={role.value}
                          onClick={() => {
                            const updated = { ...user };
                            updated.auth_user.role = role.value;
                            setUser(updated);
                            setRoleDropdownOpen(false);
                          }}
                          className={`px-5 py-2 cursor-pointer text-sm font-medium hover:bg-gray-100 transition-all ${role.color} ${user?.auth_user?.role === role.value ? "bg-gray-50" : ""
                            }`}
                        >
                          {role.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span
                  className={`px-5 py-1 my-5 font-medium border rounded-full ${user?.auth_user?.role === "seeker"
                      ? "bg-[#2c6472]/10 text-[#2c6472] border-[#2c6472]"
                      : user?.auth_user?.role === "developer"
                        ? "bg-red-100 text-red-700 border-red-300"
                        : user?.auth_user?.role === "admin"
                          ? "bg-blue-100 text-blue-700 border-blue-300"
                          : "bg-gray-100 text-gray-600 border-gray-300"
                    }`}
                >
                  {user?.auth_user?.role
                    ? user.auth_user.role.charAt(0).toUpperCase() + user.auth_user.role.slice(1)
                    : "Unknown"}
                </span>
              )}



              {/* Status Badges */}
              <div className="w-full flex flex-wrap gap-3 justify-center text-center mt-4">
                {/* Active / Inactive */}
                <span
                  onClick={() => editUserInfo && toggleStatus("is_active")}
                  className={`cursor-pointer w-[160px] px-5 py-1 text-[15px] rounded-full transition-all duration-200
        ${userStatus.is_active
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                >
                  {userStatus.is_active ? "Active" : "Inactive"}
                </span>

                {/* Email Verified */}
                <span
                  onClick={() => editUserInfo && toggleStatus("email_verified")}
                  className={`cursor-pointer w-[160px] px-5 py-1 text-[15px] rounded-full transition-all duration-200
        ${userStatus.email_verified
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                    }`}
                >
                  {userStatus.email_verified ? "Email Verified" : "Not Verified"}
                </span>

                {/* 2FA */}
                <span
                  onClick={() => editUserInfo && toggleStatus("two_factor_enabled")}
                  className={`cursor-pointer w-[160px] px-5 py-1 text-[15px] rounded-full transition-all duration-200
        ${userStatus.two_factor_enabled
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                    }`}
                >
                  {userStatus.two_factor_enabled ? "2FA Enabled" : "2FA Disabled"}
                </span>
              </div>
            </div>
          </div>



          {/* Personal Info */}
          <div className="relative w-1/2 flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-5 bg-white">

            {/* Edit / Save Button */}
            <div
              onClick={() => {
                if (editPersonalInfo) {
                  handlePersonalInfoUpdate();
                }
                setEditPersonalInfo((prev) => !prev);
              }}
              className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer transition-all"
            >
              <img src={editPersonalInfo ? tick : edit} className="w-3" alt="Edit" />
            </div>

            <h2 className="text-lg font-semibold mb-4">Personal Info</h2>

            <div className="grid grid-cols-[1fr_3fr] gap-y-2">
              {/* First Name */}
              <p className="font-medium">First Name:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.first_name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, first_name: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.first_name || "N/A"}</p>
              )}

              {/* Last Name */}
              <p className="font-medium">Last Name:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.second_name}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, second_name: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.second_name || "N/A"}</p>
              )}

              {/* City */}
              <p className="font-medium">City:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.city}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, city: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.city || "N/A"}</p>
              )}

              {/* State */}
              <p className="font-medium">State:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.state}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, state: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.state || "N/A"}</p>
              )}

              {/* Country */}
              <p className="font-medium">Country:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.country}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, country: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.country || "N/A"}</p>
              )}

              {/* Website */}
              <p className="font-medium">Website:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.website}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, website: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.website || "N/A"}</p>
              )}

              {/* GitHub */}
              <p className="font-medium">GitHub:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.github}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, github: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.github || "N/A"}</p>
              )}

              {/* Blog */}
              <p className="font-medium">Blog:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.blog}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, blog: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.blog || "N/A"}</p>
              )}

              {/* Social Media */}
              <p className="font-medium">Social Media:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.social_media}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, social_media: e.target.value })
                  }
                />
              ) : (
                <p>{personalInfo.social_media || "N/A"}</p>
              )}

              {/* LinkedIn */}
              <p className="font-medium">LinkedIn:</p>
              {editPersonalInfo ? (
                <input
                  className="border-b border-gray-300 px-3 outline-none"
                  value={personalInfo.linkedin_profile}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      linkedin_profile: e.target.value,
                    })
                  }
                />
              ) : (
                <p>{personalInfo.linkedin_profile || "N/A"}</p>
              )}
            </div>
          </div>

        </div>

        {/* Academics */}
        <div className="relative flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
          {/* Edit button */}
          <div
            onClick={() => {
              if (editAcademics) {
                academics.forEach((_, index) => handleAcademicUpdate(index));
              }
              setEditAcademics(!editAcademics);
            }} className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
          >
            <img src={editAcademics ? tick : edit} className='w-3' alt="Edit" />
          </div>

          <h2 className="text-lg font-semibold mb-4">Academics</h2>

          {academics.length > 0 ? (
            academics.map((edu, idx) => (
              <div key={idx} className="mb-4">
                {editAcademics ? (
                  <>
                    <input
                      className="border-b border-gray-300 px-3 w-full outline-none mb-1"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...academics];
                        updated[idx].institution = e.target.value;
                        setAcademics(updated);
                      }}
                    />
                    <input
                      className="border-b border-gray-300 px-3 w-full outline-none mb-1"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...academics];
                        updated[idx].degree = e.target.value;
                        setAcademics(updated);
                      }}
                    />
                    <input
                      className="border-b border-gray-300 px-3 w-full outline-none mb-1"
                      value={edu.field_of_study}
                      onChange={(e) => {
                        const updated = [...academics];
                        updated[idx].field_of_study = e.target.value;
                        setAcademics(updated);
                      }}
                    />
                    <input
                      className="border-b border-gray-300 px-3 w-full outline-none mb-1"
                      value={edu.city}
                      onChange={(e) => {
                        const updated = [...academics];
                        updated[idx].city = e.target.value;
                        setAcademics(updated);
                      }}
                    />
                    <textarea
                      className="border border-gray-300 px-3 rounded w-full outline-none mt-1 text-sm p-2"
                      rows={4}
                      value={edu.achievements}
                      onChange={(e) => {
                        const updated = [...academics];
                        updated[idx].achievements = e.target.value;
                        setAcademics(updated);
                      }}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{edu.institution || "N/A"}</p>
                    <p>{`${edu.degree || "N/A"} - ${edu.field_of_study || "N/A"}`}</p>
                    <p className="text-gray-500">{edu.city || "N/A"}</p>
                    <p className="text-gray-500">
                      {edu.start_date
                        ? new Date(edu.start_date).getFullYear()
                        : "N/A"}{" "}
                      -{" "}
                      {edu.end_date
                        ? new Date(edu.end_date).getFullYear()
                        : "Ongoing"}
                    </p>
                    {edu.achievements && (
                      <p className="mt-2 text-sm text-gray-700">
                        {edu.achievements}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No academic records found</p>
          )}
        </div>

        {/* Work Experience */}
        <div className="relative flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
          <div
            onClick={() => {
              if (editWorkExperience) {
                workExperiences.forEach((_, index) => handleWorkExperienceUpdate(index));
              }
              setEditWorkExperience(!editWorkExperience);
            }} className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
          >
            <img src={editWorkExperience ? tick : edit} className='w-3' alt="" />
          </div>
          <h2 className="text-lg font-semibold mb-4">Work Experience</h2>
          {workExperiences.length > 0 ? (
            workExperiences.map((exp, idx) => (
              <div key={idx} className="flex flex-col gap-1 mb-4">
                {editWorkExperience ? (
                  <>
                    <input
                      type="text"
                      className="w-full border-b border-gray-300 px-3 mb-1 outline-none"
                      placeholder="Company Name"
                      value={exp.company_name}
                      onChange={(e) => handleWorkExpChange(idx, 'company_name', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full border-b border-gray-300 px-3 mb-1 outline-none"
                      placeholder="Job Title"
                      value={exp.job_title}
                      onChange={(e) => handleWorkExpChange(idx, 'job_title', e.target.value)}
                    />
                    <input
                      type="text"
                      className="w-full border-b border-gray-300 px-3 mb-1 outline-none"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => handleWorkExpChange(idx, 'location', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <input
                        type="date"
                        className="border-b border-gray-300 px-3 w-fit outline-none"
                        value={exp.start_date?.split('T')[0] || ''}
                        onChange={(e) => handleWorkExpChange(idx, 'start_date', e.target.value)}
                      />
                      <input
                        type="date"
                        className="border-b border-gray-300 px-3 w-fit outline-none"
                        value={exp.end_date?.split('T')[0] || ''}
                        onChange={(e) => handleWorkExpChange(idx, 'end_date', e.target.value)}
                      />
                    </div>
                    <textarea
                      className="w-full border border-gray-300 px-3 p-2 rounded mt-2 outline-none"
                      rows={4}
                      placeholder="Key Responsibilities"
                      value={exp.key_responsibilities}
                      onChange={(e) => handleWorkExpChange(idx, 'key_responsibilities', e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{exp.company_name || "N/A"}</p>
                    <p>{exp.job_title || "N/A"}</p>
                    <p className="text-gray-500">{exp.location || "N/A"}</p>
                    <p className="text-gray-500">
                      {exp.start_date
                        ? new Date(exp.start_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                        : "N/A"}{" "}
                      -{" "}
                      {exp.end_date
                        ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })
                        : "Present"}
                    </p>
                    {exp.key_responsibilities && (
                      <textarea
                        readOnly
                        className="mt-2 text-sm text-gray-700 w-full resize-none bg-transparent focus:outline-none"
                        value={exp.key_responsibilities}
                      />
                    )}
                  </>
                )}

                {idx < workExperiences.length - 1 && <hr className="my-3 border-gray-200" />}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No work experience found</p>
          )}
        </div>

        {/* Projects */}
        <div className="relative flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
          <div
            className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
            onClick={() => {
              if (editProjects) {
                projects.forEach((_, index) => handleProjectUpdate(index));
              }
              setEditProjects(prev => !prev);
            }}          >
            <img src={editProjects ? tick : edit} className='w-3' alt="Edit" />
          </div>

          <h2 className="text-lg font-semibold mb-4">Projects</h2>

          {projects.length > 0 ? (
            projects.map((project, idx) => (
              <div key={idx} className="flex flex-col gap-1 mb-4">
                {editProjects ? (
                  <>
                    <input
                      type="text"
                      value={project.project_name || ""}
                      onChange={(e) => handleProjectChange(idx, 'project_name', e.target.value)}
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      placeholder="Project Name"
                    />
                    <input
                      type="text"
                      value={project.institution || ""}
                      onChange={(e) => handleProjectChange(idx, 'institution', e.target.value)}
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      placeholder="Institution"
                    />
                    <div className="flex gap-4 mb-1">
                      <input
                        type="month"
                        value={project.start_date ? project.start_date.slice(0, 7) : ""}
                        onChange={(e) => handleProjectChange(idx, 'start_date', e.target.value)}
                        className="w-fit mb-1 border-b border-gray-300 px-3 outline-none"
                        placeholder="Start Date"
                      />
                      <input
                        type="month"
                        value={project.end_date ? project.end_date.slice(0, 7) : ""}
                        onChange={(e) => handleProjectChange(idx, 'end_date', e.target.value)}
                        className="w-fit mb-1 border-b border-gray-300 px-3 outline-none"
                        placeholder="End Date"
                      />
                    </div>
                    <textarea
                      value={project.project_description || ""}
                      onChange={(e) => handleProjectChange(idx, 'project_description', e.target.value)}
                      className="w-full mb-1 border border-gray-300 px-3 rounded p-2 outline-none"
                      placeholder="Project Description"
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{project.project_name || "N/A"}</p>
                    <p className="text-gray-500">{project.institution || "N/A"}</p>
                    <p className="text-gray-500">
                      {project.start_date
                        ? new Date(project.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                        : "N/A"}{" "}
                      -{" "}
                      {project.end_date
                        ? new Date(project.end_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                        : "Ongoing"}
                    </p>
                    {project.project_description && (
                      <p className="mt-2 text-sm text-gray-700">
                        {project.project_description}
                      </p>
                    )}
                  </>
                )}
                {idx < projects.length - 1 && <hr className="my-3 border-gray-200" />}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects found</p>
          )}
        </div>

        {/* Languages */}
        <div className="relative flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
          <div
            className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
            onClick={() => {
              if (editLanguages) {
                handleAllLanguagesUpdate(); // Update languages only when exiting edit mode
              }
              setEditLanguages(prev => !prev);
            }}          >
            <img src={editLanguages ? tick : edit} className='w-3' alt="Edit" />
          </div>

          <h2 className="text-lg font-semibold mb-4">Languages</h2>

          {languages.length > 0 ? (
            languages.map((lang, idx) => (
              <div key={idx} className="flex flex-col gap-2 mb-3">
                {editLanguages ? (
                  <>
                    <input
                      type="text"
                      value={lang.language || ""}
                      onChange={(e) => handleLanguageChange(idx, 'language', e.target.value)}
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      placeholder="Language"
                    />
                    <input
                      type="text"
                      value={lang.proficiency || ""}
                      onChange={(e) => handleLanguageChange(idx, 'proficiency', e.target.value)}
                      className="w-full mb-1 border-b border-gray-300 px-3 text-sm outline-none"
                      placeholder="Proficiency (e.g., Fluent)"
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{lang.language || "N/A"}</p>
                    <p className="text-gray-500 capitalize">{lang.proficiency || "N/A"}</p>
                  </>
                )}
                {idx < languages.length - 1 && <hr className="my-2 border-gray-200" />}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No languages added</p>
          )}
        </div>

        {/* Certificates */}
        <div className="relative flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
          <div
            className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
            onClick={() => {
              if (editCertificates) {
                handleAllCertificatesUpdate(); // 🚀 Updates on exiting edit mode
              }
              setEditCertificates(prev => !prev); // 👇 Toggles edit mode
            }}          >
            <img src={editCertificates ? tick : edit} className='w-3' alt="Toggle Edit" />
          </div>

          <h2 className="text-lg font-semibold mb-4">Certificates</h2>

          {certificates.length > 0 ? (
            certificates.map((cert, idx) => (
              <div key={idx} className="flex flex-col gap-1 mb-3">
                {editCertificates ? (
                  <>
                    <input
                      type="text"
                      value={cert.certificate_name || ""}
                      onChange={(e) => handleCertificateChange(idx, 'certificate_name', e.target.value)}
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      placeholder="Certificate Name"
                    />
                    <input
                      type="text"
                      value={cert.provider || ""}
                      onChange={(e) => handleCertificateChange(idx, 'provider', e.target.value)}
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      placeholder="Provider"
                    />
                    <input
                      type="text"
                      value={cert.certificate_type || ""}
                      onChange={(e) => handleCertificateChange(idx, 'certificate_type', e.target.value)}
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      placeholder="Type (e.g., certification)"
                    />
                    <input
                      type="date"
                      value={cert.completion_date ? new Date(cert.completion_date).toISOString().split("T")[0] : ""}
                      onChange={(e) => handleCertificateChange(idx, 'completion_date', e.target.value)}
                      className="w-fit mb-1 border-b border-gray-300 px-3 outline-none"
                    />
                  </>
                ) : (
                  <>
                    <p className="font-medium">{cert.certificate_name || "N/A"}</p>
                    <p className="text-gray-500">{cert.provider || "N/A"}</p>
                    <p className="text-gray-500">
                      {cert.certificate_type ? cert.certificate_type.charAt(0).toUpperCase() + cert.certificate_type.slice(1) : "Certificate"} •{" "}
                      {cert.completion_date ? new Date(cert.completion_date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "N/A"}
                    </p>
                  </>
                )}
                {idx < certificates.length - 1 && <hr className="my-2 border-gray-200" />}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No certificates added</p>
          )}
        </div>

        <div className='w-full flex gap-3'>

          {/* Notifications */}
          <div className="relative w-1/2 flex flex-col justify-between gap-3 border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
            <div
              className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
              onClick={() => {
                if (editNotifications) {
                  handleNotificationUpdate(); // 🔥 Save on toggle off
                }
                setEditNotifications(prev => !prev); // 📝 Toggle edit mode
              }}
            >
              <img src={editNotifications ? tick : edit} className='w-3' alt="Toggle Edit" />
            </div>

            <h2 className="text-lg font-semibold mb-4">Notifications</h2>

            <div className="flex flex-col gap-3">
              {[
                { label: "Announcements", key: "announcements" },
                { label: "German Test", key: "german_test" },
                { label: "Recommended Jobs", key: "recommended_jobs" },
                { label: "Subscription", key: "subscription" },
              ].map(({ label, key }, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="font-medium">{label}</span>
                  <div
                    onClick={() => editNotifications && handleNotificationToggle(key)}
                    className={`w-10 h-5 rounded-full p-1 flex items-center cursor-pointer transition ${notifications[key] ? "bg-[#2c6472]" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow transform transition ${notifications[key] ? "translate-x-4.5" : "-translate-x-0.5"
                        }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="relative w-1/2 flex flex-col border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
            <div
              className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
              onClick={() => {
                if (editPreferences) {
                  handlePreferencesUpdate(); // Save on toggle off
                }
                setEditPreferences(prev => !prev); // Toggle edit mode
              }}            >
              <img src={editPreferences ? tick : edit} className='w-3' alt="Toggle Edit" />
            </div>

            <h2 className="text-lg font-semibold mb-6">Preferences</h2>

            {preferences ? (
              <div className="flex flex-col gap-5">

                {/* Cookie Policy */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cookie Policy</span>
                  <div
                    onClick={() => editPreferences && handlePrefChange('cookie_policy', !preferences.cookie_policy)}
                    className={`w-10 h-5 rounded-full p-1 flex items-center cursor-pointer transition ${preferences.cookie_policy ? "bg-[#2c6472]" : "bg-gray-300"
                      }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow transform transition ${preferences.cookie_policy ? "translate-x-4.5" : "-translate-x-0.5"
                        }`}
                    ></div>
                  </div>
                </div>

                {/* Language */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Language</span>
                  {editPreferences ? (
                    <input
                      type="text"
                      value={preferences.language}
                      onChange={(e) => handlePrefChange('language', e.target.value)}
                      className="border-b border-gray-300 px-3 outline-none"
                      placeholder="Language"
                    />
                  ) : (
                    <span className="font-medium">{preferences.language || "N/A"}</span>
                  )}
                </div>

                {/* Timezone */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Timezone</span>
                  {editPreferences ? (
                    <input
                      type="text"
                      value={preferences.timezone}
                      onChange={(e) => handlePrefChange('timezone', e.target.value)}
                      className="border-b border-gray-300 px-3 outline-none"
                      placeholder="Timezone"
                    />
                  ) : (
                    <span className="font-medium">{preferences.timezone || "N/A"}</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No preferences found</p>
            )}
          </div>

        </div>

        <div className='w-full flex gap-3'>

          {/* Subscription & CV */}
          {/* Subscription & CV */}
          <div className="relative w-1/2 flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-4 bg-white">
            {/* Edit / Save button */}
            <div
              onClick={() => {
                if (editSubscription) handleSubscriptionUpdate(); // save when turning off edit
                setEditSubscription((prev) => !prev);
              }}
              className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer transition-all"
            >
              <img src={editSubscription ? tick : edit} className="w-3" alt="Edit" />
            </div>

            <h2 className="text-lg font-semibold mb-4">Subscription & CV</h2>

            {user?.seekers?.[0] ? (
              editSubscription ? (
                <div className="flex flex-col gap-4">
                  {/* CL Format */}
                  <div className="flex items-center gap-5">
                    <label className="w-1/2 font-medium mb-1">CL Format</label>
                    <input
                      type="text"
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].cl_format || ""}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].cl_format = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  {/* CV Format */}
                  <div className="flex items-center gap-5">
                    <label className="w-1/2 font-medium mb-1">CV Format</label>
                    <input
                      type="text"
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].cv_format || ""}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].cv_format = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  {/* Subscription Tier */}
                  <div className="flex items-center gap-5">
                    <label className="w-1/2 font-medium mb-1">Subscription Tier</label>
                    <input
                      type="text"
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].subscription_tier || ""}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].subscription_tier = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  {/* Subscription Period */}
                  <div className="flex items-center gap-5">
                    <label className="w-1/2 font-medium mb-1">Subscription Period</label>
                    <input
                      type="text"
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].subscription_period || ""}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].subscription_period = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  {/* Subscription Dates */}
                  <div className="flex items-center gap-5">
                    <label className="font-medium mb-1">Subscription Start</label>
                    <input
                      type="date"
                      className="w-fit mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].subscription_interval_start?.slice(0, 10) || ""}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].subscription_interval_start = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-5">
                    <label className="font-medium mb-1">Subscription End</label>
                    <input
                      type="date"
                      className="w-fit mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].subscription_interval_end?.slice(0, 10) || ""}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].subscription_interval_end = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  {/* Daily Coverletter Limit */}
                  <div className="flex items-center gap-5">
                    <label className="w-1/2 font-medium mb-1">Daily Coverletter Limit</label>
                    <input
                      type="number"
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].daily_generatable_coverletter || 0}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].daily_generatable_coverletter = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  {/* Job Research Count */}
                  <div className="flex items-center gap-5">
                    <label className="w-1/2 font-medium mb-1">Job Research Count</label>
                    <input
                      type="number"
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].job_research_count || 0}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].job_research_count = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>

                  {/* Application Count */}
                  <div className="flex items-center gap-5">
                    <label className="w-1/2 font-medium mb-1">Application Count</label>
                    <input
                      type="number"
                      className="w-full mb-1 border-b border-gray-300 px-3 outline-none"
                      value={user.seekers[0].application_count || 0}
                      onChange={(e) => {
                        const updated = { ...user };
                        updated.seekers[0].application_count = e.target.value;
                        setUser(updated);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-medium">CL Format: {user.seekers[0].cl_format || "N/A"}</p>
                  <p className="font-medium">CV Format: {user.seekers[0].cv_format || "N/A"}</p>
                  <p className="font-medium">Subscription Tier: {user.seekers[0].subscription_tier || "N/A"}</p>
                  <p className="font-medium">Subscription Period: {user.seekers[0].subscription_period || "N/A"}</p>

                  <p className="font-medium">
                    Subscription Start:{" "}
                    {user.seekers[0].subscription_interval_start
                      ? new Date(user.seekers[0].subscription_interval_start).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : "N/A"}
                  </p>

                  <p className="font-medium">
                    Subscription End:{" "}
                    {user.seekers[0].subscription_interval_end
                      ? new Date(user.seekers[0].subscription_interval_end).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
                      : "N/A"}
                  </p>

                  <p className="font-medium">Daily Coverletter Limit: {user.seekers[0].daily_generatable_coverletter ?? "N/A"}</p>
                  <p className="font-medium">Job Research Count: {user.seekers[0].job_research_count ?? "N/A"}</p>
                  <p className="font-medium">Application Count: {user.seekers[0].application_count ?? "N/A"}</p>
                </>
              )
            ) : (
              <p className="text-gray-500">No subscription data available</p>
            )}
          </div>


          {/* Key Skills */}
          <div className="relative w-1/2 flex flex-col justify-between border border-[#0000001F] rounded-xl px-8 py-3 bg-white">
            <div
              onClick={toggleEditKeySkills}
              className="absolute top-2 right-4 flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
            >
              <img src={editKeySkills ? tick : edit} className='w-3' alt="" />
            </div>

            <h2 className="text-lg font-semibold mb-4">Key Skills</h2>

            <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-y-auto">
              {editKeySkills ? (
                <textarea
                  value={skillsInput}
                  onChange={(e) => {
                    setSkillsInput(e.target.value);
                    setKeySkills(e.target.value.split(",").map(s => s.trim()));
                  }}
                  placeholder="Enter skills separated by commas"
                  className="border border-gray-300 px-3 py-2 w-full resize-y rounded"
                  rows={3} // You can adjust rows for initial height
                />
              ) : keySkills.length > 0 ? (
                keySkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills added</p>
              )}

            </div>

            <div className="flex flex-col gap-3">
              {/* Primary Title */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Primary Title:</label>
                {editKeySkills ? (
                  <input
                    type="text"
                    value={primaryTitle}
                    onChange={(e) => setPrimaryTitle(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {user?.seekers?.[0]?.primary_title || "N/A"}
                  </span>
                )}
              </div>

              {/* Secondary Title */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Secondary Title:</label>
                {editKeySkills ? (
                  <input
                    type="text"
                    value={secondaryTitle}
                    onChange={(e) => setSecondaryTitle(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {user?.seekers?.[0]?.secondary_title || "N/A"}
                  </span>
                )}
              </div>

              {/* Tertiary Title */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Tertiary Title:</label>
                {editKeySkills ? (
                  <input
                    type="text"
                    value={tertiaryTitle}
                    onChange={(e) => setTertiaryTitle(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {user?.seekers?.[0]?.tertiary_title || "N/A"}
                  </span>
                )}
              </div>

              {/* Proficiency Test */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Proficiency Test:</label>
                {editKeySkills ? (
                  <input
                    type="number"
                    value={proficiencyTest}
                    onChange={(e) => setProficiencyTest(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {proficiencyTest === "" ? "N/A" : proficiencyTest}
                  </span>
                )}
              </div>

              {/* Top Jobs Count */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Top Jobs Count:</label>
                {editKeySkills ? (
                  <input
                    type="number"
                    value={topJobsCount}
                    onChange={(e) => setTopJobsCount(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {topJobsCount === "" ? "N/A" : topJobsCount}
                  </span>
                )}
              </div>

              {/* Total Applications */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Total Applications:</label>
                {editKeySkills ? (
                  <input
                    type="number"
                    value={totalApplications}
                    onChange={(e) => setTotalApplications(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {totalApplications === "" ? "N/A" : totalApplications}
                  </span>
                )}
              </div>

              {/* Weekly Applications */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Weekly Applications:</label>
                {editKeySkills ? (
                  <input
                    type="number"
                    value={weeklyApplications}
                    onChange={(e) => setWeeklyApplications(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {weeklyApplications === "" ? "N/A" : weeklyApplications}
                  </span>
                )}
              </div>

              {/* 🆕 Weekly Applications Count */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Weekly Applications Count:</label>
                {editKeySkills ? (
                  <input
                    type="number"
                    value={weeklyApplicationsCount}
                    onChange={(e) => setWeeklyApplicationsCount(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {weeklyApplicationsCount === "" ? "N/A" : weeklyApplicationsCount}
                  </span>
                )}
              </div>

              {/* 🆕 Application Count */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Application Count:</label>
                {editKeySkills ? (
                  <input
                    type="number"
                    value={applicationCount}
                    onChange={(e) => setApplicationCount(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {applicationCount === "" ? "N/A" : applicationCount}
                  </span>
                )}
              </div>

              {/* 🆕 Job Research Count */}
              <div className="flex items-center justify-between">
                <label className="font-medium w-1/2">Job Research Count:</label>
                {editKeySkills ? (
                  <input
                    type="number"
                    value={jobResearchCount}
                    onChange={(e) => setJobResearchCount(e.target.value)}
                    className="border-b border-gray-300 px-3 w-1/2"
                  />
                ) : (
                  <span className="w-1/2">
                    {jobResearchCount === "" ? "N/A" : jobResearchCount}
                  </span>
                )}
              </div>
            </div>

          </div>

        </div>


      </div>

    </div >
  )
}

export default UserProfile