const express = require('express')
const router = express.Router()
const viewController = require("../controller/view-controller")
const auth = require("../middleware/auth")


router.get("/", auth.authedUser, viewController.getHome)

router.get("/dashboard",auth.protect, viewController.getDashboard)

router.get("/login",auth.authedUser, viewController.getLogin)

// router.get('/food-reservation', auth.protect, viewController.getFoodReservation);
// router.get('/requests', auth.protect, viewController.getRequests);
// router.get('/semester-courses', auth.protect, viewController.getSemesterCourses);
// router.get('/payments', auth.protect, viewController.getPayments);
// router.get('/messages', auth.protect, viewController.getMessages);
// router.get('/profile', auth.protect, viewController.getProfile);

module.exports=router