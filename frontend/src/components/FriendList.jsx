// FriendList component
import axios from 'axios';
import React from 'react'
import { CgRemove } from 'react-icons/cg'
import { useDispatch, useSelector } from 'react-redux'
import { deleteFriend } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

function FriendList() {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const friends = useSelector((state) => state.user.friends);

    // remove friend from db and friends state
    const removeFriend = async(id) => {
        const res = await axios.post(`${baseURI}/users/remove-friend/${id}`, null, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });
        if(res.data.status === 'success'){
            dispatch(deleteFriend(res.data.payload));
            toast.success("Friend removed successfully");
        }
    }

    return (
        <div className='flex flex-col items-start py-2'>
            {friends?.length > 0 ? friends?.map((friend) => {
                return (
                    <div className='flex items-center justify-between w-full py-2 px-4 mb-1' key={friend._id}>
                        <div className='flex'>
                            <img
                                alt="Profile"
                                src="https://cdn-icons-png.flaticon.com/128/847/847969.png"
                                className="h-10 w-auto rounded-full"
                            />
                            <div className='mx-4'>
                                <h2 className='text-gray-900 text-md'>{friend.username}</h2>
                                <h3 className='text-gray-600 text-sm'>{friend.email}</h3>
                            </div>
                        </div>
                        <button className='mr-4 cursor-pointer'><CgRemove className='text-gray-900' size={22} onClick={()=>removeFriend(friend._id)}/></button>
                    </div>
                )
            }):<h1 className='mx-auto my-20'>No Friends</h1>}
        </div>
    )
}

export default FriendList
