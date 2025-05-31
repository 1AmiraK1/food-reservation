const express = require('express')
const router = express.Router()
const viewController = require("../controllers/view-controller")
const auth = require("../middlewares/auth")


router.get("/", auth.authedUser, viewController.getHome)

router.get("/dashboard",auth.protect, viewController.getDashboard)

router.get("/login",auth.authedUser, viewController.getLogin)

router.get("/register",auth.authedUser, viewController.getRegister)

router.get('/profile', auth.protect, viewController.getProfile);

router.get('/food-reservation', auth.protect, viewController.getFoodReservation);

router.get('/payments', auth.protect, viewController.getPayments);


module.exports=router