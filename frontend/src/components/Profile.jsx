// Profile component
import React, { useState } from 'react'
import FriendList from './FriendList'
import RequestList from './RequestList'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setProfile } from '../redux/slices/userSlice';

function Profile({ isOpen, ui }) {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const profile = useSelector((state) => state.user.user);
    const user = useSelector((state) => state.auth.user);

    const [request, setRequest] = useState(true);

    const handleUpload = async (file) => {
        const reader = new FileReader();
        reader.onloadend = async()=>{
            const base64 = reader.result;
            const res = await axios.post(`${baseURI}/users/upload-profile`, { profilePic: base64 }, {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            });
            dispatch(setProfile(res.data.payload));
        }
        reader.readAsDataURL(file);
    }

    return (
        <div className={`${ui === 'profile' ? 'flex' : 'hidden'} ${isOpen ? 'md:hidden' : 'md:flex'} xl:flex max-w-[400px] flex-col flex-1 border-r border-r-gray-300 md:ml-0 ml-16 border-l border-l-gray-300`}>
            <div className='border-b border-b-gray-300 px-4 py-4'>
                <h1 className='text-gray-900 text-xl font-semibold ml-2 mb-1'>Profile</h1>
            </div>
            <div className='flex items-center flex-col border-b border-b-gray-300 py-4'>
                <label htmlFor="profilePic">
                    <img
                        alt="Profile"
                        src={`${profile.profilePic === "" ? 'https://cdn-icons-png.flaticon.com/128/847/847969.png' : profile.profilePic}`}
                        className="h-20 w-20 object-cover mb-2 rounded-full cursor-pointer"
                    />
                </label>
                <input type="file" name='profilePic' id='profilePic' className='hidden' accept='image/*' onChange={(e) => handleUpload(e.target.files[0])} />
                <h2 className='text-gray-900 text-lg font-semibold'>{profile.username}</h2>
                <h3 className='text-gray-900 text-base'>{profile.email}</h3>
            </div>

            <div className='flex border-b-gray-300 border-b'>
                <div className='flex items-center justify-center cursor-pointer hover:bg-gray-100 w-full py-2 px-4 border-r border-r-gray-300' onClick={() => setRequest(true)}>
                    <h1 className='text-gray-900 text-base'>Requets</h1>
                </div>
                <div className='flex items-center justify-center cursor-pointer hover:bg-gray-100 w-full py-2 px-4' onClick={() => setRequest(false)}>
                    <h1 className='text-gray-900 text-base'>Friends</h1>
                </div>
            </div>

            {request ? <RequestList /> : <FriendList />}
        </div>
    )
}

export default Profile
