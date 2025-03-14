import React from 'react'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
const Footer = () => {
    return (
        <footer className='border-t'>
            <div className='container mx-auto p-4 text-center flex flex-col lg:flex-row lg:justify-between gap-2'>
                <p>© All Rights Reserved 2025.</p>
                <div className='flex justify-center items-center gap-4 text-2xl'>
                    <a href="" className='hover:text-primary'><FaFacebook /></a>
                    <a href="" className='hover:text-primary'><FaInstagram /></a>
                    <a href="" className='hover:text-primary'><FaLinkedin /></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer
