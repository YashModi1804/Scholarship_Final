import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
    }, 
    code: {
        type: String,
    },
    expireIn: {
        type: Number
    }
}, {
    timestamps: true
});

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;

