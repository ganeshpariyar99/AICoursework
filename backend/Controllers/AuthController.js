const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserModel = require("../Models/User");


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: "User already exist, you can login", success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false,
                error: err.message
            })

    }

}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === 'ganeshadmin@egadgethive.com' && password === 'admin@123') {
            const jwtToken = jwt.sign(
                { email, _id: 'admin_id_001' },
                process.env.JWT_SECRET || 'fallback_secret',
                { expiresIn: '24h' }
            );
            return res.status(200).json({
                message: "Admin login success",
                success: true,
                jwtToken,
                email,
                name: 'Admin Ganesh',
                userId: 'admin_id_001',
                role: 'admin'
            });
        }

        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(403)
                .json({ message: "Account not available", success: false });
        }

        if (user.banned) {
            return res.status(403)
                .json({ message: "Account is banned", success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: "Auth failed, email or password incorrect", success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }

        )
        res.status(200)
            .json({
                message: "Login success",
                success: true,
                jwtToken,
                email,
                name: user.name,
                userId: user._id
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })

    }

}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'egadgethive101@gmail.com',
                pass: process.env.EMAIL_PASS || 'dummypassword'
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || 'egadgethive101@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. It is valid for 15 minutes.`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.log("Mail sending failed (Setup EMAIL_USER/EMAIL_PASS in .env):", mailErr.message);
            console.log("OTP IS:", otp);
        }

        res.status(200).json({
            message: "OTP sent to your email",
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false, error: err.message });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await UserModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        res.status(200).json({
            message: "OTP verified successfully",
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false, error: err.message });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        if (user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        res.status(200).json({
            message: "Password reset successful",
            success: true
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false, error: err.message });
    }
}

module.exports = {
    signup,
    login,
    forgotPassword,
    verifyOtp,
    resetPassword
}