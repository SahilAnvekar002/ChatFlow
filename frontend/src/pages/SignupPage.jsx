// Signup page
import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

function SignupPage() {

    const baseURI = process.env.REACT_APP_API_URI;

    const navigate = useNavigate();

    // form data
    const [info, setInfo] = useState({
        username: "",
        email: "",
        password: "",
        cpassword: ""
    })

    // create new user and navigate to /login if given info is valid
    const handleSignup = async (e) => {
        e.preventDefault();
        if (info.cpassword !== info.password) {
            toast.error("Passwords does not match");
            return;
        }

        const res = await axios.post(`${baseURI}/auth/register`, {
            username: info.username,
            email: info.email,
            password: info.password
        }, {
            validateStatus: () => true
        })

        if (res.data.status === 'error') {
            toast.error(res.data.payload);
        } else {
            toast.success("Account created successfully");
            navigate('/login');
        }

        setInfo({
            username: "",
            email: "",
            password: "",
            cpassword: ""
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
                    Create a new account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm lg:max-w-lg">
                <form className="space-y-6" onSubmit={(e) => handleSignup(e)}>
                    <div>
                        <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={info.username}
                                onChange={(e) => setInfo({ ...info, username: e.target.value })}
                                required
                                autoComplete="username"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 border-1 border-gray-300 focus:border-gray-900 outline-none sm:text-sm/6"
                            />
                        </div>
                    </div>
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
                                onChange={(e) => setInfo({ ...info, email: e.target.value })}
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
                                onChange={(e) => setInfo({ ...info, password: e.target.value })}
                                required
                                autoComplete="current-password"
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-800 border-1 border-gray-300 focus:border-gray-900 outline-none sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="cpassword" className="block text-sm/6 font-medium text-gray-900">
                                Confirm Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="cpassword"
                                name="cpassword"
                                type="password"
                                value={info.cpassword}
                                onChange={(e) => setInfo({ ...info, cpassword: e.target.value })}
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
                    Already a member?{' '}
                    <Link to="/login" className="font-semibold text-gray-900">
                        Login Now
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default SignupPage