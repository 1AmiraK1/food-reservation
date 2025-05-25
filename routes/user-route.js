const express = require('express');
const router = express.Router();
const userController = require('../controllers/user-controller');
const auth = require("../middlewares/auth")
const {loginValidator , registerValidator , editValidator} = require('../middlewares/validators');
const multer = require('multer');
const upload = multer({ dest: '/public/image/upload' })

router.post('/register', registerValidator, userController.createUser);
router.post('/login', loginValidator , userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/edit',upload.single('avatar'), auth.protect,editValidator, userController.editUser)


module.exports = router;
