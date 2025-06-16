import axios from 'axios';
import React, { useState } from 'react'
import { CgClose } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addChat } from '../redux/slices/chatSlice';
import socket from '../socket';

function CreateGroupModal({ setModal }) {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const friends = useSelector((state) => state.user.friends);
    const user = useSelector((state) => state.auth.user);

    const [members, setMembers] = useState([]);
    const [groupName, setGroupName] = useState("");

    const handleCheck = (checked, id) => {
        if (checked && !members.includes(id)) {
            setMembers([...members, id]);
        } else if (!checked && members.includes(id)) {
            setMembers(members.filter(member => member !== id));
        }
    }

    const createGroup = async () => {
        const res = await axios.post(`${baseURI}/chats/group`, { users: members, chatName: groupName},
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                validateStatus: () => true
            });
        if(res.data.status === 'error'){
            toast.error(res.data.payload);
        }else{
            toast.success("Group has been created successfully");
            dispatch(addChat(res.data.payload));
            socket.emit('new friend', res.data.payload, user._id);
        }
        setModal(false);
    }

    return (
        <div className='relative shadow-md py-6 px-10 rounded-sm min-w-[600px] min-h-[600px] bg-white z-50'>
            <h1 className='font-semibold text-xl mb-6'>Create new Group</h1>
            <div className='mb-4'>
                <label htmlFor="gname" className="text-sm font-medium text-gray-900">
                    Group Name
                </label>
                <input
                    id="gname"
                    name="gname"
                    type="text"
                    value={groupName}
                    onChange={(e)=>setGroupName(e.target.value)}
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 border-1 border-gray-300 focus:border-gray-900 outline-none sm:text-sm/6 mt-2"
                />
            </div>
            <h2 className='text-base font-medium text-gray-900 mb-4'>Select group members</h2>
            <div className='h-[300px] overflow-y-scroll mb-6'>
                {friends?.length > 0 ? friends?.map((friend) => {
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
                }) : <h1 className='mx-auto my-20'>No Friends</h1>}
            </div>
            <button className='bg-gray-900 text-white rounded-md px-6 py-2 cursor-pointer' onClick={() => createGroup()}>Create Group</button>

            <button className='absolute top-3 right-3 cursor-pointer' onClick={() => setModal(false)}>
                <CgClose size={20} />
            </button>
        </div>
    )
}

export default CreateGroupModal
