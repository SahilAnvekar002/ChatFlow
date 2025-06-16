// Sidebar component
import React, { useState } from 'react'
import { FaUsers } from 'react-icons/fa'
import { IoLogOut, IoReorderThreeOutline } from 'react-icons/io5'
import { PiChatsFill } from 'react-icons/pi'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CgProfile } from 'react-icons/cg'
import socket from '../socket';

function Sidebar({setChat, setUi}) {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // remove user from localstorage and state and navigate to /login
    const handleLogout =()=>{
        dispatch(logoutUser);
        localStorage.removeItem('user');
        socket.emit('logout');
        navigate('/login');
        toast.success("Logged out successfully");
    }

    return (
        <>
        <aside className={`hidden md:flex ${!sidebarOpen ? 'md:hidden': 'md:absolute top-0 left-0 z-10 pl-4'} xl:flex flex-col h-full w-60 2xl:w-72 bg-[#f0f0f0] shadow-md`}>
            <div className='flex flex-col items-start px-8 py-4'>
                <div className='flex items-center justify-center mb-6'>
                    <img
                    alt="ChatFlow Logo"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=gray-900"
                    className="mx-auto h-6 w-auto"
                    />
                    <h1 className='text-gray-900 text-xl font-semibold ml-2'>ChatFlow</h1>
                </div>
                <div className='flex flex-col items-start px-2 w-full'>
                    <div className='flex items-center mb-1 cursor-pointer rounded-lg hover:bg-white w-full py-1 px-4' onClick={()=>setChat(true)}>
                        <PiChatsFill className='h-5 w-auto'/>
                        <h1 className='text-gray-900 text-lg ml-2'>Chats</h1>
                    </div>
                    <div className='flex items-center mb-1 cursor-pointer hover:bg-white w-full py-1 px-4 rounded-lg' onClick={()=>setChat(false)}>
                        <FaUsers className='h-5 w-auto'/>
                        <h1 className='text-gray-900 text-lg ml-2'>Users</h1>
                    </div>
                    <div className='flex items-center mb-1 cursor-pointer hover:bg-white w-full py-1 px-4 rounded-lg' onClick={()=>handleLogout()}>
                        <IoLogOut className='h-5 w-auto'/>
                        <h1 className='text-gray-900 text-lg ml-2'>Logout</h1>
                    </div>
                </div>
            </div>
        </aside>

        <aside className={`md:hidden ${!sidebarOpen ? 'hidden': 'absolute top-0 left-0 z-10 pl-4'} flex flex-col h-full w-60 2xl:w-72 bg-[#f0f0f0] shadow-md`}>
            <div className='flex flex-col items-start px-8 py-4'>
                <div className='flex items-center justify-center mb-6'>
                    <img
                    alt="ChatFlow Logo"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=gray-900"
                    className="mx-auto h-6 w-auto"
                    />
                    <h1 className='text-gray-900 text-xl font-semibold ml-2'>ChatFlow</h1>
                </div>
                <div className='flex flex-col items-start px-2 w-full'>
                    <div className='flex items-center mb-1 cursor-pointer rounded-lg hover:bg-white w-full py-1 px-4' onClick={()=>setUi('chatlist')}>
                        <PiChatsFill className='h-5 w-auto'/>
                        <h1 className='text-gray-900 text-lg ml-2'>Chats</h1>
                    </div>
                    <div className='flex items-center mb-1 cursor-pointer hover:bg-white w-full py-1 px-4 rounded-lg' onClick={()=>setUi('searchuser')}>
                        <FaUsers className='h-5 w-auto'/>
                        <h1 className='text-gray-900 text-lg ml-2'>Users</h1>
                    </div>
                    <div className='flex items-center mb-1 cursor-pointer hover:bg-white w-full py-1 px-4 rounded-lg' onClick={()=>setUi('profile')}>
                        <CgProfile className='h-5 w-auto'/>
                        <h1 className='text-gray-900 text-lg ml-2'>Profile</h1>
                    </div>
                    <div className='flex items-center mb-1 cursor-pointer hover:bg-white w-full py-1 px-4 rounded-lg' onClick={()=>handleLogout()}>
                        <IoLogOut className='h-5 w-auto'/>
                        <h1 className='text-gray-900 text-lg ml-2'>Logout</h1>
                    </div>
                </div>
            </div>
        </aside>
        <button className={`flex xl:hidden absolute top-4 left-4 z-20`} onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <IoReorderThreeOutline size={24}/>
        </button>
        </>
    )
}

export default Sidebar
