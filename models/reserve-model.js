const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
  foodPrice: { type: Number, required: true },
  dayOfWeek: { type: String, required: true }
},
{timestamps: true});
const Reserve = mongoose.model('Reserve', reserveSchema);

module.exports = Reserve;