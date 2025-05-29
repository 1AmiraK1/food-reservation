const Restaurant = require('../models/restaurant-model');
const Reserve = require('../models/reserve-model');
const sortByPersianDay = require('../utils/sortByDay');

const getHome = (req, res) => {
  res.render("index.ejs");
};

const getDashboard = (req, res) => {
  const user = req.user;
  res.render("dashboard.ejs", {
    user,
  });
};

const getLogin = (req, res) => {
  res.render("login.ejs", {
    errors: [],
    old: {},
  });
};

const getRegister = (req, res) => {
  res.render("register.ejs", {
    errors: [],
    old: {},
  });
};

const getProfile = (req, res) => {
  const user = req.user;
  const success = req.query.success === "true";
  res.render("profile.ejs", {
    success,
    errors: [],
    old: {},
    user,
  });
};

const getFoodReservation = async (req, res) => {
  try {
    const user = req.user;
    const amount = req.query.amount === "true";
    const restaurants = await Restaurant.find({}).lean();
    let reservations = await Reserve.find({ user: req.user._id })
    .populate('food restaurant')
    .lean();

  reservations = sortByPersianDay(reservations);

    res.render("food.ejs", {
      reservations,
      amount,
      user,
      restaurants,
      errors: [],
      old: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "خطا در بارگذاری صفحه رزرو غذا" });
  }
};
module.exports = {
  getHome,
  getDashboard,
  getLogin,
  getRegister,
  getProfile,
  getFoodReservation
};
