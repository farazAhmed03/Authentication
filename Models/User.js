
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true,
        minLength: 8
    },

    accountType: {
        type: String,
        required: true,
        enum: ['admin', 'lawyer', 'client', 'user'],
        default: 'user'
    },



// !==========================        Lawyer Specific Details   ==================================
    barNumber : {
        type: String,
        required: () => (this.accountType === 'lawyer'),
    },
    

// !==========================        Additional Details   ==================================
    // additionalDetails : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Profile',
    // },


    image : {
        type: String,
        required: true,
        default: 'img.jpg'
    },

    lastLogin : {
        type: Date,
        default: Date.now()
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,

}, { timestamps: true });


const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
