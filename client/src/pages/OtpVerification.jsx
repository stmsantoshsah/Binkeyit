
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosTostError from '../utils/AxiosTostError';
import { Link, useLocation, useNavigate } from 'react-router-dom'
const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const inputRef = useRef([])
    const location = useLocation();
    console.log("location",location)

    useEffect(() => {
        if (!location?.state?.email) {
            navigate("/forgot-password")
        }
    }, [navigate])

    const valideValue = data.every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            })
            console.log("response",response)
            if (response.data.error) {
                toast.error(response.data.message)
            }
            if (response.data.success) {
                toast.success(response.data.message)
                setData(["", "", "", "", "", ""])
                navigate("/reset-password",{
                    state:{
                        data:response.data,
                        email:location?.state?.email,
                    }
                })
            }
        } catch (error) {
            AxiosTostError(error)
        }
    }
    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 mx-auto w-full max-w-lg max-auto rounded p-7'>
                <p className='text-semibold font-bold'>Enter Otp</p>
                <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                    <div className='grid gap-1'>
                        <label htmlFor="otp-0">Enter Your Otp :</label>
                        <div className='flex gap-1 justify-between items-center mt-3'>
                            {
                                data.map((element, index) => {
                                    return (
                                        <input key={"otp" + index}
                                            ref={(ref) => {
                                                inputRef.current[index] = ref
                                                return ref
                                            }}
                                            type="text" onChange={(e) => {
                                                const value = e.target.value
                                                const newData = [...data]
                                                newData[index] = value;
                                                setData(newData);
                                                if (value && index < 5) {
                                                    inputRef.current[index + 1].focus()
                                                }
                                            }} value={data[index]} maxLength={1} className='w-full max-w-16 bg-blue-50 p-2 border rounded outline-none focus:border-primary text-center font-semibold' id={`otp-${index}`} />
                                    )
                                })
                            }
                        </div>
                    </div>
                    <button disabled={!valideValue} className={`${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"} text-white py-2 rounded font-semibold cursor-pointer my-3 tracking-wide`}>Verify Otp</button>
                </form>
                <p>Already have account ? <Link to="/login" className='font-semibold text-green-700 hover:text-green-800'>Login</Link> </p>
            </div>
        </section>
    )
}

export default OtpVerification

