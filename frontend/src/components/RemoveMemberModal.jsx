import axios from 'axios';
import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import socket from '../socket';
import { removeMembers } from '../redux/slices/chatSlice';
import { removeFromMessageChat } from '../redux/slices/messageSlice';

function RemoveMemberModal({ setModal, chat }) {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [members, setMembers] = useState([]);

    const handleCheck = (checked, id) => {
        if (checked && !members.includes(id)) {
            setMembers([...members, id]);
        } else if (!checked && members.includes(id)) {
            setMembers(members.filter(member => member !== id));
        }
    }

    const removeFromGroup = async () => {
        const res = await axios.post(`${baseURI}/chats/group/remove`, {chatId: chat._id , users: members },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                validateStatus: () => true
            });
        if(res.data.status === 'error'){
            toast.error(res.data.payload);
        }else{
            toast.success("members have been removed from Group successfully");
            dispatch(removeMembers(res.data.payload));
            dispatch(removeFromMessageChat(res.data.payload));
            socket.emit('remove member', res.data.payload, members); 
        }
        setModal(false);
    }

    return (
        <div className='relative shadow-md py-6 px-10 rounded-sm min-w-[600px] min-h-[600px] bg-white z-50'>
            <h1 className='font-semibold text-xl mb-6'>Remove members from Group</h1>
            <h2 className='text-base font-medium text-gray-900 mb-4'>Select group members</h2>
            <div className='h-[300px] overflow-y-scroll mb-6'>
                {chat.users.filter(u=> u._id !== user._id).filter(u=> !chat.removedUsers.includes(u._id)).length > 0 ? chat.users.filter(u=> u._id !== user._id).filter(u=> !chat.removedUsers.includes(u._id))?.map((friend) => {
                    return (
                        <div className='flex items-center justify-between w-full py-2 px-4 mb-1' key={friend._id}>
                            <div className='flex'>
                                <img
                                    alt="Profile"
                                    src={friend.profilePic === "" ? 'https://cdn-icons-png.flaticon.com/128/847/847969.png' : friend.profilePic}
                                    className="h-10 w-10 rounded-full"
                                />
                                <div className='mx-4'>
                                    <h2 className='text-gray-900 text-md'>{friend.username}</h2>
                                    <h3 className='text-gray-600 text-sm'>{friend.email}</h3>
                                </div>
                            </div>
                            <div className='flex mr-4'>
                                <input type="checkbox" value={friend._id} onChange={(e) => handleCheck(e.target.checked, friend._id)} />
                            </div>
                        </div>
                    )
                }) : <h1 className='mx-auto my-20'>No Members</h1>}
            </div>
            <button className='bg-gray-900 text-white rounded-md px-6 py-2 cursor-pointer' onClick={() => removeFromGroup()}>Remove from Group</button>

            <button className='absolute top-3 right-3 cursor-pointer' onClick={() => setModal(false)}>
                <CgClose size={20} />
            </button>
        </div>
    )
}

export default RemoveMemberModal
