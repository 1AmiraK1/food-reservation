const { param, body, validationResult } = require("express-validator");
const Reserve = require("../models/reserve-model");

const validateAmount = [
  body("amount")
    .notEmpty()
    .withMessage("مبلغ نباید خالی باشد.")
    .isInt({ min: 1, max: 1000000 })
    .withMessage("مبلغ باید عددی بین ۱ تا ۱۰۰۰۰۰۰ باشد.")
    .matches(/^\d+$/)
    .withMessage("فقط ارقام انگلیسی مجاز است."),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array();
      return res.redirect("/food-reservation");
    }
    next();
  },
];

const validateReserve = [
  body("restaurant").notEmpty().withMessage("رستوران انتخاب نشده است!"),
  body("dayOfWeek").notEmpty().withMessage("روز رزرو انتخاب نشده است!"),
  body("selectedFood").notEmpty().withMessage("غذا انتخاب نشده است!"),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array();
      return res.redirect("/food-reservation");
    }
    next();
  },
];

const validateDeleteReserve = [
  param("id")
    .notEmpty()
    .withMessage("شناسه رزرو ارسال نشده است.")
    .isMongoId()
    .withMessage("شناسه رزرو نامعتبر است."),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array();
      return res.redirect("/food-reservation");
    }

    const reserve = await Reserve.findById(req.params.id);
    if (!reserve) {
      const customErr = [{ msg: "رزرو مورد نظر یافت نشد." }]
      req.session.errors = customErr;
      return res.redirect("/food-reservation");
    }

    if (reserve.user.toString() !== req.user._id.toString()) {
      const customErr = [{ msg: "شما مجاز به حذف این رزرو نیستید." }]
      req.session.errors = customErr;
      return res.redirect("/food-reservation");
    }
    req.reserve = reserve;
    next();
  },
];

module.exports = { validateAmount, validateReserve, validateDeleteReserve };
