const Food = require("../models/food-model");
const Reserve = require("../models/reserve-model");
const User = require("../models/user-model");
const Payment = require("../models/payment-model");
const balanceService = require("../services/balanceService");

const addBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    await balanceService.increaseUserBalance(req.user._id, amount);
    req.session.amountSuccess = true;
    res.redirect("/food-reservation");
  } catch (error) {
    req.session.errors = error;
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

    const food = await Food.findById(selectedFood);
    if (!food) throw new Error("غذا یافت نشد.");

    const user = await User.findById(req.user._id);
    if (!user) throw new Error("کاربر یافت نشد.");

    const existingReserve = await Reserve.findOne({
      user: user._id,
      dayOfWeek,
    });
    if (existingReserve) {
      throw new Error(
        `شما قبلاً برای روز ${dayOfWeek} یک غذا رزرو کرده‌اید. برای تغییر، ابتدا رزرو فعلی را حذف کنید.`
      );
    }

    if (user.balance < food.price) {
      throw new Error("موجودی کافی نیست.");
    }

    user.balance -= food.price;
    await user.save();

    const newReserve = new Reserve({
      user: user._id,
      dayOfWeek,
      restaurant,
      food: selectedFood,
      foodPrice: food.price,
    });
    await newReserve.save();

    await new Payment({
      user: user._id,
      amount: food.price,
      type: "purchase",
    }).save();

    res.redirect("/food-reservation");
  } catch (err) {
    req.session.errors = [{ msg: err.message }];
    return res.redirect("/food-reservation");
  }
};

const deleteReserve = async (req, res) => {
  try {
    const reserve = req.reserve;
    const user = await User.findById(req.user._id);
    user.balance += reserve.foodPrice;
    await user.save();

    await Reserve.findByIdAndDelete(reserve._id);

    await new Payment({
      user: user._id,
      amount: reserve.foodPrice,
      type: "deletePurchase",
    }).save();
    res.redirect("/food-reservation");
  } catch (err) {
    console.error(err);
    req.session.errors = [{ msg: err.message }];
    return res.redirect("/food-reservation");
  }
};

module.exports = {
  addBalance,
  getFoodsByRestaurant,
  reserveFood,
  deleteReserve,
};
