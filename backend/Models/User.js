const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,

    },

    password:{
        type: String,
        required: true,
    },
    banned: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    wishlist: {
        type: Array,
        default: []
    },
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpiry: {
        type: Date,
        default: null
    }
});

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;