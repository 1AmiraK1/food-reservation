const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const {loginValidator , registerValidator} = require('../middlewares/validators');

router.post('/register', registerValidator, userController.createUser);
router.post('/login', loginValidator , userController.loginUser);
router.post('/logout', userController.logoutUser);


module.exports = router;
