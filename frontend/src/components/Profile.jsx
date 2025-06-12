// Profile component
import React, { useState } from 'react'
import FriendList from './FriendList'
import RequestList from './RequestList'
import { useSelector } from 'react-redux'

function Profile({isOpen, ui}) {

    const [request, setRequest] = useState(true);
    const profile = useSelector((state)=>state.user.user);

    return (
        <div className={`${ui === 'profile' ? 'flex': 'hidden'} ${isOpen ? 'md:hidden' : 'md:flex'} xl:flex max-w-[400px] flex-col flex-1 border-r border-r-gray-300 md:ml-0 ml-16 border-l border-l-gray-300`}>
            <div className='border-b border-b-gray-300 px-4 py-4'>
                <h1 className='text-gray-900 text-xl font-semibold ml-2 mb-1'>Profile</h1>
            </div>
            <div className='flex items-center flex-col border-b border-b-gray-300 py-4'>
                <img
                    alt="Profile"
                    src="https://cdn-icons-png.flaticon.com/128/847/847969.png"
                    className="h-20 w-auto object-cover mb-2 rounded-full"
                />
                <h2 className='text-gray-900 text-lg font-semibold'>{profile.username}</h2>
                <h3 className='text-gray-900 text-base'>{profile.email}</h3>
            </div>

            <div className='flex border-b-gray-300 border-b'>
                <div className='flex items-center justify-center cursor-pointer hover:bg-gray-100 w-full py-2 px-4 border-r border-r-gray-300' onClick={()=>setRequest(true)}>
                    <h1 className='text-gray-900 text-base'>Requets</h1>
                </div>
                <div className='flex items-center justify-center cursor-pointer hover:bg-gray-100 w-full py-2 px-4' onClick={()=>setRequest(false)}>
                    <h1 className='text-gray-900 text-base'>Friends</h1>
                </div>
            </div>

            {request ? <RequestList />: <FriendList />}
        </div>
    )
}

export default Profile
