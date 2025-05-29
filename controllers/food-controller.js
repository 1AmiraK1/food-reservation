const Food = require('../models/food-model');
const Reserve = require('../models/reserve-model');
const User = require('../models/user-model');
const Restaurant = require('../models/restaurant-model');
const sortByPersianDay = require('../utils/sortByDay');





const getFoodsByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const foods = await Food.find({ restaurant: restaurantId }).lean();
    res.status(200).json(foods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطایی در دریافت غذاها رخ داد.' });
  }
};


const reserveFood = async (req, res) => {
  try {
    const { restaurant, dayOfWeek, selectedFood } = req.body;
    const amount = req.query.amount === "true";
    const restaurants = await Restaurant.find({}).lean();

    let reservations = await Reserve.find({ user: req.user._id })
      .populate('food restaurant')
      .lean();

    reservations = sortByPersianDay(reservations);

    const food = await Food.findById(selectedFood);
    if (!food) throw new Error('غذا یافت نشد.');

    const user = await User.findById(req.user._id);
    if (!user) throw new Error('کاربر یافت نشد.');

    const existingReserve = await Reserve.findOne({
      user: user._id,
      dayOfWeek,
    });

    if (existingReserve) {
      return res.render("food.ejs", {
        reservations,
        amount,
        user,
        restaurants,
        errors: [{ msg: `شما قبلاً برای روز ${dayOfWeek} یک غذا رزرو کرده‌اید. برای تغییر، ابتدا رزرو فعلی را حذف کنید.` }],
        old: req.body
      });
    }

    if (user.balance < food.price) {
      return res.render("food.ejs", {
        reservations,
        amount,
        user,
        restaurants,
        errors: [{ msg: 'موجودی کافی نیست.' }],
        old: req.body
      });
    }

    user.balance -= food.price;
    await user.save();

    const newReserve = new Reserve({
      user: user._id,
      dayOfWeek,
      restaurant,
      food: selectedFood,
      foodPrice: food.price
    });

    await newReserve.save();
    res.redirect("/food-reservation");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'خطایی در ثبت رزرو رخ داد.' });
  }
};


const deleteReserve = async (req, res) => {
  try {
    const reserve = req.reserve;
    const user = await User.findById(req.user._id);
    user.balance += reserve.foodPrice;
    await user.save();

    await Reserve.findByIdAndDelete(reserve._id);

    res.redirect('/food-reservation');
  } catch (err) {
    console.error(err);
    res.status(500).send('خطایی رخ داد.');
  }
};

module.exports = { getFoodsByRestaurant, reserveFood, deleteReserve }