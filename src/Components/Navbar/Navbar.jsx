import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import jse_logo from '../../assets/nav-logo.png'
import avatar from '../../assets/avatar.png'
import arrow from '../../assets/drop-arrow.png'

const Navbar = () => {

  const dropdownRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Announcements", path: "/announcements" },
    { name: "Questions", path: "/questions" },
    { name: "User Details", path: "/users" }
  ]

    // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem('token')   // remove token
    setOpen(false)                       // close dropdown
    navigate('/')                       // navigate to home/login page
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className='flex justify-between items-center px-8 py-2 border-b border-b-[#0000001F] bg-white'>
        <img src={jse_logo} className='w-40 h-14' alt="" />

        <ul className='flex items-center gap-10 font-semibold text-[#0000004F]'>
            {menuItems.map((item) => (
              <li 
                key={item.path} 
                className={`cursor-pointer transition-colors ${
                  location.pathname === item.path ? 'text-[#2c6472]' : 'text-[#0000004F]'
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </li>
            ))}
        </ul>

        <div ref={dropdownRef} className="flex gap-4 items-center">
            <img src={avatar} className='rounded-full w-12 aspect-square' alt="" />
            <h2 className='font-semibold text-lg'>Steve</h2>
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
                        className="absolute top-20 right-5 w-48 bg-white z-10 shadow-sm rounded-sm"
                    >
                        <ul className='p-2 text-left text-sm'>
                            <Link to="/change-password" ><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Change Password</li></Link>
                            <li onClick={handleLogout} className="px-4 py-2 hover:bg-red-600 cursor-pointer text-red-500 hover:text-white">Logout</li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  )
}

export default Navbar