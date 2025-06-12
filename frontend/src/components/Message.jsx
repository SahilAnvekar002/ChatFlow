// Message component
import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react'
import { BiDotsVertical } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../redux/slices/messageSlice';
import { updateChat } from '../redux/slices/chatSlice';
import socket from '../socket';
import { decryptMessage } from '../utils/encryption';

function Message({ message }) {

    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [open, setOpen] = useState(false);

    // remove message from db and messages state and set latest message if exist
    const deleteMessage = async () => {
        const res = await axios.post(`${baseURI}/messages/${message._id}`, null,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
                validateStatus: () => true
            });
        if (res.data.status === 'success') {
            dispatch(removeMessage(res.data.payload.deletedMessage));
            socket.emit('delete message', res.data.payload.deletedMessage, res.data.payload.latestMessage);
            if (res.data.payload.latestMessage) {
                dispatch(updateChat(res.data.payload.latestMessage));
            }
        }
    }

    return (
        <div className={`relative flex flex-col w-fit ${message.sender._id === user._id ? 'bg-gray-700' : 'bg-[#ededed]'} py-2 pl-4 pr-8 rounded-md mb-2 shadow-md ${message.sender._id === user._id ? 'ml-12 self-end' : 'mr-12'}`} key={message._id}>
            <h2 className={`${message.sender._id === user._id ? 'text-white' : 'text-gray-900'} text-sm font-semibold`}>{message.sender.username}</h2>
            <h3 className={`${message.sender._id === user._id ? 'text-white' : 'text-gray-900'} text-sm mb-1`}>{decryptMessage(message.content)}</h3>
            <span className={`${message.sender._id === user._id ? 'text-gray-400' : 'text-gray-500'} text-xs text-right`}>{moment(message.createdAt).format('hh:mm A')}</span>
            {message.sender._id === user._id && <button className='absolute top-1 right-1'><BiDotsVertical size={14} className='text-gray-300 cursor-pointer' onClick={() => setOpen(!open)} /></button>}
            {open && (<>
                {/* Fullscreen invisible blocker */}
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />

                {/* Delete button near three dots */}
                <button
                    className="absolute top-2 right-4 z-50 px-4 py-2 bg-red-500 text-sm text-white cursor-pointer"
                    onClick={() => deleteMessage()}
                >
                    Delete
                </button>
            </>)}
        </div>
    )
}

export default Message
