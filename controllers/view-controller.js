const Restaurant = require("../models/restaurant-model");
const Reserve = require("../models/reserve-model");
const Payment = require("../models/payment-model");
const sortByPersianDay = require("../utils/sortByDay");

const getHome = (req, res) => {
  res.render("index.ejs");
};

const getDashboard = (req, res) => {
  res.render("dashboard.ejs", {
    user : req.user,
  });
};

const getLogin = (req, res) => {
  res.render("login.ejs");
};

const getRegister = (req, res) => {
  res.render("register.ejs");
};

const getProfile = (req, res) => {
  res.render("profile.ejs", {
    user: req.user
  });
};

const getFoodReservation = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}).lean();
    let reservations = await Reserve.find({ user: req.user._id })
      .populate("food restaurant")
      .lean();
    reservations = sortByPersianDay(reservations);

    res.render("food.ejs", {
      reservations,
      user: req.user,
      restaurants,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .render("404.ejs", { errMsg: "خطا در بارگذاری صفحه رزرو غذا" });
  }
};

const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const payments = await Payment.find({ user: req.user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPayments = await Payment.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalPayments / limit);

    res.render("payments", {
      user: req.user,
      payments,
      currentPage: page,
      totalPages,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .render("404.ejs", { errMsg: "خطا در دریافت صفحه پرداخت‌ها." });
  }
};

module.exports = {
  getHome,
  getDashboard,
  getLogin,
  getRegister,
  getProfile,
  getFoodReservation,
  getPayments,
};
