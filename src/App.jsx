import React from 'react'
import { Route, Routes , useLocation } from 'react-router-dom'
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Pages/Login/Login'
import Dashboard from './Pages/Dashboard/Dashboard';
import Announcements from './Pages/Announcements/Announcements';
import Questions from './Pages/Questions/Questions';
import UserDetails from './Pages/UserDetails/UserDetails';
import UserProfile from './Pages/UserProfile/UserProfile';
import Navbar from './Components/Navbar/Navbar';
import ChangePassword from './Pages/ChangePassword/ChangePassword ';

const App = () => {
    const location = useLocation()


    const showNavbar = location.pathname !== '/'

  return (
    <>
      {showNavbar && <Navbar />}

    <Routes>
      <Route path='/' element={<Login />}/>
      <Route path='/dashboard' element={<Dashboard />}/>
      <Route path='/announcements' element={<Announcements />}/>
      <Route path='/questions' element={<Questions />}/>
      <Route path='/users' element={<UserDetails />}/>
      <Route path='/users/:id' element={<UserProfile />}/>
      <Route path='/change-password' element={<ChangePassword/>} />
    </Routes>

    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      closeOnClick={false}
      rtl={false}
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      draggable
      theme="light"
      transition={Bounce}
    />

    </>
  )
}

export default App