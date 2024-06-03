import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from '../image/logo.png';
const URL = "http://localhost:8800/api/admin_details/admin/login";

const AdminLogin = () => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });
    const navigate = useNavigate();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
    };
    const handleStudentLogin = () => {
        navigate('/login');
    }
    const handleResetPassword = () => {
        navigate("/resetAdminPassword");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const responseData = await response.json();
            console.log("response", responseData);

            if (response.ok) {
                setUser({ username: "", password: "" });
                localStorage.setItem("userId", responseData.userId);
                toast.success("Login Successful");
                
                if (responseData.position === 'supervisor') {
                    navigate("/allAdmin");
                } else if (responseData.position === 'hod') {
                    navigate("/admin");
                }
                 else if (responseData.position === 'adean') {
                    navigate("/adean");
                }
                 else if (responseData.position === 'dean') {
                    navigate("/dean");
                }
                 else if (responseData.position === 'sectionhead') {
                    navigate("/sectionhead");
                }
                 else if (responseData.position === 'aregistrar') {
                    navigate("/aregistrar");
                }
                 else if (responseData.position === 'draccounts') {
                    navigate("/draccountant");
                }
            } else {
                toast.error(responseData.message ? responseData.message : "Invalid Credentials");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
        
    };
    

    return (
        <div className='login-container'>
            <div className='login-top'>National Institute of Technology Srinagar</div>
            <div className='login-container-wrapper'>
                <div className='login-container-2'>
                    <img src={logo} alt="Logo" />
                    <h1>Scholarship Portal</h1>
                    <h3>Sign In</h3>
                    <form onSubmit={handleSubmit}>
                        <div className='login-container-3'>
                            <label htmlFor="username">Username</label>
                            <input 
                              type='text' 
                              name='username'
                              id='username'
                              placeholder='Username'
                              required
                              value={user.username}
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
                        </div>
                        <button id='login-btn' type='submit' className='btn'>Submit</button>
                        <div className='Lower-buttons'>
                            <button className='forget-password' onClick={handleResetPassword}>Reset Password</button>
                            <button className='forget-password' onClick={handleStudentLogin}>Student Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
