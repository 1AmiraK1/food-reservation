const express = require('express');
const router = express.Router();
const userController = require('../controller/user-controller');

router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);


module.exports = router;
