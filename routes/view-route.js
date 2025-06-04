const express = require('express')
const router = express.Router()
const viewController = require("../controllers/view-controller")
const auth = require("../middlewares/auth")



router.get("/", auth.authedUser, viewController.getHome)

router.get("/login",auth.authedUser, viewController.getLogin)

router.get("/register",auth.authedUser, viewController.getRegister)

router.get("/dashboard",auth.protect, auth.addUserToLocals, viewController.getDashboard)

router.get('/profile',auth.protect, auth.addUserToLocals, viewController.getProfile);

router.get('/food-reservation',auth.protect, auth.addUserToLocals, viewController.getFoodReservation);

router.get('/payments',auth.protect, auth.addUserToLocals, viewController.getPayments);

module.exports=router