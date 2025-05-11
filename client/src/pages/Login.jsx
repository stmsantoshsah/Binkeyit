import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import { Link, useNavigate } from 'react-router-dom'
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const validValue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.login,
        data: data
      })
      if (response.data.error) {
        toast.error(response.data.message)
      }
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('accessToken',response.data.data.accessToken)
        localStorage.setItem('refreshToken',response.data.data.refreshToken)
        setData({
          email: "",
          password: "",
        })
        navigate("/")
      }
    } catch (error) {
      AxiosTostError(error)
    }
  }
  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 mx-auto w-full max-w-lg max-auto rounded p-7'>
        <p>Login</p>
        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
          <div className='grid gap-1'>
            <label htmlFor="email">Email :</label>
            <input type="email" className='bg-blue-50 p-2 border rounded outline-none focus:border-primary' name="email" id="email" value={data.email} onChange={handleChange} placeholder='Enter your email...' />
          </div>
          <div className='grid gap-1'>
            <label htmlFor="password">Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex justify-between items-center focus-within:border-primary'>
              <input type={showPassword ? "text" : "password"} autoFocus name="password" id="password" value={data.password} onChange={handleChange} className='w-full h-full outline-none' placeholder='Enter your password...' />
              <div onClick={() => setShowPassword((prev) => !prev)} className='cursor-pointer'>
                {!showPassword ? (<FaRegEyeSlash />) : (<FaRegEye />)}
              </div>
            </div>
            <Link to={"/forgot-password"} className='ms-auto hover:text-primary'>Forgot password ? </Link>
          </div>
          <button disabled={!validValue} className={`${validValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold cursor-pointer my-3 tracking-wide`}>Login</button>
        </form>
        <p>Don't have account ? <Link to="/register" className='font-semibold text-green-700 hover:text-green-800'>Register</Link> </p>
      </div>
    </section>
  )
}

export default Login
