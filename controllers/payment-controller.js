const User = require('../models/user-model');
const Payment = require('../models/payment-model');
const balanceService = require('../services/balanceService');

const addBalance = async(req, res) => {
  try {
    const {amount} = req.body;
    await balanceService.increaseUserBalance(req.user._id, amount);
    req.session.amountSuccess = true;
    res.redirect(`/payments`);
  } catch (error) {
    req.session.errors = error;
    return res.redirect(`/payments?page=${req.query.page || 1}`);
  }
};

module.exports = { addBalance }