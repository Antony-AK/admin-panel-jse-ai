import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const ChangePassword = () => {
  const [form, setForm] = useState({
    email: "",
    current_password: "",
    new_password: "",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const payload = parseJwt(token);
      if (payload?.email) {
        setForm((f) => ({ ...f, email: payload.email }));
      }
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("No auth token found, please login.");
      return;
    }

    try {
      const res = await fetch(
        "https://a1.arshan.digital/a1/admin/utils/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password changed successfully!");
        setForm({ email: form.email, current_password: "", new_password: "" });
      } else {
        toast.error(data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error(error);
       toast.error("Something went wrong!");
    }
  };

  return (
    <div className="h-[90vh] flex bg-white w-full mx-auto justify-center items-center">
      {/* Left side - Form */}
      <div className="w-[40%] flex flex-col justify-center items-center px-12 bg-white">
        <div className="max-w-md w-full mx-auto">
          <h1 className="text-3xl font-bold text-[#2c6472] mb-6">
            Change Your Password
          </h1>
          <p className="text-gray-600 mb-8">
            Keep your account secure by updating your password regularly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="text"
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2c6472] focus:ring-1 focus:ring-[#2c6472]"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">New Password</label>
              <input
                type="text"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#2c6472] focus:ring-1 focus:ring-[#2c6472]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2c6472] text-white py-3 rounded-lg font-medium hover:bg-[#26595e] transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Image / Illustration */}
      <div className="hidden lg:flex w-[40%] items-center justify-center bg-white">
        <img
          src="https://img.freepik.com/free-vector/password-reset-concept-illustration_114360-7966.jpg"
          alt="Change Password Illustration"
          className="max-w-lg"
        />
      </div>
    </div>
  );
};

export default ChangePassword;
