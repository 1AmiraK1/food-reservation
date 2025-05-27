const { body, validationResult } = require('express-validator');
const Restaurant = require('../models/restaurant-model');

const validateAmount = [
  body('amount')
    .notEmpty().withMessage('مبلغ نباید خالی باشد.')
    .isInt({ min: 1, max: 1000000 }).withMessage('مبلغ باید عددی بین ۱ تا ۱۰۰۰۰۰۰ باشد.')
    .matches(/^\d+$/).withMessage('فقط ارقام انگلیسی مجاز است.'),
  
  async(req, res, next) => {
    const errors = validationResult(req);
    const restaurants = await Restaurant.find({}).lean();
    if (!errors.isEmpty()) {
      return res.render('food.ejs', {
        errors: errors.array(),
        old: req.body,
        user: req.user,
        amount: false,
        restaurants
      });
    }
    next();
  }
];


module.exports = {validateAmount}