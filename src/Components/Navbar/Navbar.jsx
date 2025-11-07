import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import jse_logo from '../../assets/arshanlogo.png';
import avatar from '../../assets/avatar.png';
import arrow from '../../assets/drop-arrow.png';

const Navbar = () => {
  const dropdownRef = useRef(null);
  const botDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false); // profile dropdown
  const [botMenuOpen, setBotMenuOpen] = useState(false); // botMyJob dropdown

  const mainMenu = [
    { name: "Dashboard", path: "/dashboard" },
  ];

  const botMyJobMenu = [
    { name: "Announcements", path: "/announcements" },
    { name: "Questions", path: "/questions" },
    { name: "User Details", path: "/users" }
  ];

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        botDropdownRef.current && !botDropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
        setBotMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='flex justify-between items-center px-8 py-2 border-b border-b-[#0000001F] bg-white'>
      {/* Logo */}
      <div className='W-40 h-14 flex justify-center items-center'>
        <img src={jse_logo} className='w-14 h-14' alt="" />
        <div className='flex flex-col'>
          <p className='font-medium font-serif'>Arshan</p>
          <p className='font-medium'>Admin Panel</p>
        </div>
      </div>

      {/* Menu */}
<ul className="flex items-center gap-10 font-semibold text-[#0000004F]">
  {mainMenu.map((item) => (
    <li
      key={item.path}
      className={`cursor-pointer hover:text-[#2c6472] transition-colors ${
        location.pathname === item.path ? "text-[#2c6472]" : ""
      }`}
      onClick={() => navigate(item.path)}
    >
      {item.name}
    </li>
  ))}

  {/* BotMyJob Dropdown */}
  <li ref={botDropdownRef} className="relative">
    <div
      className="flex items-center gap-1 cursor-pointer select-none hover:text-[#2c6472] transition-colors"
      onClick={() => setBotMenuOpen((prev) => !prev)}
    >
      <span className={botMenuOpen ? "text-[#2c6472]" : ""}>Careerminer</span>
      <motion.img
        src={arrow}
        alt=""
        animate={{ rotate: botMenuOpen ? 180 : 0 }}
        transition={{ duration: 0.25 }}
        className="w-3 ms-2"
      />
    </div>

    <AnimatePresence>
      {botMenuOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-8 left-0 w-44 bg-white shadow-lg rounded-lg z-10 py-3 overflow-hidden border border-gray-100"
        >
          {botMyJobMenu.map((sub) => (
            <li
              key={sub.path}
              className="px-4 py-2 hover:bg-[#2c6472]/10 hover:text-[#2c6472] transition-colors text-sm cursor-pointer"
              onClick={() => {
                navigate(sub.path);
                setBotMenuOpen(false);
              }}
            >
              {sub.name}
            </li>
          ))}
        </motion.ul>
      )}
    </AnimatePresence>
  </li>
</ul>


      {/* Profile Dropdown */}
      <div ref={dropdownRef} className="flex gap-4 items-center relative">
        <img src={avatar} className='rounded-full w-12 aspect-square' alt="" />
        <h2 className='font-semibold text-lg'>Admin</h2>
        <div
          className="flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img src={arrow} className={`w-3 transition-transform ${open ? "rotate-180" : ""}`} alt="" />
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute top-14 right-0 w-48 bg-white z-10 shadow-sm rounded-sm"
            >
              <ul className='p-2 text-left text-sm'>
                <Link to="/change-password"><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Change Password</li></Link>
                <li onClick={handleLogout} className="px-4 py-2 hover:bg-red-600 cursor-pointer text-red-500 hover:text-white">Logout</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
