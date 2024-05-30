import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../image/logo.png';
const URL = "http://localhost:8800/api/auth/changePassword";

const PasswordForm = (props) => {
    const [user, setUser] = useState({
        otpCode: "",
        password: "",
        cpassword: ""
    });
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (user.password !== user.cpassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const responseData = await response.json();

            if (response.ok) {
                navigate("/login");
                toast.success("Password Change Successful");
                localStorage.setItem("userId", responseData.userId);
            } else {
                toast.error(responseData.message || "Invalid Credentials");
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error("An error occurred while changing password");
        }
    };

    return (
        <div className='login-container'>
            <div className='login-top'>National Institute of Technology Srinagar</div>
            <div className='login-container-wrapper'>
                <div className='login-container-2'>
                    <img src={logo} alt="Logo" />
                    <h1>Scholarship Portal</h1>
                    <h3>OTP verify</h3>
                    <form onSubmit={handleSubmit}>
                        <div className='login-container-3'>
                            <label htmlFor="otpCode">OTP Code</label>
                            <input
                                type='text'
                                name='otpCode'
                                id='otpCode'
                                placeholder='OTP Code'
                                required
                                maxLength={4}
                                value={user.otpCode}
                                onChange={handleInput}
                            />
                            <label htmlFor="password">Password</label>
                            <input
                                type='password'
                                name='password'
                                placeholder='Password'
                                id='password'
                                required
                                value={user.password}
                                onChange={handleInput}
                            />
                            <label htmlFor="cpassword">Confirm Password</label>
                            <input
                                type='password'
                                name='cpassword'
                                placeholder='Confirm Password'
                                id='cpassword'
                                required
                                value={user.cpassword}
                                onChange={handleInput}
                            />
                        </div>
                        <button id='login-btn' type='submit' className='btn'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PasswordForm;
