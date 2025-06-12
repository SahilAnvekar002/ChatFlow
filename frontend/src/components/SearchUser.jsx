// SearchUser component
import React, { useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { CgRemove, CgTime } from 'react-icons/cg'
import { GrAddCircle } from 'react-icons/gr'
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify'
import { addRequest, deleteFriend } from '../redux/slices/userSlice'

function SearchUser({ui, isOpen}) {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const requests = useSelector((state) => state.user.requests);
    const sentRequests = useSelector((state) => state.user.sentRequests);
    const friends = useSelector((state) => state.user.friends);

    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");

    /*useEffect(() => {
      
    }, [requests, friends, sentRequests])*/
    
    // fetch all users with given query and set users state
    const fetchUsers = async () => {
        const res = await axios.get(`${baseURI}/users/search?query=${query.trim()}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });
        if (res.data.status === 'error') {
            toast.error(res.data.payload);
        } else {
            setUsers(res.data.payload);
        }
    }

    // send friend request and add user to sent requests
    const sendRequest = async(id) => {
        const res = await axios.post(`${baseURI}/users/request/${id}`, null, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });
        if(res.data.status === 'success'){
            dispatch(addRequest(res.data.payload));
            toast.success("Request sent successfully");
        }
    }

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
        <div className={`${ui === 'searchuser'? 'flex': 'hidden'} ${isOpen? 'md:hidden':'md:flex'} flex flex-col h-full w-[400px] xl:w-96 border-r border-r-gray-300 border-l border-l-gray-300 xl:ml-0 ml-16 xl:border-l-0`}>
            <div className='border-b border-b-gray-300 px-4 py-4'>
                <h1 className='text-gray-900 text-xl font-semibold ml-2 mb-1'>Search</h1>
            </div>
            <div className='flex flex-col items-start py-4 px-4'>
                <form className='flex w-full'>
                    <input type="text" name='search' id='search' placeholder='Search User' className='rounded-md border-1 border-gray-300 outline-none py-1 px-4 placeholder:text-gray-600 mr-2 flex-1' value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button type='button' className='cursor-pointer'><BiSearch size={24} className='text-gray-900' onClick={fetchUsers} /></button>
                </form>

                <div className='flex flex-col items-start w-full py-4'>
                    {users?.length > 0 ? users?.map((user) => {
                        return (
                            <div className='flex items-center justify-between w-full py-2 px-4 mb-1' key={user._id}>
                                <div className='flex'>
                                    <img
                                        alt="Profile"
                                        src="https://cdn-icons-png.flaticon.com/128/847/847969.png"
                                        className="h-10 w-auto rounded-full"
                                    />
                                    <div className='mx-4'>
                                        <h2 className='text-gray-900 text-md'>{user.username}</h2>
                                        <h3 className='text-gray-600 text-sm'>{user.email}</h3>
                                    </div>
                                </div>
                                {friends && friends.filter(fr => fr._id === user._id).length > 0 && <button className='mr-4 cursor-pointer'><CgRemove className='text-gray-900' size={22} onClick={()=>removeFriend(user._id)}/></button>}

                                {(requests.filter(rq => rq._id === user._id).length > 0 || sentRequests.filter(rq => rq._id === user._id).length > 0 ) && <button className='mr-4'><CgTime className='text-gray-900' size={22} /></button>}

                                {friends.filter(fr => fr._id === user._id).length === 0 && requests.filter(rq => rq._id === user._id).length === 0 && sentRequests.filter(rq => rq._id === user._id).length === 0 && <button className='mr-4 cursor-pointer' onClick={() => sendRequest(user._id)}><GrAddCircle className='text-gray-900' size={22} /></button>}
                            </div>
                        )
                    }) : <h1 className='my-24 mx-auto'>No Users Found</h1>}

                </div>
            </div>
        </div>
    )
}

export default SearchUser
