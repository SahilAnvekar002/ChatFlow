// ChatBox component
import React, { useEffect, useRef, useState } from 'react'
import { BiDotsVertical, BiSend } from 'react-icons/bi'
import InputEmoji from 'react-input-emoji'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { addMessage, removeMessage } from '../redux/slices/messageSlice'
import { updateChat } from '../redux/slices/chatSlice'
import Message from './Message'
import socket from '../socket';
import { encryptMessage } from '../utils/encryption'

function ChatBox({isOpen, ui}) {

    const baseURI = process.env.REACT_APP_API_URI; // base uri i.e localhost:5000/api

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const friends = useSelector((state) => state.user.friends);
    const messages = useSelector((state) => state.message.messages);
    const chat = useSelector((state) => state.message.chat);

    const [newMessage, setNewMessage] = useState("");

    const chatRef = useRef(chat);
    const bottomRef = useRef(null);

    // scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chat, messages])

    // set current chat
    useEffect(() => {
        chatRef.current = chat;
    }, [chat]);

    // message received or deleted
    useEffect(() => {
        // if new message has current chat id, add message and set latest message, else send notification
        const handler = (newMessageReceived) => {
            const currentChat = chatRef.current;
            if (newMessageReceived.chat._id === currentChat._id) {
                dispatch(addMessage(newMessageReceived));
                dispatch(updateChat(newMessageReceived));
            } else {
                let audio = new Audio('/notification.mp3');
                audio.play();
                dispatch(updateChat(newMessageReceived));
            }
        };

        // remove deleted message from messages and update latest message if exist
        const handler2 = (...args) => {
            const [deletedMessage, latestMessage] = args;
            if(latestMessage){
                dispatch(updateChat(latestMessage));
            }
            dispatch(removeMessage(deletedMessage));
        };

        socket.on('message received', handler);
        socket.on('message deleted', handler2);

        // clean up
        return () => {
            socket.off('message received', handler);
            socket.off('message deleted', handler2);
        };

    }, [dispatch]);

    // send message, add it to messages and set latest message 
    const sendMessage = async () => {
        const encrypted =  encryptMessage(newMessage); // encrypt message
        const res = await axios.post(`${baseURI}/messages`,
            {
                content: encrypted,
                chatId: chat._id
            },
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                validateStatus: () => true
            });
        if (res.data.status === 'success') {
            dispatch(addMessage(res.data.payload));
            dispatch(updateChat(res.data.payload));
            socket.emit('new message', res.data.payload);
        }
        setNewMessage("");
    }

    if (Object.keys(chat).length === 0) {
        return (
            <div className={`${ui === 'chatbox' ? 'flex': 'hidden'} ${isOpen ? 'md:flex': 'md:hidden'} xl:flex flex-col justify-center items-center w-[550px] xl:w-[480px] 2xl:w-[550px] border-r border-r-gray-300 md:ml-0 ml-8`}>
                <h1 className='font-semibold text-xl'>No chat selected</h1>
            </div>
        )
    }
    return (
        <div className={`${ui === 'chatbox' ? 'flex': 'hidden'} ${isOpen ? 'md:flex': 'md:hidden'} xl:flex flex-col w-[550px] xl:w-[480px] 2xl:w-[550px] border-r border-r-gray-300 md:ml-0 ml-8`}>
            <div className='flex items-center justify-between border-b border-b-gray-300 w-full py-2 px-4'>
                <div className='flex items-center'>
                    <img
                        alt="Profile"
                        src="https://cdn-icons-png.flaticon.com/128/847/847969.png"
                        className="h-12 w-auto rounded-full"
                    />
                    <div className='mx-4'>
                        <h2 className='text-gray-900 text-base font-semibold'>{chat.isGroupChat ? chat.chatName : chat.users.filter(u => u._id !== user._id)[0].username}</h2>
                        <h3 className='text-gray-600 text-sm '>{chat.isGroupChat ? "" : chat.users.filter(u => u._id !== user._id)[0].email}</h3>
                    </div>
                </div>
                <BiDotsVertical size={22} className='text-gray-500 cursor-pointer' />
            </div>

            <div className='flex flex-col px-4 py-4 bg-white h-[85vh] overflow-y-scroll'>
                {messages?.map((message) => {
                    return (
                        <Message message={message} key={message._id}/>
                    )
                })}
                <div ref={bottomRef}></div>
            </div>

            <div className='pb-4 px-4'>
                {friends.filter(fr => fr._id === chat.users.filter(u => u._id !== user._id)[0]._id).length > 0 &&
                    <form className='flex'>
                        <InputEmoji
                            value={newMessage}
                            onChange={setNewMessage}
                            cleanOnEnter
                            placeholder="Type a message"
                        />
                        <button type='button' className='cursor-pointer disabled:cursor-default disabled:opacity-50' disabled={newMessage.trim() === ""}>
                            <BiSend className='text-gray-600' size={28} onClick={() => sendMessage()} />
                        </button>
                    </form>
                }
            </div>
        </div>
    )
}

export default ChatBox
