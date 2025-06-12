// Login page
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { toast } from 'react-toastify';
import { setUser } from '../redux/slices/authSlice';
import socket from '../socket'

function LoginPage() {
    
    const baseURI = process.env.REACT_APP_API_URI;

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // form data
    const [info, setInfo] = useState({
        email: "",
        password: ""
    })

    // save user to state and localstorage and redirect to home if credentials are valid
    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await axios.post(`${baseURI}/auth/login`, info, {
            validateStatus: () => true
        });

        if (res.data.status === 'error') {
            toast.error(res.data.payload);
        } else {
            socket.emit('setup', res.data.payload);
            dispatch(setUser(res.data.payload))
            localStorage.setItem('user', JSON.stringify(res.data.payload))
            toast.success("Logged into account successfully");
            navigate('/');
        }

        setInfo({
            email: "",
            password: ""
        });
    }

    return (
        <div className="flex min-h-[100vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="ChatFlow Logo"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=gray-900"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-6 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    Log into your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm lg:max-w-lg">
                <form className="space-y-6" onSubmit={(e)=>handleLogin(e)}>
                    <div>
                        <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={info.email}
                                onChange={(e)=>setInfo({...info, email:e.target.value})}
                                required
                                autoComplete="email"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 border-1 border-gray-300 focus:border-gray-900 outline-none sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={info.password}
                                onChange={(e)=>setInfo({...info, password:e.target.value})}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 border-1 border-gray-300 focus:border-gray-900 outline-none sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-gray-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black cursor-pointer"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?{' '}
                    <Link to="/signup" className="font-semibold text-gray-900">
                        Signup Now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
