const Food = require("../models/food-model");
const User = require("../models/user-model");
const Reserve = require("../models/reserve-model");
const Payment = require("../models/payment-model");

const createFoodReservation = async (userInfo, { restaurant, dayOfWeek, selectedFood }) => {
  const userId = userInfo._id;

  const food = await Food.findById(selectedFood);
  if (!food) throw new Error("غذای مورد نظر یافت نشد.");

  const user = await User.findById(userId);
  if (!user) throw new Error("کاربر یافت نشد.");

  const existingReserve = await Reserve.findOne({ user: userId, dayOfWeek });
  if (existingReserve) {
    throw new Error(`شما قبلاً برای روز ${dayOfWeek} یک غذا رزرو کرده‌اید. برای تغییر، ابتدا رزرو فعلی را حذف کنید.`);
  }

  if (user.balance < food.price) {
    throw new Error("موجودی کافی نیست.");
  }

  const newReserve = new Reserve({
    user: userId,
    dayOfWeek,
    restaurant,
    food: selectedFood,
    foodPrice: food.price,
  });

  await newReserve.save();

  try {
    user.balance -= food.price;
    await user.save();

    const payment = new Payment({
      user: userId,
      amount: food.price,
      type: "purchase",
    });

    await payment.save();
  } catch (err) {
    await Reserve.findByIdAndDelete(newReserve._id);
    throw new Error("خطا در ذخیره پرداخت. رزرو حذف شد.");
  }
};

const deleteFoodReservation = async (userId, reserve) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("کاربر یافت نشد.");

  await Reserve.findByIdAndDelete(reserve._id);

  try {
    user.balance += reserve.foodPrice;
    await user.save();

    const payment = new Payment({
      user: userId,
      amount: reserve.foodPrice,
      type: "deletePurchase",
    });

    await payment.save();
  } catch (err) {
    console.error("خطا در بازگرداندن وجه بعد از حذف رزرو:", err);
    throw new Error("رزرو حذف شد ولی بازگرداندن وجه با خطا مواجه شد.");
  }
};

module.exports = {
  createFoodReservation,
  deleteFoodReservation,
};
