import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import logo from '../image/logo.png';
const URL = "http://localhost:8800/api/auth/changePassword";

const PasswordForm = () => {
    const [user, setUser] = useState({
        otpCode: "",
        password: "",
        cpassword: ""
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || {};

    const handleInput = (e) => {
        let name = e.target.name;
        let value = e.target.value;

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
                body: JSON.stringify({ ...user, email }),
            });
            const responseData = await response.json();
            console.log("response for changePass", responseData);
            if(response.ok) {
                navigate("/login");
                toast.success("Password Change Successful");
                localStorage.setItem("userId", responseData.userId);
            } else {
                toast.error(responseData.msg ? responseData.msg : "Invalid Credentials");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='login-container'>
            <div className='login-top'>National Institute of Technology Srinagar</div>
            <div className='login-container-wrapper'>
                <div className='login-container-2'>
                    <img src={logo} alt="Logo"></img>
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
                              maxLength={"4"}
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
                        <button id='login-btn' type='submit' className='btn' >Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default PasswordForm;
