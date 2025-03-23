import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ResetPassword = () => {
    const location = useLocation()
    useEffect(()=>{
        
    })
    console.log("ResetPassword",location)
  return (
    <div>
      ResetPassword
    </div>
  )
}

export default ResetPassword
