import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const URL = "http://localhost:8800/api/admin_details/emailSendAdmin"; // Update this URL accordingly

const ResetAdminPassword = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

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
            const responseData = await response.json();
            console.log("responseData", responseData);
            if (response.ok) {
                toast.success(responseData.msg ? responseData.msg : "OTP sent successfully"); 
                if(responseData.msg==="Check your email id"? navigate('/passwordForm'): navigate('/resetAdminPassword'));
            } else {
                toast.error(responseData.msg ? responseData.msg : "Error sending reset link");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='reset-password-container'>
            <div className='login-top'>National Institute of Technology Srinagar</div>
            <div className="reset-content">
                <div className="reset-content-main">
                    <div className='reset-top'>Reset Your Password</div>  
                    <form onSubmit={handleSubmit}>
                        <p>Lost your password? Please enter your email address.</p>
                        <p>You will receive an OTP to create a new password.</p>
                        <label htmlFor="email">Email*</label>
                        <input 
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={handleInput}
                        />
                        <button type="submit" className='btn'>Send OTP</button>
                    </form>
                </div> 
            </div>
        </div>
    );
};

export default ResetAdminPassword;
