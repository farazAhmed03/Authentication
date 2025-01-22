const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');
const auth = require('../Middleware/authMiddleware');


//! =========================                 Routes            ===================================
router.post('/sendOtp', authController.sendOTP);
router.post('/register', authController.Register);
router.post('/login', authController.Login);
router.post('/change-password', authController.changePassword);





//! =========================                Protected Routes          ===================================
router.get('/admin', auth, authController.isAdmin, async(req, res) => res.send("Admin Route"));
router.get('/lawyer', auth, authController.isLawyer, async(req, res) => res.send("Lawyer Route"));
router.get('/client', auth, authController.isClient, async(req, res) => res.send("Client Route"));
router.get('/user', async(req, res) => res.send("User Route"));


module.exports = router;
