import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar'
import search_icon from '../../assets/search.png'
import avatar from '../../assets/avatar.png'
import edit from '../../assets/edit.png'

const UserDetails = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  // Get User data
  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if(!token) {
        toast.error("No User found. Please log in.");
        return;
      }
      const res = await fetch('https://a1.arshan.digital/a1/admin/edit/user-data', {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
      if(!res.ok) {
        toast.error('Failed to fetch user data')
      }
      const data = await res.json();
      setUsers(data.users || []);
    }
    catch (error) {
      toast.error("Something went wrong!");
    }
  }

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = async (id, email) => {
    try {

      const token = sessionStorage.getItem('token');
      if(!token) {
        toast.error("No User found. Please log in.");
        return;
      }

      const res = await fetch('https://a1.arshan.digital/a1/admin/edit/user-data', {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ email })
      })

      if (!res.ok) {
        toast.error('Failed to fetch user details');
        return;
      }

      const data = await res.json();

      sessionStorage.setItem('selectedUser', JSON.stringify(data));

      navigate(`/users/${id}`);
    }
    catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
        <Navbar />

        <div className="flex justify-between items-center px-8 py-5">
          <div className="relative w-full max-w-[500px]">
            <img src={search_icon} className='absolute top-1/2 -translate-y-1/2 right-3 w-5 cursor-pointer' alt="" />
            <input 
             type="text"
             placeholder='Search'
             className='w-full outline-none border border-[#0000001F] p-3 pl-5 rounded-xl bg-white'
            />
          </div>
        </div> 

        <div className="flex flex-col gap-5 px-8">

          <h2 className='font-semibold text-lg'>Users</h2>

          {users.map((user, index) => (

            <div key={index} className="flex justify-between items-center border border-[#0000001F] rounded-xl px-8 py-3 bg-white">

              <p className='font-medium text-[#00000069]'>{user.email}</p>
              <div 
               className="flex items-center rounded-full hover:bg-[#2c6472]/10 p-3 aspect-square cursor-pointer"
               onClick={() => handleEditClick(user.auth_user_id, user.email)}
              >
                <img src={edit} className='w-4' alt="" />
              </div>

            </div>

          ))}

        </div>

        <div className="flex justify-center items-center gap-8 py-10 px-8">
            <div className="bg-[#2c6472] px-3 py-1 text-white rounded-md cursor-pointer">Prev</div>
            <p>1 Of 5</p>
            <div className="bg-[#2c6472] px-3 py-1 text-white rounded-md cursor-pointer">Next</div>
        </div>         
              
    </div>
  )
}

export default UserDetails