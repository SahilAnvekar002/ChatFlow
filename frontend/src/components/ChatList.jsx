// ChatList component
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment';
import axios from 'axios';
import { setMessages } from '../redux/slices/messageSlice';
import socket from '../socket';
import { decryptMessage} from '../utils/encryption';
import { addOnline, removeOnline } from '../redux/slices/userSlice';
import { GoDotFill } from "react-icons/go";

function ChatList({ui, setUi, isOpen}) {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const chats = useSelector((state) => state.chat.chats);
    const online = useSelector((state) => state.user.online);

    useEffect(() => {
      socket.on('user-online', (userId)=>{
        dispatch(addOnline(userId));
      })

      socket.on('user-offline', (userId)=>{
        dispatch(removeOnline(userId));
      })

      return ()=>{
        socket.off('user-online');
        socket.off('user-offline');
      }
    }, [])
    

    // fetch chat messages and set messages state
    const fetchChatMessages = async (id) => {
        const res = await axios.get(`${baseURI}/messages/${id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            validateStatus: () => true
        });
        dispatch(setMessages(res.data.payload));
        socket.emit('join chat', id);
        setUi('chatbox');
    }

    return (
        <aside className={`${ui === 'chatlist'? 'flex': 'hidden'} ${isOpen? 'md:flex':'md:hidden'} flex flex-col h-full w-[400px] xl:w-96 border-r border-r-gray-300 border-l border-l-gray-300 xl:ml-0 ml-16 xl:border-l-0`}>
            <div className='border-b border-b-gray-300 px-4 py-4'>
                <h1 className='text-gray-900 text-xl font-semibold ml-2 mb-1'>Chats</h1>
            </div>
            <div className='flex flex-col items-start py-4 px-4'>
                <div className='flex flex-col items-start w-full overflow-y-scroll'>
                    {chats?.map((chat) => {
                        return (
                            <div className='relative flex cursor-pointer justify-between hover:bg-gray-100 w-full py-4 px-4' key={chat?._id} onClick={()=>fetchChatMessages(chat._id)}>
                                <div className='flex items-center'>
                                    <img
                                        alt="Profile"
                                        src={chat.isGroupChat || chat.users.filter(u => u._id !== user._id)[0].profilePic === "" ?  'https://cdn-icons-png.flaticon.com/128/847/847969.png': chat.users.filter(u => u._id !== user._id)[0].profilePic}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <div className='mx-4'>
                                        <h2 className='text-gray-900 text-md'>{chat.isGroupChat ? chat.chatName : chat.users.filter(u => u._id !== user._id)[0].username}</h2>
                                        <h3 className='text-gray-600 text-sm'>{chat?.latestMessage?.content ? decryptMessage(chat?.latestMessage.content).slice(0,25) : "No messages"}</h3>
                                        {chat.isGroupChat || !online.includes(chat.users.filter(u => u._id !== user._id)[0]._id) ? '' : <GoDotFill className='absolute right-0 top-0' size={20} color='green' /> }
                                        
                                    </div>
                                </div>
                                <span className='text-gray-900 text-xs'>{chat?.latestMessage?.createdAt ? moment(chat?.latestMessage.createdAt).format('hh:mm A') : ''}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </aside>
    )
}

export default ChatList
