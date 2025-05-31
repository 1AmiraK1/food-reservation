const User = require("../models/user-model");
const Payment = require("../models/payment-model");

async function increaseUserBalance(userId, amount) {
  const user = await User.findById(userId);
  user.balance += parseInt(amount);
  await user.save();
  await new Payment({
    user: userId,
    amount: amount,
    type: "increase",
  }).save();
  return user;
}
module.exports = { increaseUserBalance };
