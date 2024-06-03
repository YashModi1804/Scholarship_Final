import React, { useState } from 'react';
import logo from '../image/logo.png';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
// import { toast } from "react-toastify";
const URL = "http://localhost:8800/api/auth/signup";

const Register = () => {
    const [user, setUser] = useState({
        name: "",
        enrollment: "",
        email:"",
        username: "",
        password: "",
    });

    const navigate = useNavigate();
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
        // console.log(user);
        
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const responseData = await response.json();
            console.log("response : ", response);

            if(response.ok) {
                setUser({name: "", enrollment: "", username: "", password: ""});
                toast.success("Registration Successful");
                navigate("/");
            } else {
                toast.error(responseData.message? responseData.message: "Fill the Input properly")
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='login-container'>
            <div className='login-top'>National Institute of Technology Srinagar</div>
            <div className='login-container-wrapper'>
                <div className='login-container-2' id="register-cont">
                    <img src={logo} alt="Logo" />
                    <h1>Registration Form</h1>
                    <form onSubmit={handleSubmit} >
                        <div className='login-container-3'>
                            {/* <div className="input-group">
                                <label htmlFor="role">Role</label>
                                <select id="role" className='login-Drop-box'>
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div> */}
                            {/* <div className="input-group"> */}
                                <label className='login-label' htmlFor="name">Name</label>
                                <input 
                                className='login-input'
                                    type='text' 
                                    name='name'
                                    id='name'
                                    placeholder='Name'
                                    value={user.name}
                                    required
                                    onChange={handleInput}
                                />
                            {/* </div> */}
                            {/* <div className="input-group"> */}
                                <label className='login-label' htmlFor="enrollment">Enrollment</label>
                                <input 
                                    className='login-input'
                                    type='text' 
                                    name='enrollment'
                                    id="enrollment" 
                                    placeholder='Enrollment'
                                    required
                                    value={user.enrollment}
                                    onChange={handleInput}
                                />
                                <label className='login-label' htmlFor="enrollment">Email</label>
                                <input 
                                    className='login-input'
                                    type='text' 
                                    name='email'
                                    id="email" 
                                    placeholder='email'
                                    required
                                    value={user.email}
                                    onChange={handleInput}
                                />

                            {/* </div> */}
                            {/* <div className="input-group"> */}
                                <label className='login-label' htmlFor="username">Username</label>
                                <input 
                                className='login-input'
                                    type='text' 
                                    name='username'
                                    id="username"
                                    placeholder='Username'
                                    required
                                    value={user.username}
                                    onChange={handleInput}
                                />
                            {/* </div> */}
                            {/* <div className="input-group"> */}
                                <label className='login-label' htmlFor="password">Password</label>
                                <input 
                                className='login-input'
                                    type='password' 
                                    id='password'
                                    name='password'
                                    placeholder='Password'
                                    required
                                    value={user.password}
                                    onChange={handleInput}
                                />
                            {/* </div> */}
                        </div>                 
                        <button id='login-btn' type='submit' className='submit btn'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Register;
