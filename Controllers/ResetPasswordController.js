
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpModel = require('../Models/OTP');
const userModel = require('../Models/User');
const mailSender = require('../Utils/Nodemailer');
const sendResponse = require('../Utils/Response');
// const { addHours } = require('date-fns');




// !===================================              ResetPasswordToken               ======================================
exports.resetPasswordToken = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return sendResponse(res, 400, false, "Email does not exist");
        }

        // !Generate Token 
        const token = crypto.randomUUID();

        // !Update user by adding token and expiry date
        const updatedDetails = await userModel.findOneAndUpdate(
            { email }, 
            {
                token: token, 
                resetPasswordExpires: Date.now() + 5*60*1000 
            }, 
                { new: true }
            );

        // Create URL
        const url = `http://localhost:5000/update-password/${token}`;

        // send mail containing the url 
        await mailSender(email, "Password Reset Link", `Password Reset Link ${url}`);
    
        // !Send Response
        return sendResponse(res, 200, true, "Password Reset Link sent to your email");

    } catch (error) {
        return sendResponse(res, 500, false, (error.message || "An error occured while sending password reset link"));
    }
}



// !===================================              Reset Password               ======================================
exports.resetPassword = async(req, res) => {
    // !Fetch Data  
    const {password, confirmPassword, token} = req.body;
    // const {token} = req.params;

    // !Validation 
    if (password !== confirmPassword) {
        return sendResponse(res, 400, false, "Passwords do not match");
    }

    try {
        // !Get Userdetails from db using token
        const userDetail = await userModel.findOne({ token : token });

        // !If no entry - invalid token 
        if (!userDetail) {
            return sendResponse(res, 400, false, "Invalid Token");
        }
        
        // !Check if token is expired
        if (userDetail.resetPasswordExpiresAt < Date.now()) {
            return sendResponse(res, 400, false, "Token Expired");
        }

        // !Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // !Update password
        await userModel.findOneAndUpdate({ token : token }, { password: hashedPassword }, { new: true });

        // !Send response
        return sendResponse(res, 200, true, "Password Reset Successfully");

    } catch (error) {
        return sendResponse(res, 500, false, (error.message || "An error occured while resetting password"));
    }

}

