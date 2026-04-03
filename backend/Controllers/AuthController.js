const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

module.exports = {
    signup,
    login
}