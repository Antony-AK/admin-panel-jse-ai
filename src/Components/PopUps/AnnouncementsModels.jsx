import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { ADMIN_URL } from "../../utils/api"

const AnnouncementsModels = ({ onClose, onSuccess, editData = null }) => {

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    isActive: false
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        message: editData.message || "",
        isActive: editData.is_active || false,
      });
    } else {
      setFormData({ title: "", message: "", isActive: false });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error("Title and message are required!");
      return;
    }

    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error("No User found. Please log in.");
        return;
      }

      const url = editData
        ? `${ADMIN_URL}/announcements/${editData.id}`
        : `${ADMIN_URL}/announcements`;

      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          is_active: formData.isActive
        })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.issue || "Failed to upload announcement ❌");
        return;
      }

      toast.success(data.issue || "Announcement posted ✅");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Something went wrong 💥");
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="w-[60%] max-w-[800px] flex flex-col gap-5 bg-white p-6 rounded-lg shadow-lg">

        <h2 className="text-xl font-semibold">
          {editData ? "Edit Announcement" : "Add Announcement"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center gap-5 w-[70%] mx-auto"
        >

          {/* Title */}
          <div className="w-full flex flex-col justify-center gap-2">
            <label className='font-medium' htmlFor="title">Title</label>
            <input
              id='title'
              name='title'
              type="text"
              value={formData.title}
              onChange={handleChange}
              className='border border-[#0000001C] outline-none rounded-xl p-3'
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-2">
            <label className='font-medium' htmlFor="message">Message</label>
            <textarea
              id='message'
              name='message'
              value={formData.message}
              onChange={handleChange}
              className='border border-[#0000001C] outline-none rounded-xl p-3 h-28 resize-none'
              rows={4}
            ></textarea>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between gap-2">
            <label className="font-medium">Active</label>
            <div
              onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.isActive ? 'bg-[#2c6472]' : 'bg-gray-300'
                }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${formData.isActive ? 'translate-x-4.5' : '-translate-x-0.5'
                  }`}
              >
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-5 py-4 mt-4">
            <button
              className='w-40 py-2 text-[#2c6472] text-sm border border-[#2c6472] rounded-lg cursor-pointer'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className='w-40 py-2 bg-[#2c6472] text-sm text-white rounded-lg cursor-pointer'
            >
              {editData ? "Update" : "Post"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default AnnouncementsModels