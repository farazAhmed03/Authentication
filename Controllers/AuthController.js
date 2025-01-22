const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const userModel = require('../Models/User')
const otpModel = require('../Models/OTP');
const sendResponse = require('../Utils/Response');
const generateToken = require('../Utils/GenerateJwt');
const Profile = require('../Models/Profile');
const otpGenerator = require('otp-generator');
const auth = require('../Middleware/authMiddleware');
// const sendEmail = require('../Utils/Nodemailer');
// const {addHours} = require('date-fns');
const app = express();


// Middleware
app.use(bodyParser.json());


// !===========================            OTP Controller          ==============================================
exports.sendOTP = async (req, res) => {
    try {
        //! Fetch Email
        const email = req.body.email;

        //! Check if email exists
        const checkUserPresent = await userModel.findOne({ email });
        if (checkUserPresent) {
            return sendResponse(res, 400, false, "User already exists!");
        }

        //! Generate OTP
        var otp = otpGenerator.generate(6, {
            uppercaseAlphabets: false,
            lowerCaseAplhabets: false,
            specialChars: false
        });

        // !Check Unique OTP 
        const result = await otpModel.findOne({ otp });

        // !Generate Otp for corresponding Email of user
        while(result) {
            otp = otpGenerator.generate(6, {
                uppercaseAlphabets: false,
                lowerCaseAplhabets: false,
                specialChars: false
            });
            result = await otpModel.findOne({ otp });
        }


        const otpPayload = { email, otp };
        
        //! Create an entry for OTP 
        const otpBody = await otpModel.create(otpPayload);
        console.log(otpBody);

        sendResponse(res, 200, true, "OTP Sent Successfully!", otp);

    }catch (error) {
        return sendResponse(res, 500, false, (error.message || "Internal Server Error"));
    }
}



// !===========================            Registeration Controller          ==============================================
exports.Register = async (req, res) => {
    
    // !Fetch Data from Req Body
    const { username, email, password, accountType, barNumber, otp } = req.body;

    // !Check if all fields are filled
    if (!username || !email || !password || !accountType || !otp) {
        return sendResponse(res, 400, false, "Pls fill all required Fields!");
    }

    // !Check if lawyer account
    if(accountType === "lawyer" && !barNumber) {
        return sendResponse(res, 400, false, "Pls fill all required Fields!");
    }

    // !Check if barNumber is valid
    if(accountType === "lawyer" && barNumber.length !== 7) {
        return sendResponse(res, 400, false, "Invalid Bar Number!");
    }
    

    try {
        // !Check if entry already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return sendResponse(res, 401, false, "User already exists!");
        }

        // ! Find most recent OTP stored for the user
        const recentOtp = await otpModel.find({email}).sort({createdAt: -1}).limit(1);      // Fetch most recent value of OTP

        // !Check if OTP is expired
        const now = new Date();
        if (recentOtp[0].createdAt.getTime() + 5 * 60 * 1000 < now.getTime()) {
            sendResponse(res, 400, false, "OTP Expired!");
            return;
        }

        // !Check if OTP is valid
        if (recentOtp.length === 0 || recentOtp[0].otp !== otp) {
            sendResponse(res, 400, false, "Invalid OTP!");
            return;
        }         

        // !Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Request body:', req.body);
        
        // !Profile
        const profileDetails = await Profile.create({
            gender: req.body.gender || null,
            dateOfBirth: req.body.dateOfBirth || null,
            about: req.body.about || null,
            contactNumber: req.body.contactNumber || null
        });

        console.log('profileDetails', profileDetails);

        // !User object
        const userData = {
            username: username,
            email: email,
            password: hashedPassword,
            accountType: accountType,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${username}`,
        }

        // !Include barNumber only if accountType is "lawyer"
        if(accountType === "lawyer") {
            userData.barNumber = barNumber;
        }

        // !Entry created & Save entry in DB
        const user = new userModel(userData);
        await user.save();

        // !Send Response
        sendResponse(res, 200, true, "User Registered Successfully!", user);

    } catch (error) {
        sendResponse(res, 500, false, (error.message || "SOMETHING WENT WRONG"));
    }
}





// !===========================            Login Controller          ==============================================
exports.Login = async (req, res) => {

    // !Fetch Data from req body
    const { email, password } = req.body;

    // !Check if all fields are filled
    if (!email || !password) {
        return sendResponse(res, 400, false, "Pls fill all required Fields!");
    }


    try {
        // !Fetch User from DB
        let user = await userModel.findOne({ email });

        // !Check if user exists or not
        if (!user) {
            return sendResponse(res, 401, false, "User does not exist!");
        }

        // !Check Password
        const matchedPassword = await bcrypt.compare(password, user.password);

        //! Check Password Matched or not
        if (!matchedPassword) {
            return sendResponse(res, 401, false, "Invalid Credentials!");
        }

        // console.log(user);

        // !Payload for JWT
        const payLoad = {
            id: user._id,
            email: user.email,
            accountType: user.accountType
        }

        const token = await generateToken(payLoad);   // !Generate JWT Token  
        user = user.toObject();
        user.token = token;
        user.password = undefined;

        // !Option for Cookie
        const option = {
            httpOnly: true,
            // secure: true,
            expiresIn: new Date(Date.now() + 2 * 60 * 60 * 1000)    // !Cookie expires in 2 hours
        }

        // !Send Response with Cookie and Token
        res.status(200).cookie("token", token, option).json({
            status: 200,
            success: true,
            token: token,
            message: "User Logged In Successfully!",
            data: user
        })

    } catch(error) {
        sendResponse(res, 500, false, (error.message || "Internal Server Error"));
    }

}


// !===========================            Change Password Controller          ==============================================
exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword) {
        sendResponse(res, 400, false, "Please fill all fields");
    }

    try {
        // !Check if user exists
        const user = await user.findOne({ _id: req.user.id });
        if(!user) {
            sendResponse(res, 404, false, "User Not Found");
        }

        // !Check Password
        const matchedPassword = await bcrypt.compare(oldPassword, user.password);
        if(!matchedPassword) {
            sendResponse(res, 400, false, "Old Password is Incorrect");
        }
        
        // !Hash New Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        sendResponse(res, 200, true, "Password Changed Successfully");
            
    } catch (error) {
        sendResponse(res, 500, false, (error.message || "An error occured while changing password"));
    }

}



// !===========================            Logout Controller          ==============================================
exports.Logout = async(req, res) => {
    try {
        // !Remove Cookie
        res.clearCookie("token");
        sendResponse(res, 200, true, "User Logged Out Successfully!", null);
    } catch (error) {
        sendResponse(res, 500, false, (error.message || "Internal Server Error"));
    }
        
}


//TODO: ===================================                Protected Routes          =====================================================

//! =======================                Admin Route              ===========================
exports.isAdmin = async (req, res, next) => {
    const user = req.user;
    console.log(user);
    try {
        if (user.accountType !== 'admin') {
            return sendResponse(res, 401, false, "Access Denied: You are not an Admin!");
        }
        next();
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, error.message || "Internal Server Error");
    }
};


//! =======================                Lawyer Route              ===========================
exports.isLawyer = async (req, res, next) => {
    const user = req.user;
    console.log(user);
    try {
        if (user.accountType !== 'lawyer') {
            return sendResponse(res, 401, false, "Access Denied: You are not an Lawyer!");
        }
        next();
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, error.message || "Internal Server Error");
    }
};




//! =======================                Client Route              ===========================
exports.isClient = async (req, res, next) => {
    const user = req.user;
    console.log(user);

    try {
        if (user.accountType !== 'client') {
            return sendResponse(res, 401, false, "Access Denied: You are not an Client!");
        }
        next();
    } catch (error) {
        console.error(error);
        return sendResponse(res, 500, false, error.message || "Internal Server Error");
    }
};
