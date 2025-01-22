
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender : {
        type: String,
        enum: ['male', 'female', 'Other'],
        required: false
    },

    dateOfBirth : {
        type: String,
    },

    about : {
        type: String,
        trim: true
    },

    contactNumber : {
        type: Number,
        trim: true,
    }
    

});


const profileModel = mongoose.model('Profile', profileSchema);
module.exports = profileModel;
