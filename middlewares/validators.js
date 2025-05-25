const { body, validationResult } = require('express-validator');
const User = require('../models/user-model');

const loginValidator = [
  body('email')
    .notEmpty().withMessage('ایمیل نباید خالی باشد.')
    .isEmail().withMessage('فرمت ایمیل نامعتبر است.'),
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
  body('firstname')
    .notEmpty().withMessage('نام نباید خالی باشد.')
    .isLength({ min: 2 }).withMessage('حداقل ۲ کاراکتر لازم است.')
    .matches(/^[a-zA-Zآ-ی]+$/).withMessage('فقط حروف فارسی یا لاتین مجاز است.'),
  body('lastname')
    .notEmpty().withMessage('نام خانوادگی نباید خالی باشد.')
    .isLength({ min: 2 }).withMessage('حداقل ۲ کاراکتر لازم است.')
    .matches(/^[a-zA-Zآ-ی]+$/).withMessage('فقط حروف فارسی یا لاتین مجاز است.'),
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

const editValidator = [
  body('firstname')
    .notEmpty().withMessage('نام نباید خالی باشد.')
    .isLength({ min: 2 }).withMessage('حداقل ۲ کاراکتر لازم است.')
    .matches(/^[a-zA-Zآ-ی]+$/).withMessage('فقط حروف فارسی یا لاتین مجاز است.'),

  body('lastname')
    .notEmpty().withMessage('نام خانوادگی نباید خالی باشد.')
    .isLength({ min: 2 }).withMessage('حداقل ۲ کاراکتر لازم است.')
    .matches(/^[a-zA-Zآ-ی]+$/).withMessage('فقط حروف فارسی یا لاتین مجاز است.'),

  body('email')
    .notEmpty().withMessage('ایمیل نباید خالی باشد.')
    .isEmail().withMessage('فرمت ایمیل نامعتبر است.')
    .custom(async (email, { req }) => {
      // چک نکن اگر ایمیل تغییر نکرده
      if (email !== req.user.email) {
        const exists = await User.isEmailTaken(email);
        if (exists) {
          throw new Error('این ایمیل قبلاً ثبت شده است.');
        }
      }
    }),

  body('currentPass')
    .custom((value, { req }) => {
      const { currentPass, newPass, confirmNewPass } = req.body;
      const anyPasswordFieldFilled = currentPass || newPass || confirmNewPass;
      if (anyPasswordFieldFilled && !currentPass) {
        throw new Error('رمز عبور فعلی را وارد کنید.');
      }
      return true;
    }),

  body('newPass')
    .custom((value, { req }) => {
      const { currentPass, newPass, confirmNewPass } = req.body;
      const anyPasswordFieldFilled = currentPass || newPass || confirmNewPass;
      if (anyPasswordFieldFilled) {
        if (!newPass) {
          throw new Error('رمز عبور جدید را وارد کنید.');
        }
        if (newPass.length < 6) {
          throw new Error('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
        }
        if (!/[a-z]/.test(newPass)) {
          throw new Error('رمز عبور جدید باید حداقل یک حرف کوچک داشته باشد.');
        }
        if (!/[A-Z]/.test(newPass)) {
          throw new Error('رمز عبور جدید باید حداقل یک حرف بزرگ داشته باشد.');
        }
        if (!/[0-9]/.test(newPass)) {
          throw new Error('رمز عبور جدید باید حداقل یک عدد داشته باشد.');
        }
        if (!/[^a-zA-Z0-9]/.test(newPass)) {
          throw new Error('رمز عبور جدید باید حداقل یک کاراکتر خاص داشته باشد.');
        }
      }
      return true;
    }),

  body('confirmNewPass')
    .custom((value, { req }) => {
      const { currentPass, newPass, confirmNewPass } = req.body;
      const anyPasswordFieldFilled = currentPass || newPass || confirmNewPass;
      if (anyPasswordFieldFilled) {
        if (!confirmNewPass) {
          throw new Error('تکرار رمز عبور جدید را وارد کنید.');
        }
        if (newPass !== confirmNewPass) {
          throw new Error('رمز عبور جدید و تکرار آن مطابقت ندارند.');
        }
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('profile.ejs', {
        errors: errors.array(),
        old: req.body,
        user: req.user,
        success:false
      });
    }
    next();
  }
];

module.exports = { loginValidator, registerValidator, editValidator }