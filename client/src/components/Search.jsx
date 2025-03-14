import React, { useEffect, useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeftLong } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchPage, setIsSearchPage] = useState(false)
    const [isMobile] = useMobile();
    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    }, [location])
    console.log(isSearchPage)
    const redirectToSearchPage = () => {
        navigate("/search")
    }
    return (
        <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-lg border p-1 overflow-hidden flex items-center text-neutral-500 bg-slate-50 focus-within:border-primary-light group'>
            <div>
                {
                    !(isSearchPage && isMobile) ? (<button className='flex justify-center items-center h-full p-3 text-neutral-600 group-focus-within:text-primary'>
                        <IoSearch size={22} />
                    </button>) : (<Link to="/" className='flex justify-center items-center h-full p-1 text-neutral-600 group-focus-within:text-primary bg-white rounded-full m-1 shadow-md'><FaArrowLeftLong size={20} /></Link>)
                }
            </div>
            <div className='w-full h-full'>
                {
                    !isSearchPage ? (
                        <div onClick={redirectToSearchPage} className='w-full h-full flex items-center'>
                            <TypeAnimation
                                sequence={[
                                    'Search "milk"',
                                    1000,
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "paneer"',
                                    1000,
                                    'Search "chocolate"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "eggs"',
                                    1000,
                                    'Search "chips"',
                                    1000


                                ]}
                                wrapper="span"
                                speed={50}
                                repeat={Infinity}
                            />
                        </div>) : (
                        <div className='w-full h-full'>
                            <input type="text" placeholder='Search for atta daal and more' className='w-full h-full bg-transparent outline-none' autoFocus={true} />
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Search
