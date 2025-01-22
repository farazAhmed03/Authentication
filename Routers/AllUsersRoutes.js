const express = require('express');
const router = express.Router();
const users = require('../Controllers/UserController')


// !Router for Users: 
router.route('/AllUsers').get(users.AllUsers);
router.route('/SingleUser').post(users.singleUser);
router.route('/DeleteUser').delete(users.deleteUser);
router.route('/UpdateUser').put(users.updateUser);
// router.route('/DeleteAllUser').delete(users.deleteAllUser);


module.exports = router;