import mongoose from "mongoose";
import User from "../models/user.js";
import Otp from "../models/otp.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
import nodemailer from "nodemailer";

export const signup = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const existingUser = await User.findOne({ username: req.body.username });
        
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const newUser = new User({ ...req.body, password: hash });
        await newUser.save();
        res.status(200).json({ message: "User has been created" });
    } catch (error) {
        console.error("Signup error:", error);
        next(createError(500, "Internal Server Error"));
    }
}

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) 
          return next(createError(404, "User not found"))
        
        const isCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isCorrect)
          return next(createError(400, "Wrong credentials"));
        
        res.status(200).json({
            msg: "Login Successfully",
            token: await user.generateToken(),
            userId: user._id.toString(),
        });
    } catch (error) {
        console.log("error: ", error);
    }
}

export const emailSend = async (req, res, next) => {
    let data = await User.findOne({email: req.body.email});
    const response = {};   
    try {
        if(data) {
            let otpcode = Math.floor((Math.random()*10000)+1);
            let otpData = new Otp({
                email:req.body.email,
                code:otpcode,
                expireIn: new Date().getTime()+300*1000
            })
            let otpResponse = await otpData.save();
            mailer(otpData.email, otpcode);
            res.status(200).json({
                msg: "Check your email id",
            });
        } else {
            res.status(200).json({
                msg: "email not exist",
            });
        }
        // res.status(200).json("ok");
    } catch (error) {
        console.log("error", error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { otpCode, password, cpassword } = req.body;

        // Check if the passwords match
        if (password !== cpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // Validate OTP code here (you can use Otp.find or any other method)

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // If OTP is valid, update the user's password
        const user = await User.findOne({ /* Query to find the user by email or any other unique identifier */ });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's password with the hashed password
        user.password = hashedPassword;
        await user.save();

        // Return success response
        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const mailer = (email, otp) => {
    const transporter = nodemailer.createTransport({
    // host: "smtp.ethereal.email",
    service: 'gmail',
    // port: 587,
    // secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "sk3700844@gmail.com",
        pass: "crngpgkfwckaueza",
    },
    });

    const mailOptions = {
        from: 'sk3700844@gmail.com', // sender address
        to: "sumit_2022bcse074@nitsri.ac.in", // list of receivers
        subject: "OTP for password Reset", // Subject line
        text: `Your OTP is ${otp}`, // plain text body
        // html: "<b>Hello world?</b>", // html body
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log(error);
        } else {
            console.log("Email sent: ", + info.response);
        }
    });
}