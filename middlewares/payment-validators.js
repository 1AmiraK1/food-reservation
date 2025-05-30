const { body, validationResult } = require('express-validator');
const Payment = require('../models/payment-model');


const validateAmount = [
  body('amount')
    .notEmpty().withMessage('مبلغ نباید خالی باشد.')
    .isInt({ min: 1, max: 1000000 }).withMessage('مبلغ باید عددی بین ۱ تا ۱۰۰۰۰۰۰ باشد.')
    .matches(/^\d+$/).withMessage('فقط ارقام انگلیسی مجاز است.'),
  
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array();
      return res.redirect(`/payments?page=${req.query.page || 1}`);
    }
    next();
  }
];


module.exports = {validateAmount}