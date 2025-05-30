const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment-controller');
const auth = require("../middlewares/auth");
const {validateAmount} = require('../middlewares/payment-validators');


router.post('/addBalance',auth.protect ,validateAmount, paymentController.addBalance);


module.exports = router;
