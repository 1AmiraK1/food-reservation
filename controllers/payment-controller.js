const User = require('../models/user-model');
const Payment = require('../models/payment-model');

const addBalance = async(req, res) => {
  try {
    const {amount} = req.body;
    const user = await User.findById(req.user._id);
    user.balance += parseInt(amount);
    await user.save();
    await new Payment({
          user: req.user._id,
          amount: amount,
          type: "increase",
        }).save();
    res.redirect('/payments?amount=true');
  } catch (error) {
    return res.status(500).render('payments.ejs', {
      amount:false,
      errors: [{ msg: 'خطایی در به‌روزرسانی اطلاعات رخ داده است.' }],
      user : req.user
    });
  }
};

module.exports = { addBalance }