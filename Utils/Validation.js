const Joi = require('joi');

//! User Registration Validation
exports.validateRegister = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        // accountType: Joi.string().valid('admin', 'lawyer', 'client').required(),
        barNumber: Joi.string().length(7).when('accountType', {
                is: 'lawyer',
                then: Joi.required(),
                otherwise: Joi.forbidden(),
            }),
        otp: Joi.string().length(6).required(),
        gender: Joi.string().valid('male', 'female', 'other').optional(),
        dateOfBirth: Joi.date().iso().optional(),
        about: Joi.string().max(500).optional(),
        contactNumber: Joi.string()
            .pattern(/^[0-9]{11,15}$/)
            .optional(),
    });
    return schema.validate(data);
};


//! User Login Validation
exports.validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(data);
};


//! OTP Validation
exports.validateSendOTP = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
    });
    return schema.validate(data);
};


//! Change Password Validation
exports.validateChangePassword = (data) => {
    const schema = Joi.object({
        oldPassword: Joi.string().min(8).required(),
        newPassword: Joi.string().min(8).required(),
    });
    return schema.validate(data);
};
