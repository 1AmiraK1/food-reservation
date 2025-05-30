const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['increase', 'purchase', 'deletePurchase'], required: true }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);