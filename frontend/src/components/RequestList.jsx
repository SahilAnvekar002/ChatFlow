// RequestList component
import axios from 'axios';
import React from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import { FcCancel } from 'react-icons/fc'
import { useDispatch, useSelector } from 'react-redux';
import { acceptRequest, declineRequest } from '../redux/slices/userSlice';
import { toast } from 'react-toastify'
import { addChat } from '../redux/slices/chatSlice';

function RequestList() {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const requests = useSelector((state) => state.user.requests);
    const user = useSelector((state) => state.auth.user);

    // accept friend request, add user to friends and create new chat if does not exist
    const acceptFriendRequest = async (id) => {
        const res = await axios.post(`${baseURI}/users/accept/${id}`, null, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });
        if (res.data.status === 'success') {
            dispatch(acceptRequest(res.data.payload.acceptedUser));
            toast.success("Request accepted successfully");
            if(res.data.payload.result){
                dispatch(addChat(res.data.payload.result));
            }
        }
    }

    // decline friend request and remove user from requests
    const declineFriendRequest = async (id) => {
        const res = await axios.post(`${baseURI}/users/decline/${id}`, null, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });
        if (res.data.status === 'success') {
            dispatch(declineRequest(res.data.payload.acceptedUser));
            toast.success("Request declined successfully");
        }
    }

    return (
        <div className='flex flex-col items-start py-2'>
            {requests?.length > 0 ? requests?.map((request) => {
                return (
                    <div className='flex items-center justify-between w-full py-2 px-4 mb-1' key={request._id}>
                        <div className='flex'>
                            <img
                                alt="Profile"
                                src="https://cdn-icons-png.flaticon.com/128/847/847969.png"
                                className="h-10 w-auto rounded-full"
                            />
                            <div className='mx-4'>
                                <h2 className='text-gray-900 text-md'>{request.username}</h2>
                                <h3 className='text-gray-600 text-sm'>{request.email}</h3>
                            </div>
                        </div>
                        <div className='flex mr-4'>
                            <button className='cursor-pointer mr-1'><BiCheckCircle className='text-gray-900' size={22} onClick={() => acceptFriendRequest(request._id)} /></button>
                            <button className='cursor-pointer'><FcCancel className='text-gray-900' size={24} onClick={()=>declineFriendRequest(request._id)}/></button>
                        </div>
                    </div>
                )
            }) : <h1 className='mx-auto my-20'>No Requests</h1>
            }
        </div>
    )
}

export default RequestList
