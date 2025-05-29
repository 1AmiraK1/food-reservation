const { param, body, validationResult } = require('express-validator');
const Restaurant = require('../models/restaurant-model');
const Reserve = require('../models/reserve-model');
const sortByPersianDay = require('../utils/sortByDay');


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

const validateReserve = [
  body('restaurant')
    .notEmpty().withMessage('رستوران انتخاب نشده است!'),
  body('dayOfWeek')
    .notEmpty().withMessage('روز رزرو انتخاب نشده است!'),
    body('selectedFood')
    .notEmpty().withMessage('غذا انتخاب نشده است!'),
  async(req, res, next) => {
    const errors = validationResult(req);
    const restaurants = await Restaurant.find({}).lean();
        let reservations = await Reserve.find({ user: req.user._id })
        .populate('food restaurant')
        .lean();
    
      reservations = sortByPersianDay(reservations);

    if (!errors.isEmpty()) {
      return res.render('food.ejs', {
        reservations,
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

const validateDeleteReserve = [
  param('id')
    .notEmpty().withMessage('شناسه رزرو ارسال نشده است.')
    .isMongoId().withMessage('شناسه رزرو نامعتبر است.'),
    
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reserve = await Reserve.findById(req.params.id);
    if (!reserve) {
      return res.status(404).json({ errors: [{ msg: 'رزرو مورد نظر یافت نشد.' }] });
    }

    if (reserve.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ errors: [{ msg: 'شما مجاز به حذف این رزرو نیستید.' }] });
    }
    req.reserve = reserve;
    next();
  }
];

module.exports = {validateAmount , validateReserve , validateDeleteReserve}