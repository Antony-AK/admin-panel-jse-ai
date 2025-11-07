import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Navigate, useNavigate } from 'react-router-dom'
import login_img from '../../assets/login-img.png'
import jse_logo from '../../assets/arshanlogo.png'
import google from '../../assets/google.png'
import { ADMIN_URL } from "../../utils/api"

const Login = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const handleLogin = async (e) => {

        e.preventDefault()

        if (!email || !password) {
            toast.error("Please enter email and password")
            return
        }

        try {
            const response = await fetch(`${ADMIN_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                sessionStorage.setItem("token", data.token)
                // toast.success("Login successful!") 

                navigate("/dashboard")
            }
            else {
                toast.error(data.message || "Login failed")
            }
        }
        catch (error) {
            toast.error("Something went wrong!");
            console.error(error);
        }
    }

    return (
        <div className='flex justify-center items-center gap-16 h-screen  w-full'>

            {/* Left Side */}
            <div className="w-[35%] flex justify-center items-center ">
                <img src={login_img} className='h-[calc(100vh-120px)] w-[85%] ' alt="" />
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center items-center gap-6 w-[40%] ">

                <div className='flex justify-center items-center w-12 h-10 -ms-5'>
                    <img src={jse_logo} className='mx-auto w-20 h-12' alt="" />
                    <p className='text-2xl font-semibold'>Arshan</p>
                </div>
                <h2 className='text-center font-semibold  text-2xl '>Welcome to Admin Panel</h2>

                {/* <div className="w-full flex justify-center items-center border border-[#0000001F] rounded-2xl py-3 gap-5 cursor-pointer">
                    <img src={google} className=' w-7' alt="" />
                    <p className='text-[#0000004F]'>Continue with Google</p>
                </div> */}

                <div className="w-full flex justify-center items-center gap-5">
                    <div className="border-t border-t-[#0000001F] w-full"></div>
                    <p className='text-[#0000004F] font-semibold'>Or</p>
                    <div className="border-t border-t-[#0000001F] w-full"></div>
                </div>

                <form
                    onSubmit={handleLogin}
                    className='w-full flex flex-col gap-5'
                >

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                        <label className='text-[#0000004F] font-medium' htmlFor="email">Email</label>
                        <input
                            id='email'
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            //  placeholder='enter your email'
                            className='border border-[#0000004F] outline-none rounded-xl p-3 px-4'
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-2">
                        <label className='text-[#0000004F] font-medium' htmlFor="password">Password</label>
                        <input
                            id='password'
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            //  placeholder='enter your password'
                            className='border border-[#0000004F] outline-none rounded-xl p-3 px-4'
                        />
                    </div>

                    <button className='text-white bg-[#2c6472] rounded-xl w-full py-3.5 mt-7 cursor-pointer hover:bg-[#2c6472]/90'>
                        Login
                    </button>

                </form>

            </div>

        </div>
    )
}

export default Login