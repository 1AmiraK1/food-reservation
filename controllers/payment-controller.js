const User = require('../models/user-model');
const Payment = require('../models/payment-model');
const balanceService = require('../services/balanceService');

const addBalance = async(req, res) => {
  try {
    const {amount} = req.body;
    await balanceService.increaseUserBalance(req.user._id, amount);
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