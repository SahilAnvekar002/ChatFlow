// App.js root component
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

function App() {

    const dispatch = useDispatch();

    const [rehydrated, setRehydrated] = useState(false);

    // fetch user from localstorage and set to state if it is valid else navigate to /login
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            const decoded = jwtDecode(storedUser.token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime){
                localStorage.removeItem('user');
                dispatch(setUser(null));
            }else{
                dispatch(setUser(storedUser));
            }
        }
        setRehydrated(true);
    }, [dispatch]);

    if (rehydrated) {
        return (
            <BrowserRouter>
                <ToastContainer
                    position='top-center'
                    autoClose={2000}
                />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/signup' element={<SignupPage />} />
                </Routes>
            </BrowserRouter>
        );
    }
}

export default App;
