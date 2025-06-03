const balanceService = require('../services/balanceService');

const addBalance = async(req, res) => {
  try {
    const {amount} = req.body;
    await balanceService.increaseUserBalance(req.user._id, amount);
    req.session.success = true;
    res.redirect(`/payments`);
  } catch (error) {
    req.session.errors = error;
    return res.redirect(`/payments?page=${req.query.page || 1}`);
  }
};

module.exports = { addBalance }