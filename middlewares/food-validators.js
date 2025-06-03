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
    .withMessage("شناسه رزرو نامعتبر است.")
    .custom(async (value, {req})=>{
      const reserve = await Reserve.findById(req.params.id);
      if (!reserve){throw new Error("رزرو مورد نظر یافت نشد.");}
      if (reserve.user.toString() !== req.user._id.toString()) {
      throw new Error("شما مجاز به حذف این رزرو نیستید.")}
      return true;
    }),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.session.errors = errors.array();
      return res.redirect("/food-reservation");
    }
    const reserve = await Reserve.findById(req.params.id);
    req.reserve = reserve;
    next();
  },
];

module.exports = { validateAmount, validateReserve, validateDeleteReserve };
