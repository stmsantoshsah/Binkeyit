import React, { useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosTostError from '../utils/AxiosTostError';
import Axios from '../utils/Axios';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const valideValue = Object.values(data).every(el => el)
  useEffect(() => {
    if (!(location?.state?.data?.success)) {
      navigate("/");
    }
    if (location?.state?.email) {
      setData((prev) => {
        return {
          ...prev,
          email: location?.state?.email
        }
      })
    }
  }, [])
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }
  console.log("data", data)
  console.log("ResetPassword", location)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New Password and Confirm Password Must be same!.");
      return;
    }
    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      })
      if (response.data.error) {
        toast.error(response.data.message)
      }
      if (response.data.success) {
        toast.success(response.data.message)
        navigate("/login")
        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        })

      }
    } catch (error) {
      // console.log("error",error)
      AxiosTostError(error)
    }
  }
  return (
    <section className='w-full container mx-auto px-2'>
      <div className='bg-white my-4 mx-auto w-full max-w-lg max-auto rounded p-7'>
        <p className='text-semibold font-bold'>Enter Your Password</p>
        <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
           <div className='grid gap-1'>
            <label htmlFor="newPassword">New Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex justify-between items-center focus-within:border-primary'>
              <input type={showPassword ? "text" : "password"} autoFocus name="newPassword" id="newPassword" value={data.newPassword} onChange={handleChange} className='w-full h-full outline-none' placeholder='Enter your password...' />
              <div onClick={() => setShowPassword((prev) => !prev)} className='cursor-pointer'>
                {!showPassword ? (<FaRegEyeSlash />) : (<FaRegEye />)}
              </div>
            </div>
          </div>
          <div className='grid gap-1'>
            <label htmlFor="confirmPassword">Confirm Password :</label>
            <div className='bg-blue-50 p-2 border rounded flex justify-between items-center focus-within:border-primary'>
              <input type={showConfirmPassword ? "text" : "password"} autoFocus name="confirmPassword" id="confirmPassword" value={data.confirmPassword} onChange={handleChange} className='w-full h-full outline-none' placeholder='Enter your password...' />
              <div onClick={() => setShowConfirmPassword((prev) => !prev)} className='cursor-pointer'>
                {!showPassword ? (<FaRegEyeSlash />) : (<FaRegEye />)}
              </div>
            </div>
          </div>
          <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold cursor-pointer my-3 tracking-wide`}>Change Password</button>
        </form>
        <p>Already have account ? <Link to="/login" className='font-semibold text-green-700 hover:text-green-800'>Login</Link> </p>
      </div>
    </section>
  )
}

export default ResetPassword
