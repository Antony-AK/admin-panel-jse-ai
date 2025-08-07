import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../Components/Navbar/Navbar'
import search_icon from '../../assets/search.png'
import ellipsis from '../../assets/ellipsis.svg'
import AnnouncementsModal from '../../Components/PopUps/AnnouncementsModels'

const Announcements = () => {

  const menuRef = useRef(null);

  const [openMenuId, setOpenMenuId] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editAnnouncementData, setEditAnnouncementData] = useState(null);


  // Get Announcements
  const fetchAnnouncements = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        toast.error('No User found. Please log in.');
        return;
      }
      const res = await fetch('https://a1.arshan.digital/a1/admin/announcements', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) {
        toast.error('Failed to fetch announcements');
        return;
      }
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  // Initial load
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Toggle Ellipsis
  const toggleEllipsis = (id) => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Blur Focus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delete Announcements
  const handleDelete = async (id) => {

    try {
      const token = sessionStorage.getItem('token');

      if (!token) {
        toast.error("No User found. Please log in.");
        return;
      }

      const res = await fetch(`https://a1.arshan.digital/a1/admin/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (!res.ok) {
        toast.error("Failed to delete announcement");
        return;
      }

      toast.success("Announcement deleted!");
      fetchAnnouncements();
    }
    catch (error) {
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className=''>

      <div className="flex justify-between items-center px-8 py-5">
        <div className="relative w-full max-w-[500px]">
          <img src={search_icon} className='absolute top-1/2 -translate-y-1/2 right-3 w-5 cursor-pointer' alt="" />
          <input
            type="text"
            placeholder='Search'
            className='w-full outline-none border border-[#0000001F] p-3 pl-5 rounded-xl bg-white'
          />
        </div>
        <button
          className='text-white bg-[#2c6472] rounded-xl px-8 py-3 cursor-pointer'
          onClick={() => setShowModal(true)}
        >
          + Add Announcement
        </button>
      </div>

      <div className="flex flex-col gap-5 px-8 mt-2">

        {announcements.length > 0 ? (
          announcements.map((item) => (

            <div key={item.id} className="relative flex flex-col gap-2 border border-[#0000001F] rounded-xl px-8 py-3 bg-white">

              <h2 className='font-semibold'>{item.title}</h2>
              <p className='text-[#0000008F] font-medium text-sm'>
                {formatDate(item.updated_at)}
              </p>
              <p className='font-medium'>{item.message}</p>

              <div
                ref={menuRef}
                className="absolute top-2 right-2 flex items-center rounded-full hover:bg-[#2c6472]/10 p-2 aspect-square cursor-pointer"
                onClick={() => toggleEllipsis(item.id)}
              >
                <img src={ellipsis} className='w-4' alt="" />
              </div>

              <AnimatePresence>
                {openMenuId === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute right-2 top-10 w-40 bg-white border border-[#0000001F] rounded-md z-10"
                  >
                    <ul className="p-2 text-left text-sm">
                      <li
                        onClick={() => {
                          setShowModal(true);
                          setEditAnnouncementData(item);
                          setOpenMenuId(null); // close ellipsis menu
                        }} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit</li>
                      <li
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                      >
                        Delete
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          ))

        ) : (

          <p>No Announcements</p>

        )}

      </div>

      <div className="flex justify-center items-center gap-8 py-10 px-8">
        <div className="bg-[#2c6472] px-3 py-1 text-white rounded-md cursor-pointer">Prev</div>
        <p>1 Of 5</p>
        <div className="bg-[#2c6472] px-3 py-1 text-white rounded-md cursor-pointer">Next</div>
      </div>

      {showModal &&
        <AnnouncementsModal
          onClose={() => {
            setShowModal(false);
            setEditAnnouncementData(null);
          }}
          onSuccess={() => fetchAnnouncements()}
          editData={editAnnouncementData}
        />
      }


    </div>
  )
}

export default Announcements