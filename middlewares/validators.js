const { body, validationResult } = require('express-validator');
const User = require('../models/user-model');

const loginValidator = [
  body('emailOrUsername')
    .notEmpty().withMessage('ایمیل یا نام کاربری نباید خالی باشد.'),
  body('password')
    .notEmpty().withMessage('رمز عبور نباید خالی باشد.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login.ejs', {
        errors: errors.array(),
        old: req.body
      });
    }
    next();
  }
];

const registerValidator = [
  body('username')
    .notEmpty().withMessage('نام کاربری نباید خالی باشد.')
    .isLength({ min: 3 }).withMessage('حداقل ۳ کاراکتر لازم است.')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('فقط حروف، اعداد و _ مجاز است.')
    .custom(async username => {
      const exists = await User.isUsernameTaken(username);
      if (exists) {
        throw new Error('این نام کاربری قبلاً استفاده شده است.');
      }
    }),

  body('email')
    .notEmpty().withMessage('ایمیل نباید خالی باشد.')
    .isEmail().withMessage('فرمت ایمیل نامعتبر است.')
    .custom(async email => {
      const exists = await User.isEmailTaken(email);
      if (exists) {
        throw new Error('این ایمیل قبلاً ثبت شده است.');
      }
    }),

  body('password')
    .notEmpty().withMessage('رمز عبور نباید خالی باشد.')
    .isLength({ min: 6 }).withMessage('رمز عبور باید حداقل ۶ کاراکتر باشد.')
    .matches(/[a-z]/).withMessage('رمز عبور باید حداقل یک حرف کوچک داشته باشد.')
    .matches(/[A-Z]/).withMessage('رمز عبور باید حداقل یک حرف بزرگ داشته باشد.')
    .matches(/[0-9]/).withMessage('رمز عبور باید حداقل یک عدد داشته باشد.')
    .matches(/[^a-zA-Z0-9]/).withMessage('رمز عبور باید حداقل یک کاراکتر خاص داشته باشد.'),

  body('confirmPass')
    .notEmpty().withMessage('تکرار رمز عبور نباید خالی باشد.')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('رمز عبور و تکرار آن مطابقت ندارند.');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('register.ejs', {
        errors: errors.array(),
        old: req.body
      });
    }
    next();
  }
];

module.exports = {loginValidator , registerValidator}