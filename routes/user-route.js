const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const auth = require("../middlewares/auth")
const {loginValidator , registerValidator , editValidator} = require('../middlewares/user-validators');
const multerErrorHandler = require('../middlewares/multer-error');


router.post('/register', registerValidator, userController.createUser);
router.post('/login', loginValidator , userController.loginUser);
router.post('/logout',auth.protect, userController.logoutUser);
router.post('/edit',auth.protect,multerErrorHandler, userController.editUser)

//,editValidator
module.exports = router;
