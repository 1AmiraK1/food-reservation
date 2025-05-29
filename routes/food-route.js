const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food-controller');
const auth = require("../middlewares/auth");
const {validateReserve, validateDeleteReserve} = require('../middlewares/food-validators');




router.get('/restaurant/:restaurantId',auth.protect, foodController.getFoodsByRestaurant);
router.post('/reserve',auth.protect,validateReserve, foodController.reserveFood);
router.post('/delete-reserve/:id',auth.protect ,validateDeleteReserve, foodController.deleteReserve);


module.exports = router;
