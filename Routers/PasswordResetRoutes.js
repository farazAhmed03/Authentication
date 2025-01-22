const express = require('express');
const router = express.Router();
const resetController = require('../Controllers/ResetPasswordController');

// !Route to generate reset password token
// router.post('/reset-password-token', resetController.resetPasswordToken);

// !Route to reset the password
// router.post('/reset-password', resetController.resetPassword);

module.exports = router;
