const Food = require("../models/food-model");
const balanceService = require("../services/balanceService");
const reserveService = require("../services/reserveService");

const addBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    await balanceService.increaseUserBalance(req.user._id, amount);
    req.session.success = true;
    res.redirect("/food-reservation");
  } catch (error) {
    const errorMessage = 'خطا در افزایش موجودی.';
    req.session.errors = [{ msg: errorMessage, path: 'amount', type: 'server' }];
    return res.redirect("/food-reservation");
  }
};

const getFoodsByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const foods = await Food.find({ restaurant: restaurantId }).lean();
    res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "خطایی در دریافت غذاها رخ داد." });
  }
};

const reserveFood = async (req, res) => {
  try {
    const { restaurant, dayOfWeek, selectedFood } = req.body;

    await reserveService.createFoodReservation(req.user, { restaurant, dayOfWeek, selectedFood });

    req.session.success = true;
    res.redirect("/food-reservation");
  } catch (err) {
    req.session.errors = [{ msg: err.message || 'خطایی در رزرو غذا رخ داد.', path: 'reserve', type: 'logic' }];
    return res.redirect("/food-reservation");
  }
};

const deleteReserve = async (req, res) => {
  try {
    const reserve = req.reserve;

    await reserveService.deleteFoodReservation(req.user._id, reserve);

    res.redirect("/food-reservation");
  } catch (err) {
    console.error(err);
    req.session.errors = [{ msg: err.message || 'خطایی در حذف رزرو رخ داد.', path: 'deleteReserve', type: 'logic' }];
    return res.redirect("/food-reservation");
  }
};

module.exports = {
  addBalance,
  getFoodsByRestaurant,
  reserveFood,
  deleteReserve,
};
