const UserModel = require('../Models/User');

const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Get User Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email } = req.body;
        
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { name, email },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error("Update User Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}).select('-password');
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Get All Users Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await UserModel.findByIdAndDelete(userId);
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const toggleBanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        user.banned = !user.banned;
        await user.save();
        
        res.status(200).json({ 
            success: true, 
            message: `User ${user.banned ? 'banned' : 'unbanned'} successfully`,
            user: { _id: user._id, name: user.name, email: user.email, banned: user.banned }
        });
    } catch (error) {
        console.error("Toggle Ban User Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
    toggleBanUser
};
