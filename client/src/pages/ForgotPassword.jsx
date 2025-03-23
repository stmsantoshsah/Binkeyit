import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import { Link, useNavigate } from 'react-router-dom'
const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
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

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data: data
            })
            if (response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/verification-otp",{
                    state:data
                })
                setData({
                    email: "",
                })
              
            }
        } catch (error) {
            AxiosTostError(error)
        }
    }
    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 mx-auto w-full max-w-lg max-auto rounded p-7'>
                <p className='text-semibold font-bold'>Forgot Password</p>
                    <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="email">Email :</label>
                        <input type="email" className='bg-blue-50 p-2 border rounded outline-none focus:border-primary' name="email" id="email" value={data.email} onChange={handleChange} placeholder='Enter your email...' />
                    </div>
                    <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold cursor-pointer my-3 tracking-wide`}>Send Otp</button>
                </form>
                <p>Already have account ? <Link to="/login" className='font-semibold text-green-700 hover:text-green-800'>Login</Link> </p>
            </div>
        </section>
    )
}

export default ForgotPassword
