// Home page
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatList from '../components/ChatList'
import ChatBox from '../components/ChatBox'
import Profile from '../components/Profile'
import SearchUser from '../components/SearchUser'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setChats } from '../redux/slices/chatSlice'
import { setFriends, setProfile, setRequests, setSentRequests } from '../redux/slices/userSlice'
import socket from '../socket'

function HomePage() {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    
    const navigate = useNavigate();

    const [chat, setChat] = useState(true);
    const [ui, setUi] = useState("chatlist");

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchChats();
            fetchProfile();
            fetchRequests();
            fetchSentRequests();
            fetchFriends();
            socket.emit('setup', user);
            socket.on('connected', () => {
                console.log('✅ Socket connected');
            });
        }

    }, [user])

    // fetch all user chats
    const fetchChats = async () => {
        const res = await axios.get(`${baseURI}/chats`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });

        dispatch(setChats(res.data.payload));
    }

    // fetch user data
    const fetchProfile = async () => {
        const res = await axios.get(`${baseURI}/users/profile`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });

        dispatch(setProfile(res.data.payload));
    }

    // fetch all user requests
    const fetchRequests = async () => {
        const res = await axios.get(`${baseURI}/users/requests`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });

        dispatch(setRequests(res.data.payload));
    }

    // fetch all user sent requests
    const fetchSentRequests = async () => {
        const res = await axios.get(`${baseURI}/users/sent-requests`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });

        dispatch(setSentRequests(res.data.payload));
    }

    // fetch all user friends
    const fetchFriends = async () => {
        const res = await axios.get(`${baseURI}/users/friends`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });

        dispatch(setFriends(res.data.payload));
    }

    return (
        <div className="flex h-screen">
            <div className='flex w-full'>
                <Sidebar setChat={setChat} setUi={setUi}/>
                <ChatList ui={ui} setUi={setUi} isOpen={chat}/> 
                <SearchUser ui={ui} isOpen={chat}/>
                <ChatBox isOpen={chat} ui={ui}/>
                <Profile isOpen={chat} ui={ui}/>
            </div>
        </div>

    )
}

export default HomePage
