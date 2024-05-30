import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import PasswordForm from './PasswordForm';
const URL = "http://localhost:8800/api/auth/emailSend"; // Update this URL accordingly

const Reset = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const [otpForm, showForm] = useState(true);

    const handleInput = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            // let options = {
            //     method:'POST',
            //     url:URL,
            //     data:{email:email}
            // }
            const responseData = await response.json();
            console.log("responseData", responseData);
            if(response.ok) {
                toast.success(responseData.msg? responseData.msg: "error");
                showForm(false);
                // navigate("/login");
            } else {
                toast.error(responseData.msg ? responseData.msg : "Error sending reset link");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='reset-password-container'>
            <h1>Reset Password</h1>
            {otpForm? <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={handleInput}
                />
                <button type="submit" >Send OTP</button>
            </form> : <PasswordForm email={email}/>}
        </div>
    );
};

export default Reset;
