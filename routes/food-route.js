const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food-controller');
const auth = require("../middlewares/auth");



router.get('/:restaurantId',auth.protect, foodController.getFoodsByRestaurant);

module.exports = router;
